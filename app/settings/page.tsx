'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

// 임시로 사용할 사용자 ID (추후 로그인 상태에서 가져와야 함)
const MOCK_USER_ID = "mock-uuid-user-1"; 

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      setIsFetching(true);
      setMessage('');
      try {
        const response = await fetch(`/api/mock/users/${MOCK_USER_ID}`);
        if (response.ok) {
          const userData: User = await response.json();
          setUser(userData);
          setName(userData.name);
          // Email은 보통 수정하지 않으므로 상태로 관리하지 않거나, 읽기 전용으로만 사용
          setAvatar(userData.avatar);
        } else {
          const errorData = await response.json();
          setMessage(errorData.message || '사용자 정보를 불러오는데 실패했습니다.');
        }
      } catch (error) {
        setMessage('네트워크 오류 또는 서버 문제로 사용자 정보를 불러오지 못했습니다.');
        console.error('Fetch user data error:', error);
      }
      setIsFetching(false);
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage('');
    setIsLoading(true);

    if (!user) {
      setMessage('사용자 정보가 로드되지 않았습니다.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/mock/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, avatar }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('정보가 성공적으로 업데이트되었습니다.');
        setUser(data.user); // 업데이트된 사용자 정보로 상태 업데이트
        setName(data.user.name);
        setAvatar(data.user.avatar);
        // router.push('/profile/' + user.id); // 성공 시 프로필 페이지로 이동 등
      } else {
        setMessage(data.message || '정보 업데이트 중 오류가 발생했습니다.');
      }
    } catch (error) {
      setMessage('네트워크 오류 또는 서버 문제로 정보 업데이트에 실패했습니다.');
      console.error('Update user data error:', error);
    }
    setIsLoading(false);
  };

  if (isFetching) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <p>사용자 정보를 불러오는 중...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-4">
         <h2 className="text-2xl font-semibold mb-4">회원정보 수정</h2>
        <p className="text-red-500">{message || '사용자 정보를 찾을 수 없습니다.'}</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-900 p-4">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white dark:bg-zinc-800 rounded-xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-zinc-900 dark:text-white">회원정보 수정</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center mb-6">
            <img src={avatar || '/mockups/avatar-placeholder.png'} alt="Avatar" className="w-32 h-32 rounded-full object-cover border-2 border-zinc-300 dark:border-zinc-600" />
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">사용자명</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-zinc-700 dark:text-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">이메일 (변경 불가)</label>
            <input
              id="email"
              name="email"
              type="email"
              readOnly
              className="mt-1 block w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm bg-zinc-100 dark:bg-zinc-700 dark:text-zinc-400 sm:text-sm cursor-not-allowed"
              value={user.email}
            />
          </div>
          <div>
            <label htmlFor="avatar" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">아바타 URL</label>
            <input
              id="avatar"
              name="avatar"
              type="url"
              className="mt-1 block w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-zinc-700 dark:text-white"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://example.com/avatar.png"
            />
          </div>
          {/* TODO: 비밀번호 변경 섹션/링크 */} 
          <div>
            <button
              type="submit"
              disabled={isLoading || isFetching}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 dark:focus:ring-offset-zinc-800"
            >
              {isLoading ? '저장 중...' : '정보 저장'}
            </button>
          </div>
        </form>
        {message && (
          <p className={`mt-4 text-sm text-center ${message.includes('성공') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {message}
          </p>
        )}
      </div>
    </main>
  );
} 