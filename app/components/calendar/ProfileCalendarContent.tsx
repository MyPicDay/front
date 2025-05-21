// 클라이언트 컴포넌트로 지정 (Next.js의 서버/클라이언트 분리 기능)
// 이 파일은 브라우저에서 실행되어야 하므로 'use client' 선언이 필요함
'use client';

import React, { useState, useEffect, useCallback } from 'react'; //react 훅들을 가져옴
import { useRouter } from 'next/navigation'; //Next.js에서 페이지 이동을 도와주는 훅
import FullCalendar from '@fullcalendar/react'; //전체 캘린더 UI 컴포넌트
import { CalendarOptions } from '@fullcalendar/core';//캘린더 옵션 타입 정의
import dayGridPlugin from '@fullcalendar/daygrid';//월간 보기 등 dayGrid 기능 추가 플러그인
import interactionPlugin from '@fullcalendar/interaction';// 마우스로 날짜 클릭 등 상호작용 기능 플러그인
import CalendarEventStyles from './CalendarEventStyles';//커스텀 CSS를 적용하는 컴포넌트
import { Diary } from '@/app/types/diary';//다이어리타임(id, title, date, image 등)
import { fetchMonthlyDiaries } from '@/lib/services/apiService';//특정 월의 일기 데이터를 불러오는 함수
import CalendarLoading from './CalendarLoading';// 로딩 중일 때 보여줄 컴포넌트
import CalendarError from './CalendarError';//에러 발생 시 보여줄 컴포넌트
// EmptyCalendarMessage는 필요 없어졌으므로 주석 처리 또는 삭제
// import EmptyCalendarMessage from './EmptyCalendarMessage'; 

//컴포넌트에서 받는 props 타입 정의(userId라는 문자열 하나)
interface ProfileCalendarContentProps {
  userId: string;
}

// 캘린더 이벤트 생성 함수
//일기 배열을 캘린더에서 쓸 수 있는 이벤트 배열로 반환하는 함수
function createCalendarEvents(diaries: Diary[]): any[] {
  return diaries.map(diary => ({
    id: String(diary.id),// 고유 ID
    title: diary.title, // 제목
    date: diary.date, // 날짜
    display: 'background', //배경에 표시되도록 설정
    backgroundColor: 'transparent',//배경색 없음(스타일 따로 적용)
    classNames: 'diary-date-cell', // CSS 클래스 지정
    extendedProps: {
      image: diary.image, // 확장 속성 : 이미지와 ID
      diaryId: diary.id
    }
  }));
}

//메인 컴포넌트 정의 
export default function ProfileCalendarContent({ userId }: ProfileCalendarContentProps) {
  const router = useRouter(); // 페이지 이동 기능
  
  // 여러 가지 상태 정의
  const [isLoading, setIsLoading] = useState(true); // 로딩 중 여부
  const [error, setError] = useState<Error | null>(null); // 에러 상태
  const [diaries, setDiaries] = useState<Diary[]>([]); // 불러온 일기들
  const [currentVisibleMonth, setCurrentVisibleMonth] = useState<Date>(() => new Date(2025, 4, 1)); //현재 보여지는 달

  const calendarRef = React.useRef<FullCalendar>(null); //캘린더에 접근하기 위한 참조
  // 특정 달의 일기를 불러오는 함수
  const loadDiariesForMonth = useCallback(async (date: Date) => {
    if (!userId) return;

    setIsLoading(true); // 로딩 시작
    setError(null); // 에러 초기화
    try {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      console.log(`[PCC] Fetching for User: ${userId}, Year: ${year}, Month: ${month}`);
      const fetchedDiaries = await fetchMonthlyDiaries(userId, year, month);
      setDiaries(fetchedDiaries); // 결과 저장
    } catch (err) {
      console.error('[PCC] Error fetching monthly diaries:', err);
      setError(err as Error); // 에러 저장
      setDiaries([]); // 데이터 초기화
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  }, [userId]);
  //현재 달이 변경되면 다시 일기 로딩
  useEffect(() => {
    loadDiariesForMonth(currentVisibleMonth);
  }, [userId, loadDiariesForMonth, currentVisibleMonth]);
  //FullCalender 동적 import
  useEffect(() => {
    try {
      require('@fullcalendar/daygrid');
      require('@fullcalendar/react');
    } catch (error) {
      console.error('[PCC] FullCalendar package load error:', error);
    }
  }, []);

  const calendarEvents = createCalendarEvents(diaries); // 일기 -> 이벤트로 변환
  const formattedDiaryDates = diaries.map(d => ({ date: d.date, id: d.id, image: d.image }));//클릭용 데이터 준비

  //달이 변경될 때 호출 되는 함수
  const handleDatesSet = (dateInfo: any) => {
    console.log('[PCC] datesSet event. New view start date:', dateInfo.view.currentStart);
    const newViewDate = dateInfo.view.currentStart;
    if (newViewDate.getFullYear() !== currentVisibleMonth.getFullYear() ||
        newViewDate.getMonth() !== currentVisibleMonth.getMonth()) {
      setCurrentVisibleMonth(newViewDate);//상태 업데이트
    }
  };

  //이벤트(=일기)를 클릭했을 때 해당 일기 상세 페이지로 이동
  const handleEventClick = (info: any) => {
    const diaryId = info.event.extendedProps?.diaryId;
    if (diaryId) router.push(`/diary/${diaryId}`);
  };
  //날짜 셀을 클릭했을 때
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
    plugins: [dayGridPlugin, interactionPlugin], //사용 플러그인
    initialView: "dayGridMonth", //초기 뷰는 월간 보기
    initialDate: new Date(2025, 4, 1),// 초기 날짜 (5월 1일)
    events: calendarEvents, // 표시할 이벤트
    headerToolbar: {
      left: 'prev',
      center: 'title',
      right: 'today next'
    },
    locale: "ko", // 한국어 설정
    height: "auto", // 자동 높이
    dayMaxEventRows: 1,
    firstDay: 0, // 주의 시작 : 일요일
    fixedWeekCount: true,
    aspectRatio: 1.5, // 화면 비율
    //셀과 헤더의 CSS 클래스
    dayCellClassNames: "border border-gray-200 dark:border-gray-700",
    dayHeaderClassNames: "border border-gray-200 dark:border-gray-700 p-2 text-center",
    viewClassNames: "border border-gray-200 dark:border-gray-700",

    eventContent: () => null, // 이벤트 안에 텍스트는 안 보여줌
    datesSet: handleDatesSet, // 날짜 범위 바뀌면 실행
    eventClick: handleEventClick, //이벤트 클릭
    dateClick: handleDateClick, // 날짜 셀 클릭
    //커스텀 버튼 정의
    customButtons: {
      prev: { text: '<', click: () => calendarRef.current?.getApi().prev() },
      next: { text: '>', click: () => calendarRef.current?.getApi().next() },
      today: { text: 'today', click: () => calendarRef.current?.getApi().today() }
    }
  };
  // 화면에 표시할 내용 반환(렌더링)
  return (
    <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow max-w-4xl mx-auto relative">
      {error ? (
        <CalendarError /> // 에러가 있다면 에러 컴포넌트 표시
      ) : isLoading ? (
        <CalendarLoading /> //로딩중이면 로딩 표시
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