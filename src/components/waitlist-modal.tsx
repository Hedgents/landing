"use client";

import { useState, type CSSProperties } from "react";

// Shared Cloudflare Worker + D1 waitlist endpoint.
const WAITLIST_API = "https://hedgents-waitlist.guanyidu98.workers.dev";

export function WaitlistButton({
  className,
  style,
  label = "Request early access",
  source = "landing",
}: {
  className?: string;
  style?: CSSProperties;
  label?: string;
  source?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className} style={style}>
        {label} →
      </button>
      <WaitlistModal open={open} onClose={() => setOpen(false)} source={source} />
    </>
  );
}

function WaitlistModal({ open, onClose, source }: { open: boolean; onClose: () => void; source: string }) {
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async () => {
    setBusy(true);
    setErr(null);
    try {
      const r = await fetch(WAITLIST_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), interest: interest || undefined, source }),
      });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || "failed");
      setDone(true);
    } catch (e: unknown) {
      const m = e instanceof Error ? e.message : "";
      setErr(m === "invalid email" ? "Enter a valid email." : "Something went wrong, try again.");
    } finally {
      setBusy(false);
    }
  };

  if (!open) return null;

  return (
        <div
          className="waitlist-backdrop fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
          onClick={onClose}
        >
          <div
            className="waitlist-dialog w-full max-w-md rounded-2xl border p-7"
            style={{ backgroundColor: "var(--graphite)", borderColor: "rgba(199,155,71,0.38)" }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="waitlist-title"
          >
            <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-[#c79b47]">
              Hedgents · early access
            </p>
            <h3 id="waitlist-title" className="mt-3 font-serif text-3xl font-bold leading-tight text-white">
              Trade metals across onchain markets.
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-white/55">
              Join product verification and trade testing for the first gold and
              silver products. Optional hedging follows where a liquid market exists.
            </p>
            {done ? (
              <div className="mt-5 rounded-lg border border-emerald-400/30 bg-emerald-400/5 px-4 py-3 text-sm text-emerald-300">
                You are on the list. We will be in touch.
              </div>
            ) : (
              <form className="mt-5" onSubmit={(e) => { e.preventDefault(); submit(); }}>
                <input
                  autoFocus
                  type="email"
                  required
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErr(null); }}
                  placeholder="you@email.com"
                  className="w-full rounded-lg border bg-black/30 px-4 py-2.5 text-sm text-white outline-none focus:border-white/40"
                  style={{ borderColor: "rgba(255,255,255,0.15)" }}
                />
                <select
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  className="mt-3 w-full rounded-lg border bg-black/30 px-4 py-2.5 text-sm text-white/70 outline-none focus:border-white/40"
                  style={{ borderColor: "rgba(255,255,255,0.15)" }}
                >
                  <option value="">What interests you most? (optional)</option>
                  <option value="buy-metals">Owning metals on Solana</option>
                  <option value="compare-products">Comparing metal products</option>
                  <option value="hedge">Hedging through Hyperliquid</option>
                  <option value="integration">Integrating as a partner</option>
                </select>
                {err && <div className="mt-3 text-xs text-amber-400">{err}</div>}
                <button
                  type="submit"
                  disabled={busy}
                  className="mt-5 w-full rounded-lg px-5 py-2.5 font-mono text-sm font-semibold transition-opacity hover:opacity-85 disabled:opacity-50"
                  style={{ backgroundColor: "var(--gold)", color: "var(--graphite)" }}
                >
                  {busy ? "…" : "Request early access"}
                </button>
              </form>
            )}
            <button
              type="button"
              onClick={onClose}
              className="mt-4 w-full font-mono text-[11px] uppercase tracking-widest text-white/30 hover:text-white/60"
            >
              close
            </button>
          </div>
        </div>
  );
}
