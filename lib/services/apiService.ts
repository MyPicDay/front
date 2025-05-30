import api from '@/app/api/api';
import { CalendarDiary, ApiDiaryResponse, mapApiResponseToCalendarDiary } from '@/app/types/calendar';

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
  diaries: CalendarDiary[]; // CalendarDiary 타입으로 변경
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
    
    // API 응답의 diaries를 CalendarDiary 타입으로 변환
    if (data.diaries && Array.isArray(data.diaries)) {
      data.diaries = data.diaries.map((diary: ApiDiaryResponse) => mapApiResponseToCalendarDiary(diary));
    }
    
    return data as ProfileData;
  } catch (error) {
    console.error(`getProfileData API 호출 중 예외 발생 (ID: ${id}):`, error);
    return { message: `프로필 데이터 요청 중 오류가 발생했습니다 (ID: ${id}).` };
  }
}

export async function fetchMonthlyDiaries(userId: string, year: number, month: number): Promise<CalendarDiary[]> {
  try {
    const response = await api.get(`/diaries/user/${userId}/monthly?year=${year}&month=${month}`);

    if (response.status !== 200) {
      const errorData = response.data;
      console.error(`월별 일기 데이터 로드 실패 (${response.status} ${response.statusText}):`, errorData);
      throw new Error(`월별 일기 데이터를 가져오는데 실패했습니다: ${response.statusText}`);
    }
    
    const data: ApiDiaryResponse[] = response.data;
    
    // API 응답을 CalendarDiary 타입으로 변환
    return data.map(mapApiResponseToCalendarDiary);
  } catch (error) {
    console.error('fetchMonthlyDiaries API 호출 중 예외 발생:', error);
    return []; // 오류 발생 시 빈 배열 반환
  }
}

