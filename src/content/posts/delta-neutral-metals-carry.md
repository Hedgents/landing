# What a Delta-Neutral Metals Position Actually Earns

*Almost every tokenized metal on-chain is a naked long. There is a known way to get paid for holding bullion instead of guessing where the price goes. It runs into a wall, and nobody selling it wants to talk about the wall.*

By **Hedgents Research**

---

**TL;DR.** A delta-neutral metals position holds tokenized metal long and shorts an equal-notional metals perpetual against it. The price bet cancels. What is left is the funding the perp pays. On Hyperliquid's builder-deployed commodity markets (gold and silver perps via the trade.xyz DEX), that funding has been positive enough, on a recent realized basis, to net a carry in the rough range of **5 to 8% on gold and silver**. Then you hit capacity. Platinum and palladium perps are capped at $25m of open interest each against $500m for gold and silver, so a real hedge stays gold-plus-silver and does not scale to large AUM without funding compressing. Almost no on-chain metals product hedges at all. They are directional longs, all of them. This is the structure behind a hedged-carry tranche, and it is early: ours is a paper hedge on devnet with no live-capital track record.

---

## What "delta-neutral" actually means

You have seen the phrase stapled to degen vaults that were one bad funding flip away from zero. Here is the real version.

Delta is sensitivity to price. A long position in one ounce of gold has a delta of roughly +1: gold rises a dollar, you make a dollar. A short position in one ounce of gold perpetual futures has a delta of roughly -1. Hold both at equal notional and they cancel. Gold can rip to $5,000 or crater to $2,000 and your mark-to-market barely moves, because every dollar gained on the metal is a dollar lost on the perp.

So what are you exposed to once direction is gone? The funding rate. A perpetual future has no expiry, so unlike a dated contract it never mechanically converges to spot. Exchanges force that convergence with a periodic cash payment between the two sides, called funding. When the perp trades above the underlying, which is the usual state in an asset people are eager to be long, funding is positive and longs pay shorts. ([Coinbase](https://www.coinbase.com/learn/perpetual-futures/understanding-funding-rates-in-perpetual-futures), [BitMEX](https://www.bitmex.com/blog/what-are-perpetual-futures))

A delta-neutral position is short the perp. In the normal positive-funding regime you are on the receiving end. You hold the metal, short its perp against it, the price bet washes out, and you collect funding for as long as the regime holds. TradFi calls this cash-and-carry. Crypto calls it basis or funding-rate carry. It is the most common way to turn a directional asset into a yield instrument without betting on where it goes. ([Kraken](https://www.kraken.com/learn/trading/perpetual-futures-contracts))

## How perp funding is computed, and why metals funding is positive but not crazy

Funding is not one fixed number. On Hyperliquid, which hosts the metals perps in question, the rate has two parts: an interest-rate component plus a premium that floats with how far the perp trades from its oracle price. It is paid every hour, settled peer to peer with the exchange taking no cut, and capped at 4% per hour. ([Hyperliquid docs](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/funding))

The metals perps do not live on Hyperliquid's core order books. They are listed through HIP-3, the permissionless framework that lets a builder stake HYPE and deploy its own perp markets with its own oracles. Commodity perps launched this way on October 13, 2025. The dominant builder is trade.xyz, which runs gold, silver, platinum, palladium, copper, and oil markets and accounts for the large majority of HIP-3 open interest. ([CoinGecko](https://www.coingecko.com/learn/hyperliquid-hip3-hip4-tokenized-stocks-and-prediction-markets), [trade.xyz docs](https://docs.trade.xyz/consolidated-resources/specification-index))

<!--WAITLIST-->

Now the detail that decides whether the carry is real. trade.xyz applies a 0.5x multiplier to Hyperliquid's baseline funding formula, on purpose. The stated reason: make funding reflect the carry cost of a traditional asset rather than a crypto one. Hyperliquid's default interest-rate component annualizes to about 11%, which is sensible for borrowing dollars against a volatile crypto long and absurd for gold. Halving it brings the baseline to roughly 5.5% annualized, which the docs put near SOFR plus 1 to 2%, the real-world cost of carrying bullion. ([trade.xyz docs](https://docs.trade.xyz/perp-mechanics/funding))

That one design choice is why metals-perp funding has been positive and harvestable without being a casino. The baseline sits near a real money-market rate. The premium pushes it up when demand to be long metals runs hot, which describes the second half of 2025 into 2026 as investors crowded into gold and silver as a macro hedge, and pulls it down or briefly negative when the crowd thins. A delta-neutral short captures the baseline plus whatever the premium adds, net of perp trading fees and the borrow on the tokenized-metal leg. On gold and silver, recently, that has netted out to roughly **5 to 8%**. Observed range on the funding mechanism, not a promise. Funding is a market price and it moves.

## Why the hedge stays gold and silver: the capacity ceiling

You cannot short platinum or palladium at size without becoming the market and watching your own hedge move the price against you. That is the ceiling. Everything else in this section is the arithmetic behind it.

The seductive next thought after "5 to 8% on gold and silver" is "so do it across all four metals and across a billion dollars." Both halves are wrong, and the reason is open interest.

trade.xyz publishes per-market open-interest caps, and they are not uniform. Gold and silver each carry a $500m cap, run on cross margin, with a tight ±4% discovery bound. Platinum and palladium each carry a $25m cap, twenty times smaller, run on the more restrictive isolated margin, with a wider ±5% bound. ([trade.xyz docs](https://docs.trade.xyz/consolidated-resources/specification-index)) That is the platform telling you, in its own risk parameters, where the liquidity is. You can put a meaningful short on gold or silver. You cannot on platinum or palladium. A four-metal index can be held long across all four, because spot bullion is deep. The hedge against it cannot. So a real hedge stays gold-plus-silver, and the platinum and palladium legs run unhedged and directional, by necessity.

The same constraint caps the trade even on gold and silver. Funding is the price of a crowded long. The carry exists because more capital wants to be long the metal than short it. Every dollar of delta-neutral short you add is a dollar of supply on the short side, which nudges the premium down and lowers funding for everyone, you included. At small size, invisible. At a size that starts to matter against a $500m cap and the live open interest underneath it (the gold perp has at times shown well under $100m of open interest against that cap), your own flow eats the yield you came for. Anyone selling you both a high yield and unlimited scale is selling something the order book will not deliver.

## Why almost no on-chain metals product hedges at all

Strange, given the clean way to turn metals into yield sitting right there: essentially every tokenized-metals product on-chain is an unhedged directional long. PAXG, XAUT, XAUM, Oro, the Remora single-metal tokens, Ondo's wrapped ETFs. All of them hand you price exposure to bullion and nothing else. Not one shorts a perp against the inventory.

There are honest reasons. Issuing allocated, custodied, attested metal is a custody-and-compliance business, and bolting a derivatives desk onto it is a different business with different counterparties and different regulatory questions. A token that is "one ounce in a vault" is simple to verify and redeem. A token that is "one ounce in a vault, minus a perp short on a builder-deployed DEX, marked hourly" is not. So the supply side built the easy, valuable thing and left the harder thing unbuilt.

That gap is the whole point. The tokenized-metals issuers are not competitors to a hedged product. They are its supply rail, the spot inventory the long leg is sourced from, and the more of them there are, the deeper that rail gets.

## The honest caveats

Delta-neutral is not risk-free, and pretending otherwise is how people blow up. You trade price risk for funding-regime risk. Funding can compress toward zero when the long crowd thins. It can invert, shorts paying longs, in a selloff or a backwardated market, at which point the carry becomes a cost until you unwind. The short leg is leveraged and carries liquidation and margin risk on a sharp move, even though the spot leg offsets the economics. Add execution slippage, basis risk between the tokenized-metal oracle and the perp oracle, and the venue risk of putting your whole hedge on one perp platform. Independent write-ups of crypto basis trades are blunt that market neutral does not mean risk-free: even a well-run version carries execution, model, liquidity, and counterparty risk you cannot fully eliminate. ([SparkCore](https://sparkcore.fund/blog/delta-neutral-crypto-strategies-explained)) The carry is a regime, not a coupon.

Our own status is the caveat that matters most. The hedged-carry structure described here is, today, a **paper (simulated) hedge running on Solana devnet**. There is no live-capital track record. Any yield it implies is a design target computed against simulated funding, not a realized return on deployed money. We would rather say that plainly than dress a devnet demo as a fund.

## Where this lands

The trade is one sentence: hold the metal, short its perp at equal size, get paid the funding instead of betting on the price. That is the engine behind a hedged-carry product, and behind the two-sided design we have written about before, where the hedged basket splits into a senior piece that wants a steady coupon and a junior piece that takes the leverage and the swings. We are not putting hard tranche numbers on those here. The yield is a capacity-bounded market carry on a paper hedge, and quoting a fixed rate against it would be a lie.

The carry is gold-and-silver shaped. It is finite. It is volatile in time, and almost completely unbuilt on-chain. We are building into that gap as **hgMETAL**: an oracle-free, in-kind, actively-managed four-metal index, with a hedged-carry structure layered on the gold-plus-silver portion where the perp liquidity actually exists. Live on Solana devnet today, paper hedge, no live-capital track record. To see the mechanics rather than read about them, the demo is at **terminal.hedgents.com**.

---

## Methodology and sources

Funding-rate mechanics, the hourly settlement, and the 4%/hour cap are from the [Hyperliquid funding documentation](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/funding). The 0.5x funding multiplier, the ~11% to ~5.5% annualized baseline adjustment, and the SOFR-plus-1-to-2% framing are from the [trade.xyz funding docs](https://docs.trade.xyz/perp-mechanics/funding). Per-market open-interest caps ($500m gold and silver versus $25m platinum and palladium), margin modes, oracle pairs, and discovery bounds are from the [trade.xyz specification index](https://docs.trade.xyz/consolidated-resources/specification-index). HIP-3's October 13, 2025 commodity launch and trade.xyz's share of HIP-3 open interest are from [CoinGecko](https://www.coingecko.com/learn/hyperliquid-hip3-hip4-tokenized-stocks-and-prediction-markets) and [CoinMarketCap](https://coinmarketcap.com/academy/article/hyperliquid-hip-3-open-interest-hits-dollar790m-all-time-high). Delta-neutral, cash-and-carry, and basis-trade mechanics draw on [Coinbase](https://www.coinbase.com/learn/perpetual-futures/understanding-funding-rates-in-perpetual-futures), [BitMEX](https://www.bitmex.com/blog/what-are-perpetual-futures), [Kraken](https://www.kraken.com/learn/trading/perpetual-futures-contracts), and [SparkCore](https://sparkcore.fund/blog/delta-neutral-crypto-strategies-explained).

The ~5 to 8% net carry on gold and silver is a recent-realized range on the funding mechanism described above, not a forward promise; funding is a market price and can compress or invert. The live gold-perp open interest figure (well under $100m against the $500m cap) reflects a point-in-time observation and moves continuously. Figures are as of June 2026. Verify before acting.

This analysis is informational only and does not constitute investment advice.
