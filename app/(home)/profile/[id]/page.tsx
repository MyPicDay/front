import UserProfile from '@/app/components/UserProfile';

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-8">
      <UserProfile userId={id} />
    </main>
  );
} 