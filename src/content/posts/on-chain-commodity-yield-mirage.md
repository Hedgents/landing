# The On-Chain Commodity-Yield Mirage: What Is Real and What Is Theater

*Four things on-chain call themselves "metals yield." Only one of them is actually paid by the metal. Here is how to tell them apart.*

By **Hedgents Research**

---

**TL;DR.** Search for "yield" on tokenized metals and you will find numbers that range from 1% to over 2,000%. They are not the same kind of number. Some are real income with a real payer behind them. Some are just a token being printed and handed back to you, which is not yield at all. We sort the on-chain commodity-yield universe into four buckets: (1) inflationary token emissions dressed up as APY, which are theater; (2) lending and LP yield on tokenized metal, which is real but small and capacity-limited; (3) T-bill yield on the dollar leg, which is real but is rate yield, not metals yield; and (4) market-neutral funding carry from metals perpetuals, which is the one structurally metals-specific source, recently around 5-8% net on gold and silver. The rule that falls out: a yield number with no hedge and no funding source named behind it is emissions, not income.

---

## Why "yield on gold" is a suspicious phrase to begin with

Gold does not pay a coupon. Neither does silver, platinum, or palladium. A bar in a vault produces no cash flow. It can appreciate, it can sit there, but it does not yield anything by holding it. That is the whole reason gold is treated as a store of value rather than an income asset.

So any time a product offers you "yield on gold," the first question is not *how much* but *paid by whom, out of what*. Every honest yield has a counterparty who is worse off for paying it: a borrower paying interest, a trader paying funding, a fund passing through bond coupons. If you cannot name that counterparty, the yield is either a fee rebate, a marketing subsidy, or freshly printed tokens. The metal is not paying you. Something else is, or nothing is.

With that test in hand, the on-chain "metals yield" universe sorts cleanly into four buckets, in ascending order of how real they are.

## Bucket 1: Emissions theater (the headline APYs that are not income)

This is the loudest and the emptiest category. A token launches, advertises a spectacular APY for holding or staking it, and pays that "yield" in more of its own token. The number can be enormous precisely because it is denominated in a thing the issuer prints at will. A 2,000% APY paid in a token whose supply is inflating to fund that APY is not a 2,000% return. It is a dilution schedule wearing a yield costume.

The poster child sits on Solana under the "$RMX / Rare Metals Index" banner, which wraps Remora's tokenized single-metal ETFs (GLDr, SLVr, PPLTr, PALLr, CPERr) and has advertised holder reward rates in the thousands of percent: figures cited around 2,190% on the gold sleeve up to roughly 4,380% on the copper sleeve. We could not independently verify those exact percentages from a neutral source. They render dynamically on the project's revenue-share launchpad page, and the project's own site now carries the line "This is a memecoin. Not financial advice." That disclaimer is the most honest number on the page.

Here is the tell, independent of the figure. These rewards come from a revenue-share / emissions launchpad mechanism, not from the metal and not from any external payer. The launchpad routes token fees and freshly minted supply back to holders and calls the result APY. When the yield is paid in the same asset whose price it is supposed to enhance, you are not earning on metal exposure. You are being handed a larger slice of a pie that is being baked larger to hand it to you. Annualizing a token-emission rate produces these four-digit numbers mechanically. The metal underneath (real, ETF-wrapped, custodied) is fine. The yield bolted on top is theater.

<!--WAITLIST-->

## Bucket 2: Lending and LP yield (real, small, capacity-limited)

This one is genuine income, and it is worth respecting for being honest about its own size. Tokenized gold like PAXG is integrated into DeFi money markets and AMMs (Aave, Compound, Uniswap and similar), and you can earn by lending it to borrowers or by providing it as one side of a liquidity pool. The counterparty is named and real: a borrower paying interest, or traders paying swap fees.

The rates are modest and the capacity is thin. Public aggregators put PAXG lending and CeDeFi staking yields in roughly the 3-8% APY range depending on demand, and gold-pair LP returns anywhere from about 1% to low-double-digits depending on volume, with most of 2026 clustering in low-to-mid single digits. This tracks the off-chain reality: physical gold lease rates are structurally low (normally low-single-digit, and historically near zero in calm conditions), because there is structurally little borrowing demand for gold. They can spike when bullion is tight, as some 2026 commentary has flagged, but the base case is a near-zero return for simply lending out a bar. Nobody borrows gold to build a factory. The on-chain rate is higher than the lease rate mostly because of DeFi borrowing demand and liquidity incentives, and incentives are themselves a soft form of bucket 1.

The honest read: lending and LP yield on tokenized metal is real income, but it is small, it is demand-constrained, and it does not scale. The moment a lot of capital chases it, the rate compresses toward the underlying lease rate, which is near zero. Useful at the margin. Not a thesis.

## Bucket 3: T-bill yield on the dollar leg (real, but it is rate yield, not metals yield)

This is the cleanest "real yield" in the room, and also the one most often mislabeled. Tokenized-Treasury products (Ondo's USDY and OUSG are the reference examples) pay you genuine income: short-duration US Treasuries and bank deposits, passed through on-chain. As of spring 2026 USDY was paying roughly 4.65% APY on around $740M of supply, and OUSG was running in the mid-single digits (published figures land in the ~3.4-4.5% range depending on the source and the trailing window). The counterparty is the US Treasury. That is about as real as a yield gets.

But notice what it is yield *on*. It is yield on dollars, not on metal. When a structured metals product advertises "earn yield while holding gold," very often the yield is coming from a T-bill-backed dollar leg sitting next to the gold, not from the gold. That is fine, and it can be a sensible product, as long as you understand you are stacking US-rate income onto a metals position, not extracting income from the metal. If rates fall, that yield falls with them, and it has nothing to do with gold, silver, platinum, or palladium. It is the risk-free rate in a wrapper. Real, but mislabeled when it is sold as metals yield.

## Bucket 4: Market-neutral funding carry (the one structurally metals-specific yield)

Now the only source on this list that is both real income and actually a function of the metal itself: the carry from a delta-neutral long-spot / short-perpetual position.

The mechanism is the well-documented crypto cash-and-carry trade, applied to metals. You hold the metal long (tokenized spot) and short an equal notional of the metal perpetual. The two price exposures cancel, so you are roughly delta-neutral: you do not care which way the metal moves. What you collect is the funding rate, the periodic payment perpetual-futures longs pay shorts when the perp trades above spot. Because metals perps, like crypto perps, tend to trade in mild contango with persistent long demand, the short side gets paid to carry the position. The payer is named and real: leveraged longs on the perp who want metals exposure without posting full spot.

This is the same engine that powers delta-neutral "yield" stablecoins, where realized funding has historically averaged around 11% across a full cycle but swings from negative in bears to well above that in bulls, with the cooler 2026 stretch settling into high single digits. Metals funding is its own market, generally thinner and calmer than the crypto majors, which cuts both the upside and the blow-up risk. On a recent realized basis, the market-neutral carry on tokenized gold and silver has run roughly **5-8% net** after fees and the periods when funding goes flat or negative. Gold and silver specifically, and on purpose: platinum and palladium perpetuals have thin open interest, so the hedge cannot run them at size. The honest carry today is a gold-and-silver story.

Two caveats keep it honest. The carry is not free money: funding can flip negative, the basis can drift, and the short leg has to be actively managed and occasionally defended. It is a harvested spread, not a coupon. And an annualized figure from one good week is meaningless. The only number worth quoting is realized, net, over a stretch that includes the bad weeks, which is why we quote a realized 5-8% range and not an annualized snapshot.

## The rule that falls out

Put the four buckets next to each other and a single diagnostic emerges. Real metals-linked yield always has a named payer behind it:

- Lending/LP: borrowers and traders pay, capacity is small.
- T-bill leg: the Treasury pays, but it is dollar yield, not metals yield.
- Funding carry: leveraged perp longs pay, and the position is hedged delta-neutral so the income is not just disguised price risk.

Emissions theater has neither. No external payer, no hedge, just a token being printed and annualized into a headline. So the field test is blunt: **a metals "yield" with no hedge and no funding source named behind it is emissions, not income.** If the APY is four digits, it is definitely emissions. If it is single digits but the issuer cannot tell you who is paying it out of what, assume the same until proven otherwise.

## Where this leaves us, and what we are building

The point of this piece is not that emissions tokens are evil. Some are honest memecoins that say so on the tin. The point is that "metals yield" is a phrase doing a lot of dishonest work on-chain, and only one of the four sources is structurally a yield on the metal rather than a yield on dollars or a yield on inflation. That one source is the market-neutral funding carry, the roughly 5-8% net realized on hedged gold and silver.

That carry is exactly what we are trying to harvest. **hgMETAL** is our oracle-free, in-kind, actively-managed index across four metals (gold, silver, platinum, palladium; no copper, no yield overlay on the index itself). Separately, we run a hedged-carry structure: the metals basket hedged delta-neutral so the position earns from funding rather than from the direction of the metal. The carry comes from metals-perp funding on Hyperliquid, which is why the hedge is gold-and-silver-deep and not platinum-and-palladium-deep.

We will be plain about the stage, because the whole article is about not overclaiming. hgMETAL is live on Solana devnet with a paper (simulated) hedge. There is no live-capital track record yet. The 5-8% is a market figure for the carry that exists in the world, not a promised return on our product, and anything beyond it is a design target on a paper hedge until real capital and real fills prove it out. We mention it only because, if you have read this far, you now know it is the one number in the metals-yield universe with a real payer behind it. You can look at the devnet build here: **terminal.hedgents.com**.

---

## Methodology and sources

Funding-carry and delta-neutral mechanics, and the realized-yield ranges for cash-and-carry strategies, draw on public explainers and historical funding data (Hyperliquid funding documentation; delta-neutral / cash-and-carry guides; published realized-yield ranges for funding-based stablecoins, where full-cycle averages have run near 11% with wide swings). Tokenized-Treasury yields are from Ondo's public figures and third-party trackers (USDY ~4.65% APY on ~$740M supply, spring 2026; OUSG in the mid-single digits, with published figures ranging ~3.4-4.5% across sources and trailing windows). Tokenized-gold lending and LP ranges are from public DeFi yield aggregators (PAXG lending/CeDeFi spanning roughly 0.01% to 12% across platforms, clustering ~3-8%; gold-pair LP ~1% to low-double-digits), cross-checked against the structurally low level of physical gold lease rates (normally low-single-digit and historically near zero, though no longer published transparently since the LBMA discontinued GOFO data in 2015, and reportedly tighter in some of 2026). Remora / $RMX product scope (GLDr, SLVr, PPLTr, PALLr, CPERr) is from the project's own materials; the four-digit reward percentages (cited around 2,190% to 4,380%) are as referenced to us and as displayed dynamically on the project's revenue-share launchpad page, which we could not independently verify from a neutral source, and the project self-labels as a memecoin. Figures are as of June 2026; on-chain yields move fast and many of these change daily, so verify before acting.

This analysis is informational only and does not constitute investment advice.
