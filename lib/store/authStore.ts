import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null; // 서버가 HttpOnly 쿠키로 관리한다고 가정
  isLoggedIn: boolean;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  checkAuth: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null, // 초기 상태는 null
      isLoggedIn: false,
      login: (accessToken, refreshToken) => {
        set({ accessToken, refreshToken, isLoggedIn: true });
        // refreshToken은 서버가 HttpOnly 쿠키로 설정했다고 가정
      },
      logout: () => {
        set({ accessToken: null, refreshToken: null, isLoggedIn: false });
        // localStorage에서 accessToken 제거
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
        }
        // 서버가 refreshToken 쿠키를 제거했다고 가정
      },
      checkAuth: () => {
        // persist 미들웨어가 accessToken을 localStorage에서 로드한 후 호출되어야 함.
        // (onRehydrateStorage 콜백을 통해)
        if (typeof window !== 'undefined') {
          const currentAccessToken = get().accessToken; // 스토어의 현재 accessToken
          if (currentAccessToken) {
            set({ isLoggedIn: true });
            // refreshToken은 HttpOnly이므로 클라이언트에서 읽거나 설정하지 않음.
            // 로그인 시 스토어에 저장했던 refreshToken은 페이지 새로고침 후에는 null일 수 있음.
          } else {
            // accessToken이 없다면, refreshToken도 없고 로그아웃된 상태여야 함.
            set({ accessToken: null, refreshToken: null, isLoggedIn: false });
          }
        }
      }
    }),
    {
      name: 'auth-storage', // 로컬 스토리지에 저장될 때 사용될 키 이름
      storage: createJSONStorage(() => localStorage), // accessToken은 localStorage에 저장
      // refreshToken은 persist 대상에서 제외 (HttpOnly 쿠키로 관리된다고 가정)
      partialize: (state) => ({ accessToken: state.accessToken }),
      // persist된 스토리지로부터 상태가 성공적으로 복원(rehydrated)된 후에 checkAuth를 호출.
      onRehydrateStorage: () => {
        return (state, error) => {
          if (state && typeof window !== 'undefined') {
            // console.log('Rehydrated, calling checkAuth. Current accessToken:', state.accessToken);
            state.checkAuth();
          } else if (error) {
            console.error("Failed to rehydrate auth store", error);
          }
        };
      },
    }
  )
);

// 초기화 시 checkAuth 호출은 onRehydrateStorage로 이동.
// 이렇게 하면 persist된 accessToken이 로드된 *후에* isLoggedIn 상태가 결정됩니다.
// if (typeof window !== 'undefined') {
//    useAuthStore.getState().checkAuth(); // 이 방식은 persist 완료 전에 실행될 수 있음
// }

export default useAuthStore; 