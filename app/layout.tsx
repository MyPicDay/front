'use client';

import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={`${inter.className} bg-[#FEF4E4] text-zinc-900 dark:text-zinc-100 min-h-screen`}>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
} 