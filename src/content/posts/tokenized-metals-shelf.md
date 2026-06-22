# The Tokenized-Metals Shelf Is Crowded. The Index On Top Of It Is Empty.

*A market-structure look at on-chain metals: why gold tokens fragmented, what TradFi tells us comes next, and the one layer nobody has built yet.*

By **Hedgents Research**

---

**TL;DR.** A buyer searching for tokenized gold on Solana in mid-2026 finds four distinct assets: PAXG (Wormhole-bridged), XAUT (as XAUT0 via LayerZero), XAUM, and Oro $GOLD. That is the natural structure for a tokenized commodity, and it mirrors TradFi's gold ETF market, which has stayed fragmented across a dozen products for over two decades. The same pattern is now spreading across the rest of the metals complex. Understanding why fragmentation persists, and what it costs a buyer who concentrates in one token, points directly at the layer that is still missing.

---

## The current landscape

Four tokenized gold assets are live or actively bridged on Solana as of mid-2026:

| Asset | Issuer | Custody | Regulator | Attestation cadence | Solana presence |
|---|---|---|---|---|---|
| **PAXG** | Paxos Trust Company | Brinks, London | NYDFS plus OCC oversight (USA) | Monthly attestation by KPMG (since Feb 2025) | Bridged from Ethereum via Wormhole ("Paxos Gold (Wormhole)") |
| **XAUT / XAUT0** | TG Commodities (Tether) | Swiss vaulting | Swiss vaulting, no single prudential regulator | Quarterly (BDO Italia, ISAE 3000) | XAUT0 via LayerZero (Oct 2025) |
| **XAUM** | Matrixdock (Matrixport) | LBMA ecosystem: Heraeus, Metalor, Brinks, Malca-Amit | Singapore / APAC custody | Monthly vault statements (on-chain) | Added Solana, Feb 2026 |
| **Oro $GOLD** | Oro Finance | Brinks-tier, GD-certified custody | UAE / Dubai (DMCC-tier GD custody) | Quarterly RSM attestation | Solana-native, small (~$3M TVL, Feb 2026) |

One clarification, because the confusion is common: on Solana there is no separate "kPAXG" gold token. The bridged asset is "Paxos Gold (Wormhole)," and the "k" prefix you may see is Kamino's LP-receipt naming convention, not a different wrapper. It is the same PAXG. The real distinct count is four, and Oro $GOLD belongs on the list as a small Solana-native entrant, not as a peer to PAXG or XAUT in size.

The money behind this is real. Tokenized-gold spot trading reached **$90.7B in Q1 2026**. Total tokenized gold sits at roughly **$5B** (CoinGecko tokenized-gold category, June 2026), down from a peak near $6B in mid-February 2026 after the March gold selloff. XAUT's reserves peaked near **$3.3B in Q1 2026** (about a 36% quarterly rise) and have eased to roughly **$2.55B** since. These are meaningful numbers. Yet a buyer's first question, *which one should I hold?*, still has no clean answer.

---

## Why so many? Three structural reasons

**1. Tokenization is mechanically easy.** Shipping a tokenized gold product needs a regulated custodian, a regulatory wrapper, an audit firm, a 1:1 mint-and-redeem contract, and a listing. A well-capitalized team can do this in three to six months. The smart contracts are commodity engineering, with no novel cryptography and no novel mechanism design. Contrast stablecoins, where network-effect lock-in (Circle's clearance rails, Tether's exchange dominance) drove 90%+ share into two tokens. Gold has no equivalent lock-in, because gold is not a settlement currency. Nothing forces convergence to a single token.

**2. Each issuer has a different distribution thesis.** Paxos sells NYDFS-and-OCC regulation and institutional trust to compliance-sensitive buyers. Tether sells reach: USDT rails and exchange ubiquity, the gold equivalent of its stablecoin. Matrixdock sells APAC custody and LBMA branding to buyers who prefer regional vaulting. Oro sells Solana-native settlement (no bridge) to crypto-native users. Each thesis is defensible. None has won the category, because they are not all chasing the same customer.

**3. Gold has multiple legitimate representations.** Every USDC token is fungible with every other USDC token, so stablecoins collapse to a winner. Gold does not work that way. The same ounce can be tokenized in different vaults (London, Singapore, UAE), under different regulators (NYDFS, MAS, DMCC), with different attestation cadences, with different redemption rights, and with different liquidity depth across chains. Those are not cosmetic differences. A US-regulated DAO treasury reasonably treats PAXG (NYDFS, monthly KPMG attestation) differently than a Singapore fund treats XAUM (LBMA custody, Singapore-based). Both are choosing rationally for their context.

---

## The TradFi parallel: gold ETFs have stayed fragmented for over two decades

The standard objection to fragmentation is that the market will eventually consolidate to one or two winners, the way USDC and USDT did. The TradFi gold ETF market says otherwise.

| TradFi gold ETF | AUM (June 2026) | Expense ratio | Launched |
|---|---|---|---|
| GLD (SPDR) | ~$140B | 0.40% | 2004 |
| IAU (iShares) | ~$70B | 0.25% | 2005 |
| GLDM (SPDR Mini) | ~$30B | 0.10% | 2018 |
| SGOL (abrdn) | ~$7.3B | 0.17% | 2009 |
| BAR (GraniteShares) | ~$1B | 0.17% | 2017 |
| AAAU, OUNZ, IAUM and others | smaller | variable | various |

US-listed gold ETF AUM is roughly **$250B**, with GLD and IAU alone near **$210B**; global gold ETF AUM is around **$600B** (World Gold Council, May 2026). GLD and IAU together hold roughly 70-75% of the US total, and the remainder, still large in dollar terms, splits across a long tail of smaller funds.

That structure has not dissolved in the more than two decades since GLD launched (November 2004). It settled into a durable shape: two giants plus a long tail, each serving a different segment. There is no obvious reason on-chain gold should behave differently. The underlying drivers are the same: multiple custody jurisdictions, multiple wrappers, different fee structures, different liquidity preferences. Expect Solana's tokenized-metal market in 2030 to resemble the gold ETF market today, not a single winner.

---

<!--WAITLIST-->

## What concentrating in one token costs

If fragmentation is permanent, single-token concentration carries a real, stackable cost. An allocator holding 100% in one issuer holds 100% of the exposure to that issuer's failure modes: custodian or operational failure, regulatory action against the issuer, a mint-and-redeem contract exploit, a bridge exploit (relevant for any bridged variant), or a sovereign action against the custody jurisdiction. The same single position also concentrates liquidity (one token's DEX depth sets your exit slippage), concentrates geography and regulatory regime, and pushes all the monitoring onto you: attestations, regulator actions, bridge security, and depeg spreads, multiplied by every token you would need to hold to actually be diversified. Spreading across four or five issuers cuts per-failure exposure toward 20-25% and lets exits route to whichever underlying is deepest at the moment of need. None of that work produces alpha. It is pure risk management, and most holders never do it.

---

## The gap is narrower than it was, and it is no longer gold-only

Earlier this year, the aggregation niche looked wide open. It is narrower now, and honesty requires saying so. Since then, **Remora** launched five ETF-wrapped single-metal tokens on Solana (GLDr, SLVr, PPLTr, PALLr, CPERr), marketed together as the "$RMX / Rare Metals Index." **Ondo** has pushed past 400 tokenized assets. **Streamex** shipped GLDY's 24/7 Solana/Orca pool in May 2026. Tokenized metal exposure, across more than just gold, is now a crowded and well-funded shelf, though much of this new supply is accredited-only or non-US-restricted.

So the remaining gap has to be stated precisely. There is still no single, actively-managed, in-kind, multi-metal index on Solana. Remora's $RMX is five separate tokens under one brand, not one fungible basket SPL. Paxos and Tether issue directional single-asset longs on allocated metal; Ondo and Remora tokenize US metal ETFs (compliance-gated, not offered to US persons); Matrixdock vaults physical gold. None of them is an actively-managed basket, and none pairs that basket with a hedge.

This matters for how we read the field. These issuers are not competitors to pick a fight with. They are the **supply rail**: the regulated, custodied, attested inventory that any index or hedged product has to source its spot exposure from. The more of them there are, the deeper and more substitutable that rail becomes. That is good for whatever gets built on top.

---

## What is actually missing

The mature TradFi answer to ETF fragmentation is the index basket, and on-chain the case is stronger still: a single SPL token rebalances automatically, composes cleanly across DeFi, and spares the holder the cross-chain logistics of running five positions by hand. But aggregation alone is the easy half, and it is now partly addressed by branded single-metal bundles. The open layer on top of the supply rail is not passive aggregation. It is active management, in two flavors for two different buyers.

For the holder who wants the metal and the upside, the value is an **actively-managed, in-kind, multi-metal index**: risk-weighting across the metals, threshold-based rebalancing, volatility targeting, a deliberate gold-to-silver tilt, and sell discipline. That is a basket that decides, not a basket that merely holds. The edge is the management, not the aggregation.

For the holder who wants metals exposure without taking the price bet, the value is a **market-neutral hedged carry**: the long metal exposure paired with a hedge so the position is roughly delta-neutral, designed to earn from carry rather than from the direction of the metal. We are not putting hard numbers on that here, by design. It is early: any yield it implies is a design target on a paper hedge, on devnet, with no live-capital track record. We mention it only to name the second buyer.

And to be clear, this is a metals story, not a gold-only story. Silver is core to the basket, not a future teaser. Platinum and palladium round out a four-metal index (gold, silver, platinum, palladium; no copper). Gold is just the most familiar door into the room.

---

## The thesis, and what we are building

Tokenized metals on Solana have fragmented across single-asset longs and ETF wrappers: Paxos, Tether, Matrixdock, Ondo, Remora. What is still missing is an actively-managed, in-kind, multi-metal index with a hedged carry on top. That is what we are building.

It is called **hgMETAL**. It is an oracle-free, in-kind index across four metals, actively rebalanced, with no yield overlay on the index itself. The hedged carry is a separate structure: the metals basket hedged delta-neutral and tranched into hgUSD (a stable senior coupon) and hgYIELD (a levered junior), for the holder who wants exposure without the directional bet. All three are live today on Solana devnet with a paper (simulated) hedge. There is no live-capital track record yet. You can look at them here: **terminal.hedgents.com**.

---

## Methodology and sources

This article draws on public market-cap and volume data from CoinGecko, CoinMarketCap, and DefiLlama; each issuer's public custody, attestation, and regulatory disclosures (Paxos/KPMG, Tether/BDO Italia, Matrixdock, Oro Finance/RSM); World Gold Council gold-ETF AUM reporting (May 2026); and TradFi fund data from State Street, BlackRock, abrdn, and GraniteShares. Remora, Ondo, and Streamex product details are from their own public materials. Figures are as of June 2026; tokenized-metal markets move quickly, so verify before acting.

This analysis is informational only and does not constitute investment advice.
