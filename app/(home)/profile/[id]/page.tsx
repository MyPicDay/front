import UserProfile from '@/app/components/UserProfile';

interface ProfilePageProps {
  params: {
    id: string;
  };
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { id } = params;
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-8">
      <UserProfile userId={id} />
    </main>
  );
}