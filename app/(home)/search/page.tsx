'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DiaryList from '../../components/DiaryList';

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/mock/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setResults(data);
      router.push(`/search?q=${encodeURIComponent(query)}`);
    } catch (error) {
      console.error('검색 중 오류 발생:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-8">일기 검색</h1>
      
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="검색어를 입력하세요"
            className="flex-1 px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? '검색 중...' : '검색'}
          </button>
        </div>
      </form>

      {results.length > 0 ? (
        <div>
          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
            검색 결과 ({results.length}개)
          </h2>
          <DiaryList items={results} />
        </div>
      ) : query && !isLoading ? (
        <p className="text-zinc-600 dark:text-zinc-400 text-center py-8">
          검색 결과가 없습니다.
        </p>
      ) : null}
    </div>
  );
} 