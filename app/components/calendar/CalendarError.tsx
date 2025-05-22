export default function CalendarError() {
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