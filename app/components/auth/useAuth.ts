'use client';

import { useEffect, useState } from 'react';
import api from '@/app/api/api';
import { getServerURL } from '@/lib/utils/url';

interface User {
    userId: string;
    nickname: string;
    email: string;
    avatar: string;
  }
  
  export default function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchMe = async () => {
        try {
          const storedToken = localStorage.getItem('accessToken');
          setToken(storedToken);
  
          if (!storedToken) {
            setUser(null);
            setLoading(false);
            return;
          }
  
          const baseUrl = getServerURL();
          const res = await api.get(`${baseUrl}/user/me`, {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });
          
          if (res.status === 200) {
            setUser(res.data);
          }
        } catch (err) {
          console.error('로그인 정보 가져오기 실패:', err);
          setUser(null);
          setToken(null);
          localStorage.removeItem('accessToken');
        } finally {
          setLoading(false);
        }
      };
  
      fetchMe();
    }, []);
  
    return { user, loading, token };
  }