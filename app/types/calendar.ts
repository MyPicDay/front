// 캘린더 관련 공통 타입 정의

export interface UserDTO {
  userId: string;
  username: string;
}

export interface CalendarDiary {
  diaryId: number;
  title: string;
  visibility: string; // 'PUBLIC', 'PRIVATE', 'FRIENDS'
  content: string;
  author: UserDTO;
  imageUrls: string[];
  likeCount: number;
  commentCount: number;
  createdAt: string; // ISO date string (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss)
}

// API 응답 타입 (기존 시스템과의 호환성을 위해)
export interface ApiDiaryResponse {
  id?: number;
  diaryId?: number;
  title?: string;
  content?: string;
  date?: string;
  createdAt?: string;
  authorId?: string;
  image?: string;
  imageUrls?: string[];
  author?: {
    name?: string;
    username?: string;
    userId?: string;
    image?: string;
  };
  likes?: number;
  likeCount?: number;
  comments?: number;
  commentCount?: number;
  visibility?: string;
}

// API 응답을 CalendarDiary로 변환하는 함수
export function mapApiResponseToCalendarDiary(apiResponse: ApiDiaryResponse): CalendarDiary {
  return {
    diaryId: apiResponse.diaryId || apiResponse.id || 0,
    title: apiResponse.title || '',
    visibility: apiResponse.visibility || 'PUBLIC',
    content: apiResponse.content || '',
    author: {
      userId: apiResponse.authorId || apiResponse.author?.userId || '',
      username: apiResponse.author?.name || apiResponse.author?.username || 'Unknown',
    },
    imageUrls: apiResponse.imageUrls || (apiResponse.image ? [apiResponse.image] : []),
    likeCount: apiResponse.likeCount || apiResponse.likes || 0,
    commentCount: apiResponse.commentCount || apiResponse.comments || 0,
    createdAt: apiResponse.createdAt || apiResponse.date || '',
  };
}

// CalendarDiary를 기존 Diary 타입으로 변환하는 함수 (다른 컴포넌트 호환성을 위해)
export function mapCalendarDiaryToLegacyDiary(calendarDiary: CalendarDiary) {
  return {
    id: calendarDiary.diaryId,
    title: calendarDiary.title,
    content: calendarDiary.content,
    date: calendarDiary.createdAt.split('T')[0],
    authorId: calendarDiary.author.userId,
    image: calendarDiary.imageUrls.length > 0 ? calendarDiary.imageUrls[0] : '',
    author: {
      name: calendarDiary.author.username,
      image: '',
    },
    likes: calendarDiary.likeCount,
    comments: calendarDiary.commentCount,
  };
} 