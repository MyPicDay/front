import axios from 'axios';
import useAuthStore from '@/lib/store/authStore';
import router from 'next/router';

const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_SERVER_URL}` || 'http://localhost:8080',
});

api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    const deviceId = localStorage.getItem('deviceId');
    if (deviceId) {
        config.headers['Device-Id'] = deviceId;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 401 오류 & 재발급 시도 전이 아니라면
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const deviceId = localStorage.getItem('deviceId');

            try {
                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/reissue`,
                    {},
                    {
                        headers: {
                            'Device-Id': deviceId,
                            Authorization: localStorage.getItem('accessToken'),
                        },
                        withCredentials: true,
                    }
                );

                const newAccessToken = res.headers['authorization']?.split(' ')[1];
                if (newAccessToken) {
                    localStorage.setItem('accessToken', newAccessToken);
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return axios(originalRequest); // 재요청
                }
            } catch (reissueError) {
                // 리프레시 토큰 만료 로그아웃 처리
                console.warn('❌ 토큰 재발급 실패: 자동 로그아웃');
                try {
                    await axios.post(
                        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/logout`,
                        {},
                        {
                            headers: {
                                Authorization: localStorage.getItem('accessToken'),
                                'Device-Id': localStorage.getItem('deviceId'),
                            },
                            withCredentials: true,
                        }
                    );
                } catch (logoutError) {
                    console.error('❗ 로그아웃 API 호출 실패:', logoutError);
                }

                // ✅ 상태 초기화 + 리디렉션
                const { logout } = useAuthStore.getState();
                logout();
                router.push('/login');
            }
        }
        return Promise.reject(error);
    }
);

export default api;
