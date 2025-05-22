import users from '../../../../lib/data/users.json';
export const revalidate = 0;
export async function GET() {
  return Response.json(users);
} 