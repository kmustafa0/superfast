import { notFound } from "next/navigation";
import matter from "gray-matter";
import yaml from "js-yaml";
import ReactMarkdown from "react-markdown";
import { GitHubFile, PostMetadata } from "@/types";
import type { Metadata as NextMetadata } from "next";
import { formatDateEU } from "@/lib/formatDate";

export async function generateStaticParams() {
  const res = await fetch(
    "https://api.github.com/repos/kmustafa0/blog-posts/contents/posts"
  );
  const files: GitHubFile[] = await res.json();
  return files
    .filter((file: GitHubFile) => file.name.endsWith(".md"))
    .map((file: GitHubFile) => ({ slug: file.name.replace(".md", "") }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Partial<NextMetadata>> {
  const { slug } = await params;

  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post not found",
    };
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://superfast.vercel.app";

  return {
    title: post.metadata.title,
    description: post.metadata.excerpt,
    alternates: {
      canonical: `${siteUrl}/posts/${slug}`,
    },
    openGraph: {
      title: post.metadata.title,
      description: post.metadata.excerpt,
      url: `${siteUrl}/posts/${slug}`,
      siteName: "Super Fast Next Blog",
      images: [
        {
          url: `${siteUrl}/api/og?slug=${encodeURIComponent(
            post.metadata.title
          )}`,
          width: 1200,
          height: 630,
          alt: post.metadata.title,
        },
      ],
      locale: "en-US",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.metadata.title,
      description: post.metadata.excerpt,
      images: [
        `${siteUrl}/api/og?slug=${encodeURIComponent(post.metadata.title)}`,
      ],
    },
  };
}

async function getPostBySlug(
  slug: string
): Promise<{ metadata: PostMetadata; content: string } | null> {
  try {
    const res = await fetch(
      `https://raw.githubusercontent.com/kmustafa0/blog-posts/main/posts/${slug}.md`,
      {
        next: { revalidate: 10 },
      }
    );
    if (!res.ok) return null;

    const raw = await res.text();
    
    // 🔒 GÜVENLİK: YAML deserialization attack'leri için safe parsing
    const { data, content } = matter(raw, {
      engines: {
        yaml: (s: string) => yaml.load(s, { schema: yaml.SAFE_SCHEMA })
      }
    });
    const metadata = data as PostMetadata;

    if (!metadata.title || !metadata.date || !metadata.excerpt) {
      throw new Error(`Missing required metadata fields in markdown: ${slug}`);
    }

    return {
      metadata: metadata as PostMetadata,
      content,
    };
  } catch (err) {
    console.error("Failed to fetch post:", err);

    return null;
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  console.log("title:", post?.metadata.title);

  if (!post) return notFound();

  return (
    <article className="prose prose-invert max-w-none">
      <h1>{post.metadata.title}</h1>
      <time className="text-sm text-gray-500">
        {formatDateEU(post.metadata.date)}
      </time>
      <ReactMarkdown>{post.content}</ReactMarkdown>
    </article>
  );
}
