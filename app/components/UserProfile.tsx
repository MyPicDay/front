'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProfileCalendar from './calendar';
import FollowersListClient from './FollowersListClient';
import FollowingsListClient from './FollowingsListClient';

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

interface Diary {
  id: number;
  title: string;
  content: string;
  date: string;
  authorId: string;
  image: string;
}

interface UserProfileProps {
  userId: string;
}

export default function UserProfile({ userId }: UserProfileProps) {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'diary' | 'followers' | 'followings'>('diary');

  useEffect(() => {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
      'http://localhost:3000';

    fetch(`${baseUrl}/api/mock/profile/${userId}`)
      .then(r => r.json())
      .then(data => {
        setUser(data.user);
        setStats(data.stats);
        setLoading(false);
      });
  }, [userId]);

  if (loading || !user || !stats) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="animate-pulse">
          <div className="h-32 w-32 rounded-full bg-gray-200 dark:bg-gray-700 mx-auto md:mx-0"></div>
          <div className="mt-4 space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* 프로필 헤더 */}
      <div className="mb-8 px-4">
        <div className="flex flex-col items-center md:flex-row md:items-start">
          <img 
            src={user.avatar || '/mockups/avatar-placeholder.png'} 
            alt={`${user.name}의 프로필 이미지`} 
            className="w-32 h-32 rounded-full object-cover border-2 border-indigo-500 dark:border-indigo-400 shadow-lg"
          />
          
          <div className="mt-4 md:mt-0 md:ml-8 text-center md:text-left">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">{user.name}</h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">{user.email}</p>
            
            {/* 통계 정보 */}
            <div className="flex justify-center md:justify-start space-x-8 mt-4">
              <div className="text-center" onClick={() => setTab('diary')} >
                <p className="text-2xl font-bold">{stats.diaryCount}</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">나의 일기</p>
              </div>
              <div className="text-center" onClick={() => setTab('followers')}>
                <p className="text-2xl font-bold">{stats.followerCount}</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">팔로워</p>
              </div>
              <div className="text-center" onClick={() => setTab('followings')}>
                <p className="text-2xl font-bold">{stats.followingCount}</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">팔로잉</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 캘린더 컴포넌트 */}
      <div className="my-8">
        {tab === 'diary' && <ProfileCalendar userId={user.id} />}
          {tab === 'followers' && <FollowersListClient userId={user.id} />}
          {tab === 'followings' && <FollowingsListClient userId={user.id} />}
     
      </div>
    </div>
  );
} 