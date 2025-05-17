'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

// FullCalendar 플러그인
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

// FullCalendar를 클라이언트 사이드에서만 로드
const FullCalendar = dynamic(() => import('@fullcalendar/react'), {
  ssr: false,
  loading: () => <div className="w-full py-12 text-center">캘린더를 불러오는 중...</div>
});

// 일기 데이터 타입 정의
interface Diary {
  id: number;
  title: string;
  content: string;
  date: string;
  authorId: string;
  image: string;
}

// 특정 날짜 이미지 타입 정의
interface SpecialDateImage {
  date: string;
  imageUrl: string;
  title: string;
}

// API에서 사용자의 일기 데이터를 가져오는 함수
async function fetchUserDiaries(userId: string): Promise<Diary[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/mock/diaries/user/${userId}`);
    
    if (!response.ok) {
      throw new Error('일기 데이터를 가져오는데 실패했습니다');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('일기 데이터 로드 오류:', error);
    return [];
  }
}

// 특정 날짜에 표시할 이미지를 추가하는 함수
function createCalendarEvents(diaries: Diary[]): any[] {
  return diaries.map(diary => ({
    id: String(diary.id),
    title: diary.title,
    date: diary.date,
    display: 'background',
    backgroundColor: 'transparent',
    classNames: 'diary-date-cell',
    extendedProps: {
      image: diary.image,
      diaryId: diary.id
    }
  }));
}

interface ProfileCalendarProps {
  diaries: Diary[];
  userId?: string; // 선택적 사용자 ID (실시간 데이터 로드용)
}

export default function ProfileCalendar({ diaries, userId }: ProfileCalendarProps) {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [calendarDiaries, setCalendarDiaries] = useState<Diary[]>(diaries || []);
  
  // 클라이언트 측에서 추가 데이터 로드 (선택적)
  useEffect(() => {
    // 초기 데이터가 있으면 사용
    if (diaries && diaries.length > 0) {
      setCalendarDiaries(diaries);
      setIsLoaded(true);
      return;
    }
    
    // userId가 있고 초기 데이터가 없는 경우 API에서 로드
    if (userId) {
      const loadDiaries = async () => {
        try {
          const userDiaries = await fetchUserDiaries(userId);
          setCalendarDiaries(userDiaries);
        } catch (error) {
          console.error('일기 데이터를 불러오는 중 오류가 발생했습니다:', error);
          setHasError(true);
        } finally {
          setIsLoaded(true);
        }
      };
      
      loadDiaries();
    } else {
      // 데이터와 userId가 모두 없는 경우 로드 완료 표시
      setIsLoaded(true);
    }
  }, [diaries, userId]);
  
  // 캘린더 라이브러리 로드 확인
  useEffect(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const testDayGrid = require('@fullcalendar/daygrid');
      const testReact = require('@fullcalendar/react');
    } catch (error) {
      console.error('FullCalendar 패키지 로드 오류:', error);
      setHasError(true);
    }
  }, []);
  
  // 에러 시 대체 UI
  if (hasError) {
    return (
      <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow">
        <p className="text-red-500 text-center py-8">
          캘린더를 불러오는 중 오류가 발생했습니다.
        </p>
        <div className="grid grid-cols-7 gap-1 border border-gray-200 dark:border-gray-700">
          {Array.from({ length: 42 }).map((_, idx) => (
            <div key={idx} className="aspect-square border border-gray-200 dark:border-gray-700 p-1"></div>
          ))}
        </div>
      </div>
    );
  }
  
  // 로딩 중 상태
  if (!isLoaded) {
    return (
      <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow">
        <div className="text-center py-8">캘린더를 불러오는 중...</div>
      </div>
    );
  }
  
  // 일기 없음 상태 처리
  if (calendarDiaries.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow">
        <div className="text-center py-4 text-gray-500">작성된 일기가 없습니다.</div>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          initialDate={new Date(2025, 4, 1)}
          locale="ko"
          height="auto"
          dayCellClassNames="border border-gray-200 dark:border-gray-700"
          dayHeaderClassNames="border border-gray-200 dark:border-gray-700 p-2 text-center"
          viewClassNames="border border-gray-200 dark:border-gray-700"
          headerToolbar={{
            left: 'prev',
            center: 'title',
            right: 'today next'
          }}
        />
      </div>
    );
  }
  
  // 캘린더 이벤트 생성
  const events = createCalendarEvents(calendarDiaries);

  // 날짜 데이터 포맷팅 (YYYY-MM-DD)
  const formattedDiaryDates = calendarDiaries.map(diary => {
    return {
      date: diary.date,
      id: diary.id,
      image: diary.image
    };
  });

  return (
    <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        initialDate={new Date(2025, 4, 1)} // 2025년 5월 1일
        events={events}
        headerToolbar={{
          left: 'prev',
          center: 'title',
          right: 'today next'
        }}
        locale="ko"
        height="auto"
        dayMaxEventRows={1}
        firstDay={0 as number} // 일요일부터 시작
        fixedWeekCount={true} // 항상 6주 표시
        
        // 캘린더 스타일 커스터마이징
        dayCellClassNames="border border-gray-200 dark:border-gray-700"
        dayHeaderClassNames="border border-gray-200 dark:border-gray-700 p-2 text-center"
        viewClassNames="border border-gray-200 dark:border-gray-700"
        
        // 이벤트 렌더링 커스터마이징
        eventContent={() => null} // 이벤트 내용 렌더링하지 않음 (배경만 표시)
        
        // 이벤트 클릭 핸들러
        eventClick={(info) => {
          const diaryId = info.event.extendedProps?.diaryId;
          if (diaryId) {
            router.push(`/diary/${diaryId}`);
          }
        }}
        
        // 날짜 셀 클릭 핸들러 (해당 날짜에 일기가 있으면 이동)
        dateClick={(info) => {
          const clickedDate = info.dateStr;
          const diaryOnDate = formattedDiaryDates.find(d => d.date === clickedDate);
          
          if (diaryOnDate) {
            router.push(`/diary/${diaryOnDate.id}`);
          }
        }}
      />
      
      <style jsx global>{`
        /* 일기가 있는 날짜 셀에 배경 이미지 적용 */
        .diary-date-cell {
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }
        
        .diary-date-cell::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          z-index: 1;
          opacity: 0.9;
        }
        
        /* 특정 일기 이미지를 각 일기 데이터에 맞게 설정 */
        ${calendarDiaries.map(diary => `
          .fc-day[data-date="${diary.date}"] .fc-daygrid-day-bg .diary-date-cell::before {
            background-image: url('${diary.image}');
          }
          
          .fc-day[data-date="${diary.date}"] {
            cursor: pointer;
          }
        `).join('\n')}
        
        /* 날짜 셀 내부의 텍스트는 이미지 위로 표시 */
        .fc-daygrid-day-number {
          position: relative;
          z-index: 2;
          color: white;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
        }
        
        /* 숨겨진 이벤트는 표시하지 않음 */
        .fc-daygrid-event-harness {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
