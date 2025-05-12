import diaries from '../../../../../lib/data/diaries.json';

export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const diaryId = parseInt(params.id);
  const diary = diaries.find((d) => d.id === diaryId);

  if (diary) {
    return Response.json(diary);
  } else {
    return Response.json({ message: 'Diary not found' }, { status: 404 });
  }
} 