import { ImageResponse } from "next/og";
import { getPost, posts } from "@/content/posts";

// Branded OG card so post links unfurl on X with a large summary image.
export const runtime = "nodejs";
export const alt = "Hedgents Research";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Pre-generate one static image per slug.
export function generateImageMetadata() {
  return posts.map((p) => ({
    id: p.slug,
    alt: p.title,
    size,
    contentType,
  }));
}

// Brand palette, hard-coded to sRGB hex (ImageResponse does not resolve
// the OKLCH CSS variables from globals.css).
const NAVY = "#10183a";
const GOLD = "#c9a14a";
const CREAM = "#f3ead6";

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  const title = post?.title ?? "Hedgents Research";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: NAVY,
          padding: "72px 80px",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: GOLD,
            fontFamily: "monospace",
          }}
        >
          Hedgents Research
        </div>

        <div
          style={{
            display: "flex",
            fontSize: title.length > 70 ? 58 : 68,
            lineHeight: 1.12,
            fontWeight: 700,
            color: CREAM,
            maxWidth: 1040,
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 26,
              color: GOLD,
              fontFamily: "monospace",
            }}
          >
            hedgents.com/blog
          </div>
          <div
            style={{
              display: "flex",
              height: 6,
              width: 120,
              backgroundColor: GOLD,
            }}
          />
        </div>
      </div>
    ),
    { ...size },
  );
}
