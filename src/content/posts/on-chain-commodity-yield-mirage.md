# The On-Chain Commodity-Yield Mirage: What Is Real and What Is Theater

*Four things on-chain call themselves "metals yield." Only one of them is actually paid by the metal. Here is how to tell them apart.*

By **Hedgents Research**

---

**TL;DR.** Search "yield" on tokenized metals and the numbers run from 1% to over 2,000%. They are not the same kind of number, and most of them are lying. Four buckets. One: token emissions dressed as APY. Theater. Two: lending and LP yield on tokenized metal. Real, small, capacity-capped. Three: T-bill yield on a dollar leg parked next to the gold. Real, but that is rate yield wearing a metals label. Four: market-neutral funding carry off metals perpetuals, recently around 5-8% net on gold and silver. That last one is the only source structurally paid by the metal. The field test: a yield number with no hedge and no named funding source behind it is emissions, not income.

---

## "Yield on gold" should make you suspicious

Gold pays no coupon. Neither does silver, platinum, or palladium. A bar in a vault throws off no cash. It can appreciate, it can sit there, and that is the whole list. This is exactly why gold is a store of value and not an income asset.

So when a product offers "yield on gold," the question is never *how much*. It is *paid by whom, out of what*. Every honest yield has someone on the other side who is worse off for paying it. A borrower paying interest. A trader paying funding. A fund passing through bond coupons. Name that someone or the "yield" is a fee rebate, a marketing subsidy, or freshly printed tokens. The metal is not paying you. Something else is, or nothing is.

That one test sorts the whole on-chain metals-yield universe. Four buckets, worst to best.

## Bucket 1: Emissions theater

The loudest bucket and the emptiest. A token launches, advertises a spectacular APY for holding it, and pays that "yield" in more of its own token. The number gets enormous because it is denominated in a thing the issuer prints at will. A 2,000% APY funded by inflating the token's own supply is not a return. It is a dilution schedule in a yield costume.

The poster child lives on Solana as "$RMX / Rare Metals Index," which wraps Remora's tokenized single-metal ETFs (GLDr, SLVr, PPLTr, PALLr, CPERr) and has advertised holder rewards in the thousands of percent: around 2,190% on the gold sleeve, up to roughly 4,380% on copper. We could not verify those exact figures from a neutral source. They render dynamically on the project's revenue-share launchpad page. The same project's site now carries the line "This is a memecoin. Not financial advice." That disclaimer is the most honest number on the page.

The tell holds no matter what the figure is. These rewards come from a revenue-share launchpad, not from the metal and not from any outside payer. The launchpad routes token fees and freshly minted supply back to holders and calls it APY. Pay the yield in the same token whose price it is meant to lift and you are not earning on metals. You are getting a bigger slice of a pie being baked bigger to hand to you. Annualize a token-emission rate and four-digit numbers fall out mechanically. The metal underneath is fine: real, ETF-wrapped, custodied. The yield bolted on top is theater.

<!--WAITLIST-->

## Bucket 2: Lending and LP yield

Genuine income, and honest about its own modest size. Tokenized gold like PAXG plugs into DeFi money markets and AMMs (Aave, Compound, Uniswap, the usual). You lend it to borrowers, or you provide it as one leg of a pool. The counterparty is named and real: a borrower paying interest, or traders paying swap fees.

The rates are thin and so is the capacity. Aggregators put PAXG lending and CeDeFi staking around 3-8% APY depending on demand, and gold-pair LP anywhere from about 1% to low-double-digits depending on volume, most of 2026 clustering in low-to-mid single digits. That tracks the off-chain reality. Physical gold lease rates sit low by nature, low-single-digit normally and near zero when things are calm, because almost nobody needs to borrow gold. Nobody borrows a bar to build a factory. Rates can spike when bullion is tight, and some 2026 commentary has flagged exactly that, but the base case for lending out a bar is roughly nothing. The on-chain rate runs above the lease rate mostly on DeFi borrowing demand and liquidity incentives, and incentives are bucket 1 in lighter makeup.

So: real income, but small, demand-constrained, and it does not scale. Send a lot of capital after it and the rate compresses toward the lease rate, which is near zero. Useful at the margin. Not a thesis.

## Bucket 3: T-bill yield on the dollar leg

The cleanest real yield in the room, and the most often mislabeled. Tokenized-Treasury products (Ondo's USDY and OUSG are the references) pay genuine income: short-duration US Treasuries and bank deposits, passed through on-chain. As of spring 2026, USDY was paying roughly 4.65% APY on around $740M of supply, and OUSG ran in the mid-single digits, with published figures landing in the ~3.4-4.5% range depending on source and trailing window. The counterparty is the US Treasury. About as real as yield gets.

Now notice what it is yield *on*. Dollars, not metal. When a structured metals product says "earn yield while holding gold," the yield usually comes from a T-bill-backed dollar leg parked beside the gold, not from the gold. Fine product, often a sensible one, as long as you read it correctly: you are stacking US-rate income onto a metals position, not pulling income out of the metal. Rates fall, that yield falls with them, and none of it has anything to do with gold, silver, platinum, or palladium. It is the risk-free rate in a wrapper. Real. Just not metals yield, whatever the marketing says.

## Bucket 4: Market-neutral funding carry

The one source on the list that is both real income and actually a function of the metal: carry from a delta-neutral long-spot / short-perpetual position.

It is the cash-and-carry trade everyone knows from crypto, pointed at metals. Hold the metal long (tokenized spot), short an equal notional of the metal perpetual. The two price exposures cancel, so you are roughly delta-neutral and indifferent to which way the metal goes. What you keep is the funding rate, the periodic payment perp longs hand to shorts when the perp trades above spot. Metals perps, like crypto perps, sit in mild contango with persistent long demand, so the short side gets paid to carry. The payer has a name: leveraged longs who want metals exposure without posting full spot.

Same engine that runs the delta-neutral "yield" stablecoins, where realized funding has averaged around 11% across a full cycle, negative in bears, well above that in bulls, with the cooler 2026 stretch settling into high single digits. Metals funding is its own market, thinner and calmer than the crypto majors, which trims the upside and the blow-up risk in the same stroke. On a recent realized basis, the market-neutral carry on tokenized gold and silver has run roughly **5-8% net**, after fees and after the stretches when funding goes flat or negative. Gold and silver, and on purpose. Platinum and palladium perps have thin open interest, so the hedge cannot run them at size. The honest carry today is a gold-and-silver story.

Two things keep it honest. It is not free money. Funding can flip negative, the basis drifts, and the short leg has to be managed and sometimes defended. A harvested spread, not a coupon. And an annualized figure off one good week is worthless. The only number worth quoting is realized, net, over a window that includes the bad weeks. Which is why we say 5-8% realized and not an annualized snapshot off a hot Tuesday.

## The rule

Line the four buckets up and one diagnostic does the work. Real metals-linked yield always has a named payer:

- Lending/LP: borrowers and traders pay. Capacity is small.
- T-bill leg: the Treasury pays. Dollar yield, not metals yield.
- Funding carry: leveraged perp longs pay, and the position is hedged delta-neutral, so the income is not disguised price risk.

Emissions theater has no payer and no hedge. Just a token being printed and annualized into a headline. The field test is blunt: **a metals "yield" with no hedge and no funding source named behind it is emissions, not income.** Four-digit APY? Emissions, no further questions. Single-digit but the issuer cannot tell you who pays it out of what? Same answer until proven otherwise.

## Where this leaves us, and what we are building

Emissions tokens are not evil. Some are honest memecoins that say so on the tin. The problem is the phrase "metals yield," which does a lot of dishonest work on-chain. Of the four sources, exactly one is structurally a yield on the metal rather than a yield on dollars or a yield on inflation: the market-neutral funding carry, roughly 5-8% net realized on hedged gold and silver.

That carry is what we are after. **hgMETAL** is our oracle-free, in-kind, actively-managed index across four metals (gold, silver, platinum, palladium; no copper, no yield overlay on the index itself). Alongside it we run a hedged-carry structure: the metals basket hedged delta-neutral so the position earns from funding instead of from where the metal goes. The carry comes from metals-perp funding on Hyperliquid, which is why the hedge runs deep on gold and silver and not on platinum and palladium.

Now the stage, plainly, since this whole piece is about not overclaiming. hgMETAL is live on Solana devnet with a paper (simulated) hedge. No live-capital track record yet. The 5-8% is the carry that exists in the world, not a promised return on our product, and anything past it is a design target on a paper hedge until real capital and real fills prove it. We bring it up only because, this far in, you can see it for what it is: the one number in the metals-yield universe with a real payer behind it. The devnet build is at **terminal.hedgents.com**.

---

## Methodology and sources

Funding-carry and delta-neutral mechanics, and the realized-yield ranges for cash-and-carry strategies, draw on public explainers and historical funding data (Hyperliquid funding documentation; delta-neutral / cash-and-carry guides; published realized-yield ranges for funding-based stablecoins, where full-cycle averages have run near 11% with wide swings). Tokenized-Treasury yields are from Ondo's public figures and third-party trackers (USDY ~4.65% APY on ~$740M supply, spring 2026; OUSG in the mid-single digits, with published figures ranging ~3.4-4.5% across sources and trailing windows). Tokenized-gold lending and LP ranges are from public DeFi yield aggregators (PAXG lending/CeDeFi spanning roughly 0.01% to 12% across platforms, clustering ~3-8%; gold-pair LP ~1% to low-double-digits), cross-checked against the structurally low level of physical gold lease rates (normally low-single-digit and historically near zero, though no longer published transparently since the LBMA discontinued GOFO data in 2015, and reportedly tighter in some of 2026). Remora / $RMX product scope (GLDr, SLVr, PPLTr, PALLr, CPERr) is from the project's own materials; the four-digit reward percentages (cited around 2,190% to 4,380%) are as referenced to us and as displayed dynamically on the project's revenue-share launchpad page, which we could not independently verify from a neutral source, and the project self-labels as a memecoin. Figures are as of June 2026; on-chain yields move fast and many of these change daily, so verify before acting.

This analysis is informational only and does not constitute investment advice.
