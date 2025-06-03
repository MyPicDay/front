'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { UserListProps } from '@/app/types';
import { getServerURL } from '@/lib/utils/url';
import FollowToggleButton from './FollowToggleButton'; 
import { useState } from 'react';

const [followStates, setFollowStates] = useState<{ [key: string]: boolean }>({}); // 팔로우 상태 저장

const handleFollowClick = (e: React.MouseEvent, userId: string, nickname: string) => {
  e.stopPropagation();

  const current = followStates[userId] ?? false;
  setFollowStates(prev => ({ ...prev, [userId]: !current }));

  // 실제 API 호출 로직 여기에 추가 가능
  alert(`${nickname} 님을 ${current ? '언팔로우' : '팔로우'} 하였습니다!`);
};

export default function UserList({ users, isLoading }: UserListProps) {
  const router = useRouter();

  if (!users || users.length === 0) {
    return (
      <p className="text-zinc-600 dark:text-zinc-400 text-center py-8">
        검색 결과가 없습니다.
      </p>
    );
  }

  const handleFollowClick = (e: React.MouseEvent, nickname: string) => {
    e.stopPropagation();
    alert(`${nickname} 님을 팔로우 하였습니다!`);
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">검색 결과</h2>
      <ul className="space-y-2">
        {users.map((user) => (
          <li
            key={user.userId}
            className="flex items-center justify-between border-b pb-3 px-4 py-2 gap-3"
          >

            <div
              className="flex items-center space-x-4 cursor-pointer rounded-md px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
              onClick={() => router.push(`/profile/${user.userId}`)}
            >
              <Image
                src={user.profileImageUrl || "/images/city-night.png"}
                alt={`${user.nickname} 프로필 이미지`}
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="font-medium text-gray-800 dark:text-white">{user.nickname}</span>
            </div>
            <button
              className="border border-orange-400 text-orange-500 px-3 py-1 rounded-md text-sm hover:bg-orange-500 hover:text-white transition-colors"
              onClick={(e) => handleFollowClick(e, user.nickname)}
            >
              팔로우
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
