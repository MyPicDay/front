'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useAuthStore from '@/lib/store/authStore';
import api from "@/app/api/api";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  // TODO: Zustand 또는 React Context로 로그인 상태 및 사용자 정보 관리
  // const { login } = useAuthStore(); 

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage('');
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      let token: string | null = null;
      // ✅ 헤더에서 토큰 추출 (만약 서버가 헤더에 담는 구조라면)
      const authHeader = response.headers['authorization'];
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.slice(7);
        if (token != null) {
          localStorage.setItem('accessToken', token);
        }
        console.log('토큰 저장 완료:', token);

      } else {
        console.warn('응답 헤더에 토큰이 없습니다.');
      }

      setMessage('로그인 성공! 메인 페이지로 이동합니다.');
      if (token != null) {
        login(token, '');
      }
      setTimeout(() => router.push('/'), 1000);
    } catch (error: any) {
      const message = error.response?.data?.message || '로그인 중 오류 발생';
      setMessage(message);
      console.error('❌ 로그인 실패:', message);
    }
    setIsLoading(false);
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-white p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        {/* 좌측: 로고 및 태그라인 */}
        <div className="flex-1 bg-[#FEF4E4] p-8 flex flex-col items-center justify-center text-center">
          <img src="/images/logo-image-text.png" alt="MyPicDay 로고" className="w-40 h-auto mb-8" />
          <p className="text-lg text-amber-800">나만의 캐릭터로 기록하는 하루 한 장</p>
        </div>

        {/* 우측: 로그인 폼 */}
        <div className="flex-1 bg-white p-8 flex flex-col justify-center">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 text-zinc-900">로그인</h2>
          <p className="text-center text-zinc-500 mb-8">로그인하여 나만의 하루를 만들어보세요.</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="block w-full px-4 py-3 rounded-md border border-zinc-300 bg-[#FEF4E4] text-zinc-900 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="block w-full px-4 py-3 rounded-md border border-zinc-300 bg-[#FEF4E4] text-zinc-900 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-md bg-amber-600 hover:bg-amber-700 text-white text-lg font-semibold shadow disabled:opacity-50 transition-colors"
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
          </form>
          <Link href="/signup">
            <button
              className="mt-4 w-full py-3 rounded-md bg-white hover:bg-amber-50 text-amber-600 text-lg font-semibold shadow border border-amber-600 transition-colors"
            >
              회원가입
            </button>
          </Link>
          {message && (
            <p className={`mt-6 text-center text-base ${message.includes('성공') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>
          )}
        </div>
      </div>
    </main>
  );
} 