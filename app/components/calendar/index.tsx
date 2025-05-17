'use client';

import ProfileCalendarContent from './ProfileCalendarContent';

interface ProfileCalendarProps {
  userId: string; 
}

export default function ProfileCalendar({ userId }: ProfileCalendarProps) {
    if (!userId) {
    return <div className="text-center p-4 text-red-500">사용자 ID가 제공되지 않아 캘린더를 표시할 수 없습니다.</div>;
  }

  return (
    <ProfileCalendarContent userId={userId} />
  );
} 