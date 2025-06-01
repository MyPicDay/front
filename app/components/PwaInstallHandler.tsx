'use client';

import { useEffect } from 'react';
import { usePwaInstall } from '../hooks/usePwaInstall';

export default function PwaInstallHandler() {
  const { canInstall, triggerInstall } = usePwaInstall();

  useEffect(() => {
    if (canInstall) {
      console.log('PWA 설치가 가능합니다. 사용자에게 설치를 유도할 수 있습니다.');
      // 예: 여기에 설치 버튼 UI를 추가하고, 클릭 시 triggerInstall() 호출
      // 간단한 예시로, 3초 후 자동으로 설치 프롬프트를 띄우는 코드 (실제로는 사용자 인터랙션 기반으로 하는 것이 좋음)
      // /*
      const timer = setTimeout(() => {
        console.log('자동으로 PWA 설치 프롬프트를 시도합니다.');
        triggerInstall();
      }, 3000);
      return () => clearTimeout(timer);
      // */
    }
  }, [canInstall, triggerInstall]);

  useEffect(() => {
    // 브라우저 알림 권한 요청 로직 (PWA 설치와 별개로 실행)
    const requestNotificationPermission = async () => {
      if ('Notification' in window) {
        if (Notification.permission === 'default') {
          console.log('브라우저 알림 권한을 요청합니다.');
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            console.log('브라우저 알림이 허용되었습니다.');
            // 여기에 알림 허용 시 추가 로직 (예: UI 업데이트, 서버에 상태 전송 등)
          } else {
            console.log('브라우저 알림이 거부되거나 무시되었습니다.');
          }
        } else if (Notification.permission === 'granted') {
          console.log('브라우저 알림이 이미 허용되어 있습니다.');
        } else {
          console.log('브라우저 알림이 이미 거부되어 있습니다.');
        }
      }
    };

    // 페이지 로드 후 일정 시간 뒤에 권한 요청 (사용자 경험 고려)
    // const permissionTimer = setTimeout(requestNotificationPermission, 5000); // 예: 5초 후
    // const permissionTimer = setTimeout(requestNotificationPermission, 5000); // 예: 5초 후
		

    // return () => clearTimeout(permissionTimer);
    requestNotificationPermission();
  }, []); // 빈 의존성 배열로 마운트 시 1회 실행

  return null; 
} 