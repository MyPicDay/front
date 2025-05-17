'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileNav() {
  const pathname = usePathname();
  // TODO: 로그인 후 유저 아이디 가져오기
  const userId = 'mock-uuid-user-1';
  
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-zinc-200 dark:border-zinc-800 z-50" style={{ backgroundColor: '#FEF4E4' }}>
      <div className="grid grid-cols-5 h-16">
        <Link 
          href={`/calendar/${userId}`}
          className={`flex flex-col items-center justify-center gap-1 ${
            pathname === '/calendar' 
              ? 'text-indigo-600 dark:text-indigo-400' 
              : 'text-zinc-600 dark:text-zinc-400'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs">캘린더</span>
        </Link>
        
        <Link 
          href={`/diary/${userId}`} 
          className={`flex flex-col items-center justify-center gap-1 ${
            pathname === '/diary' 
              ? 'text-indigo-600 dark:text-indigo-400' 
              : 'text-zinc-600 dark:text-zinc-400'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span className="text-xs">일기 추천</span>
        </Link>
        
        <Link 
          href={`/diary/new`} 
          className={`flex flex-col items-center justify-center gap-1 ${
            pathname === '/diary/new' 
              ? 'text-indigo-600 dark:text-indigo-400' 
              : 'text-zinc-600 dark:text-zinc-400'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span className="text-xs">일기 작성</span>
        </Link>
        
        <Link 
          href={`/profile/${userId}`} 
          className={`flex flex-col items-center justify-center gap-1 ${
            pathname.startsWith('/profile') 
              ? 'text-indigo-600 dark:text-indigo-400' 
              : 'text-zinc-600 dark:text-zinc-400'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-xs">프로필</span>
        </Link>
        
        <Link 
          href="/search" 
          className={`flex flex-col items-center justify-center gap-1 ${
            pathname === '/search' 
              ? 'text-indigo-600 dark:text-indigo-400' 
              : 'text-zinc-600 dark:text-zinc-400'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-xs">검색</span>
        </Link>
      </div>
    </nav>
  );
} 