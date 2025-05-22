"use client";
import Image from "next/image";

interface FollowUser {
  id: string;
  name: string;
  avatar: string;
  isFollowing: boolean;
}

interface FollowListProps {
  title: string;
  users: FollowUser[];
  onFollowToggle: (userId: string) => void;
}

export default function FollowList({ title, users, onFollowToggle }: FollowListProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-lg font-semibold mt-8 mb-4">{title}</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id} className="flex items-center py-3 border-b">
            <Image
              src={user.avatar || "/mockups/avatar-placeholder.png"}
              alt={`${user.name}의 프로필 이미지`}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            <span className="ml-4 flex-1 font-medium">{user.name}</span>
            <button
              className={`px-4 py-1 rounded border transition ${
                user.isFollowing
                  ? "bg-[#A67C52] text-white border-[#A67C52] hover:bg-[#8B5E34]"
                  : "bg-white text-[#A67C52] border-[#A67C52] hover:bg-[#F5E9DA]"
              }`}
              onClick={() => onFollowToggle(user.id)}
            >
              {user.isFollowing ? "팔로우 취소" : "팔로우"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
} 