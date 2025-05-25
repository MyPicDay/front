'use client'; // 인터랙티브 요소(좋아요, 댓글 입력 등)를 위해 클라이언트 컴포넌트로 전환

import { useState, useEffect } from 'react';
import Image from 'next/image'; // Next.js Image 컴포넌트 사용
import api from '@/app/api/api';
import {format, formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';


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
 // id: string; 
  name: string;
  avatar: string;
}

interface Comment {
  id: number;
  user: User;
  text: string;
  createdAt: string;
  replies?: Comment[]; // Add replies array to Comment interface
}

interface CommentResponse {
  id: number;
  name: string;
  avatar: string;
  date: string;
  // Add other response fields as needed
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
  const [scrollToCommentId, setScrollToCommentId] = useState<number | null>(null); // 스크롤 대상 댓글 ID 상태
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  // diary 객체에 author, likes, comments가 없을 경우를 대비한 기본값 설정
  const author = diary.author || { id: diary.authorId, name: '홍길동', avatar: '/images/city-night.png' };
  const initialLikes = diary.likes || Math.floor(Math.random() * 2000000) + 100000; // 예: 293.4만 -> 2934000
  const [likeCount, setLikeCount] = useState(initialLikes);
  
  const initialComments: Comment[] = diary.comments || [
    { id: 0, user: { name: '김철수', avatar: '/images/city-night.png' }, text: '고양이 이쁘네요!', createdAt: '1주' },
    

  ];

  
  function formatDate(date: Date) {
  
    const d = new Date(date);
    const now = new Date();
    
    // 한국 시간대로 변환 (UTC+9)
    const kstOffset = 9 * 60 * 60 * 1000; // 9시간을 밀리초로 변환
    const kstNow = new Date(now.getTime() + kstOffset);
    const kstDate = new Date(d.getTime() + kstOffset);
    
    
    const diff = Math.max(0, (kstNow.getTime() - kstDate.getTime()) / 1000);
    
    
    // 2시간(7200초) 이내면 "방금 전" 표시
    if (diff < 7200) {
      return "방금 전";
    }
    // 3일 이내면 상대적 시간 표시
    if (diff < 60 * 60 * 24 * 3) {
      return formatDistanceToNow(d, { addSuffix: true, locale: ko });
    }
    // 그 외에는 전체 날짜 표시
    return format(d, 'PPP EEE p', { locale: ko });
  } 



  const [comments, setComments] = useState<Comment[]>(initialComments);
  let timeout: NodeJS.Timeout;
  
  const handleLikeToggle = () => {
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
  };
  let respnse : any;
  const handleCommentSubmit = async (e: React.FormEvent) => { 
    e.preventDefault();
    if (!newComment.trim()) return;  
   
    try {
       respnse = await api.post(
        '/diary/comment',
        {
          diaryId: diary.id,
          comment: newComment,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        } 
      );
      
      // 현재 시간을 사용하여 댓글 생성 시간 설정
      const currentTime = new Date();
      const newCommentObj: Comment = {
        id: respnse.data.id, 
        user: { name: respnse.data.name, avatar: respnse.data.avatar }, 
        text: newComment,
        createdAt: formatDate(currentTime), // API 응답의 date 대신 현재 시간 사용
      };
      
      console.log('New comment with current time:', newCommentObj);
      const updatedComments = [...comments, newCommentObj];
      setComments(updatedComments);
      setVisibleCommentCount(updatedComments.length);
      setNewComment('');
      setScrollToCommentId(newCommentObj.id);
    } catch (error) {
      console.error('댓글 전송 실패', error);
    }
  }; 

  const handleReplySubmit = async (e: React.FormEvent, parentCommentId: number) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      const reply = await api.post<CommentResponse>(
        '/diary/reply',
        {
          diaryId: diary.id,
          parentCommentId: parentCommentId,
          comment: replyText,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const currentTime = new Date();
      const newReply: Comment = {
        id: reply.data.id,
        user: { name: reply.data.name, avatar: reply.data.avatar },
        text: replyText,
        createdAt: formatDate(currentTime),
      };

      // Update comments to include the new reply
      setComments(prev => prev.map(comment => {
        if (comment.id === Number(parentCommentId)) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply]
          };
        }
        return comment;
      }));

      setReplyText('');
      setReplyingTo(null);
    } catch (error) {
      console.error('답글 전송 실패', error);
    }
  };

  const ReplyComponent = ({ reply }: { reply: Comment }) => (
    <div className="ml-8 mt-2 flex items-start">
      <div className="w-5 h-5 rounded-full overflow-hidden mr-2 mt-0.5">
        <Image
          src={reply.user.avatar || '/images/default-avatar.png'}
          alt={reply.user.name}
          width={20}
          height={20}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex-1">
        <div>
          <span className="font-semibold mr-1 text-zinc-800 dark:text-zinc-200">{reply.user.name}</span>
          <span className="text-zinc-700 dark:text-zinc-300">{reply.text}</span>
        </div>
        <div className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 flex space-x-2">
          <span>{reply.createdAt}</span>
          <button 
            onClick={() => setReplyingTo(replyingTo === reply.id ? null : reply.id)}
            className="font-medium hover:underline"
          >
            답글 달기
          </button>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    async function fetchDiary() {
      try {
        const res = await api.get(`/diary/${diary.id}`); 
        const data = res.data;
        console.log(data);
        setLikeCount(data.count);
        setLiked(data.liked);
      } catch (error) {
        setLikeCount(0);
        setLiked(false);
      }
    }

    fetchDiary();
  }, []);

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
            </div>

            <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 mb-1">
              좋아요 {formatNumber(likeCount)}개
            </div>

            {/* 일기 내용 (본문) */}
            <div className="text-sm text-zinc-800 dark:text-zinc-200 mb-2">
              <span className="font-semibold mr-1">{author.name}</span>
              {diary.title}
            </div>
          </div>
          
          {/* 댓글 목록 - 내부 스크롤 영역에 포함 */}
          <div className="px-4 pb-4 space-y-1.5">
            {comments.slice(0, visibleCommentCount).map((comment) => (
              <div key={comment.id} id={`comment-${comment.id}`} className="text-sm flex items-start">
                <div className="w-6 h-6 rounded-full overflow-hidden mr-2 mt-0.5">
                  <Image
                    src={comment.user.avatar || '/images/default-avatar.png'}
                    alt={comment.user.name}
                    width={24} 
                    height={24}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1">
                  <div>
                    <span className="font-semibold mr-1 text-zinc-800 dark:text-zinc-200">{comment.user.name}</span>
                    <span className="text-zinc-700 dark:text-zinc-300">{comment.text}</span>
                  </div>
                  <div className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 flex space-x-2">
                    <span>{comment.createdAt}</span>
                    <button 
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      className="font-medium hover:underline"
                    >
                      답글 달기
                    </button>
                  </div>
                  {/* Show replies if they exist */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {comment.replies.map((reply: Comment) => (
                        <ReplyComponent key={reply.id} reply={reply} />
                      ))}
                    </div>
                  )}
                  {replyingTo === comment.id && (
                    <div className="mt-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-5 h-5 rounded-full overflow-hidden">
                          <Image
                            src="/images/cat-king.png"
                            alt="Current user"
                            width={20}
                            height={20}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          {comment.user.name}님에게 답글 작성 중
                        </span>
                      </div>
                      <form 
                        onSubmit={(e) => handleReplySubmit(e, comment.id)}
                        className="flex items-center gap-2"
                      >
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="답글을 입력하세요..."
                          className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-full px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-sky-500 dark:focus:border-sky-400"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyText('');
                            }}
                            className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                          >
                            취소
                          </button>
                          <button
                            type="submit"
                            className="bg-sky-500 hover:bg-sky-600 text-white font-medium text-sm px-4 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!replyText.trim()}
                          >
                            답글
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
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