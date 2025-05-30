'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/lib/store/authStore';

export default function HomePage() {
  const router = useRouter();
  const {isLoggedIn, user} = useAuthStore();

  useEffect(() => {
    // authStore에서 isLoggedIn 상태가 true로 설정되면 (즉, 사용자가 로그인한 것으로 확인되면)
    // 사용자를 캘린더 페이지로 리디렉션합니다.
    // layout.tsx에서 이미 로그인되지 않은 사용자는 /login으로 리디렉션 처리를 하고 있으므로,
    // 이 page.tsx는 로그인된 사용자의 / 경로 접근 시 리디렉션만 담당합니다.
    if (isLoggedIn) {
      // TODO: 로그인 후 유저 아이디 가져오기
      const userId = user?.id; // 사용자 ID는 임시로 localStorage 또는 기본값 사용
      router.replace(`/calendar/${userId}`);
    }
    // isLoggedIn이 false인 경우, layout.tsx가 /login으로 리디렉션할 것이므로
    // 이 컴포넌트에서는 별도의 처리를 하지 않습니다.
  }, [isLoggedIn, router]);

  // 리디렉션이 발생하거나, authStore의 상태가 확정될 때까지
  // 아무것도 표시하지 않거나 로딩 스피너를 보여줄 수 있습니다.
  // layout.tsx 에서도 로딩 처리가 있을 수 있으므로 null 이나 간단한 로더가 적합합니다.
  return null; // 또는 <p>Loading...</p> 또는 로딩 스피너 컴포넌트
} 