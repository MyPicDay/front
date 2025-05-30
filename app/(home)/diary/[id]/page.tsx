import DiaryDetail from '../../../components/DiaryDetail';

async function getDiary(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_SERVER_URL || process.env.NEXT_PUBLIC_UNIMPLEMENTED_API_SERVER_URL || 'http://localhost:3000';
  // TODO: 구현이 끝나면 경로를 변경해주세요
  // const baseUrl = process.env.NEXT_PUBLIC_API_SERVER_URL;
  const res = await fetch(`${baseUrl}/api/mock/diaries/${id}`, { cache: 'no-store' });
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch diary');
  }
  
  return res.json();
}

export default async function DiaryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;


  const diary = await getDiary(id);
  console.log("diary", diary);
  
  if (!diary || diary.message) { // Check for not found message
    return (
      <main className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-red-500">일기를 찾을 수 없습니다.</p>
      </main>
    );
  }
  return <DiaryDetail diary={diary} />;
} 