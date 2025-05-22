'use client'; // 인터랙티브 요소(좋아요, 댓글 입력 등)를 위해 클라이언트 컴포넌트로 전환

import { useState, useEffect } from 'react';
import Image from 'next/image'; // Next.js Image 컴포넌트 사용

// 아이콘 (Heroicons 예시 - 실제 프로젝트에서는 라이브러리 설치 또는 SVG 직접 사용)
const HeartIcon = ({ className, filled }: { className?: string, filled?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-7 w-7"} fill={filled ? "red" : "none"} viewBox="0 0 24 24" stroke={filled ? "red": "currentColor"} strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const ChatBubbleIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-7 w-7"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const DotsHorizontalIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
  </svg>
);

const PaperAirplaneIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);


interface User { // 임시 User 타입 (실제로는 API 응답에 맞춰야 함)
  id: string;
  name: string;
  avatar: string;
}

interface Comment { // 임시 Comment 타입
  id: string;
  user: User;
  text: string;
  createdAt: string;
}

interface Diary {
  id: number;
  title: string; // 일기 내용으로 사용
  content: string; // 상세 페이지에서는 content가 메인 텍스트가 될 수 있음
  date: string;
  authorId: string;
  image: string;
  // 목업 데이터 추가 (실제 API 응답에 따라 변경)
  author?: User;
  likes?: number;
  comments?: Comment[];
}

// 숫자 포맷 함수 (예: 1000 -> 1천, 10000 -> 1만)
const formatNumber = (num: number) => {
  if (num >= 100000000) return (num / 100000000).toFixed(1).replace(/\.0$/, '') + '억';
  if (num >= 10000) return (num / 10000).toFixed(1).replace(/\.0$/, '') + '만';
  // 만 단위 미만은 그대로 표시 (또는 쉼표 추가 등)
  return num.toLocaleString();
};


export default function DiaryDetail({ diary }: { diary: Diary }) {

  // 목업 데이터 및 상태 (실제로는 diary prop에서 받거나, SWR/React Query 등으로 관리)
  const [liked, setLiked] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [visibleCommentCount, setVisibleCommentCount] = useState(3); // 초기에 보여줄 댓글 수
  const [scrollToCommentId, setScrollToCommentId] = useState<string | null>(null); // 스크롤 대상 댓글 ID 상태

  // diary 객체에 author, likes, comments가 없을 경우를 대비한 기본값 설정
  const author = diary.author || { id: diary.authorId, name: '홍길동', avatar: '/images/city-night.png' };
  const initialLikes = diary.likes || Math.floor(Math.random() * 2000000) + 100000; // 예: 293.4만 -> 2934000
  const [likeCount, setLikeCount] = useState(initialLikes);
  
  const initialComments: Comment[] = diary.comments || [
    { id: 'comment1', user: { id: 'user1', name: '김철수', avatar: '/images/city-night.png' }, text: '고양이 이쁘네요!', createdAt: '1주' },
    { id: 'comment2', user: { id: 'user2', name: '박영희', avatar: '/images/city-night.png' }, text: '정말 귀여워요 😍', createdAt: '1주' },
    { id: 'comment3', user: { id: 'user3', name: author.name, avatar: author.avatar }, text: '감사합니다! 😊', createdAt: '1주' },
    { id: 'comment4', user: { id: 'user4', name: '이하나', avatar: '/images/city-night.png' }, text: '너무 멋진 사진이네요!', createdAt: '2주' },
    { id: 'comment5', user: { id: 'user5', name: '최다윗', avatar: '/images/city-night.png' }, text: '저도 가보고 싶어요.', createdAt: '2주' },
    { id: 'comment6', user: { id: 'user6', name: '윤지민', avatar: '/images/city-night.png' }, text: '최고예요!', createdAt: '3주' },
    { id: 'comment7', user: { id: 'user6', name: '윤지민', avatar: '/images/city-night.png' }, text: '최고예요!', createdAt: '3주' },
    { id: 'comment8', user: { id: 'user6', name: '윤지민', avatar: '/images/city-night.png' }, text: '최고예요!', createdAt: '3주' },
    { id: 'comment9', user: { id: 'user6', name: '윤지민', avatar: '/images/city-night.png' }, text: '최고예요!', createdAt: '3주' },
    { id: 'comment0', user: { id: 'user6', name: '윤지민', avatar: '/images/city-night.png' }, text: '최고예요!', createdAt: '3주' },
    { id: 'comment01', user: { id: 'user6', name: '윤지민', avatar: '/images/city-night.png' }, text: '최고예요!', createdAt: '3주' },
    { id: 'comment02', user: { id: 'user6', name: '윤지민', avatar: '/images/city-night.png' }, text: '최고예요!', createdAt: '3주' },
    { id: 'comment03', user: { id: 'user6', name: '윤지민', avatar: '/images/city-night.png' }, text: '최고예요!', createdAt: '3주' },
    { id: 'comment04', user: { id: 'user6', name: '윤지민', avatar: '/images/city-night.png' }, text: '최고예요!', createdAt: '3주' },
    { id: 'comment05', user: { id: 'user6', name: '윤지민', avatar: '/images/city-night.png' }, text: '최고예요!', createdAt: '3주' },
    { id: 'comment06', user: { id: 'user6', name: '윤지민', avatar: '/images/city-night.png' }, text: '최고예요!', createdAt: '3주' },
    { id: 'comment07', user: { id: 'user6', name: '윤지민', avatar: '/images/city-night.png' }, text: '최고예요!', createdAt: '3주' },
    { id: 'comment09', user: { id: 'user6', name: '윤지민', avatar: '/images/city-night.png' }, text: '최고예요!', createdAt: '3주' },
    { id: 'comment10', user: { id: 'user6', name: '윤지민', avatar: '/images/city-night.png' }, text: '최고예요!', createdAt: '3주' },
    { id: 'comment11', user: { id: 'user6', name: '윤지민', avatar: '/images/city-night.png' }, text: '최고예요!', createdAt: '3주' },

  ];
  const [comments, setComments] = useState<Comment[]>(initialComments);

  const handleLikeToggle = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
    // TODO: API 호출로 좋아요 상태 업데이트
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const newCommentObj: Comment = {
      id: `comment${comments.length + 1}`, // 실제 앱에서는 고유 ID 생성 방식 개선 필요
      user: { id: 'currentUser', name: '나', avatar: '/images/avatar-city-night.png' }, // 현재 사용자 정보
      text: newComment,
      createdAt: '방금',
    };
    const updatedComments = [...comments, newCommentObj];
    setComments(updatedComments);
    setVisibleCommentCount(updatedComments.length); // 새 댓글 작성 시 모든 댓글 보이도록 처리
    setNewComment('');
    setScrollToCommentId(newCommentObj.id); // 새 댓글로 스크롤 하도록 ID 설정
    // TODO: API 호출로 댓글 등록
  };

  useEffect(() => {
    if (scrollToCommentId) {
      const element = document.getElementById(`comment-${scrollToCommentId}`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setScrollToCommentId(null); // 스크롤 후 상태 초기화
    }
  }, [scrollToCommentId, comments]); // scrollToCommentId나 comments가 변경될 때 실행


  return (
    <main className="bg-zinc-50 dark:bg-zinc-950 min-h-screen py-8">
      {/* 메인 카드 컨테이너: flex-col로 내부 요소 수직 정렬, max-h로 카드 최대 높이 제한하여 내부 스크롤 유도 */}
      <div className="container mx-auto max-w-lg bg-white dark:bg-zinc-900 shadow-xl rounded-lg overflow-hidden flex flex-col max-h-[calc(100vh-4rem)]">
        {/* 상단 고정 영역: 작성자 정보 및 이미지 */}
        <div>
          {/* 작성자 정보 */}
          <div className="flex items-center p-3 border-b border-zinc-200 dark:border-zinc-700">
            <Image
              src={author.avatar}
              alt={author.name}
              width={32}
              height={32}
              className="rounded-full object-cover mr-3"
            />
            <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{author.name}</span>
            <button className="ml-auto text-zinc-500 dark:text-zinc-400">
              <DotsHorizontalIcon />
            </button>
          </div>

          {/* 이미지 */}
          <div className="w-full aspect-square relative"> {/* 이미지 비율 1:1 */}
            <Image
              src={diary.image}
              alt={diary.title || "일기 이미지"}
              layout="fill" // 부모 요소에 꽉 채우기
              objectFit="cover" // 이미지를 비율 유지하며 꽉 채움
              priority // 중요 이미지 우선 로드
            />
          </div>
        </div>

        {/* 스크롤 가능 영역: 상호작용 버튼, 본문, 댓글 목록 */}
        <div className="flex-grow overflow-y-auto scrollbar-hide [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {/* 상호작용 버튼 및 정보 */}
          <div className="p-4">
            <div className="flex items-center mb-2">
              <button onClick={handleLikeToggle} className="mr-3 text-zinc-700 dark:text-zinc-300 hover:text-red-500 dark:hover:text-red-400">
                <HeartIcon filled={liked} />
              </button>
              <button className="text-zinc-700 dark:text-zinc-300">
                <ChatBubbleIcon />
              </button>
              {/* 더 많은 버튼 (예: 공유) 은 생략 */}
            </div>

            <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 mb-1">
              좋아요 {formatNumber(likeCount)}개
            </div>

            {/* 일기 내용 (본문) */}
            <div className="text-sm text-zinc-800 dark:text-zinc-200 mb-2">
              <span className="font-semibold mr-1">{author.name}</span>
              {diary.title} {/* 또는 diary.content, 필요에 따라 확장 가능 */}
            </div>
          </div>
          
          {/* 댓글 목록 - 내부 스크롤 영역에 포함 */}
          <div className="px-4 pb-4 space-y-1.5">
            {comments.slice(0, visibleCommentCount).map((comment) => (
              <div key={comment.id} id={`comment-${comment.id}`} className="text-sm flex items-start"> {/* 각 댓글에 id 속성 추가 */}
                <div className="w-6 h-6 rounded-full overflow-hidden mr-2 mt-0.5"> {/* 아바타 컨테이너에 원형, 크기, overflow, 마진 적용 */}
                  <Image
                    src={comment.user.avatar}
                    alt={comment.user.name}
                    width={24} 
                    height={24}
                    className="object-cover w-full h-full" /* 이미지가 부모 div를 채우도록 object-cover와 w-full, h-full 적용 */
                  />
                </div>
                <div>
                  <div>
                    <span className="font-semibold mr-1 text-zinc-800 dark:text-zinc-200">{comment.user.name}</span>
                    <span className="text-zinc-700 dark:text-zinc-300">{comment.text}</span>
                  </div>
                  <div className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 flex space-x-2">
                    <span>{comment.createdAt}</span>
                    <button className="font-medium hover:underline">답글 달기</button>
                  </div>
                </div>
              </div>
            ))}
            {visibleCommentCount < comments.length && (
              <button
                onClick={() => setVisibleCommentCount(prev => Math.min(prev + 5, comments.length))}
                className="w-full text-left text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 mt-3 py-1"
              >
                댓글 {comments.length - visibleCommentCount}개 더 보기...
              </button>
            )}
          </div>
        </div>

        {/* 하단 고정 영역: 댓글 입력창 */}
        <form onSubmit={handleCommentSubmit} className="border-t border-zinc-200 dark:border-zinc-700 p-3 flex items-center bg-white dark:bg-zinc-900">
          {/* 현재 사용자 아바타 (선택 사항) */}
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글 달기..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-zinc-700 dark:text-zinc-300 placeholder-zinc-400 dark:placeholder-zinc-500"
          />
          <button
            type="submit"
            className="text-sky-500 font-semibold text-sm hover:text-sky-600 disabled:opacity-50"
            disabled={!newComment.trim()}
          >
            게시
          </button>
        </form>
      </div>
    </main>
  );
} 