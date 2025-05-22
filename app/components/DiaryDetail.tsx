'use client'; // 인터렉티브 요소(좋아요, 댓글, 입력 등)를 위해 컴포넌트로 전환
import { useState } from 'react'; // React의 useState 훅을 가져옴(컴포넌트의 상태 관리에 사용)
import Image from 'next/image';

// 컴포넌트에 전달 되는 diary prop의 타입 정의
interface DiaryDetailProps {
  diary: {
    username: string; //작성자 이름
    profileImage: string; // 작성자 프로필 이미지 URL
    title: string; // 일기 제목
    imageUrl: string; //일기 이미지 URL
    likeCount: number; // 좋아여 개수
    comments: { //댓글 배열
      username: string; // 댓글 작성자 이름
      content: string; // 댓글 내용
      createdAt: string; //댓글 작성 시각
    }[];
  };
}

// 숫자를 보기 좋은 포맷(예: 1.2만, 3.4억)으로 바꿔주는 함수
const formatNumber = (num: number) => {
  if (num >= 100000000) return (num / 100000000).toFixed(1).replace(/\.0$/, '') + '억';
  if (num >= 10000) return (num / 10000).toFixed(1).replace(/\.0$/, '') + '만';
  return num.toLocaleString();
};

const DotsHorizontalIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
  </svg>
);

const ChatBubbleIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-7 w-7"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

// 하트(좋아요) 아이콘 컴포넌트 정의
const HeartIcon = ({ className, filled }: { className?: string; filled?: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className || 'h-7 w-7'} // 크기 설정
    fill={filled ? 'red' : 'none'}// 채워진 하트 여부
    viewBox="0 0 24 24"
    stroke={filled ? 'red' : 'currentColor'}// 윤곽선 색상
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
);
// 메인 컴포넌트
export default function DiaryDetail({ diary }: DiaryDetailProps) {
  const [showAllComments, setShowAllComments] = useState(false);// 전체 댓글 보기 여부
  const [commentInput, setCommentInput] = useState('');// 댓글 입력값 상태
  const [comments, setComments] = useState(diary.comments || []);// 현재 댓글 목록
    const [visibleCommentCount, setVisibleCommentCount] = useState(3); // 초기에 보여줄 댓글 수

    // 초기 좋아요 수 설정 (없으면 랜덤 생성)
  const initialLikes = diary.likeCount || Math.floor(Math.random() * 2000000) + 100000;
  const [likeCount, setLikeCount] = useState(initialLikes);// 좋아요 수 상태
  const [liked, setLiked] = useState(false); // 좋아요 상태
  // 좋아요 버튼 클릭 시 호출되는 함수
  const handleLikeToggle = () => {
    setLiked(!liked);// 상태 반전
    setLikeCount(prev => (liked ? prev - 1 : prev + 1));// 좋아요 수 증가/감소
  };
  // 댓글 등록 버튼 클릭 시 호출되는 함수
  const handleAddComment = () => {
    if (!commentInput.trim()) return;// 빈 문자열은 등록하지 않음

    const newComment = {
      username: '현재 유저', // 임시 사용자 이름
      content: commentInput,// 입력된 댓글 내용
      createdAt: new Date().toISOString(),// 현재 시각
    };

    setComments([newComment, ...comments]);// 새로운 댓글을 앞에 추가
    setCommentInput('');// 입력창 초기화
  };
  // 보여줄 댓글 리스트 (3개까지 자르거나 전체)
  const displayedComments = showAllComments ? comments : comments.slice(0, 3);

return (
  
 <main className="bg-zinc-50 dark:bg-zinc-950 min-h-screen py-8">
  {/* 메인 카드 컨테이너 */}
  <div className="container mx-auto max-w-lg bg-white dark:bg-zinc-900 shadow-xl rounded-lg overflow-hidden flex flex-col max-h-[calc(100vh-4rem)]">
  
    {/* 상단 프로필 */}
    <div className="flex items-center p-3 border-b border-zinc-200 dark:border-zinc-700">
      <img src={diary.profileImage} alt="프로필" className="w-8 h-8 rounded-full mr-3" />
      <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{diary.username}</span>
      <button className="ml-auto text-zinc-500 dark:text-zinc-400">
        <DotsHorizontalIcon />
      </button>
    </div>

    {/* 이미지 */}
    <div className="w-full aspect-square relative">
      <Image
        src={diary.imageUrl}
        alt={diary.title || "일기 이미지"}
        fill
        style={{ objectFit: "cover" }}
        priority
      />
    </div>
    {/* 스크롤 가능 영역 */}
    <div className="flex-grow overflow-y-auto scrollbar-hide [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      
      {/* 상호작용 버튼 및 정보 */}
      <div className="p-4 pb-1">
        <div className="flex items-center mb-2">
          <button onClick={handleLikeToggle} className="mr-3 text-zinc-700 dark:text-zinc-300 hover:text-red-500 dark:hover:text-red-400">
            <HeartIcon filled={liked} />
          </button>
          <button className="text-zinc-700 dark:text-zinc-300">
            <ChatBubbleIcon />
          </button>
        </div>
        <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 mb-1">
          좋아요 {formatNumber(likeCount)}개
        </div>
      </div>
      {/* 좋아요 + 댓글 버튼 */}
<div className="px-4 pt-0 pb-3">
  {comments.length > 3 && !showAllComments && (
    <button
      onClick={() => setShowAllComments(true)}
      className="text-sm text-zinc-500 dark:text-zinc-400 mb-0"
    >
      댓글 {formatNumber(comments.length)}개 모두 보기
    </button>
  )}
</div>
      {/* 댓글 목록 */}
      <div className="px-4">
        {displayedComments.map((comment, index) => (
          <div key={index} className="flex items-start mb-2">
            <img
              src="/images/avatar.png"
              alt="아바타"
              className="w-6 h-6 rounded-full mr-2"
            />
            <div className="text-sm leading-tight">
              <span className="font-semibold mr-1">{comment.username}</span>
              <span>{comment.content}</span>
              <div className="text-xs text-zinc-400 mt-0.5">1주 · <button className="hover:underline">답글 달기</button></div>
            </div>
          </div>
        ))}
                  
</div>
    </div>

    {/* 댓글 입력창 */}
    <div className="flex items-center border-t px-4 py-2">
      <input
        type="text"
        value={commentInput}
        onChange={e => setCommentInput(e.target.value)}
        placeholder="댓글을 입력하세요..."
        className="flex-1 outline-none bg-transparent text-sm placeholder-zinc-500"
      />
      <button
          onClick={handleAddComment}
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          등록
        </button>
    </div>

  </div> {/* <- 메인 카드 닫기 위치는 여기! */}
</main>
  );
}
