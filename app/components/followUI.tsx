interface ProfileProps {
  followingCount: number;
  followerCount: number;
}

export default function Profile({ followingCount, followerCount }: ProfileProps) {
  return (
    <div className="flex space-x-4">
      <div>
        <strong>{followingCount}</strong> Following
      </div>
      <div>
        <strong>{followerCount}</strong> Followers
      </div>
    </div>
  );
}
