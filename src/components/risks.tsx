"use client";

import { motion } from "framer-motion";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

const RISKS = [
  {
    number: "01",
    label: "Strategy",
    title: "Yield is not guaranteed; capital is at risk.",
    body: "ONyc relies on Kamino's isolated ONyc market: a sustained NAV impairment of the underlying reinsurance book, a USDC borrow-rate spike, or a Chainlink Data Streams outage on the ONyc oracle can each pressure the position and require deleveraging or accept a haircut. HedgedJLP is a basis trade: when Jupiter Perps funding diverges from JLP fee accrual, the spread can compress to zero or invert. Stable Yield earns USDC supply APR, the lowest-risk strategy, but still subject to Kamino utilization spikes and the reserve's bad-debt provisioning.",
  },
  {
    number: "02",
    label: "Liquidity + withdrawals",
    title: "Redemptions are not instant; stress widens the queue.",
    body: "Unwinding onyc requires multiple Kamino transactions (repay USDC, withdraw ONyc collateral, swap back to USDC); hedgedjlp requires closing perps positions; large redemptions face slippage that the dashboard's quoted NAV does not reflect. Under normal conditions a withdrawal completes within a business day. Under stress, whether from Kamino USDC utilization saturating against borrow repayments, JLP or perps illiquidity, ONyc secondary-market thinness, or many simultaneous depositor withdrawals, the queue stretches and partial payouts may occur. The operator commits to best-effort timely execution; this is not a guarantee.",
  },
  {
    number: "03",
    label: "External smart-contract",
    title: "Hedgents calls on-chain code it does not own.",
    body: "Capital is deployed into Kamino (lending), Jupiter Perps (perpetuals + JLP), Jito (staking), and Jupiter Swap (aggregator routing). Any bug, exploit, or governance change in those protocols can cause loss. We do not audit them. We monitor for known incident shapes and have automated unwind paths, but a black-swan exploit is not survivable through monitoring alone.",
  },
  {
    number: "04",
    label: "Hedgents code",
    title: "Our own software has bugs.",
    body: "The fleet ships rapid iteration on real money: twelve releases in the five days before this disclosure was written. We test, we review, we keep rollback binaries. We have also shipped bugs that required emergency unwinds (over-hedged hedgedjlp positions, stale rate constants, mis-computed APR formulas, all in the public DEVLOG). The transparent codebase means you can audit every change; it does not mean every change is correct on the first try.",
  },
  {
    number: "05",
    label: "Oracle",
    title: "Strategy execution depends on external price feeds.",
    body: "Pyth publishes spot prices on Solana, Switchboard is the backup, Jupiter's price API marks JLP. Kamino's isolated ONyc market uses Chainlink Data Streams for ONyc NAV, a different feed family with its own attestation cadence and OnRe / Apex Group dependency. We do not read these oracles directly; Kamino's lending program aggregates them through its own scope-prices view and we trust that aggregation. Three concrete failure modes. (1) Outage: an oracle stops publishing; riskwatcher refuses to authorize action on stale data and the position drifts unmanaged through the outage. (2) Lag during a fast move: pull-oracle update models can stale on-chain prices by seconds during a sharp move, long enough for Kamino's keepers to liquidate at a price that no longer exists. (3) Manipulation: a successful attack on the feeder set (thin-market pump, aggregator exploit, governance capture) propagates a confident-but-wrong price, and the strategies act on it before correction. Solana DeFi has seen this shape of attack before; it has not gone away.",
  },
  {
    number: "06",
    label: "Operator key",
    title: "Long-lived signing key, no third-party custody.",
    body: "The signing daemons hold a long-lived Ed25519 role key bound at compile time. There is no qualified custodian, no transfer agent, no multisig. If the operator's infrastructure is compromised, every signing daemon on that host is compromised. The riskwatcher and researcher roles deliberately cannot sign, but the three execution daemons (onyc, stable-yield, hedgedjlp) can.",
  },
  {
    number: "07",
    label: "Operator counterparty",
    title: "Depositors hold a claim on the operator's good faith.",
    body: "The closed-beta vault is a tracked-custody model: shares are computed and updated by the operator's accounting; there is no external trustee enforcing the calculations or distributions. If the operator is coerced, becomes incapacitated, refuses to honor withdrawals, or simply leaves, depositors have no automatic recovery, and the on-chain assets sit inside the operator-controlled wallet. The relationship is bilateral trust at this stage; future versions plan to migrate to multi-sig or DAO governance.",
  },
  {
    number: "08",
    label: "Regulatory + offering",
    title: "Not registered. Not a fund. Devnet stage.",
    body: "Hedgents is an operator-run execution layer, not a registered investment vehicle. The hgMETAL tokens are live for buy/sell with test USDC on Solana devnet only (try it at terminal.hedgents.com); the fleet/treasury subscription records depositor shares as a tracked custody. Neither carries securities registration, audited financials, or transfer restrictions enforced by an external agent. Regulatory frameworks for on-chain yield products are still forming; future rules may restrict access, require disclosures we cannot meet, or trigger an orderly unwind.",
  },
  {
    number: "09",
    label: "Economics",
    title: "Two fee shapes, both negotiated.",
    body: "Fleet/treasury depositors pay a performance fee of 10–20% on net gain above their high-water mark, taken at the end of each strategy cycle. The operator does not take a fee on returns that merely recover prior drawdowns. The exact rate is negotiated based on deposit size. Self-deployed clients (running their own Hedgents fleet on their own infrastructure) pay a one-time setup fee covering install, key ceremony, initial config, and a defined post-deploy support window; a premium tier extends this with ongoing incident consultation. Both are negotiated. No management fee on AUM, no on-chain entry or exit fee in either model. Operational costs (RPC, gas, swap slippage, infrastructure) are borne entirely by the operator and do not reduce depositor net gain.",
  },
  {
    number: "10",
    label: "hgMETAL tranches",
    title: "Devnet stage, paper hedge, no live-capital track record.",
    body: "The hgMETAL family (hgUSD senior, hgYIELD junior, hgMETAL in-kind metals index) is live on Solana devnet only, with a paper hedge: design targets and the ~10% net basket carry are venue-verified and backtested on Hyperliquid, not earned on live capital. Specific failure modes. (1) Tracking error: the in-kind index tracks a gold/silver/platinum/palladium basket; rebalancing, oracle-free in-kind accounting, and venue depth can drift the token from the underlying metals. (2) Funding compression: the senior coupon and junior return depend on basket carry; if Hyperliquid funding compresses or inverts, the spread can fall to zero and junior absorbs first loss. (3) Mock USDC: the devnet demo settles in test USDC with no monetary value. (4) Forward-priced mint/redeem: requests are struck at a keeper-set NAV (anti-dilution), and a redemption gate caps each window with a swing fee, so redemptions are neither instant nor guaranteed at the quoted price. The junior-windfall reserve (defends the ~4.5% senior floor, accounting-only, never leaves the vault) and the ~15% ops/insurance USDC buffer reduce but do not eliminate these risks; neither is a guarantee.",
  },
];

export function Risks() {
  return (
    <section
      id="risks"
      className="relative min-h-screen snap-start scroll-mt-12 border-t border-border/40 flex flex-col justify-center"
    >
      <div className="mx-auto max-w-6xl px-8 sm:px-12 w-full py-12">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease }}
          className="mb-10"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-4">
            07 / What can go wrong
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground leading-tight">
            Risks, before you commit capital.
          </h2>
          <p className="mt-3 text-foreground max-w-2xl leading-relaxed">
            You can lose your entire deposit. For the v0 fleet vault there is
            no insurance, no clawback, no recovery mechanism. hgMETAL carries a
            distinct, devnet-stage risk profile, set out separately below.
          </p>
          <p className="mt-3 text-muted-foreground max-w-2xl">
            On-chain yield is real, and so is on-chain loss. The
            transparency that lets you verify every transaction also
            means every failure mode is visible. The categories
            below are the ones we have identified. There may be others.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {RISKS.map((r, i) => (
            <motion.div
              key={r.number}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08 * i, ease }}
              className="border border-border/50 rounded overflow-hidden bg-card flex flex-col"
            >
              <div className="flex items-center gap-2 px-5 py-3 border-b border-border/40 bg-muted/30">
                <span
                  className="font-mono text-sm font-bold"
                  style={{ color: "var(--gold)" }}
                >
                  {r.number}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
                  {r.label}
                </span>
              </div>
              <div className="px-5 py-5 flex-1 flex flex-col gap-3">
                <h3 className="font-serif text-lg font-semibold text-foreground leading-snug">
                  {r.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {r.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4, ease }}
          className="mt-8 text-xs text-muted-foreground/80 max-w-2xl leading-relaxed font-serif italic"
        >
          The live demo at{" "}
          <a
            href="https://terminal.hedgents.com"
            className="underline hover:text-foreground transition-colors"
          >
            terminal.hedgents.com
          </a>{" "}
          publishes live position state and lets you buy and sell all three
          tokens with test USDC on devnet, the GitHub repo publishes the
          source. Verify before depositing. No statement on this site
          should be read as a guarantee of yield, principal preservation,
          or strategy continuity.
        </motion.p>
      </div>
    </section>
  );
}
