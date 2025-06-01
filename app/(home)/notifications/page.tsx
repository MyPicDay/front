'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/app/api/api';
import useNotificationStore from '@/lib/store/useNotificationStore';
import { getServerURL } from '@/lib/utils/url';

interface Notification {
  id: string;
  type: 'LIKE' | 'COMMENT' | 'REPLY' | 'FOLLOW';
  message: string;
  createdAt: string;
  isread: boolean;
  moveToWhere: string;
  senderProfileImage: string;
  diaryThumbnail: string;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { decreaseUnreadCount } = useNotificationStore();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get('/notifications');
        setNotifications(response.data);
      } catch (error) {
        console.error('알림을 불러오는 중 오류 발생:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleNotificationClick = async (notification: Notification) => {
    try {
      const response = await api.post(`/notifications/${notification.id}/read`);
      decreaseUnreadCount();
    } catch (error) {
      console.error('알림 읽음처리 중 오류 발생:', error);
    }

    switch (notification.type) {
      case 'LIKE':
      case 'COMMENT':
      case 'REPLY':
        router.push(`/diary/${notification.moveToWhere}`);
        break;
      case 'FOLLOW':
        router.push(`/profile/${notification.moveToWhere}`);
        break;
      default:
        console.warn('Unknown notification type');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-zinc-600 dark:text-zinc-400">알림을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-8">알림</h1>

      {notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`p-4 rounded-lg cursor-pointer transition-colors flex items-center justify-between gap-4
      ${notification.isread
                  ? 'bg-white dark:bg-zinc-800'
                  : 'bg-indigo-50 dark:bg-indigo-900/20'
                } hover:bg-indigo-100 dark:hover:bg-indigo-900/30`}
            >
              {/* 프로필 이미지 */}
              <div className="flex-shrink-0">
                <img
                 src={notification.senderProfileImage ? `${getServerURL()}/${notification.senderProfileImage}` : "/images/default.png"}

                  alt="Sender"
                  className="w-10 h-10 rounded-full object-cover"
                />
              </div>

              {/* 알림 메시지 */}
              <div className="flex-1">
                <p className="text-zinc-900 dark:text-white">{notification.message}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>

              {/* 일기 썸네일 */}
              {notification.type !== 'FOLLOW' && (
                <div className="flex-shrink-0">
                  <img
                    src={notification.diaryThumbnail ? `${getServerURL()}/diaries/images/${notification.diaryThumbnail}` : "/images/default.png"}
                    alt="Diary Thumbnail"
                    className="w-12 h-12 rounded-md object-cover"
                  />

                </div>
              )}


              {/* 안 읽은 표시 */}
              {!notification.isread && (
                <div className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 ml-2" />
              )}
            </div>
          ))}

        </div>
      ) : (
        <p className="text-center text-zinc-600 dark:text-zinc-400 py-8">
          새로운 알림이 없습니다.
        </p>
      )}
    </div>
  );
} 