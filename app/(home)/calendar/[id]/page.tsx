import ProfileCalendar from '@/app/components/calendar';

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const res = await fetch(`http://localhost:8080/api/calender/${id}`)
  const data = await res.json();

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 py-8 max-w-4xl mx-auto">
      <ProfileCalendar userId={id} />
    </main>
  );
} 