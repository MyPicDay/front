export const revalidate = 0; // disable cache for mocks

export async function GET() {
  const characters = [
    {
      "id": 1,
      "displayImageUrl": "http://localhost:8080/api/characters/fixed/base_image_1.png",
      "type": "FIXED"
    },
    {
      "id": 2,
      "displayImageUrl": "http://localhost:8080/api/characters/fixed/base_image_2.png",
      "type": "FIXED"
    },
    {
      "id": 3,
      "displayImageUrl": "http://localhost:8080/api/characters/fixed/base_image_3.png",
      "type": "FIXED"
    },
    {
      "id": 4,
      "displayImageUrl": "http://localhost:8080/api/characters/fixed/base_image_4.png",
      "type": "FIXED"
    }
  ];
  return Response.json(characters);
} 