'use client';

import Header from '../components/Header';
import MobileNav from '../components/MobileNav';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
