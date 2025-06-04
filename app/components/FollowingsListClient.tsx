'use client';

import { useState, useEffect } from 'react';
import { getServerURL } from '@/lib/utils/url'; // getServerURL 임포트
import FollowToggleButton from './FollowToggleButton';
import api from '@/app/api/api'; // api 임포트


interface User {
  id: string;
  nickname: string;
  email: string;
  avatar: string;
  isFollowing?: boolean; // 현재 사용자가 이 유저를 팔로우하는지 여부
}

interface FollowingsListClientProps {
  userId: string; // 프로필 주인의 userId
}

export default function FollowingsListClient({ userId }: FollowingsListClientProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // const baseUrl = getServerURL(); // api 사용으로 제거

    // TODO: API 명세 확인 후 정확한 팔로잉 목록 엔드포인트로 수정 필요
    api.get(`/users/${userId}/followers`) // 현재는 팔로워 목록 엔드포인트로 되어 있음
      .then(r => r.data) // axios는 자동으로 json 파싱
      .then((data: User[]) => {
        // 이 목록의 유저들은 현재 사용자가 '팔로우 중'인 상태이므로 isFollowing: true로 설정
        const initialUsers = data.map(user => ({ ...user, isFollowing: true }));
        setUsers(initialUsers);
        setLoading(false);
      })
      .catch(error => {
         console.error("Error fetching followings:", error);
         setLoading(false);
      });
  }, [userId]);

  // 팔로우/언팔로우 상태 토글 핸들러
  const handleFollowToggle = async (targetUserId: string, currentStatus: boolean) => {
     setIsUpdating(true);

     // 상태를 먼저 업데이트하여 UI에 즉시 반영 (Optimistic update)
     setUsers(users.map(user =>
        user.id === targetUserId ? { ...user, isFollowing: !currentStatus } : user
     ));

     try {
       // const baseUrl = getServerURL(); // api 사용으로 제거
       if (currentStatus) { // true이면 현재 팔로우 중 -> 언팔로우 요청
        // api.delete 호출 시 targetUserId를 사용해야 할 가능성이 높음
         await api.delete(`/users/${targetUserId}/followers`); 
       } else { // false이면 현재 언팔로우 중 -> 팔로우 요청
         await api.post(`/users/${targetUserId}/followers`);
       }
       // 성공 시 별도 처리 없음 (Optimistic update 유지)

     } catch (error) {
       console.error("Error calling follow toggle API for followings list:", error);
       // API 호출 실패 시 상태를 원래대로 되돌림 (롤백)
       setUsers(users.map(user =>
          user.id === targetUserId ? { ...user, isFollowing: currentStatus } : user
       ));
     } finally {
       setIsUpdating(false);
     }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={`pulse-following-${i}`} className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">
        내 팔로잉
      </h2>
      {isUpdating && <div className="text-center text-sm text-gray-500 dark:text-gray-400">상태 업데이트 중...</div>}
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="flex items-center space-x-4 p-4 bg-white dark:bg-zinc-900 rounded-lg shadow">
            <img
              src={user.avatar ? `${getServerURL()}/${user.avatar.startsWith('/') ? user.avatar.substring(1) : user.avatar}` : '/mockups/avatar-placeholder.png'}
              alt={`${user.nickname}의 프로필 이미지`}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3 className="font-medium text-zinc-900 dark:text-white">{user.nickname}</h3>
            </div>


            <FollowToggleButton
  userId={user.id}
  isFollowing={user.isFollowing ?? false}
  isUpdating={isUpdating}
  onToggle={(newStatus) => handleFollowToggle(user.id, newStatus)}
/>
            
          </div>
        ))}
        {users.length === 0 && !loading && (
          <p className="text-center text-zinc-600 dark:text-zinc-400 py-8">
            팔로잉 중인 사용자가 없습니다.
          </p>
        )}
      </div>
    </div>
  );
} 