import DiaryDetail from '../../../components/DiaryDetail';

export default async function DiaryDetailPage({ params }: { params: { id: string } }) {
  const res = await fetch(`http://localhost:8080/api/posts/${params.id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return <div>일기 데이터를 불러올 수 없습니다.</div>;
  }

  const diary = await res.json();

  if (!diary) {
    return <div>일기가 존재하지 않습니다.</div>;
  }

  return <DiaryDetail diary={diary} />;
}