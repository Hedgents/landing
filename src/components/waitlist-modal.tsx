"use client";

import { useState, type CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";

// hgMETAL v1 waitlist → shared Cloudflare Worker + D1 (hedgents-waitlist).
const WAITLIST_API = "https://hedgents-waitlist.guanyidu98.workers.dev";

export function WaitlistButton({
  className,
  style,
  label = "Join the waitlist",
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

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-md rounded-2xl border p-7"
            style={{ backgroundColor: "var(--navy)", borderColor: "rgba(201,168,76,0.3)" }}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-serif text-2xl font-bold text-white">Join the hgMETAL waitlist</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/55">
              Get notified when the live-capital launch opens. Today it is live on devnet with a paper
              hedge and no live-capital track record.
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
                  <option value="senior">hgUSD senior coupon</option>
                  <option value="junior">hgYIELD junior yield</option>
                  <option value="index">the hgMETAL index</option>
                  <option value="building">building on it</option>
                </select>
                {err && <div className="mt-3 text-xs text-amber-400">{err}</div>}
                <button
                  type="submit"
                  disabled={busy}
                  className="mt-5 w-full rounded-lg px-5 py-2.5 font-mono text-sm font-semibold transition-opacity hover:opacity-85 disabled:opacity-50"
                  style={{ backgroundColor: "var(--gold)", color: "var(--navy)" }}
                >
                  {busy ? "…" : "Join waitlist"}
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
