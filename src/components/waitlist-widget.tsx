import { WaitlistButton } from "@/components/waitlist-modal";

// Inline long-form callout for the blog. Cream/navy/gold house style:
// a gold-tinted bordered box with a serif headline, one honest body line,
// and the shared WaitlistButton. The "mid" variant sits between article
// halves; the "footer" variant closes the piece (slightly larger, centered).
export function WaitlistWidget({
  source,
  variant = "mid",
}: {
  source: string;
  variant?: "mid" | "footer";
}) {
  const isFooter = variant === "footer";

  const headline = isFooter
    ? "Join the hgMETAL waitlist"
    : "Get the hedged-carry launch";

  return (
    <aside
      className={[
        "rounded-xl border",
        isFooter ? "my-14 px-8 py-9 text-center" : "my-12 px-7 py-7",
      ].join(" ")}
      style={{
        borderColor: "rgba(201,168,76,0.35)",
        backgroundColor: "rgba(201,168,76,0.06)",
      }}
    >
      <p
        className="font-mono text-[10px] uppercase tracking-[0.3em]"
        style={{ color: "var(--gold)" }}
      >
        Hedgents
      </p>
      <h3
        className={[
          "mt-2 font-serif font-bold leading-snug",
          isFooter ? "" : "",
        ].join(" ")}
        style={{
          color: "var(--foreground)",
          fontSize: isFooter ? "clamp(22px, 3.5vw, 28px)" : "clamp(20px, 3vw, 24px)",
        }}
      >
        {headline}
      </h3>
      <p
        className={[
          "mt-3 text-[15px] leading-[1.7]",
          isFooter ? "mx-auto max-w-[460px]" : "max-w-[520px]",
        ].join(" ")}
        style={{ color: "var(--muted-foreground)" }}
      >
        hgMETAL is live on Solana devnet with a paper hedge and no live-capital
        track record yet. Join the waitlist to hear when the live-capital launch
        opens.
      </p>
      <div className={isFooter ? "mt-6 flex justify-center" : "mt-5"}>
        <WaitlistButton
          source={source}
          label="Join the waitlist"
          className="inline-block rounded-lg px-5 py-2.5 font-mono text-sm font-semibold transition-opacity hover:opacity-85"
          style={{ backgroundColor: "var(--gold)", color: "var(--navy)" }}
        />
      </div>
    </aside>
  );
}
