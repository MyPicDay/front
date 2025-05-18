import DiaryList from '../../components/DiaryList';

export default async function DiaryListPage() {
  const baseUrl = process.env.NEXT_PUBLIC_API_SERVER_URL || process.env.NEXT_PUBLIC_UNIMPLEMENTED_API_SERVER_URL || 'http://localhost:3000';
  // TODO: 구현이 끝나면 경로를 변경해주세요
  // const baseUrl = process.env.NEXT_PUBLIC_API_SERVER_URL;
  const res = await fetch(`${baseUrl}/api/mock/diaries`, { cache: 'no-store' });
  const diaries = await res.json();
  return <DiaryList items={diaries} />;
} 