import ProfileCalendar from '@/app/components/calendar';

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 py-8 max-w-4xl mx-auto">
      <ProfileCalendar userId={id} />
    </main>
  );
} 