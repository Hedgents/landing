import type { Metadata } from "next";
import { sortedPosts } from "@/content/posts";

export const metadata: Metadata = {
  title: "Blog · Hedgents Research",
  description:
    "Market-structure research on on-chain metals, structured products, and hedged carry from the Hedgents team.",
  alternates: { canonical: "https://hedgents.com/blog" },
  openGraph: {
    title: "Blog · Hedgents Research",
    description:
      "Market-structure research on on-chain metals, structured products, and hedged carry from the Hedgents team.",
    url: "https://hedgents.com/blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog · Hedgents Research",
    description:
      "Market-structure research on on-chain metals, structured products, and hedged carry from the Hedgents team.",
  },
};

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function BlogIndexPage() {
  return (
    <main className="bg-background" style={{ color: "var(--foreground)" }}>
      <div className="mx-auto max-w-3xl px-6 pt-20 pb-24">
        {/* Header */}
        <p
          className="font-mono text-[10px] uppercase tracking-[0.3em] mb-4"
          style={{ color: "var(--gold)" }}
        >
          Hedgents Research
        </p>
        <h1
          className="font-serif font-bold leading-tight"
          style={{ fontSize: "clamp(40px, 6vw, 64px)" }}
        >
          Blog
        </h1>
        <p
          className="mt-4 text-base leading-relaxed"
          style={{ color: "var(--muted-foreground)", maxWidth: "560px" }}
        >
          Market-structure notes on on-chain metals, structured products, and
          hedged carry. Written by the people building hgMETAL.
        </p>

        <hr
          className="my-10 border-0 h-px"
          style={{ backgroundColor: "var(--border)" }}
        />

        {/* Post list */}
        <ul className="flex flex-col gap-10">
          {sortedPosts.map((post) => (
            <li key={post.slug}>
              <a href={`/blog/${post.slug}`} className="group block">
                <time
                  className="font-mono text-xs uppercase tracking-wide"
                  style={{ color: "var(--muted-foreground)" }}
                  dateTime={post.date}
                >
                  {formatDate(post.date)} · {post.author}
                </time>
                <h2
                  className="mt-2 font-serif font-bold leading-snug transition-opacity group-hover:opacity-70"
                  style={{
                    fontSize: "clamp(22px, 3.5vw, 30px)",
                    color: "var(--foreground)",
                  }}
                >
                  {post.title}
                </h2>
                <p
                  className="mt-3 text-[15px] leading-relaxed"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {post.description}
                </p>
                <span
                  className="mt-3 inline-block font-mono text-xs underline underline-offset-2"
                  style={{ color: "var(--gold)" }}
                >
                  Read →
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
