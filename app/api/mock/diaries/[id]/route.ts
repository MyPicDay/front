import diaries from '../../../../../lib/data/diaries.json';

export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  console.log('Received params.id:', id);
  const diaryId = parseInt(id);
  const diary = diaries.find((d) => d.id === diaryId);

  if (diary) {
    return Response.json(diary);
  } else {
    return Response.json({ message: 'Diary not found' }, { status: 404 });
  }
} 