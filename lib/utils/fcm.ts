import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage , Messaging} from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyAfvhxfOnZQ5iqcQP55Ok_3_wrVj3Qw6PE",
  authDomain: "mypicday-a1e3f.firebaseapp.com",
  projectId: "mypicday-a1e3f",
  storageBucket: "mypicday-a1e3f.firebasestorage.app",
  messagingSenderId: "41455946806",
  appId: "1:41455946806:web:cd0f5f7223d4d4441e5c97",
};

const app = initializeApp(firebaseConfig);

let messaging: Messaging | null = null;

export function getFirebaseMessaging(): Messaging | null {
  if (typeof window !== 'undefined') {
    if (!messaging) {
      messaging = getMessaging(app);
    }
    return messaging;
  }
  return null;
}

export const requestPermissionAndGetToken = async (): Promise<string | null> => {
    if (typeof window === 'undefined') return null; 
  try {
    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
      console.warn('알림 권한이 거부되었습니다.');
      return null;
    }

     const messagingInstance = getFirebaseMessaging();
    if (!messagingInstance) {
      console.warn('Firebase messaging 인스턴스 생성 실패');
      return null;
    }

    const token = await getToken(messagingInstance, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY, 
    });

    // console.log('FCM 토큰:', token);
    return token;
  } catch (error) {
    console.error('FCM 토큰 요청 중 오류 발생:', error);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    const messagingInstance = getFirebaseMessaging();
    if (!messagingInstance) return;

    onMessage(messagingInstance, (payload) => {
      // console.log('포그라운드 알림 수신:', payload);

      const notificationTitle = payload.notification?.title || '새 알림';
      const notificationOptions = {
        body: payload.notification?.body || '',
        icon: payload.notification?.icon || '/favicon.ico',
      };

      new Notification(notificationTitle, notificationOptions);

      resolve(payload);
    });
  });
