'use client';
import { useState, useEffect } from 'react';
// import { getServerURL } from '@/lib/utils/url'; // api 사용으로 getServerURL 직접 호출 불필요
import useAuth from './auth/useAuth';
import api from '@/app/api/api'; // api 임포트

interface FollowButtonProps {
  userId: string; // 팔로우 대상 유저
  isFollowing: boolean;
  isUpdating?: boolean;
  onToggle?: (newStatus: boolean) => void;
}

export default function FollowButton({
  userId,
  isFollowing,
  isUpdating = false,
  onToggle,
}: FollowButtonProps) {
  const [following, setFollowing] = useState(isFollowing);
  const { user: currentUser, loading: authLoading, token } = useAuth(); // token은 api 인터셉터에서 처리하므로 직접 사용 X

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

    if (!token) { // 이 로직은 useAuthフック 내부 또는 다른 방식으로 처리하는 것이 좋을 수 있음
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      if (following) {
        await api.delete(`/follow/${userId}`);
      } else {
        await api.post(`/follow/${userId}`);
      }
      // const response = await fetch(`${baseUrl}/follow/${userId}`, {
      //   method: following ? 'DELETE' : 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${token}`,
      //   },
      //   credentials: 'include',
      // });

      // if (!response.ok) {
      //   const errorData = await response.json().catch(() => null);
      //   console.error('API 응답 실패:', response.status, errorData);
      //   throw new Error(errorData?.message || '팔로우 요청 실패');
      // }
      // axios는 오류 발생 시 자동으로 throw하므로, response.ok 확인은 catch 블록에서 처리

      const newStatus = !following;
      setFollowing(newStatus);
      onToggle?.(newStatus);
    } catch (error: any) { // error 타입을 명시적으로 any 또는 적절한 타입으로 지정
      console.error('팔로우 토글 실패:', error);
      // axios 에러 객체에서 실제 에러 메시지를 추출하도록 수정 필요 (예: error.response.data.message)
      const errorMessage = error.response?.data?.message || error.message || '팔로우 동작 중 오류가 발생했습니다.';
      alert(errorMessage);
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
