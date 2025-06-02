'use client';

import { useState, useEffect } from 'react';
import { getServerURL } from '@/lib/utils/url';

interface User {
  id: string;
  nickname: string;
  email: string;
  avatar: string;
  isFollowing?: boolean;
}

interface FollowersListClientProps {
  userId: string;
}

export default function FollowersListClient({ userId }: FollowersListClientProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const baseUrl = getServerURL();

    fetch(`${baseUrl}/followings/${userId}`)
      .then(r => r.json())
      .then((data: User[]) => {
        const initialUsers = data.map(user => ({ ...user, isFollowing: true }));
        setUsers(initialUsers);
        setLoading(false);
      })
      .catch(error => {
         console.error("Error fetching followers:", error);
         setLoading(false);
      });
  }, [userId]);

  const handleFollowToggle = async (targetUserId: string, currentStatus: boolean) => {
     setIsUpdating(true);

     setUsers(users.map(user =>
        user.id === targetUserId ? { ...user, isFollowing: !currentStatus } : user
     ));

     try {
       const baseUrl = getServerURL();

       const method = currentStatus ? 'DELETE' : 'POST';
       const response = await fetch(`${baseUrl}/users/${targetUserId}/followers`, {
          method: method,
       });

       if (!response.ok) {
         console.error("Failed to toggle follow status on mock API");
         setUsers(users.map(user =>
            user.id === targetUserId ? { ...user, isFollowing: currentStatus } : user
         ));
       }

     } catch (error) {
       console.error("Error calling follow toggle mock API:", error);
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
            <div key={`pulse-item-${i}`} className="flex items-center space-x-4">
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
        내 팔로워 {/* 제목 고정 */}
      </h2>
      {isUpdating && <div className="text-center text-sm text-gray-500 dark:text-gray-400">상태 업데이트 중...</div>}
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="flex items-center space-x-4 p-4 bg-white dark:bg-zinc-900 rounded-lg shadow">
            <img
              src={user.avatar || '/mockups/avatar-placeholder.png'}
              alt={`${user.nickname}의 프로필 이미지`}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3 className="font-medium text-zinc-900 dark:text-white">{user.nickname}</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{user.email}</p>
            </div>
            <button
                className={`ml-auto px-4 py-1 rounded border transition ${
                  user.isFollowing
                    ? "bg-[#A67C52] text-white border-[#A67C52] hover:bg-[#8B5E34]"
                    : "bg-white text-[#A67C52] border-[#A67C52] hover:bg-[#F5E9DA]"
                }`}
                onClick={() => handleFollowToggle(user.id, user.isFollowing ?? false)}
                disabled={isUpdating}
              >
                {user.isFollowing ? "팔로우 취소" : "팔로우"}
            </button>
          </div>
        ))}
        {users.length === 0 && !loading && (
          <p className="text-center text-zinc-600 dark:text-zinc-400 py-8">
            팔로워가 없습니다. {/* 메시지 고정 */}
          </p>
        )}
      </div>
    </div>
  );
} 