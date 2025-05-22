import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

export const revalidate = 0;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const followersDataPath = path.join(process.cwd(), 'lib/data/followers.json');
  const usersDataPath = path.join(process.cwd(), 'lib/data/users.json');
  const followers = JSON.parse(fs.readFileSync(followersDataPath, 'utf8'));
  const users = JSON.parse(fs.readFileSync(usersDataPath, 'utf8'));

  // 이 사용자를 팔로우하는 사람들
  const myFollowers = followers.filter((f: any) => f.followingId === id);

  // 사용자 정보와 isFollowing(내가 팔로우 중인지) 포함
  const result = myFollowers.map((f: any) => {
    const user = users.find((u: any) => u.id === f.followerId);
    return {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      isFollowing: true // 실제 로직에 맞게 처리
    };
  });

  return Response.json(result);
} 