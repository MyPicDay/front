import {apiFetch, getBaseUrl} from '@/lib/services/apiService';
import type {Diary, Page} from '@/app/types';

export async function fetchDiaries(page = 0): Promise<Page<Diary>> {
    const baseUrl= getBaseUrl();
    const url = `${baseUrl}/api/diaries?page=${page}&sort=createdAt,desc`;
    return await apiFetch<Page<Diary>>(url);
}