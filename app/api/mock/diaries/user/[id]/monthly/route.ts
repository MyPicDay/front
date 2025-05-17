import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Diary } from '@/app/types/diary';

// 데이터 파일 경로
const diariesDataPath = path.join(process.cwd(), 'lib/data/diaries.json');

// 데이터 로드 함수
function loadDiaries(): Diary[] {
  try {
    const jsonData = fs.readFileSync(diariesDataPath, 'utf8');
    return JSON.parse(jsonData) as Diary[];
  } catch (error) {
    console.error(`Error loading diaries data from ${diariesDataPath}:`, error);
    return [];
  }
}

export const revalidate = 0; // 캐시 비활성화

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = (await params).id;
  const searchParams = req.nextUrl.searchParams;
  const year = searchParams.get('year');
  const month = searchParams.get('month');

  if (!year || !month) {
    return Response.json({ message: 'Year and month query parameters are required.' }, { status: 400 });
  }

  const yearNum = parseInt(year, 10);
  const monthNum = parseInt(month, 10);

  if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
    return Response.json({ message: 'Invalid year or month format.' }, { status: 400 });
  }

  const allDiaries = loadDiaries();

  const filteredDiaries = allDiaries.filter(diary => {
    if (diary.authorId !== userId) {
      return false;
    }
    // diary.date는 'YYYY-MM-DD' 형식이라고 가정합니다.
    const diaryDate = new Date(diary.date);
    return diaryDate.getFullYear() === yearNum && diaryDate.getMonth() + 1 === monthNum;
  });

  return Response.json(filteredDiaries);
} 