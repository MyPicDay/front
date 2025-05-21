'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [characterDesc, setCharacterDesc] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage('');
    setIsLoading(true);

    if (password !== confirmPassword) {
      setMessage('비밀번호가 일치하지 않습니다.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, email, password }),
      });

      const result = await response.text();

      console.log("서버 응답:", result);

      if (response.ok) {
        setMessage('회원가입 성공! 로그인 페이지로 이동합니다.');
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setMessage(result || '회원가입 중 오류가 발생했습니다.');
      }
    } catch (error) {
      setMessage('네트워크 오류 또는 서버 문제로 회원가입에 실패했습니다.');
      console.error('Signup fetch error:', error);
    }
    setIsLoading(false);
  };

  return (
    <main className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        {/* 좌측: 회원가입 폼 */}
        <div className="flex-1 bg-[#FEF4E4] p-8 flex flex-col justify-center">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-zinc-900">회원가입</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-base font-medium text-zinc-700 mb-1">이메일</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full px-4 py-2 rounded-md border border-zinc-300 bg-[#FEF4E4] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-base font-medium text-zinc-700 mb-1">비밀번호</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="block w-full px-4 py-2 rounded-md border border-zinc-300 bg-[#FEF4E4] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-base font-medium text-zinc-700 mb-1">비밀번호 확인</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="block w-full px-4 py-2 rounded-md border border-zinc-300 bg-[#FEF4E4] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="nickname" className="block text-base font-medium text-zinc-700 mb-1">닉네임</label>
              <input
                id="nickname"
                name="nickname"
                type="text"
                required
                className="block w-full px-4 py-2 rounded-md border border-zinc-300 bg-[#FEF4E4] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="nickname"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
              />
            </div>
          </form>
        </div>
        {/* 우측: 캐릭터 생성 안내 및 버튼 */}
        <div className="flex-1 bg-white p-8 flex flex-col justify-center border-t md:border-t-0 md:border-l border-zinc-200">
          <h3 className="text-xl font-semibold text-center mb-6 text-zinc-900">나만의 캐릭터 만들기</h3>
          <div>
            <label htmlFor="characterDesc" className="block text-base font-medium text-zinc-700 mb-1">캐릭터 생성</label>
            <textarea
              id="characterDesc"
              name="characterDesc"
              rows={4}
              className="block w-full px-4 py-2 rounded-md border border-zinc-300 bg-[#FEF4E4] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
              placeholder="생성하고자 하는 캐릭터에 대해 묘사해주세요.\n자세하게 묘사할수록 원하는 모습에 더 가까워집니다."
              value={characterDesc}
              onChange={e => setCharacterDesc(e.target.value)}
            />
          </div>
          <button
            type="submit"
            form=""
            disabled={isLoading}
            onClick={handleSubmit}
            className="mt-8 w-full py-3 rounded-md bg-[#FEF4E4] hover:bg-amber-300 text-zinc-900 text-lg font-semibold shadow disabled:opacity-50 border border-zinc-300 transition-colors"
          >
            {isLoading ? '가입 처리 중...' : '회원가입'}
          </button>
          {message && (
            <p className={`mt-4 text-center text-base ${message.includes('성공') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>
          )}
        </div>
      </div>
    </main>
  );
} 