'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

// 필요한 FullCalendar 플러그인들 (직접 import)
import dayGridPlugin from '@fullcalendar/daygrid'; 
import interactionPlugin from '@fullcalendar/interaction';

// FullCalendar 컴포넌트만 클라이언트 사이드에서 로드
const FullCalendar = dynamic(() => import('@fullcalendar/react'), {
  ssr: false,
  loading: () => <p>캘린더를 불러오는 중...</p>
});

interface Diary {
  id: string;
  title: string;
  date: string;
}

export default function CalendarPage() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        const response = await fetch('/api/mock/diaries');
        const diaries = await response.json();
        
        const calendarEvents = diaries.map((diary: Diary) => ({
          id: diary.id,
          title: diary.title,
          date: diary.date,
          backgroundColor: '#4f46e5', // indigo-600
          borderColor: '#4f46e5',
        }));

        setEvents(calendarEvents);
      } catch (error) {
        console.error('일기 데이터를 불러오는 중 오류 발생:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiaries();
  }, []);

  const handleEventClick = (info: any) => {
    router.push(`/diary/${info.event.id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-zinc-600 dark:text-zinc-400">캘린더를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-8">일기 캘린더</h1>
      
      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-xl p-4">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventClick={handleEventClick}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek'
          }}
          locale="ko"
          height="auto"
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false
          }}
        />
      </div>
    </div>
  );
} 