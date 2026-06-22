# What a Delta-Neutral Metals Position Actually Earns

*The hedged-carry trade applied to metals: how shorting a perp against tokenized bullion turns price direction into yield, why metals-perp funding has been worth harvesting, and the capacity ceiling nobody talks about.*

By **Hedgents Research**

---

**TL;DR.** A delta-neutral metals position holds tokenized metal long and shorts an equal-notional metals perpetual against it, so the price bet cancels and what is left is the funding the perp pays. On Hyperliquid's builder-deployed commodity markets (gold and silver perps via the trade.xyz DEX), that funding has been positive enough, on a recent realized basis, to harvest a net carry in the rough range of **5 to 8% on gold and silver**. The catch is capacity: platinum and palladium perps are capped at $25m of open interest each versus $500m for gold and silver, so a real hedge stays gold-plus-silver and does not scale to large AUM without funding compressing. Almost no on-chain metals product hedges at all. They are all directional longs. This is the structure behind a hedged-carry tranche, and it is early: ours is a paper hedge on devnet with no live-capital track record.

---

## What "delta-neutral" actually means

Delta is sensitivity to price. A long position in one ounce of gold has a delta of roughly +1: gold rises a dollar, you make a dollar. A short position in one ounce of gold perpetual futures has a delta of roughly -1. Hold both at equal notional and the deltas cancel. Gold can rip to $5,000 or crater to $2,000 and, to a first approximation, your mark-to-market does not move, because every dollar gained on the metal is a dollar lost on the perp, and vice versa.

That sounds pointless until you ask what you are still exposed to once direction is gone. The answer is the funding rate. A perpetual future has no expiry, so unlike a dated contract it never mechanically converges to spot. Exchanges force that convergence with a periodic cash payment between the two sides, called funding. When the perp trades above the underlying (the usual state in an asset people are eager to be long), funding is positive and longs pay shorts. ([Coinbase](https://www.coinbase.com/learn/perpetual-futures/understanding-funding-rates-in-perpetual-futures), [BitMEX](https://www.bitmex.com/blog/what-are-perpetual-futures))

A delta-neutral position is short the perp, so in the normal positive-funding regime you are on the receiving end: you hold the metal, short its perp against it, the price bet washes out, and you collect funding for as long as the regime holds. In TradFi this is the cash-and-carry trade. In crypto it is usually called basis or funding-rate carry, and it is the most common way to turn a directional asset into a yield instrument without betting on where it goes. ([Kraken](https://www.kraken.com/learn/trading/perpetual-futures-contracts))

## How perp funding is actually computed, and why metals funding is positive but not crazy

Funding is not a single fixed number. On Hyperliquid, which hosts the metals perps in question, the rate has two parts: an interest-rate component plus a premium that floats with how far the perp trades from its oracle price. Funding is paid every hour, settled peer to peer (the exchange takes no cut), and capped at 4% per hour. ([Hyperliquid docs](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/funding))

The metals perps do not live on Hyperliquid's core order books. They are listed through HIP-3, the permissionless framework that lets a builder stake HYPE and deploy its own perp markets with its own oracles. Commodity perps launched this way on October 13, 2025, and the dominant builder is trade.xyz, which runs gold, silver, platinum, palladium, copper, and oil markets and accounts for the large majority of HIP-3 open interest. ([CoinGecko](https://www.coingecko.com/learn/hyperliquid-hip3-hip4-tokenized-stocks-and-prediction-markets), [trade.xyz docs](https://docs.trade.xyz/consolidated-resources/specification-index))

<!--WAITLIST-->

Here is the detail that matters for a carry harvester, and it is easy to miss. trade.xyz applies a 0.5x multiplier to Hyperliquid's baseline funding formula, deliberately. The stated reason is to make funding reflect the carry cost of a traditional asset rather than a crypto asset. Hyperliquid's default interest-rate component annualizes to about 11%, which is sensible for borrowing dollars against a volatile crypto long but absurd for gold. Halving it brings the baseline to roughly 5.5% annualized, which the docs describe as closer to SOFR plus 1 to 2%, the real-world cost of carrying bullion. ([trade.xyz docs](https://docs.trade.xyz/perp-mechanics/funding))

That single design choice is why metals-perp funding has been positive and harvestable without being a casino. The baseline sits near a real money-market rate, then the premium pushes it up when demand to be long metals runs hot (the second half of 2025 into 2026 was exactly that, with investors crowding into gold and silver as a macro hedge) and pulls it down or briefly negative when the crowd thins. A delta-neutral short captures the baseline plus whatever the premium adds, net of perp trading fees and the borrow on the tokenized-metal leg. On gold and silver, on a recent realized basis, that has netted out to roughly **5 to 8%**. That is an observed range on the funding mechanism, not a promise. Funding is a market price and it moves.

## Why the hedge stays gold and silver: the capacity ceiling

The seductive next thought is "if 5 to 8% on gold and silver, then do it across all four metals and across a billion dollars." Both halves of that are wrong, and the reason is open interest.

trade.xyz publishes per-market open-interest caps, and they are not uniform. Gold and silver each carry a $500m cap, run on cross margin, with a tight ±4% discovery bound. Platinum and palladium each carry a $25m cap, twenty times smaller, run on the more restrictive isolated margin, with a wider ±5% bound. ([trade.xyz docs](https://docs.trade.xyz/consolidated-resources/specification-index)) That is the platform telling you, in its own risk parameters, where the liquidity is. You can put a meaningful short on gold or silver. You cannot short platinum or palladium at size without becoming the market and watching your own hedge move the price against you. A four-metal index can be held long across all four, because spot bullion is deep. The hedge against it cannot. A real hedge stays gold-plus-silver, and the platinum and palladium legs run unhedged, directional, by necessity.

The same constraint caps how big the trade can get even on gold and silver. Funding is the price of a crowded long: the carry exists precisely because more capital wants to be long the metal than short it. Every dollar of delta-neutral short you add is a dollar of supply on the short side, which nudges the premium down and lowers funding for everyone including you. At small size this is invisible. At a size that starts to matter against a $500m cap and the live open interest underneath it (the gold perp has at times shown well under $100m of open interest against that cap), your own flow compresses the very yield you came for. The honest framing is that the carry is real, the capacity is finite, and anyone promising both a high yield and unlimited scale is promising something the order book will not deliver.

## Why almost no on-chain metals product hedges at all

Here is the strange part. With a clean, well-understood way to turn metals into yield sitting right there, essentially every tokenized-metals product on-chain is an unhedged directional long. PAXG, XAUT, XAUM, Oro, the Remora single-metal tokens, Ondo's wrapped ETFs: all of them hand you price exposure to bullion and nothing else. None of them shorts a perp against the inventory. None of them is delta-neutral.

There are honest reasons. Issuing allocated, custodied, attested metal is a custody-and-compliance business, and bolting a derivatives desk onto it is a different business with different counterparties and different regulatory questions. A token that is "one ounce in a vault" is simple to verify and redeem. A token that is "one ounce in a vault, minus a perp short on a builder-deployed DEX, marked hourly" is not. So the supply side built the easy, valuable thing (deep, redeemable, regulated spot inventory) and left the harder thing unbuilt.

That gap is the whole point. The tokenized-metals issuers are not competitors to a hedged product. They are its supply rail, the spot inventory the long leg is sourced from, and the more of them there are, the deeper and more substitutable that rail becomes.

## The honest caveats

Delta-neutral is not risk-free, and saying otherwise is how people blow up. You trade price risk for funding-regime risk. Funding can compress toward zero when the long crowd thins, and it can invert (shorts pay longs) in a selloff or a backwardated market, at which point the carry turns into a cost until you unwind. The short leg is leveraged and carries liquidation and margin risk on a sharp move, even though the spot leg offsets the economics. There is execution and rebalancing slippage, basis risk between the tokenized-metal oracle and the perp oracle, and venue risk in concentrating the hedge on a single perp platform. Independent write-ups of crypto basis trades are blunt that "market neutral does not mean risk-free": even a well-run version carries execution, model, liquidity, and counterparty risk that cannot be fully eliminated, and a poorly managed one can lose money in a stress event despite being nominally neutral. ([SparkCore](https://sparkcore.fund/blog/delta-neutral-crypto-strategies-explained)) The carry is a regime, not a coupon.

And our own status is the most important caveat. The hedged-carry structure we are describing is, today, a **paper (simulated) hedge running on Solana devnet**. There is no live-capital track record. Any yield it implies is a design target computed against simulated funding, not a realized return on deployed money. We would rather say that plainly than dress a devnet demo as a fund.

## Where this lands

Strip the jargon and the trade is one sentence: hold the metal, short its perp at equal size, and get paid the funding instead of betting on the price. That is the engine behind a hedged-carry product, and behind the two-sided design we have written about before, where the hedged basket splits into a senior piece that wants a steady coupon and a junior piece that takes the leverage and the variability. We are deliberately not putting hard tranche numbers on those here, because the yield is a market-driven, capacity-bounded carry on a paper hedge, not a fixed rate.

The carry is gold-and-silver shaped, finite in size, volatile in time, and almost completely unbuilt on-chain. We are building into that gap as **hgMETAL**: an oracle-free, in-kind, actively-managed four-metal index, with a separate hedged-carry structure layered on the gold-plus-silver portion where the perp liquidity actually exists. All of it is live on Solana devnet today with a paper hedge and no live-capital track record. If you want to see the mechanics rather than read about them, the demo is at **terminal.hedgents.com**.

---

## Methodology and sources

Funding-rate mechanics, the hourly settlement, and the 4%/hour cap are from the [Hyperliquid funding documentation](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/funding). The 0.5x funding multiplier, the ~11% to ~5.5% annualized baseline adjustment, and the SOFR-plus-1-to-2% framing are from the [trade.xyz funding docs](https://docs.trade.xyz/perp-mechanics/funding). Per-market open-interest caps ($500m gold and silver versus $25m platinum and palladium), margin modes, oracle pairs, and discovery bounds are from the [trade.xyz specification index](https://docs.trade.xyz/consolidated-resources/specification-index). HIP-3's October 13, 2025 commodity launch and trade.xyz's share of HIP-3 open interest are from [CoinGecko](https://www.coingecko.com/learn/hyperliquid-hip3-hip4-tokenized-stocks-and-prediction-markets) and [CoinMarketCap](https://coinmarketcap.com/academy/article/hyperliquid-hip-3-open-interest-hits-dollar790m-all-time-high). Delta-neutral, cash-and-carry, and basis-trade mechanics draw on [Coinbase](https://www.coinbase.com/learn/perpetual-futures/understanding-funding-rates-in-perpetual-futures), [BitMEX](https://www.bitmex.com/blog/what-are-perpetual-futures), [Kraken](https://www.kraken.com/learn/trading/perpetual-futures-contracts), and [SparkCore](https://sparkcore.fund/blog/delta-neutral-crypto-strategies-explained).

The ~5 to 8% net carry on gold and silver is a recent-realized range on the funding mechanism described above, not a forward promise; funding is a market price and can compress or invert. The live gold-perp open interest figure (well under $100m against the $500m cap) reflects a point-in-time observation and moves continuously. Figures are as of June 2026. Verify before acting.

This analysis is informational only and does not constitute investment advice.
