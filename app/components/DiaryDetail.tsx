type Diary = {
  id: number;
  title: string;
  content: string;
  date: string;
  authorId: string;
  image: string;
};

export default function DiaryDetail({ diary }: { diary: Diary }) {
  return (
    <article className="container mx-auto px-4 py-8 max-w-2xl">
      <img 
        src={diary.image} 
        alt={diary.title} 
        className="w-full h-64 object-cover rounded-lg shadow-md mb-6"
        loading="lazy"
      />
      <h1 className="text-3xl font-bold mb-3 text-zinc-900 dark:text-zinc-100">{diary.title}</h1>
      <time className="text-sm text-zinc-500 dark:text-zinc-400 block mb-4">{new Date(diary.date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
      <div className="prose prose-zinc dark:prose-invert max-w-none">
        <p>{diary.content}</p>
      </div>
    </article>
  );
} 