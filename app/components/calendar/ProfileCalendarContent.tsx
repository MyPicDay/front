'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import FullCalendar from '@fullcalendar/react';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import CalendarEventStyles from './CalendarEventStyles';
import { Diary } from '@/app/types/diary';
import { fetchMonthlyDiaries } from '@/lib/services/apiService';
import CalendarLoading from './CalendarLoading';
import CalendarError from './CalendarError';
// EmptyCalendarMessage는 필요 없어졌으므로 주석 처리 또는 삭제
// import EmptyCalendarMessage from './EmptyCalendarMessage'; 

interface ProfileCalendarContentProps {
  userId: string;
}

// 캘린더 이벤트 생성 함수
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

export default function ProfileCalendarContent({ userId }: ProfileCalendarContentProps) {
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [currentVisibleMonth, setCurrentVisibleMonth] = useState<Date>(() => new Date(2025, 4, 1));

  const calendarRef = React.useRef<FullCalendar>(null);

  const loadDiariesForMonth = useCallback(async (date: Date) => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);
    try {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      console.log(`[PCC] Fetching for User: ${userId}, Year: ${year}, Month: ${month}`);
      const fetchedDiaries = await fetchMonthlyDiaries(userId, year, month);
      setDiaries(fetchedDiaries);
    } catch (err) {
      console.error('[PCC] Error fetching monthly diaries:', err);
      setError(err as Error);
      setDiaries([]);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadDiariesForMonth(currentVisibleMonth);
  }, [userId, loadDiariesForMonth, currentVisibleMonth]);
  
  useEffect(() => {
    try {
      require('@fullcalendar/daygrid');
      require('@fullcalendar/react');
    } catch (error) {
      console.error('[PCC] FullCalendar package load error:', error);
    }
  }, []);

  const calendarEvents = createCalendarEvents(diaries);
  const formattedDiaryDates = diaries.map(d => ({ date: d.date, id: d.id, image: d.image }));

  const handleDatesSet = (dateInfo: any) => {
    console.log('[PCC] datesSet event. New view start date:', dateInfo.view.currentStart);
    const newViewDate = dateInfo.view.currentStart;
    if (newViewDate.getFullYear() !== currentVisibleMonth.getFullYear() ||
        newViewDate.getMonth() !== currentVisibleMonth.getMonth()) {
      setCurrentVisibleMonth(newViewDate);
    }
  };

  const handleEventClick = (info: any) => {
    const diaryId = info.event.extendedProps?.diaryId;
    if (diaryId) router.push(`/diary/${diaryId}`);
  };

  const handleDateClick = (info: any) => {
    const clickedDateStr = info.dateStr; // YYYY-MM-DD 형식
    const diaryOnDate = formattedDiaryDates.find(d => d.date === clickedDateStr);

    if (diaryOnDate) {
      // 일기가 있는 날짜를 클릭하면 해당 일기 상세 페이지로 이동
      router.push(`/diary/${diaryOnDate.id}`);
    } else {
      // 일기가 없는 날짜를 클릭한 경우
      const today = new Date();
      const clickedDate = new Date(clickedDateStr);

      // 클릭된 날짜의 시간을 00:00:00으로 설정하여 날짜만 비교
      clickedDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      if (clickedDate <= today) {
        // 오늘 또는 과거 날짜인 경우 일기 작성 페이지로 이동 (선택된 날짜를 쿼리 파라미터로 전달)
        router.push(`/diary/new?date=${clickedDateStr}`);
      } else {
        // 미래 날짜인 경우 (선택 사항: 사용자에게 알림을 줄 수 있음)
        console.log("미래 날짜에는 일기를 작성할 수 없습니다.");
        // alert("미래 날짜에는 일기를 작성할 수 없습니다."); // 또는 다른 UI 피드백
      }
    }
  };

  // FullCalendar 옵션 설정 (기존과 대부분 동일)
  const calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: "dayGridMonth",
    initialDate: new Date(2025, 4, 1),
    events: calendarEvents,
    headerToolbar: {
      left: 'prev',
      center: 'title',
      right: 'today next'
    },
    locale: "ko",
    height: "auto",
    dayMaxEventRows: 1,
    firstDay: 0,
    fixedWeekCount: true,
    aspectRatio: 1.5,

    dayCellClassNames: "border border-gray-200 dark:border-gray-700",
    dayHeaderClassNames: "border border-gray-200 dark:border-gray-700 p-2 text-center",
    viewClassNames: "border border-gray-200 dark:border-gray-700",

    eventContent: () => null,
    datesSet: handleDatesSet,
    eventClick: handleEventClick,
    dateClick: handleDateClick, // 수정된 핸들러 연결

    customButtons: {
      prev: { text: '<', click: () => calendarRef.current?.getApi().prev() },
      next: { text: '>', click: () => calendarRef.current?.getApi().next() },
      today: { text: 'today', click: () => calendarRef.current?.getApi().today() }
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow max-w-4xl mx-auto relative">
      {error ? (
        <CalendarError />
      ) : isLoading ? (
        <CalendarLoading />
      // EmptyCalendarMessage 또는 EmptyCalendar는 이전 요청에 따라 삭제되었으므로, 
      // 일기가 없는 경우 FullCalendar가 빈 상태로 표시되거나, CSS로 별도 스타일링 필요
      ) : null } {/* 로딩이 아닐 때는 항상 FullCalendar를 표시 (내용이 없더라도) */}


      {/* FullCalendar는 에러가 아닐 때 항상 렌더링 (로딩 중이거나, 데이터가 없어도 뼈대는 나옴) */}
      {!error && (
          <FullCalendar
            ref={calendarRef}
            {...calendarOptions}
          />
      )}
      
      {/* 로딩 중이 아니고, 에러도 없고, 일기 데이터가 있을 때만 스타일 적용 */}
      {!isLoading && !error && diaries.length > 0 && (
        <CalendarEventStyles diaries={diaries} />
      )}

      {/* 로딩 중이 아니고, 에러도 없고, 일기가 없을 때 "작성된 일기 없음" 메시지 (캘린더와 별개로 표시) */}
      {!isLoading && !error && diaries.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-400 py-4">
          작성된 일기가 없습니다. 빈 날짜를 클릭하여 새 일기를 작성할 수 있습니다.
        </div>
      )}
    </div>
  );
} 