import './globals.css';
import { Inter } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import DeviceInitializer from './components/DeviceInitializer';
import PwaInstallHandler from './components/PwaInstallHandler';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'MyPicDay',
    description: '당신의 하루를 기록하세요',
    manifest: '/manifest.json',
    icons: {
        icon: [
            { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
            { url: '/icons/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
            { url: '/icons/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
            { url: '/icons/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
        apple: [
            { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
        ]
    },
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'MyPicDay',
    },
};

export const viewport: Viewport = {
    themeColor: '#4f46e5',
    // 필요하다면 다른 viewport 관련 설정 추가 (e.g., width, initialScale)
};

export default function RootLayout({ children, }: { children: React.ReactNode; }) {
    return (
        <html lang="ko">
        <body className={`${inter.className} bg-[#FEF4E4] text-zinc-900 dark:text-zinc-100 min-h-screen`}>
        <DeviceInitializer />
        <PwaInstallHandler />
        <main>{children}</main>
        </body>
        </html>
    );
}
