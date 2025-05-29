import {apiFetch, getBaseUrl} from '@/lib/services/apiService';
import type {Page, User} from '@/app/types';

export async function fetchUsers(query:string) : Promise<Page<User>> {
    const baseUrl= getBaseUrl();
    const url = `${baseUrl}/api/users?nickname=${query}`;
    return await apiFetch<Page<User>>(url);
}

export async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);

  if (!response.ok) {
    const errorData = await response.text();
    console.error(`API 요청 실패 (${response.status}):`, errorData);
    throw new Error(`API 요청 실패: ${response.statusText}`);
  }

  const data: T = await response.json();
  return data;
}