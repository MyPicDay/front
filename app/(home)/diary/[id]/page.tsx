import DiaryDetail from '../../../components/DiaryDetail';

async function getDiary(id: string) {
  const res = await fetch(`http://localhost:3000/api/mock/diaries/${id}`, { cache: 'no-store' });
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch diary');
  }
  return res.json();
}

export default async function DiaryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const diary = await getDiary(id);
  
  if (!diary || diary.message) { // Check for not found message
    return (
      <main className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-red-500">일기를 찾을 수 없습니다.</p>
      </main>
    );
  }

  return <DiaryDetail diary={diary} />;
} 