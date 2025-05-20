'use client'; // 인터렉티브 요소(좋아요, 댓글, 입력 등)를 위해 컴포넌트로 전환
import { useState } from 'react';
import Image from 'next/image'; // next.js Image 컴포넌트 사용

interface DiaryDetailProps {
  diary: {
    username: string;
    profileImage: string;
    title: string;
    imageUrl: string;
    likeCount: number;
    comments: {
      username: string;
      content: string;
      createdAt: string;
    }[];
  };
}

// 좋아요 숫자 포맷 함수
const formatNumber = (num: number) => {
  if (num >= 100000000) return (num / 100000000).toFixed(1).replace(/\.0$/, '') + '억';
  if (num >= 10000) return (num / 10000).toFixed(1).replace(/\.0$/, '') + '만';
  return num.toLocaleString();
};

// 하트 아이콘 컴포넌트
const HeartIcon = ({ className, filled }: { className?: string; filled?: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className || 'h-7 w-7'}
    fill={filled ? 'red' : 'none'}
    viewBox="0 0 24 24"
    stroke={filled ? 'red' : 'currentColor'}
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
);

export default function DiaryDetail({ diary }: DiaryDetailProps) {
  const [showAllComments, setShowAllComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [comments, setComments] = useState(diary.comments || []);
  const initialLikes = diary.likeCount || Math.floor(Math.random() * 2000000) + 100000;
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [liked, setLiked] = useState(false); // 좋아요 상태

  const handleLikeToggle = () => {
    setLiked(!liked);
    setLikeCount(prev => (liked ? prev - 1 : prev + 1));
  };

  const handleAddComment = () => {
    if (!commentInput.trim()) return;

    const newComment = {
      username: '현재 유저',
      content: commentInput,
      createdAt: new Date().toISOString(),
    };

    setComments([newComment, ...comments]);
    setCommentInput('');
  };

  const displayedComments = showAllComments ? comments : comments.slice(0, 3);

  return (
    <div className="p-4">
      <div className="flex items-center space-x-3 mb-4">
        <img src={diary.profileImage} alt="프로필" className="w-10 h-10 rounded-full" />
        <span className="font-semibold">{diary.username}</span>
      </div>

      <h2 className="text-xl font-bold mb-2">{diary.title}</h2>
      <img src={diary.imageUrl} alt="일기 이미지" className="w-full rounded-lg mb-4" />

      <div className="flex items-center mb-2">
        <button
          onClick={handleLikeToggle}
          className="mr-3 text-zinc-700 dark:text-zinc-300 hover:text-red-500 dark:hover:text-red-400"
        >
          <HeartIcon filled={liked} />
        </button>
        <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
          좋아요 {formatNumber(likeCount)}개
        </span>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">댓글</h3>
        {displayedComments.map((comment, index) => (
          <div key={index} className="mb-2">
            <span className="font-medium">{comment.username}:</span>{' '}
            <span>{comment.content}</span>
            <div className="text-xs text-gray-400">{comment.createdAt}</div>
          </div>
        ))}

        {/* 댓글 더보기 */}
        {comments.length > 3 && !showAllComments && (
          <button onClick={() => setShowAllComments(true)} className="text-blue-500 text-sm mt-2">
            댓글 더보기
          </button>
        )}
      </div>

      {/* 댓글 입력창 */}
      <div className="mt-4 flex items-center space-x-2">
        <input
          type="text"
          value={commentInput}
          onChange={e => setCommentInput(e.target.value)}
          placeholder="댓글을 입력하세요..."
          className="flex-1 border border-gray-300 rounded px-3 py-1"
        />
        <button
          onClick={handleAddComment}
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          등록
        </button>
      </div>
    </div>
  );
}
