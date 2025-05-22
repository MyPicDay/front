import { GetServerSideProps } from "next";

type Comment = {
  username: string;
  content: string;
  createdAt: string;
};

type PostDetail = {
  username: string;
  profileImage: string;
  title: string;
  imageUrl: string;
  likeCount: number;
  comments: Comment[];
};

export default function PostPage({ post }: { post: PostDetail }) {
  return (
    <div>
      <h1>{post.title}</h1>
      <p>작성자: {post.username}</p>
      <img src={post.imageUrl} alt="post image" width="400" />
      <h3>댓글</h3>
      <ul>
        {post.comments.map((c, i) => (
          <li key={i}>
            <strong>{c.username}</strong>: {c.content}
          </li>
        ))}
      </ul>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.id;
  const res = await fetch(`http://localhost:8080/api/posts/${id}`);
  const post = await res.json();

  return {
    props: { post },
  };
};