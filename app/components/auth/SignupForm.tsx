'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import api from '@/app/api/api';

interface FixedCharacter {
  id: number;
  displayImageUrl: string;
  type: string;
}

export default function SignupPage() {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fixedCharacters, setFixedCharacters] = useState<FixedCharacter[]>([]);
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchFixedCharacters = async () => {
      try {
        const response = await api.get('/characters/fixed');
        setFixedCharacters(response.data);
        if (response.data.length > 0) {
          setSelectedCharacterId(response.data[0].id);
        }
      } catch (error) {
        console.error('고정 캐릭터 목록 조회 실패:', error);
        setMessage('캐릭터 목록을 불러오는데 실패했습니다.');
      }
    };
    fetchFixedCharacters();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage('');
    setIsLoading(true);

    if (password !== confirmPassword) {
      setMessage('비밀번호가 일치하지 않습니다.');
      setIsLoading(false);
      return;
    }

    if (!selectedCharacterId) {
      setMessage('캐릭터를 선택해주세요.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/signup', {
        nickname,
        email,
        password,
        fixedCharacterId: selectedCharacterId,
      });
      setMessage('회원가입 성공! 로그인 페이지로 이동합니다.');
      setTimeout(() => router.push('/login'), 1000);
    } catch (error: any) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message || '회원가입 중 오류가 발생했습니다.');
      } else {
        setMessage('네트워크 오류 또는 서버 문제로 회원가입에 실패했습니다.');
      }
      console.error('Signup error:', error);
    }
    setIsLoading(false);
  };

  return (
    <main className="flex items-center justify-center min-h-screen p-4 bg-white">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        {/* 좌측: 회원가입 폼 */}
        <div className="flex-1 bg-[#FEF4E4] p-8 flex flex-col justify-center">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-zinc-900">회원가입</h2>
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div>
              <label htmlFor="email" className="block text-base font-medium text-zinc-700 mb-1">이메일</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full px-4 py-2 rounded-md border border-zinc-300 bg-[#FEF4E4] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-base font-medium text-zinc-700 mb-1">비밀번호</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="block w-full px-4 py-2 rounded-md border border-zinc-300 bg-[#FEF4E4] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-base font-medium text-zinc-700 mb-1">비밀번호 확인</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="block w-full px-4 py-2 rounded-md border border-zinc-300 bg-[#FEF4E4] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="nickname" className="block text-base font-medium text-zinc-700 mb-1">닉네임</label>
              <input
                id="nickname"
                name="nickname"
                type="text"
                required
                className="block w-full px-4 py-2 rounded-md border border-zinc-300 bg-[#FEF4E4] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="nickname"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !selectedCharacterId}
              className="w-full py-3 rounded-md bg-amber-400 hover:bg-amber-500 text-zinc-900 text-lg font-semibold shadow disabled:opacity-50 border border-zinc-300 transition-colors"
            >
              {isLoading ? '가입 처리 중...' : '회원가입'}
            </button>
            {message && (
              <p className={`mt-4 text-center text-sm ${message.includes('성공') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>
            )}
          </form>
        </div>
        {/* 우측: 캐릭터 선택하기 */}
        <div className="flex-1 bg-white p-8 flex flex-col justify-center border-t md:border-t-0 md:border-l border-zinc-200">
          <h3 className="text-xl font-semibold text-center mb-6 text-zinc-900">캐릭터 선택하기</h3>
          {fixedCharacters.length > 0 ? (
            <Swiper
              spaceBetween={10}
              slidesPerView={1}
              onSlideChange={(swiper: SwiperType) => setSelectedCharacterId(fixedCharacters[swiper.activeIndex].id)}
              modules={[Pagination]}
              pagination={{ clickable: true }}
              className="w-full max-w-xs mx-auto mb-6"
            >
              {fixedCharacters.map((character, index) => (
                <SwiperSlide key={character.id} className="flex justify-center items-center p-2 pb-8">
                  <div className={`cursor-pointer rounded-lg overflow-hidden border-4 ${selectedCharacterId === character.id ? 'border-amber-500' : 'border-transparent'}`}>
                    <img 
                      src={character.displayImageUrl}
                      alt={`캐릭터 ${character.id}`}
                      width={700} 
                      height={150}
                      className="object-contain"
                      loading={index < 2 ? "eager" : "lazy"}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <p className="text-center text-zinc-500">캐릭터를 불러오는 중입니다...</p>
          )}
        </div>
      </div>
    </main>
  );
}

// AI 캐릭터 생성 기능 추가 예정
{/* <h3 className="text-xl font-semibold text-center mb-6 text-zinc-900">나만의 캐릭터 만들기</h3> */}
{/* <div>
  <label htmlFor="characterDesc" className="block text-base font-medium text-zinc-700 mb-1">캐릭터 생성</label>
  <textarea
    id="characterDesc"
    name="characterDesc"
    rows={4}
    className="block w-full px-4 py-2 rounded-md border border-zinc-300 bg-[#FEF4E4] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
    placeholder="생성하고자 하는 캐릭터에 대해 묘사해주세요.\n자세하게 묘사할수록 원하는 모습에 더 가까워집니다."
    value={characterDesc}
    onChange={e => setCharacterDesc(e.target.value)}
  />
</div> */}
{/* <button
  type="submit"
  form=""
  disabled={isLoading}
  onClick={handleSubmit}
  className="mt-8 w-full py-3 rounded-md bg-[#FEF4E4] hover:bg-amber-300 text-zinc-900 text-lg font-semibold shadow disabled:opacity-50 border border-zinc-300 transition-colors"
>
  {isLoading ? '가입 처리 중...' : '회원가입'}
</button> */}
{/* {message && (
  <p className={`mt-4 text-center text-base ${message.includes('성공') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>
)} */}