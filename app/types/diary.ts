export type Diary = {
  id: number;
  title: string;
  content: string;
  date: string;
  authorId: string;
  image: string;
  author?: {
    name: string;
    image: string;
  };
  likes?: number;
  comments?: number;
};

export interface SpecialDateImage {
  date: string;
  imageUrl: string;
  title: string;
} 