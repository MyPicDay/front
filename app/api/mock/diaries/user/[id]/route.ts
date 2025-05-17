import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

// 타입 정의
interface Diary {
  id: number;
  title: string;
  content: string;
  date: string;
  authorId: string;
  image: string;
}

// 데이터 파일 경로 및 로드
const diariesDataPath = path.join(process.cwd(), 'lib/data/diaries.json');

// 데이터 로드 함수
function loadData<T>(filePath: string): T[] {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error(`Error loading data from ${filePath}:`, error);
    return [];
  }
}

// 데이터 불러오기
const diaries = loadData<Diary>(diariesDataPath);

export const revalidate = 0; // 캐시 비활성화

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // Next.js 15에서는 params를 사용하기 전에 대기해야 함
  const { id } = await params;
  
  // 사용자의 일기 조회
  const userDiaries = diaries.filter(diary => diary.authorId === id);

  console.log("test userDiaries :" , userDiaries)
  
  if (userDiaries.length === 0) {
    return Response.json({ message: `사용자(ID: ${id})의 일기가 없습니다.` }, { status: 404 });
  }
  
  return Response.json(userDiaries);
} 