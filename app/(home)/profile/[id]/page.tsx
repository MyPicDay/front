import UserProfile from '../../../components/UserProfile';

// User 타입 정의 (UserProfile 컴포넌트의 User 타입과 일치해야 함)
interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  message?: string; // API 에러 메시지 필드
}

async function getUser(id: string): Promise<User | { message: string }> {
  // 로컬 개발 환경에서는 절대 경로 사용 또는 환경 변수 설정 필요
  // process.env.API_BASE_URL || 'http://localhost:3000'
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/mock/users/${id}`, { cache: 'no-store' });
  
  // 응답이 ok가 아니어도 JSON 본문을 파싱 시도 (에러 메시지 포함 가능성)
  const data = await res.json(); 

  if (!res.ok) {
    // 에러 객체 또는 메시지를 포함한 객체를 반환하도록 처리
    // 여기서는 API가 { message: "..." } 형태로 에러를 반환한다고 가정
    console.error(`Failed to fetch user ${id}:`, data.message || res.statusText);
    return { message: data.message || `사용자(ID: ${id}) 정보를 가져오는데 실패했습니다.` };
  }
  return data as User;
}

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const userData = await getUser(params.id);

  if ('message' in userData && userData.message) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-red-500">{userData.message}</p>
      </main>
    );
  }

  // userData가 User 타입임을 확신할 수 있음 (타입 가드 통과)
  const user = userData as User;

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-8">
      <UserProfile user={user} />
    </main>
  );
} 