'use client';
import { useState, useEffect } from 'react';
import { getServerURL } from '@/lib/utils/url';
import useAuth from './auth/useAuth';

interface FollowButtonProps {
  userId: string; // 팔로우 대상 유저
  isFollowing: boolean;
  isUpdating?: boolean;
  onToggle?: (newStatus: boolean) => void;
}

const baseUrl = getServerURL();

export default function FollowButton({
  userId,
  isFollowing,
  isUpdating = false,
  onToggle,
}: FollowButtonProps) {
  const [following, setFollowing] = useState(isFollowing);
  const { user: currentUser, loading: authLoading, token } = useAuth();

  useEffect(() => {
    setFollowing(isFollowing); // prop이 바뀔 때 상태 동기화
  }, [isFollowing]);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // 인증 확인
    if (!currentUser && !authLoading) {
      alert('로그인이 필요합니다.');
      return;
    }

    // 자기 자신 팔로우 방지
    if (currentUser?.userId === userId) {
      alert('자기 자신은 팔로우할 수 없습니다.');
      return;
    }

    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/follow/${userId}`, {
        method: following ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('API 응답 실패:', response.status, errorData);
        throw new Error(errorData?.message || '팔로우 요청 실패');
      }

      const newStatus = !following;
      setFollowing(newStatus);
      onToggle?.(newStatus);
    } catch (error) {
      console.error('팔로우 토글 실패:', error);
      alert(error instanceof Error ? error.message : '팔로우 동작 중 오류가 발생했습니다.');
    }
  };

  // 로그인 상태가 확인되지 않았으면 렌더링하지 않음
  if (authLoading || currentUser?.userId === userId) {
    return null;
  }

  const buttonStyle = `
    ml-auto px-4 py-1 rounded border transition 
    ${following
      ? 'bg-[#A67C52] text-white border-[#A67C52] hover:bg-[#8B5E34]'
      : 'bg-white text-[#A67C52] border-[#A67C52] hover:bg-[#F5E9DA]'}
    ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}
  `;

  return (
    <button
      className={buttonStyle}
      onClick={handleClick}
      disabled={isUpdating}
    >
      {following ? '팔로우 취소' : '팔로우'}
    </button>
  );
}
