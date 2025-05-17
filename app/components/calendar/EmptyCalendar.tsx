'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

interface EmptyCalendarProps {
  initialDate?: Date;
}

export default function EmptyCalendar({ initialDate = new Date(2025, 4, 1) }: EmptyCalendarProps) {
  return (
    <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow">
      <div className="text-center py-4 text-gray-500">작성된 일기가 없습니다.</div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        initialDate={initialDate}
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