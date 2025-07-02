import { GitHubFile, PostMetadata } from "@/types";
import matter from "gray-matter";

export async function getPosts(): Promise<
  { slug: string; metadata: PostMetadata; content: string }[]
> {
  try {
    const res = await fetch(
      "https://api.github.com/repos/kmustafa0/blog-posts/contents/posts",
      {
        next: { revalidate: 10 },
      }
    );
    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status}`);
    }

    const files: GitHubFile[] = await res.json();
    const posts = await Promise.all(
      files
        .filter((file) => file.name.endsWith(".md"))
        .map(async (file) => {
          const contentRes = await fetch(file.download_url);
          const raw = await contentRes.text();
          const { data, content } = matter(raw);

          const metadata = data as PostMetadata;

          return {
            slug: file.name.replace(".md", ""),
            metadata,
            content,
          };
        })
    );
    return posts.sort(
      (a, b) =>
        new Date(b.metadata.date).getTime() -
        new Date(a.metadata.date).getTime()
    );
  } catch (err) {
    console.error("Error fetching posts: ", err);
    return [];
  }
}
