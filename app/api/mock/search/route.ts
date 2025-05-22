import { NextResponse } from 'next/server';
import diariesData from '../../../../lib/data/diaries.json';

export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase() || '';

    if (!query) {
      return NextResponse.json({ message: '검색어를 입력해주세요.' }, { status: 400 });
    }

    const results = diariesData.filter(diary => 
      diary.title.toLowerCase().includes(query) || 
      diary.content.toLowerCase().includes(query)
    );

    return NextResponse.json(results);

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ message: '검색 중 오류가 발생했습니다.' }, { status: 500 });
  }
} 