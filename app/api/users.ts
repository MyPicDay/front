import api from '@/app/api/api';

export async function fetchUsers(keyword: string) {
  const res = await api.get('/users', { params: { nickname: keyword } });
  return res.data; // { content: User[] }
}
