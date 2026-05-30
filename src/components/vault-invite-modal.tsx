"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DASHBOARD_BASE =
  process.env.NEXT_PUBLIC_HEDGENTS_DASHBOARD_BASE ?? "https://dashboard.hedgents.com";

type Step = "code" | "email" | "done";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function VaultInviteModal({ open, onClose }: Props) {
  const [step, setStep] = useState<Step>("code");
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [doneMessage, setDoneMessage] = useState<string>("");

  // Reset state every time the modal opens — operator might paste a different
  // code, and stale step state would be confusing.
  useEffect(() => {
    if (open) {
      setStep("code");
      setCode("");
      setEmail("");
      setBusy(false);
      setError(null);
      setDoneMessage("");
    }
  }, [open]);

  // ESC closes — basic affordance, no focus trap (only one focusable field at
  // a time so the user can't tab into oblivion).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  async function submitCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const r = await fetch(`${DASHBOARD_BASE}/api/invite/validate`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });
      const j = (await r.json()) as { valid: boolean; status: string };
      if (j.valid) {
        setStep("email");
      } else {
        setError(j.status || "code not recognised");
      }
    } catch {
      setError("can't reach the server — try again in a moment");
    } finally {
      setBusy(false);
    }
  }

  async function submitEmail(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const r = await fetch(`${DASHBOARD_BASE}/api/invite/register`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code: code.trim(), email: email.trim() }),
      });
      const j = (await r.json()) as { ok: boolean; message: string };
      if (j.ok) {
        setDoneMessage(j.message);
        setStep("done");
      } else {
        setError(j.message || "registration failed");
      }
    } catch {
      setError("can't reach the server — try again in a moment");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative w-full max-w-md rounded-lg border p-7"
            style={{
              backgroundColor: "var(--navy)",
              borderColor: "rgba(255,255,255,0.12)",
            }}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="absolute right-4 top-4 text-white/40 hover:text-white/80 transition-colors text-xl leading-none"
            >
              ×
            </button>

            <div className="text-[10px] uppercase tracking-[0.18em] text-white/40 mb-3">
              Hedgents Vault · invite-only beta
            </div>

            {step === "code" && (
              <>
                <h2 className="text-xl font-semibold text-white mb-2">
                  Park USDC. The fleet trades.
                </h2>
                <p className="text-sm text-white/60 mb-5 leading-relaxed">
                  One deposit, three strategies running on-chain. Stable lending +
                  leveraged jitoSOL + hedged JLP. Non-custodial, withdraw any
                  time. For people who&apos;d rather not babysit positions.
                </p>
                <form onSubmit={submitCode} className="space-y-3">
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-wide text-white/50">
                      Invite code
                    </span>
                    <input
                      autoFocus
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      disabled={busy}
                      className="mt-1 w-full rounded border bg-transparent px-3 py-2 font-mono text-sm text-white outline-none focus:border-white/60 disabled:opacity-50"
                      style={{ borderColor: "rgba(255,255,255,0.2)" }}
                      placeholder="enter your code"
                      autoComplete="off"
                      spellCheck={false}
                    />
                  </label>
                  {error && (
                    <div className="text-[12px] text-amber-400">{error}</div>
                  )}
                  <button
                    type="submit"
                    disabled={busy || code.trim().length === 0}
                    className="w-full rounded px-4 py-2.5 font-mono text-sm font-semibold transition-opacity hover:opacity-80 disabled:opacity-40"
                    style={{ backgroundColor: "var(--gold)", color: "var(--navy)" }}
                  >
                    {busy ? "Checking…" : "Continue →"}
                  </button>
                  <div className="text-[11px] text-white/40 text-center pt-1">
                    No code yet?{" "}
                    <a
                      href="mailto:contact@hedgents.com?subject=Vault%20invite%20request"
                      className="underline hover:text-white/70"
                    >
                      Request one
                    </a>
                  </div>
                </form>
              </>
            )}

            {step === "email" && (
              <>
                <h2 className="text-xl font-semibold text-white mb-2">
                  You&apos;re in. Where do we send instructions?
                </h2>
                <p className="text-sm text-white/60 mb-5 leading-relaxed">
                  We&apos;ll email deposit instructions within 48 hours. The
                  beta cohort is small — deposits are processed manually so we
                  can catch edge cases before the public launch.
                </p>
                <form onSubmit={submitEmail} className="space-y-3">
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-wide text-white/50">
                      Email
                    </span>
                    <input
                      autoFocus
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={busy}
                      className="mt-1 w-full rounded border bg-transparent px-3 py-2 font-mono text-sm text-white outline-none focus:border-white/60 disabled:opacity-50"
                      style={{ borderColor: "rgba(255,255,255,0.2)" }}
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                  </label>
                  {error && (
                    <div className="text-[12px] text-amber-400">{error}</div>
                  )}
                  <button
                    type="submit"
                    disabled={busy || !email.includes("@")}
                    className="w-full rounded px-4 py-2.5 font-mono text-sm font-semibold transition-opacity hover:opacity-80 disabled:opacity-40"
                    style={{ backgroundColor: "var(--gold)", color: "var(--navy)" }}
                  >
                    {busy ? "Registering…" : "Join beta →"}
                  </button>
                </form>
              </>
            )}

            {step === "done" && (
              <>
                <div className="text-emerald-400 text-3xl mb-2">✓</div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  You&apos;re on the list.
                </h2>
                <p className="text-sm text-white/60 mb-5 leading-relaxed">
                  {doneMessage}
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full rounded border px-4 py-2.5 font-mono text-sm transition-colors hover:border-white/50"
                  style={{
                    borderColor: "rgba(255,255,255,0.2)",
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  Close
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
