import {apiFetch, getBaseUrl} from '@/lib/services/apiService';
import type {Page, User} from '@/app/types';

export async function fetchUsers(query:string) : Promise<Page<User>> {
    const baseUrl= getBaseUrl();
    const url = `${baseUrl}/api/users?nickname=${query}`;
    return await apiFetch<Page<User>>(url);
}