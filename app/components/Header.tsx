'use client';

import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import {useEffect, useRef, useState} from 'react';
import useAuthStore from '@/lib/store/authStore';
import api from '../api/api';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const logout = useAuthStore((state) => state.logout);
  // TODO: 로그인 후 유저 아이디 가져오기
  const userId = 'mock-uuid-user-1'
  const [hasNotification, setHasNotification] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  
  // 화면 사이즈 상태 (모바일 뷰 감지용)
  const [isMobile, setIsMobile] = useState(false);


  const handleLogout = async () => {
  try {
    await api.post('/auth/logout', {}, { withCredentials: true }); // refreshToken 쿠키 삭제
    logout(); // Zustand 상태 초기화
    router.push('/login'); // 로그아웃 후 이동
  } catch (error) {
    console.error('로그아웃 실패:', error);
  }
};


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && keyword.trim()) {
      router.push(`/search?q=${encodeURIComponent(keyword)}`);
    }
  };


  // 알림 데이터 가져오기 (mock)
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/mock/notifications');
        const data = await res.json();
        // 읽지 않은 알림이 있는지 확인
        setHasNotification(data.some((notification: any) => !notification.read));
      } catch (error) {
        console.error('알림 데이터를 가져오는 중 오류 발생:', error);
      }
    };

    fetchNotifications();
  }, []);

  // 화면 크기 변경 감지
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // 768px 미만이면 모바일로 간주
    };
    
    // 초기 설정
    handleResize();
    
    // 리사이즈 이벤트 리스너
    window.addEventListener('resize', handleResize);

    // 외부 클릭 감지
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, []);

  return (
    <header className="sticky top-0 z-50" style={{ backgroundColor: '#FEF4E4' }}>
      <div className="container mx-auto px-4">
        {/* PC 헤더 (md 이상 크기에서만 표시) */}
        <div className="hidden md:flex items-center justify-between h-16">
          {/* 로고 */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 relative">
              <img src="/images/logo.png" alt="로고" className="w-full h-full object-contain" />
            </div>
            <img src="/images/logo-text.png" alt="MyPicDay" className="h-8 object-contain" />
          </Link>
          
          {/* 검색창 */}
          <div className="relative w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="search"
              placeholder="검색"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-10 pr-4 py-2 w-full rounded-full bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          {/* 네비게이션 링크 */}
          <nav className="flex items-center gap-6">
            <Link 
              href={`/calendar/${userId}`} 
              className={`flex items-center gap-1 font-medium ${pathname.startsWith('/calendar') ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-700 dark:text-zinc-300'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="hidden lg:inline">캘린더</span>
            </Link>
            <Link 
              href="/diary" 
              className={`flex items-center gap-1 font-medium ${pathname === '/diary' ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-700 dark:text-zinc-300'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="hidden lg:inline">일기 추천</span>
            </Link>
            <Link 
              href="/diary/new" 
              className={`flex items-center gap-1 font-medium ${pathname === '/diary/new' ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-700 dark:text-zinc-300'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span className="hidden lg:inline">일기 작성</span>
            </Link>
            <Link 
              href={`/profile/${userId}`} 
              className={`flex items-center gap-1 font-medium ${pathname.startsWith('/profile') ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-700 dark:text-zinc-300'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="hidden lg:inline">프로필</span>
            </Link>
          </nav>

          {/* 알림 & 프로필 */}
          <div className="flex items-center gap-4">
            <Link href="/notifications" className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-zinc-700 dark:text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {hasNotification && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  1
                </span>
              )}
            </Link>
            <div className="relative" ref={profileMenuRef}>
              <button 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="w-8 h-8 rounded-full overflow-hidden border-2 border-amber-500 focus:outline-none"
              >
                <img src="/images/city-night.png" alt="프로필" className="w-full h-full object-cover" />
              </button>
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-30 bg-white rounded-md shadow-lg py-1 z-50 dark:bg-zinc-800">
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-700"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    설정
                  </Link>
                  <div className="border-t border-zinc-200 dark:border-zinc-700"></div>
                  <button
                    onClick={() => { 
                      console.log('로그아웃 클릭');
                      handleLogout();
                      setIsProfileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-700"
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* 모바일 헤더 (md 미만 크기에서만 표시) */}
        <div className="flex md:hidden items-center justify-between h-14">
          {/* 로고 */}
          <Link href="/" className="flex items-center gap-1">
            <div className="w-8 h-8 relative">
              <img src="/images/logo.png" alt="로고" className="w-full h-full object-contain" />
            </div>
            <img src="/images/logo-text.png" alt="MyPicDay" className="h-6 object-contain" />
          </Link>
          
          {/* 알림 아이콘 */}
          <Link href="/notifications" className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-zinc-700 dark:text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {hasNotification && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                1
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
} 