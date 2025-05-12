interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface UserProfileProps {
  user: User;
}

export default function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="max-w-2xl mx-auto my-10 p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-xl flex flex-col items-center">
      <img 
        src={user.avatar || '/mockups/avatar-placeholder.png'} 
        alt={`${user.name}'s avatar`} 
        className="w-40 h-40 rounded-full object-cover border-4 border-indigo-500 dark:border-indigo-400 mb-6 shadow-lg"
      />
      <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-white mb-2">{user.name}</h1>
      <p className="text-lg text-indigo-600 dark:text-indigo-400 mb-6">{user.email}</p>
      
      {/* 프로필 페이지에 추가될 수 있는 내용들 */}
      {/* <div className="w-full mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-700">
        <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200 mb-4">작성한 일기</h2>
        <p className="text-zinc-600 dark:text-zinc-400">[사용자가 작성한 일기 목록이 여기에 표시됩니다.]</p>
      </div> */}

      {/* 현재 사용자의 프로필일 경우, 설정 페이지로 이동하는 버튼 추가 가능 */}
      {/* 예: <a href="/settings" className="mt-6 ...">프로필 수정</a> */}
    </div>
  );
} 