import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getPost, posts } from "@/content/posts";
import { Markdown } from "@/components/markdown";

// Next 16: params is a Promise and must be awaited in dynamic routes.
type Params = { slug: string };

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

async function readPostMarkdown(file: string): Promise<string> {
  const filePath = path.join(process.cwd(), "src/content/posts", file);
  return readFile(filePath, "utf8");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  const url = `https://hedgents.com/blog/${post.slug}`;
  return {
    title: `${post.title} · Hedgents Research`,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const markdown = await readPostMarkdown(post.file);

  return (
    <main className="bg-background" style={{ color: "var(--foreground)" }}>
      <article className="mx-auto max-w-[720px] px-6 pt-16 pb-24">
        {/* Breadcrumb / back links */}
        <nav className="mb-10 flex items-center gap-4 font-mono text-xs">
          <a
            href="/"
            className="transition-opacity hover:opacity-70"
            style={{ color: "var(--muted-foreground)" }}
          >
            Hedgents
          </a>
          <span style={{ color: "var(--border)" }}>/</span>
          <a
            href="/blog"
            className="transition-opacity hover:opacity-70"
            style={{ color: "var(--gold)" }}
          >
            ← Blog
          </a>
        </nav>

        {/* The .md already carries its own H1 title, byline, and TL;DR,
            so we render it as-is with no duplicate title. */}
        <div className="markdown-body">
          <Markdown>{markdown}</Markdown>
        </div>

        {/* Footer back-link */}
        <hr
          className="my-12 border-0 h-px"
          style={{ backgroundColor: "var(--border)" }}
        />
        <a
          href="/blog"
          className="font-mono text-xs underline underline-offset-2 transition-opacity hover:opacity-70"
          style={{ color: "var(--gold)" }}
        >
          ← Back to Blog
        </a>
      </article>
    </main>
  );
}
