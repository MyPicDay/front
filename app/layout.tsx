'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { useEffect } from 'react';
import generateUUID from './utils/uuidGenerator';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    useEffect(() => {
        // deviceId 생성해서 localStorage에 저장
        let deviceId = localStorage.getItem('deviceId');
        if (!deviceId) {
            // deviceId = crypto.randomUUID(); // 브라우저 지원
            deviceId = generateUUID(); // 브라우저 지원
            localStorage.setItem('deviceId', deviceId);
            console.log('새 deviceId 생성:', deviceId);
        } else {
            console.log('기존 deviceId:', deviceId);
        }
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/firebase-messaging-sw.js')
                .then((registration) => {
                    console.log('FCM 서비스워커 등록 완료:', registration);
                })
                .catch((err) => {
                    console.error('FCM 서비스워커 등록 실패:', err);
                });
        }
    }, []);

    return (
        <html lang="ko">
            <body className={`${inter.className} bg-[#FEF4E4] text-zinc-900 dark:text-zinc-100 min-h-screen`}>
                <main>{children}</main>
            </body>
        </html>
    );
}
