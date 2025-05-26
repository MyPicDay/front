'use client';

import {useEffect, useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';

import api from '@/app/api/api';

type Diary = {
  diaryId: number;
  title: string;
  content: string;
  createdAt: string;
  authorId: string;
  imageUrls: string[];
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
      try {

        const res = await api.get(`/diary/${diary.id}`); 

        const data = res.data;
        console.log(data)
        setLikeCount(data.count);
        setLiked(data.liked);
      } catch (error) {
        setLikeCount(0);
        setLiked(false);
      }
    }

    fetchDiary();
  }, []);

  const [liked, setLiked] = useState(false);
  const commentCount = formatNumber(diary.commentCount ?? 0);
  const authorName = diary.author?.username;
  const profileImage = diary.author?.profileImageUrl || "/images/roopy.jpg";
  const hasImage = diary.imageUrls?.[0] && diary.imageUrls?.[0].trim() !== "";
  const mainImage = hasImage ? `data:image/jpeg;base64,${diary.imageUrls?.[0]}` : "/images/roopy.jpg";

  const [likeCount, setLikeCount] = useState(diary.likeCount ?? 0);
  const [comment, setComment] = useState('');

  // 랜덤 이름 (실제로는 API에서 가져온 데이터 사용)
  let timeout: NodeJS.Timeout;

  function handleLikeToggle() {
    const nextLiked = !liked; 
    setLiked(nextLiked);
    setLikeCount(prev => prev + (nextLiked ? 1 : -1));
    clearTimeout(timeout);

    timeout = setTimeout(async () => {
      try {
        const result = await api.post(
          '/diary/like',
          {

            diaryId: diary.id,
            liked: nextLiked, 
            
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        console.log('좋아요 업데이트 성공', result.data);
      } catch (error) {
        console.error('좋아요 업데이트 실패', error);
      }
    }, 1000);
  }
  
  async function handleCommentSubmit() {
    
    if (!comment.trim()) return;

    try {
      const result = await api.post(
        '/diary/comment',
        {

          diaryId: diary.id,

          comment,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      alert("댓글 등록 되었습니다.");
      setComment('');
    } catch (error) {
      console.error('댓글 전송 실패', error);
    }
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
      {/*TODO 일단 이미지1개만 고정 슬라이드 UI로 List형태 받아서 진행 예정*/}
      <div className="relative w-full">
          <Image
              src={mainImage}
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
          좋아요 {formatNumber(likeCount)}개
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

export default function DiaryList(page = 0) {
  console.log()
  const [diaries, setDiaries] = useState<Diary[]>([]);
  useEffect(() => {
    const loadDiaries  = async () => {
      try {
        const res = await api.get<Page<Diary>>('/diaries', {
          params: {
            page: page,
            sort: 'createdAt,desc'
          }
        });
        setDiaries(res.data.content);
      } catch (e) {
        console.error(e);
        setDiaries([]);
      }
    };
    loadDiaries();
  }, []);
  if (!diaries || diaries.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-zinc-600 dark:text-zinc-400">등록된 일기가 없습니다.</p>
      </div>
    );
  }
  return (
    <section className="container mx-auto px-4 py-8 max-w-lg">
      {diaries.map((diary) => (
        <DiaryFeedItem key={diary.diaryId} diary={diary} />
      ))}
    </section>
  );
} 