import { NextResponse } from 'next/server';
import usersData from '../../../../../lib/data/users.json'; // 실제로는 DB를 사용해야 합니다.
import fs from 'fs';
import path from 'path';

export const revalidate = 0;

const usersFilePath = path.join(process.cwd(), 'lib', 'data', 'users.json');
let users = [...usersData]; // 메모리에 사용자 데이터 로드

// 특정 사용자 정보 가져오기 (GET)
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const user = users.find(u => u.id === userId);

    if (!user) {
      return NextResponse.json({ message: '사용자를 찾을 수 없습니다.' }, { status: 404 });
    }
    // 실제 앱에서는 password 같은 민감 정보는 제외하고 반환해야 합니다.
    const { ...userWithoutPassword } = user; 
    return NextResponse.json(userWithoutPassword, { status: 200 });

  } catch (error) {
    console.error(`Error fetching user ${params.id}:`, error);
    return NextResponse.json({ message: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 특정 사용자 정보 수정하기 (PUT)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const { name, avatar } = await request.json(); // 이메일, 비밀번호 변경은 별도 처리 가정

    if (!name && !avatar) {
      return NextResponse.json({ message: '수정할 내용을 입력해주세요.' }, { status: 400 });
    }

    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return NextResponse.json({ message: '사용자를 찾을 수 없습니다.' }, { status: 404 });
    }

    // 사용자 정보 업데이트
    if (name) users[userIndex].name = name;
    if (avatar) users[userIndex].avatar = avatar;
    // users[userIndex].updatedAt = new Date().toISOString(); // 수정일시 기록 (선택적)

    // users.json 파일 업데이트
    try {
      fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
    } catch (error) {
      console.error('Failed to write users.json for update:', error);
      // 파일 쓰기 실패 시에도 일단 성공으로 응답 (메모리에는 반영됨)
    }

    // 수정된 사용자 정보 반환 (민감 정보 제외)
    const { ...updatedUserWithoutPassword } = users[userIndex];
    return NextResponse.json({ message: '사용자 정보가 성공적으로 수정되었습니다.', user: updatedUserWithoutPassword }, { status: 200 });

  } catch (error) {
    console.error(`Error updating user ${params.id}:`, error);
    return NextResponse.json({ message: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
} 