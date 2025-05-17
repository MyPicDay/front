import { NextRequest, NextResponse } from 'next/server';

// 데이터를 저장할 임시 배열 (실제로는 DB 사용)
// 예시: ['mock-uuid-user-1', 'mock-uuid-user-3'] 사용자가 'mock-uuid-user-current'를 팔로우하고 있다고 가정
let currentFollowings: string[] = ['mock-uuid-user-1', 'mock-uuid-user-3']; // 현재 사용자가 팔로우하는 유저 ID 목록

export const revalidate = 0; // 캐시 비활성화

// 특정 사용자를 팔로우하는 API (POST)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // params를 await합니다.
  const awaitedParams = await params;
  const targetUserId = awaitedParams.id;

  console.log(`[API MOCK] POST /api/mock/users/${targetUserId}/follow`);

  if (!targetUserId) {
    return NextResponse.json({ message: 'Target user ID is required' }, { status: 400 });
  }

  // 이미 팔로우하고 있는지 확인
  if (currentFollowings.includes(targetUserId)) {
    return NextResponse.json({ message: 'Already following this user' }, { status: 409 }); // 409 Conflict
  }

  // 팔로우 목록에 추가 (실제로는 DB 업데이트)
  currentFollowings.push(targetUserId);
  console.log(`[API MOCK] User followed. Current followings:`, currentFollowings);

  return NextResponse.json({ message: `Successfully followed user ${targetUserId}` }, { status: 200 });
}

// 특정 사용자를 언팔로우하는 API (DELETE)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // params를 await합니다.
  const awaitedParams = await params;
  const targetUserId = awaitedParams.id;

  console.log(`[API MOCK] DELETE /api/mock/users/${targetUserId}/follow`);

  if (!targetUserId) {
    return NextResponse.json({ message: 'Target user ID is required' }, { status: 400 });
  }

  const index = currentFollowings.indexOf(targetUserId);
  if (index === -1) {
    // 실제로 targetUserId가 currentFollowings에 없는 경우 404를 반환합니다.
    console.log(`[API MOCK] User ${targetUserId} not found in followings list:`, currentFollowings);
    return NextResponse.json({ message: 'Not following this user' }, { status: 404 });
  }

  // 팔로우 목록에서 제거 (실제로는 DB 업데이트)
  currentFollowings.splice(index, 1);
  console.log(`[API MOCK] User unfollowed. Current followings:`, currentFollowings);

  return NextResponse.json({ message: `Successfully unfollowed user ${targetUserId}` }, { status: 200 });
} 