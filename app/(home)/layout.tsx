'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/lib/store/authStore';
import Header from '../components/Header';
import MobileNav from '../components/MobileNav';
import LoadingSpinner from '../components/LoadingSpinner'; // LoadingSpinner 임포트

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  // 각 상태를 개별적으로 선택하여 무한 루프 방지
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  const [isClient, setIsClient] = useState(false);
  const [authStatusResolved, setAuthStatusResolved] = useState(false); // 클라이언트에서 인증 상태 확인 시도 여부

  useEffect(() => {
    // 컴포넌트가 클라이언트에 마운트되었음을 표시합니다.
    console.log("HomeLayout useEffect");
    setIsClient(true);
  }, []);

  useEffect(() => {
    // 클라이언트 환경이고 아직 인증 상태 확인을 시도하지 않았다면, checkAuth()를 호출합니다.
    if (isClient && !authStatusResolved) {
      checkAuth(); // 인증 상태를 확인하고 스토어를 업데이트합니다.
      setAuthStatusResolved(true); // 인증 상태 확인을 시도했음을 표시합니다.
    }
  }, [isClient, authStatusResolved, checkAuth]);

  useEffect(() => {
    // 클라이언트 환경이고, 인증 상태 확인이 완료되었으며, 로그인되지 않은 경우 리디렉션합니다.
    if (isClient && authStatusResolved && !isLoggedIn) {
      // TESAT:  true true false null
      console.log("TESAT: ", isClient, authStatusResolved, isLoggedIn);
      router.replace('/login');
    }
  }, [isClient, authStatusResolved, isLoggedIn, router]);

  // 1. 서버에서 렌더링 중이거나, 클라이언트지만 아직 인증 상태 확인이 시도되지 않았다면 아무것도 렌더링하지 않거나 로더를 보여줍니다.
  //    이것이 하이드레이션 불일치를 방지하는 데 매우 중요합니다.
  if (!isClient || !authStatusResolved) {
    return <LoadingSpinner />; // 로딩 스피너 사용
  }

  // 2. 클라이언트이고 인증 상태 확인이 완료되었지만, 로그인되지 않았다면 (리디렉션이 진행 중일 수 있음)
  //    이 경우에도 자식 컴포넌트를 렌더링하지 않아 UI 깜빡임을 방지합니다.
  if (!isLoggedIn) {
    // router.replace가 실행된 후 실제 페이지 이동까지 약간의 시간이 걸릴 수 있으므로,
    // 그동안 null이나 로딩 메시지를 보여주는 것이 좋습니다.
    return <LoadingSpinner />; // 로딩 스피너 사용 (리디렉션 중 표시)
  }

  // 3. 클라이언트이고, 인증 상태 확인이 완료되었으며, 로그인된 경우에만 자식 컴포넌트를 렌더링합니다.
  return (
    <>
      <Header />
      <main className="pb-20 md:pb-8">
        {children}
      </main>
      <MobileNav />
    </>
  );
}