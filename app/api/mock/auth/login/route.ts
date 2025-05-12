import { NextResponse } from 'next/server';
import users from '../../../../../lib/data/users.json'; // 실제로는 DB를 사용해야 합니다.

export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: '이메일과 비밀번호를 모두 입력해주세요.' }, { status: 400 });
    }

    // 실제 앱에서는 password도 검증해야 합니다.
    const user = users.find(u => u.email === email);

    if (!user) {
      return NextResponse.json({ message: '이메일 또는 비밀번호가 잘못되었습니다.' }, { status: 401 });
    }

    // 로그인 성공 시, 사용자 정보와 함께 임시 토큰 반환
    // 실제 앱에서는 JWT 토큰 등을 생성하여 반환합니다.
    const mockToken = `mock-jwt-token-for-${user.id}-${Date.now()}`;

    return NextResponse.json({
      message: '로그인 성공!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      },
      token: mockToken
    }, { status: 200 });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
} 