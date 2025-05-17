export interface Diary {
  id: number;
  title: string;
  content: string;
  date: string;
  authorId: string;
  image: string;
}

export interface SpecialDateImage {
  date: string;
  imageUrl: string;
  title: string;
} 