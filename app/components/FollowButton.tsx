"use client";
//nextjs 클라이언트 컴포넌트 브라우저에서 실행됨
import { useState } from "react";
// React의 useState를 사용하기 위한 import
import axios from "axios";
// axios는 HTTP 요청을 보내기 위한 라이브러리

interface FollowButtonProps {
    //userId: 팔로우할 대상 사용자의 ID
  userId: string;
    //현재 로그인한 사용자가 해당 사용자를 팔로우하고 있는지 여부(초기값)
  isFollowingInitial: boolean;
}
//Follow이라는 이름의 React 함수형 컴포넌트를 정의하고, userId,isFollowingInitial을 props로 받습니다.
export default function FollowButton({ userId, isFollowingInitial }: FollowButtonProps){
    //현재 팔로우 상태(true/false)
    const[isFollowing, setIsFollowing] = useState(isFollowingInitial);
    //loading: 요청 중임을 표시하는 상태값
    const[loading, setLoading] = useState(false);

    //버튼 클릭 시 호출되는 비공기 함수
    const toggleFollow = async () => {
        try{
            setLoading(true);
            if(isFollowing){
                //언팔로우(팔로우 상태일 떄)
            await axios.delete(`http://localhost:8080/api/follow/${userId}`);
            }else{
                //팔로우 (팔로우가 아닐 때)
                await axios.post(`http://localhost:8080/api/follow/${userId}`, {}, {
                    withCredentials:true,
                });
                //요청 이후 상태 업데이트
                //상태를 반대로 전환(팔로우 -> 언팔로우 또는 반대로)
            }setIsFollowing(!isFollowing);
        }catch(error){
            console.error("Follow toggle error:", error);
        }finally{
            setLoading(false);
        }
    };

    //클릭하면 toggleFollow() 함수 실행
    //요청 중엔 버튼 비활성화
    //상태에 따라 색상과 텍스트가 바뀜 팔로우중 -> 회색(UnFollow) 아니면 -> 파란색(Follow)
    return(
    <button
      onClick={toggleFollow}
      disabled={loading}
      className={`px-4 py-2 rounded ${
        isFollowing ? "bg-gray-300" : "bg-blue-500 text-white"
      }`}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
    );
}