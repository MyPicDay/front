'use client';

// import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserListProps } from '@/app/types';
// import { getServerURL } from '@/lib/utils/url'; // getServerURL is not used
import FollowToggleButton from './FollowToggleButton'; // FollowToggleButton is imported but not used
import api from '@/app/api/api'; // api.ts import 추가
import useAuthStore from '@/lib/store/authStore'; // authStore import 추가

export default function UserList({ users, isLoading }: UserListProps) {
  const router = useRouter();
  const [followStates, setFollowStates] = useState<{ [key: string]: boolean }>({}); // 팔로우 상태 저장
  const loggedInUser = useAuthStore((state) => state.user); // 현재 로그인한 사용자 정보

  const handleFollowClick = async (e: React.MouseEvent, userId: string, nickname: string) => {
    e.stopPropagation();

    const currentFollowState = followStates[userId] ?? false;
    const newFollowState = !currentFollowState;

    // 낙관적 업데이트: 먼저 UI를 변경
    setFollowStates(prev => ({ ...prev, [userId]: newFollowState }));

    try {
      if (newFollowState) {
        // 팔로우 요청
        await api.post(`/follow/${userId}`);
        alert(`${nickname} 님을 팔로우 하였습니다!`);
      } else {
        // 언팔로우 요청
        await api.delete(`/follow/${userId}`);
        alert(`${nickname} 님을 언팔로우 하였습니다!`);
      }
    } catch (error) {
      console.error('팔로우/언팔로우 처리 중 오류 발생:', error);
      alert('요청 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
      // 오류 발생 시 상태를 원래대로 롤백
      setFollowStates(prev => ({ ...prev, [userId]: currentFollowState }));
    }
  };

  if (isLoading) { // Added loading state check
    return (
      <p className="text-zinc-600 dark:text-zinc-400 text-center py-8">
        사용자 목록을 불러오는 중...
      </p>
    );
  }

  // 현재 로그인한 사용자를 제외한 사용자 목록
  const filteredUsers = users?.filter(user => user.userId !== loggedInUser?.id) || [];

  if (!filteredUsers || filteredUsers.length === 0) {
    return (
      <p className="text-zinc-600 dark:text-zinc-400 text-center py-8">
        검색 결과가 없습니다.
      </p>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">검색 결과</h2>
      <ul className="space-y-2">
        {filteredUsers.map((user) => (
          <li
            key={user.userId}
            className="flex items-center justify-between border-b pb-3 px-4 py-2 gap-3"
          >
            <div
              className="flex items-center space-x-4 cursor-pointer rounded-md px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
              onClick={() => router.push(`/profile/${user.userId}`)}
            >
              <img
                src={user.profileImageUrl || "/images/city-night.png"}
                alt={`${user.nickname} 프로필 이미지`}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
              <span className="font-medium text-gray-800 dark:text-white">{user.nickname}</span>
            </div>
            <button
              className={`border px-3 py-1 rounded-md text-sm transition-colors ${
                followStates[user.userId]
                  ? 'bg-zinc-200 text-zinc-600 hover:bg-zinc-300'
                  : 'border-orange-400 text-orange-500 hover:bg-orange-500 hover:text-white'
              }`}
              onClick={(e) => handleFollowClick(e, user.userId, user.nickname)}
            >
              {followStates[user.userId] ? '언팔로우' : '팔로우'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
