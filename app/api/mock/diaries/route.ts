import diaries from '../../../../lib/data/diaries.json';
export const revalidate = 0;
export async function GET() {
  return Response.json(diaries);
} 