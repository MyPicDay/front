/* firebase-messaging-sw.js */
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js');
importScripts("https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js");

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload,
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image || '/icons/android-chrome-192x192.png', // 기본 아이콘
    data: { url: payload.fcmOptions?.link || '/' } // 알림 클릭 시 이동할 URL
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    }),
  );
});

// Workbox를 사용한 PWA 오프라인 캐싱 (기존 설정과 충돌하지 않도록 주의)
// self.__WB_MANIFEST는 next-pwa가 빌드 시 주입합니다.
if (workbox) {
  console.log(`Workbox is loaded`);
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

  // 이미지 캐싱 전략
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'image-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 60, // 최대 60개 이미지 캐시
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30일
        }),
      ],
    }),
  );

  // API 응답 캐싱 (예시: /api/mock/* 경로)
  workbox.routing.registerRoute(
    new RegExp('^/api/mock/.*'),
    new workbox.strategies.NetworkFirst({
      cacheName: 'api-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 30,
          maxAgeSeconds: 24 * 60 * 60, // 1일
        }),
      ],
    })
  );

} else {
  console.log(`Workbox didn't load`);
}
