export type GitHubFile = {
  name: string;
  download_url: string;
  type: "file" | "dir";
};

export type PostMetadata = {
  title: string;
  date: string;
  excerpt: string;
};

export type Post = {
  slug: string;
  metadata: PostMetadata;
  content: string;
};
