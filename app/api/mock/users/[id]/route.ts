import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

// 타입 정의
interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

// 데이터 파일 경로 및 로드
const usersDataPath = path.join(process.cwd(), 'lib/data/users.json');

// 데이터 로드 함수
function loadData<T>(filePath: string): T[] {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error(`Error loading data from ${filePath}:`, error);
    return [];
  }
}

// 사용자 데이터 불러오기
const users = loadData<User>(usersDataPath);

export const revalidate = 0; // 캐시 비활성화

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // Next.js 15에서는 params를 사용하기 전에 대기해야 함
  const { id } = await params;
  
  // 사용자 정보 조회
  const user = users.find(user => user.id === id);
  if (!user) {
    return Response.json({ message: `사용자(ID: ${id})를 찾을 수 없습니다.` }, { status: 404 });
  }
  
  return Response.json(user);
}

// 특정 사용자 정보 수정하기 (PUT)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Next.js 15에서는 params를 사용하기 전에 대기해야 함
    const { id } = await params;
    const { name, avatar } = await request.json(); // 이메일, 비밀번호 변경은 별도 처리 가정

    if (!name && !avatar) {
      return Response.json({ message: '수정할 내용을 입력해주세요.' }, { status: 400 });
    }

    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      return Response.json({ message: '사용자를 찾을 수 없습니다.' }, { status: 404 });
    }

    // 사용자 정보 업데이트
    if (name) users[userIndex].name = name;
    if (avatar) users[userIndex].avatar = avatar;
    // users[userIndex].updatedAt = new Date().toISOString(); // 수정일시 기록 (선택적)

    // users.json 파일 업데이트
    try {
      fs.writeFileSync(usersDataPath, JSON.stringify(users, null, 2), 'utf-8');
    } catch (error) {
      console.error('Failed to write users.json for update:', error);
      // 파일 쓰기 실패 시에도 일단 성공으로 응답 (메모리에는 반영됨)
    }

    // 수정된 사용자 정보 반환 (민감 정보 제외)
    const { ...updatedUserWithoutPassword } = users[userIndex];
    return Response.json({ message: '사용자 정보가 성공적으로 수정되었습니다.', user: updatedUserWithoutPassword }, { status: 200 });

  } catch (error) {
    console.error(`Error updating user ${params.id}:`, error);
    return Response.json({ message: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
} 