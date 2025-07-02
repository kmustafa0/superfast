import { formatDateEU } from "@/lib/formatDate";
import { Post } from "@/types";
import Link from "next/link";

export default function PostList({ posts }: { posts: Post[] }) {
  return (
    <div className="space-y-10">
      {posts.map((post) => (
        <article key={post.slug}>
          <h2 className="text-xl font-bold">
            <Link href={`/posts/${post.slug}`}>{post.metadata.title}</Link>
          </h2>
          <time className="text-xs text-gray-500">
            {formatDateEU(post.metadata.date)}
          </time>
          <p className="mt-2 text-sm text-gray-400">{post.metadata.excerpt}</p>
        </article>
      ))}
    </div>
  );
}
