'use client';

import {useEffect, useState} from 'react';
import ProfileCalendar from './calendar';
import FollowersListClient from './FollowersListClient';
import FollowingsListClient from './FollowingsListClient';
import api from '../api/api';
import { redirect } from 'next/navigation';
import { getServerURL } from '@/lib/utils/url';

interface Stats {
  userId: string;
  nickname: string;
  avatar: string;
  email: string;
  diaryCount: number;
  followerCount: number;
  followingCount: number;
}

interface UserProfileProps {
  userId: string;
}

export default function UserProfile({userId}: UserProfileProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'diary' | 'followers' | 'followings'>('diary');

  useEffect(() => {
    const fetchProfile = async () => {
      const baseUrl = getServerURL();
      try {
        const response = await api.get(`${baseUrl}/profiles/${userId}`);
        if (response.status === 200) {
          const data = response.data;
          data.avatar = `${baseUrl}/${data.avatar}`;
          setStats(data);
        } else {
          redirect('/');
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        redirect('/');
      }
      setLoading(false);
    };

    fetchProfile();
  }, [userId]);

  if (loading || !stats) {
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
            src={stats.avatar || '/mockups/avatar-placeholder.png'} 
            alt={`${stats.nickname}의 프로필 이미지`} 
            className="w-32 h-32 rounded-full object-cover border-2 border-indigo-500 dark:border-indigo-400 shadow-lg"
          />
          
          <div className="mt-4 md:mt-0 md:ml-8 text-center md:text-left">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">{stats.nickname}</h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">{stats.email}</p>
            
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
        {tab === 'diary' && <ProfileCalendar userId={stats.userId} />}
          {tab === 'followers' && <FollowersListClient userId={stats.userId} />}
          {tab === 'followings' && <FollowingsListClient userId={stats.userId} />}
     
      </div>
    </div>
  );
}
