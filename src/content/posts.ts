// Blog post registry. Add future posts here; the .md lives in
// src/content/posts/<file> and is read at build time by the post route.
export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO yyyy-mm-dd
  author: string;
  file: string; // filename inside src/content/posts/
};

export const posts: Post[] = [
  {
    slug: "tokenized-metals-shelf",
    title:
      "The Tokenized-Metals Shelf Is Crowded. The Index On Top Of It Is Empty.",
    description:
      "Why on-chain gold fragmented into four tokens, what two decades of gold ETFs tell us comes next, and the one layer nobody has built: an actively-managed, hedged, multi-metal index.",
    date: "2026-06-22",
    author: "Hedgents Research",
    file: "tokenized-metals-shelf.md",
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

// Newest first, for the index listing.
export const sortedPosts: Post[] = [...posts].sort((a, b) =>
  b.date.localeCompare(a.date),
);
