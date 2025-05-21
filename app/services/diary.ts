const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const likeDiary = async (diaryId: number, liked: boolean): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/diary/like`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({ diaryId, liked }),
  });

  if (!response.ok) {
    throw new Error('Failed to update like status');
  }
};

export const commentDiary = async (diaryId: number, comment: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/diary/comment`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({ diaryId, comment }),
  });

  if (!response.ok) {
    throw new Error('Failed to submit comment');
  }
}; 