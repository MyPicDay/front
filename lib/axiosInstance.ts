import axios, { type InternalAxiosRequestConfig } from 'axios';
import useAuthStore from './store/authStore';

const axiosInstance = axios.create({
  baseURL: '/api', // API 기본 경로 (필요에 따라 수정)
  // timeout: 5000, // 요청 타임아웃 (선택 사항)
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 클라이언트 사이드에서만 localStorage 접근 및 토큰 추가
    if (typeof window !== 'undefined') {
      const { accessToken } = useAuthStore.getState(); // Zustand 스토어에서 직접 상태 가져오기
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (선택 사항 - 예: 401 에러 시 자동 로그아웃 또는 토큰 갱신)
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    // 예: 토큰 만료(401) 시 리프레시 토큰으로 새 액세스 토큰 요청
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // const { refreshToken, login, logout } = useAuthStore.getState();
      // if (refreshToken) {
      //   try {
      //     // 여기서 /api/auth/refresh 같은 엔드포인트로 리프레시 토큰 보내서 새 액세스 토큰 받아오는 로직
      //     const { data } = await axios.post('/auth/refresh', { refreshToken }); // 실제 API 경로로 변경
      //     const newAccessToken = data.accessToken;
      //     const newRefreshToken = data.refreshToken; // 리프레시 토큰도 갱신될 수 있음
      //     login(newAccessToken, newRefreshToken);
      //     axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
      //     originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
      //     return axiosInstance(originalRequest);
      //   } catch (refreshError) {
      //     logout(); // 리프레시 실패 시 로그아웃
      //     // 로그인 페이지로 리디렉션 또는 에러 처리
      //     if (typeof window !== 'undefined') {
      //        window.location.href = '/login';
      //     }
      //     return Promise.reject(refreshError);
      //   }
      // } else {
      //   logout();
      //   if (typeof window !== 'undefined') {
      //     window.location.href = '/login';
      //   }
      // }
      // 현재는 백엔드가 없으므로, 401 발생 시 로그아웃 처리하고 로그인 페이지로 리다이렉트만 가정합니다.
      console.error("토큰 만료 또는 인증 실패, 로그아웃 처리합니다.");
      useAuthStore.getState().logout();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 