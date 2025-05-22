import {Diary} from '@/app/types/diary';

// UserProfile 컴포넌트의 User 타입과 일치해야 함 (page.tsx에서 가져옴)
interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface Stats {
  diaryCount: number;
  followerCount: number;
  followingCount: number;
}

export interface ProfileData {
  user: User;
  stats: Stats;
  diaries: Diary[]; // 초기 프로필 로드 시 함께 가져올 일기 (선택적)
  message?: string;
}


export const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_SERVER_URL || process.env.NEXT_PUBLIC_UNIMPLEMENTED_API_SERVER_URL || 'http://localhost:3000';
};

export async function getProfileData(id: string): Promise<ProfileData | { message: string }> {
  const baseUrl = getBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/api/mock/profile/${id}`, { cache: 'no-store' });
    const data = await res.json();

    if (!res.ok) {
      console.error(`프로필 데이터를 가져오는데 실패했습니다 (ID: ${id}):`, data.message || res.statusText);
      return { message: data.message || `사용자(ID: ${id}) 정보를 가져오는데 실패했습니다.` };
    }
    return data as ProfileData;
  } catch (error) {
    console.error(`getProfileData API 호출 중 예외 발생 (ID: ${id}):`, error);
    return { message: `프로필 데이터 요청 중 오류가 발생했습니다 (ID: ${id}).` };
  }
}

export async function fetchMonthlyDiaries(userId: string, year: number, month: number): Promise<Diary[]> {
  const baseUrl = getBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/api/mock/diaries/user/${userId}/monthly?year=${year}&month=${month}`);
    
    if (!response.ok) {
      const errorData = await response.text(); // 좀 더 자세한 오류를 보기 위해 text로 읽음
      console.error(`월별 일기 데이터 로드 실패 (${response.status} ${response.statusText}):`, errorData);
      throw new Error(`월별 일기 데이터를 가져오는데 실패했습니다: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('fetchMonthlyDiaries API 호출 중 예외 발생:', error);
    return []; // 오류 발생 시 빈 배열 반환
  }
}

