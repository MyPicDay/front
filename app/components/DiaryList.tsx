'use client';

import { useState , useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type ImageInfo = {
  url: string;
  isThumbnail: boolean;
};

type Diary = {
  diaryId: number;
  title: string;
  content: string;
  createdAt: string;
  authorId: string;
  images: ImageInfo[];
  author?: {
    username: string;
    profileImageUrl: string;
  };
  likeCount?: number;
  commentCount?: number;
};

// 요약된 숫자 표시 함수 (예: 1.2만, 293.4만)
const formatNumber = (num: number): string => {
  if (num >= 10000000) {
    return `${(num / 10000000).toFixed(1)}천만`;
  } else if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}백만`;
  } else if (num >= 10000) {
    return `${(num / 10000).toFixed(1)}만`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}천`;
  }
  return num.toString();
};

const DiaryFeedItem = ({ diary }: { diary: Diary }) => { 

  useEffect(() => {
    async function fetchDiary() {
      const res = await fetch(`http://localhost:8080/api/diary/1`);
      const data = await res.json();
      setLikeCount(data.count);
    }
   fetchDiary();
  }, []);

  const [liked, setLiked] = useState(false);
  const likeCount = formatNumber(diary.likeCount ?? 0);
  const commentCount = formatNumber(diary.commentCount ?? 0);
  const authorName = diary.author?.username;
  // TODO (추후 수정 예정) 현재는 프로필 이미지가 없는 관계로 디폴트 값 존재
  const profileImage = diary.author?.profileImageUrl || "/images/roopy.jpg";

  const mainImage = diary.images?.find(img => img.isThumbnail) ||  diary.images?.[0];
  
  const [likeCount, setLikeCount] = useState(diary.likes || Math.floor(Math.random() * 500000) + 1000);
  const [comment, setComment] = useState('');
  const commentCount = diary.comments || Math.floor(Math.random() * 50000) + 100;
  
  // 랜덤 이름 (실제로는 API에서 가져온 데이터 사용)
  const authorName = diary.author?.name || "홍길동";
  const profileImage = diary.author?.image || "/images/cat-king.png";   
  let timeout: NodeJS.Timeout;

  function handleLikeToggle() { 
    setLiked(prev => !prev);
    console.log("전 liked", likeCount);
  
    // setLikeCount(prev => liked ? prev - 1 : prev + 1)
    console.log("liked", likeCount);
    clearTimeout(timeout); // 이전의 setTimeout을 취소 
  
  

    timeout = setTimeout(async() => {  
    
    const result = await fetch('http://localhost:8080/api/diary/like', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ diaryId: diary.id, liked  }),
    });
    // 1초 후 API 호출로 DB에 좋아요 상태를 업데이트
  }, 1000); // 1초 후에 API 호출
  }

  async function handleCommentSubmit() {
    if (!comment.trim()) return;
    const result = await fetch('http://localhost:8080/api/diary/comment', {
      headers: {
        'Content-Type': 'application/json',
      }, 
      method: 'POST',
      body: JSON.stringify({ diaryId: diary.id, comment }),
    });
    // TODO: API 호출로 댓글 저장
    setComment(''); // 입력창 초기화
  }

  function handleCommentChange(e: React.ChangeEvent<HTMLInputElement>) {
    setComment(e.target.value);
  }
  
  return (
    <article className="bg-white dark:bg-zinc-900 rounded-xl shadow-md mb-6 overflow-hidden">
      {/* 작성자 정보 */}
      <div className="flex items-center p-4 bg-[#FEF4E4] ">
        <div className="w-10 h-10 rounded-full overflow-hidden mr-3 ">
          <Image 
            src={profileImage} 
            alt={authorName ?? ""}
            width={40} 
            height={40} 
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-zinc-900 dark:text-white">{authorName}</p>
        </div>
        <button className="text-zinc-500 dark:text-zinc-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
        </button>
      </div>
      
      {/* 이미지 */}
      {/*TODO (추후 삭제 예정)현재 이미지가 없으면 기본 이미지 설정*/}
      <div className="relative w-full">
          <Image
              src={mainImage?.url || "/images/roopy.jpg"}
              alt={diary?.title}
              width={500}
              height={500}
              className="w-full h-auto object-cover"
              loading="lazy"
              priority={false}
          />
      </div>
      
      {/* 상호작용 버튼 */}
      <div className="p-4">
        <div className="flex mb-2 text-zinc-900 dark:text-white">
          <button 
            className="mr-4"
            onClick={handleLikeToggle}
            aria-label="좋아요"
          >
            {liked ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="red">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            )}
          </button>
          
          <Link href={`/diary/${diary.diaryId}`} aria-label="댓글">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </Link>
        </div>
        
        {/* 좋아요 수 */}
        <div className="font-semibold text-zinc-900 dark:text-white mb-1">
          좋아요 {likeCount}개
        </div>
        
        {/* 제목과 내용 */}
        <div className="mb-1">
          <Link href={`/diary/${diary.diaryId}`} className="font-semibold text-zinc-900 dark:text-white mr-2 inline-block">
            {authorName}
          </Link>
          <span className="text-zinc-700 dark:text-zinc-300 truncate">{diary.title}</span>
        </div>
        
        {/* 댓글 보기 */}
        <div className="text-zinc-500 dark:text-zinc-400 text-sm">
          <Link href={`/diary/${diary.diaryId}`}>
            댓글 {commentCount}개 모두 보기
          </Link>
        </div>
        
        {/* 작성 날짜 */}
        <time className="text-xs text-zinc-500 dark:text-zinc-400 block mt-1">
          {new Date(diary.createdAt).toLocaleDateString('ko-KR')}
        </time>
      </div>
      
      {/* 댓글 입력창 */}
      <div className="border-t border-zinc-200 dark:border-zinc-700 p-4 flex">
        <input
          type="text"
          placeholder="댓글 달기..."
          value={comment}
          onChange={handleCommentChange}
          className="flex-1 bg-transparent border-none outline-none text-zinc-700 dark:text-zinc-300"
        />
        <button onClick={handleCommentSubmit} className="text-blue-500 font-semibold">게시</button>
      </div>
    </article>
  );
};

// 추천 일기 (일반 다이어리와 추천 다이어리 모두 보여주기 위한 컴포넌트)
const RecommendedDiary = ({ diary }: { diary: Diary }) => {
  return (
    <div className="dark:bg-zinc-800 rounded-lg p-4 mb-6">
      <div className="text-center text-amber-600 font-bold mb-3">✨ 일기 추천 ✨</div>
      <DiaryFeedItem diary={diary} />
    </div>
  );
};

export default function DiaryList({ items }: { items: Diary[]  }) {
  // 첫 번째 다이어리를 추천으로 표시하고 나머지는 일반 피드로 표시
  if (!items || items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-zinc-600 dark:text-zinc-400">등록된 일기가 없습니다.</p>
      </div>
    );
  }

  const regularDiaries = items

  return (
    <section className="container mx-auto px-4 py-8 max-w-lg">

      {regularDiaries.map((diary) => (
        <DiaryFeedItem key={diary.diaryId} diary={diary} />
      ))}
    </section>
  );
} 