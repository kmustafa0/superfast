import { GitHubFile, PostMetadata } from "@/types";
import matter from "gray-matter";
import yaml from "js-yaml";

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
          
          // 🔒 GÜVENLİK: YAML deserialization attack'leri için safe parsing
          const { data, content } = matter(raw, {
            engines: {
              yaml: (s: string) => yaml.load(s, { schema: yaml.SAFE_SCHEMA })
            }
          });

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
