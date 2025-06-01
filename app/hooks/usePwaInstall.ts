import { useEffect, useState } from 'react';
import { getMessaging, getToken } from 'firebase/messaging';
import { initializeApp } from 'firebase/app';
import { BeforeInstallPromptEvent } from '../types/pwa';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

export const usePwaInstall = () => {
  const [deferredEvt, setEvt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const onBefore = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setEvt(e); // 사용자에게 원하는 시점에 prompt() 호출
    };
    window.addEventListener('beforeinstallprompt', onBefore as EventListener);

    const onInstalled = async () => {
      // 설치 감지 → FCM 토큰 요청
      const permission =
        Notification.permission === 'default'
          ? await Notification.requestPermission()
          : Notification.permission;
      if (permission !== 'granted') return;

      const app = initializeApp(firebaseConfig);
      const messaging = getMessaging(app);
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!,
        serviceWorkerRegistration: await navigator.serviceWorker.ready,
      });

      await fetch('/api/pwa/fcm-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
    };
    window.addEventListener('appinstalled', onInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBefore as EventListener);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  /** 사용자 클릭 등으로 호출 */
  const triggerInstall = async () => {
    if (!deferredEvt) return;
    try {
      await deferredEvt.prompt();
      const { outcome } = await deferredEvt.userChoice;
      if (outcome === 'accepted') {
        console.log('사용자가 PWA 설치를 수락했습니다.');
      } else {
        console.log('사용자가 PWA 설치를 거부했습니다.');
      }
    } catch (error) {
      console.error('PWA 설치 프롬프트 실행 중 오류:', error);
    }
  };

  return { canInstall: !!deferredEvt, triggerInstall };
};
