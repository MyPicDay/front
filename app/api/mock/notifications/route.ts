import { NextResponse } from 'next/server';
import notificationsData from '../../../../lib/data/notifications.json';

export const revalidate = 0;

export async function GET() {
  try {
    // 최신 알림이 먼저 오도록 정렬
    const sortedNotifications = [...notificationsData].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json(sortedNotifications);
  } catch (error) {
    console.error('Notifications error:', error);
    return NextResponse.json(
      { message: '알림을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 