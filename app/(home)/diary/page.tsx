import DiaryList from '../../components/DiaryList';

export default async function DiaryListPage() {
  const res = await fetch('http://localhost:3000/api/mock/diaries', { cache: 'no-store' });
  const diaries = await res.json();
  return <DiaryList items={diaries} />;
} 