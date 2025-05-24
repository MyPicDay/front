'use client';

import {useEffect, useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {fetchUsers} from "@/lib/services/userService";
import UserList from "@/app/components/UserList";
import {User} from "@/app/types";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<User[]>([]);

  useEffect(() => {
    const usersCallApi = async () => {
      if (!query.trim()) return;
      setIsLoading(true);
      try {
        // TODO 추후 url 수정 예정 (현재는 유저 검색만 진행)
        const users = await fetchUsers(query);
        setResults(users.content);
      } catch (error) {
        console.error('검색 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };
    usersCallApi();
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-8">일기 검색</h1>
      <UserList users={results} isLoading={isLoading}/>
    </div>
  );
} 