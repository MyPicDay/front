'use client';

import { EventSourcePolyfill } from 'event-source-polyfill';
import useNotificationStore from '@/lib/store/useNotificationStore';
import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import {useEffect, useRef, useState} from 'react';
import useAuthStore from '@/lib/store/authStore';
import api from '../api/api';
import { getServerURL } from '@/lib/utils/url';
import SearchInput from '@/app/components/SearchInput';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const logout = useAuthStore((state) => state.logout);
  // TODO: 로그인 후 유저 아이디 가져오기
  const {user} = useAuthStore((state) => state);
  const userId = user?.id;
  const { unreadCount, setUnreadCount } = useNotificationStore();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  
  // 화면 사이즈 상태 (모바일 뷰 감지용)
  const [isMobile, setIsMobile] = useState(false);


  const handleLogout = async () => {
  try {
    await api.post('/auth/logout', {}, { withCredentials: true });
    // logout(); // Zustand 상태 초기화
    // router.push('/login'); // 로그아웃 후 이동
  } catch (error) {
    console.error('로그아웃 실패:', error);
  } finally {
    logout(); 
    router.push('/login'); 
  }
};


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && keyword.trim()) {
      router.push(`/search?q=${encodeURIComponent(keyword)}`);
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      if (typeof window !== 'undefined') {
        const response = await api.get('/notifications/unread/count', { withCredentials: true });
        setUnreadCount(response.data);
      }
    };
    fetchNotifications();
  }, []);


  // 알림 데이터 가져오기 
useEffect(() => {
  if (!userId) return;

  const token = localStorage.getItem('accessToken');
  if (!token) return;

  const eventSource = new EventSourcePolyfill(`${getServerURL()}/notifications/subscribe`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    heartbeatTimeout: 180000, //3분
    withCredentials: true, 
  });

  eventSource.addEventListener("connect", (event) => {
    const message = event as MessageEvent;
});

  eventSource.addEventListener('notification', (event) => {
    try {
      const message = event as MessageEvent;
      const data = JSON.parse(message.data);
      console.log('SSE 알림 수신:', data);
      setUnreadCount((prev: number) => prev + 1);
    } catch (err) {
      console.error('알림 파싱 오류:', err);
    }
  });

  eventSource.onerror = (error: Event) => {
    console.error('SSE 연결 오류:', error);
  };

  return () => {
    eventSource.close();
  };
}, [userId]);


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
          <SearchInput />
          
          {/* 네비게이션 링크 */}
          <nav className="flex items-center gap-6">
            <Link 
              href={`/calendar/${userId}`} 
              className={`flex items-center gap-1 font-medium ${pathname.startsWith('/calendar') ? 'text-[#936239] dark:text-indigo-400' : 'text-zinc-700 dark:text-zinc-300'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="hidden lg:inline">캘린더</span>
            </Link>
            <Link 
              href="/diary" 
              className={`flex items-center gap-1 font-medium ${pathname === '/diary' ? 'text-[#936239] dark:text-indigo-400' : 'text-zinc-700 dark:text-zinc-300'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="hidden lg:inline">일기 추천</span>
            </Link>
            <Link 
              href="/diary/new" 
              className={`flex items-center gap-1 font-medium ${pathname === '/diary/new' ? 'text-[#936239] dark:text-indigo-400' : 'text-zinc-700 dark:text-zinc-300'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span className="hidden lg:inline">일기 작성</span>
            </Link>
            <Link 
              href={`/profile/${userId}`} 
              className={`flex items-center gap-1 font-medium ${pathname.startsWith('/profile') ? 'text-[#936239] dark:text-indigo-400' : 'text-zinc-700 dark:text-zinc-300'}`}
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
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                   {unreadCount}
                </span>
              )}
            </Link>
            <div className="relative" ref={profileMenuRef}>
              <button 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="w-8 h-8 rounded-full overflow-hidden border-2 border-amber-500 focus:outline-none"
              >
                <img src={`${user?.avatar}`} alt="프로필" className="w-full h-full object-cover" />
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
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
} 