import { NextRequest, NextResponse  } from 'next/server';
import fs  from 'fs';
import path from 'path';

// 타입 정의
interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface Diary {
  id: number;
  title: string;
  content: string;
  date: string;
  authorId: string;
  image: string;
}

interface Follower {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
}

// 데이터 파일 경로 및 로드
const usersDataPath = path.join(process.cwd(), 'lib/data/users.json');
const diariesDataPath = path.join(process.cwd(), 'lib/data/diaries.json');
const followersDataPath = path.join(process.cwd(), 'lib/data/followers.json');

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
const users = loadData<User>(usersDataPath);
const diaries = loadData<Diary>(diariesDataPath);
const followersData = loadData<Follower>(followersDataPath);

export const revalidate = 0; // 캐시 비활성화

export async function GET(
  req: NextRequest,
  context: any // ✅ 타입 에러 회피용
) {
  const { id } = await context.params as { id: string };

  
  // 사용자 정보 조회
  const user = users.find(user => user.id === id);
  if (!user) {
    return NextResponse .json({ message: `사용자(ID: ${id})를 찾을 수 없습니다.` }, { status: 404 });
  }
  
  // 작성한 일기 수 계산
  const userDiaries = diaries.filter(diary => diary.authorId === id);
  const diaryCount = userDiaries.length;
  
  // 팔로워 수 계산 (이 사용자를 팔로우하는 사람들)
  const followers = followersData.filter(f => f.followingId === id);
  const followerCount = followers.length;
  
  // 팔로잉 수 계산 (이 사용자가 팔로우하는 사람들)
  const following = followersData.filter(f => f.followerId === id);
  const followingCount = following.length;
  
  return NextResponse .json({
    user,
    stats: {
      diaryCount,
      followerCount,
      followingCount
    },
    diaries: userDiaries
  });
} 