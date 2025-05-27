'use client';

import { useEffect, useRef, useState } from 'react';
import debounce from 'lodash.debounce';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { fetchUsers } from '@/app/api/users';
import type { User } from '@/app/types';

export default function SearchInput() {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // 검색어 하이라이트 
  function highlightMatch(text: string, keyword: string) {
    if (!keyword.trim()) return text;

    const regex = new RegExp(`(${keyword})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="text-[#AA815F] font-semibold">
          {part}
        </span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  }

  // debounce로 API 호출 제한
  const debouncedSearch = debounce(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    try {
      const res = await fetchUsers(query);
      setResults(res.content);
    } catch (err) {
      console.error('검색 실패:', err);
    }
  }, 300);

  useEffect(() => {
    debouncedSearch(keyword);
    return () => debouncedSearch.cancel();
  }, [keyword]);

  // 외부 클릭하면 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Enter 누르면 검색 페이지로 이동
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && keyword.trim()) {
      router.push(`/search?q=${encodeURIComponent(keyword)}`);
      setShowResults(false);
    }
  };

  return (
    <div className="relative w-72" ref={wrapperRef}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <input
        type="search"
        placeholder="검색"
        value={keyword}
        onChange={(e) => {
          setKeyword(e.target.value);
          setShowResults(true);
        }}
        onKeyDown={handleKeyDown}
        className="pl-10 pr-4 py-2 w-full rounded-full bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#AA815F] border-zinc-300 focus:border-[#AA815F]"
      />

      {/* 드롭다운 결과 */}
      {showResults && (
        <ul className="absolute z-10 w-full bg-white shadow-md border border-zinc-200 rounded-lg mt-1 max-h-60 overflow-auto">
          {results.length > 0 ? (
            results.map((user) => (
              <li
                key={user.userId}
                className="flex items-center px-4 py-2 cursor-pointer hover:bg-zinc-100 gap-3"
                onClick={() => {
                  router.push(`/profile/${user.userId}`);
                  setShowResults(false);
                }}
              >
                <Image
                  src={user.profileImageUrl || "/images/city-night.png"}
                  alt={`${user.nickname} 프로필 이미지`}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="text-sm">{highlightMatch(user.nickname, keyword)}</span>
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-zinc-500 text-sm text-center">
              검색 결과가 없습니다.
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
