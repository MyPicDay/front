import { NextResponse } from 'next/server';
import usersData from '../../../../../lib/data/users.json'; // 실제로는 DB를 사용해야 합니다.
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto'; // Node.js crypto 모듈에서 randomUUID 가져오기

export const revalidate = 0;

// users.json 파일 경로
const usersFilePath = path.join(process.cwd(), 'lib', 'data', 'users.json');

// 현재 users 데이터를 메모리에 로드 (앱 실행 시 한 번)
let users = [...usersData];

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json({ message: '모든 필드를 입력해주세요.' }, { status: 400 });
    }

    const existingUser = users.find(user => user.email === email || user.name === username);
    if (existingUser) {
      return NextResponse.json({ message: '이미 사용 중인 아이디 또는 이메일입니다.' }, { status: 409 });
    }

    const newUser = {
      id: randomUUID(), // UUID로 ID 생성
      name: username,
      email: email,
      // 실제 앱에서는 비밀번호를 해싱하여 저장해야 합니다.
      // password: hashedPassword, 
      avatar: `/mockups/avatar${Math.floor(Math.random() * 2) + 1}.png` // 임시 아바타
    };

    users.push(newUser);

    // users.json 파일 업데이트 (실제 운영에서는 DB 사용)
    try {
      fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
    } catch (error) {
      console.error('Failed to write users.json:', error);
      // 파일 쓰기 실패 시에도 일단 성공으로 응답 (메모리에는 반영됨)
      // 운영 환경에서는 트랜잭션 처리 등으로 데이터 일관성 보장 필요
    }

    return NextResponse.json({ message: '회원가입 성공!', user: { id: newUser.id, name: newUser.name, email: newUser.email } }, { status: 201 });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ message: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
} 