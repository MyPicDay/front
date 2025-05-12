'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow';
  message: string;
  createdAt: string;
  read: boolean;
  userId: string;
  diaryId?: string;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/mock/notifications');
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error('알림을 불러오는 중 오류 발생:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleNotificationClick = (notification: Notification) => {
    if (notification.diaryId) {
      router.push(`/diary/${notification.diaryId}`);
    } else if (notification.userId) {
      router.push(`/profile/${notification.userId}`);
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
              className={`p-4 rounded-lg cursor-pointer transition-colors ${
                notification.read
                  ? 'bg-white dark:bg-zinc-800'
                  : 'bg-indigo-50 dark:bg-indigo-900/20'
              } hover:bg-indigo-100 dark:hover:bg-indigo-900/30`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <p className="text-zinc-900 dark:text-white">{notification.message}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                )}
              </div>
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