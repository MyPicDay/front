'use client';

import { getServerURL } from "@/lib/utils/url";
import { CalendarDiary } from "@/app/types/calendar";

interface CalendarEventStylesProps {
  diaries: CalendarDiary[];
}

export default function CalendarEventStyles({ diaries }: CalendarEventStylesProps) {
  const diariesWithServerImage = diaries.map(diary => ({
    ...diary,
    image: diary.imageUrls.length > 0 ? `${getServerURL()}/diaries/images/${diary.imageUrls[0]}` : '',
    date: diary.createdAt.split('T')[0] // 날짜 형식 통일
  }));
  
  return (
    <style jsx global>{`
      .fc-day[data-date] {
        position: relative;
        overflow: hidden;
      }
      ${diariesWithServerImage.map(diary => `
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