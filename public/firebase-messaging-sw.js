importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAfvhxfOnZQ5iqcQP55Ok_3_wrVj3Qw6PE",
  authDomain: "mypicday-a1e3f.firebaseapp.com",
  projectId: "mypicday-a1e3f",
  storageBucket: "mypicday-a1e3f.firebasestorage.app",
  messagingSenderId: "41455946806",
  appId: "1:41455946806:web:cd0f5f7223d4d4441e5c97",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("[firebase-messaging-sw.js] 백그라운드 메세지 수신: ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/icon.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
