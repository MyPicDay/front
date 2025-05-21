'use client';

// 인라인으로 타입 정의
interface Diary {
  id: number;
  title: string;
  content: string;
  date: string;
  authorId: string;
  image: string;
}

interface CalendarEventStylesProps {
  diaries: Diary[];
}

export default function CalendarEventStyles({ diaries }: CalendarEventStylesProps) {
  console.log("diaries: ", diaries)
  return (
    <style jsx global>{`
      .fc-day[data-date] {
        position: relative;
        overflow: hidden;
      }
      ${diaries.map(diary => 
        
        `
        .fc-day[data-date="${diary.date}"] {
          background-image: url('${diary.image}');
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
          background-color: #f8fafc;
          opacity: 0.95;
        }
      `).join('\n')}
      .fc-daygrid-day-number {
        position: relative;
        z-index: 2;
        color: white;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
      }
      .fc-daygrid-event-harness {
        display: none !important;
      }
      .fc-daygrid-day {
        aspect-ratio: 1/1;
        min-height: 180px !important;
        height: auto !important;
        max-width: 100vw;
      }
    `}</style>
  );
} 