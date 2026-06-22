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
    slug: "on-chain-commodity-yield-mirage",
    title:
      "The On-Chain Commodity-Yield Mirage: What Is Real and What Is Theater",
    description:
      "Sorting on-chain metals yield into four buckets: emissions theater, lending and LP, T-bill dollar yield, and the one real metals carry.",
    date: "2026-06-22",
    author: "Hedgents Research",
    file: "on-chain-commodity-yield-mirage.md",
  },
  {
    slug: "delta-neutral-metals-carry",
    title: "What a Delta-Neutral Metals Position Actually Earns",
    description:
      "How shorting a metals perp against tokenized bullion turns price direction into harvestable funding carry, and the gold-plus-silver capacity ceiling that caps it.",
    date: "2026-06-22",
    author: "Hedgents Research",
    file: "delta-neutral-metals-carry.md",
  },
  {
    slug: "tokenized-silver-behind-gold",
    title:
      "Tokenized Silver Is Far Behind Tokenized Gold. Here Is Why, and Why It Matters",
    description:
      "On-chain gold is a multi-billion-dollar market and tokenized silver is a rounding error next to it. The gap is structural, not permanent.",
    date: "2026-06-22",
    author: "Hedgents Research",
    file: "tokenized-silver-behind-gold.md",
  },
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
