# The Tokenized-Metals Shelf Is Crowded. The Index On Top Of It Is Empty.

*Gold tokens fragmented on purpose, the same way gold ETFs did, and that fragmentation is permanent. Here is what it costs the buyer who ignores it.*

By **Hedgents Research**

---

**TL;DR.** Fragmentation in tokenized gold is structural and here to stay. A buyer on Solana in mid-2026 faces four distinct assets: PAXG (Wormhole-bridged), XAUT (as XAUT0 via LayerZero), XAUM, and Oro $GOLD. That is the same shape TradFi's gold ETF market settled into and kept for twenty years. Concentrating in one token to dodge the mess is a quiet, unpriced bet on a single issuer's failure modes. The one square nobody has filled is an actively-managed, in-kind, multi-metal index. That is the interesting part of this board.

---

## The shelf today

Four tokenized gold assets are live or actively bridged on Solana as of mid-2026:

| Asset | Issuer | Custody | Regulator | Attestation cadence | Solana presence |
|---|---|---|---|---|---|
| **PAXG** | Paxos Trust Company | Brinks, London | NYDFS plus OCC oversight (USA) | Monthly attestation by KPMG (since Feb 2025) | Bridged from Ethereum via Wormhole ("Paxos Gold (Wormhole)") |
| **XAUT / XAUT0** | TG Commodities (Tether) | Swiss vaulting | Swiss vaulting, no single prudential regulator | Quarterly (BDO Italia, ISAE 3000) | XAUT0 via LayerZero (Oct 2025) |
| **XAUM** | Matrixdock (Matrixport) | LBMA ecosystem: Heraeus, Metalor, Brinks, Malca-Amit | Singapore / APAC custody | Monthly vault statements (on-chain) | Added Solana, Feb 2026 |
| **Oro $GOLD** | Oro Finance | Brinks-tier, GD-certified custody | UAE / Dubai (DMCC-tier GD custody) | Quarterly RSM attestation | Solana-native, small (~$3M TVL, Feb 2026) |

One clarification, because the confusion is common. On Solana there is no separate "kPAXG" gold token. The bridged asset is "Paxos Gold (Wormhole)," and the "k" prefix you may see is just Kamino's LP-receipt naming. Same PAXG. The real distinct count is four. Oro $GOLD makes the list as a small Solana-native entrant, not as a rival to PAXG or XAUT on size.

The money here is not theoretical. Tokenized-gold spot trading hit **$90.7B in Q1 2026**. Total tokenized gold sits near **$5B** (CoinGecko tokenized-gold category, June 2026), down from a peak around $6B in mid-February after the March selloff. XAUT's reserves peaked near **$3.3B in Q1 2026** (about a 36% quarterly rise) and have since eased to roughly **$2.55B**. Big numbers. And yet the buyer's first question, *which one do I hold?*, still has no clean answer.

---

## Why so many?

Tokenization is mechanically easy. To ship a tokenized gold product you need a regulated custodian, an audit firm, a 1:1 mint-and-redeem contract, and a listing. A well-capitalized team does that in three to six months. There is no novel cryptography and no clever mechanism design. It is commodity engineering.

Gold isn't a currency, so nothing forces it into one token. Stablecoins collapsed to two winners because of lock-in: Circle's clearance rails, Tether's exchange dominance, network effects that punish the third entrant. Gold has no such gravity. Nothing pulls the market toward convergence.

Then there is distribution. Each issuer is selling to a different buyer. Paxos sells NYDFS-and-OCC regulation to compliance-sensitive institutions. Tether sells reach, the USDT playbook applied to gold. Matrixdock sells APAC custody and LBMA branding to buyers who want regional vaulting. Oro sells bridge-free Solana-native settlement to crypto natives. Four theses, four customers, no overlap. So nobody wins, because nobody is fighting over the same buyer.

The deepest reason is that gold has many legitimate representations. The same ounce can sit in London, Singapore, or the UAE, under NYDFS, MAS, or DMCC, with different attestation cadences and different redemption rights. None of that is cosmetic. A US-regulated DAO treasury is right to treat PAXG (NYDFS, monthly KPMG attestation) differently from how a Singapore fund treats XAUM. Both are choosing correctly for where they sit.

---

## The TradFi tell: gold ETFs never consolidated

The reflexive objection is that this all converges eventually, the way USDC and USDT did. The gold ETF market is the counterexample, and it has had twenty years to converge.

| TradFi gold ETF | AUM (June 2026) | Expense ratio | Launched |
|---|---|---|---|
| GLD (SPDR) | ~$140B | 0.40% | 2004 |
| IAU (iShares) | ~$70B | 0.25% | 2005 |
| GLDM (SPDR Mini) | ~$30B | 0.10% | 2018 |
| SGOL (abrdn) | ~$7.3B | 0.17% | 2009 |
| BAR (GraniteShares) | ~$1B | 0.17% | 2017 |
| AAAU, OUNZ, IAUM and others | smaller | variable | various |

US-listed gold ETF AUM is roughly **$250B**, with GLD and IAU alone near **$210B**. Global gold ETF AUM runs around **$600B** (World Gold Council, May 2026). GLD and IAU hold maybe 70-75% of the US total. The rest, still enormous in dollar terms, scatters across a long tail.

That shape has held since GLD launched in November 2004. Two giants and a long tail, each serving a segment, stable for two decades. On-chain gold runs on the same drivers: many custody jurisdictions, many wrappers, varied fees, varied liquidity preferences. So Solana's tokenized-metal market in 2030 looks like the gold ETF market today, not a single winner. Bet accordingly.

---

<!--WAITLIST-->

## What concentrating in one token costs

Hold one token, own all of its ways of dying.

A 100% position in one issuer is 100% exposure to that issuer's failure modes. Custodian or operational failure. Regulatory action against the issuer. A mint-and-redeem exploit. A bridge exploit, if it's a bridged variant. A sovereign move against the custody jurisdiction. That one position also pins your exit slippage to a single token's DEX depth, locks you into one geography and one regulatory regime, and dumps the monitoring on you: attestations, regulator actions, bridge security, depeg spreads.

Spread across four or five issuers and per-failure exposure drops toward 20-25%, with exits free to route to whichever underlying is deepest when you need out. None of this produces alpha. It is pure risk management, and most holders never do it.

---

## The gap narrowed, and it stopped being gold-only

Earlier this year the aggregation niche looked wide open. It is tighter now, and saying otherwise would be dishonest. **Remora** launched five ETF-wrapped single-metal tokens on Solana (GLDr, SLVr, PPLTr, PALLr, CPERr), marketed together as the "$RMX / Rare Metals Index." **Ondo** pushed past 400 tokenized assets. **Streamex** shipped GLDY's 24/7 Solana/Orca pool in May 2026. Metal exposure on-chain, across more than gold, is now a crowded and well-funded shelf. Much of that new supply is accredited-only or closed to US persons, which matters for who can actually touch it.

State the remaining gap precisely. There is still no single, actively-managed, in-kind, multi-metal index on Solana. Remora's $RMX is five separate tokens under one brand, not a fungible basket SPL. Paxos and Tether issue single-asset longs on allocated metal. Ondo and Remora tokenize US metal ETFs, compliance-gated and not offered to US persons. Matrixdock vaults physical gold. None of them is an actively-managed basket, and none pairs that basket with a hedge.

Read these issuers correctly. They are not competitors to pick a fight with. They are the **supply rail**: the regulated, custodied, attested inventory that any index or hedged product sources its spot exposure from. More of them means a deeper rail. Good for whatever sits on top.

---

## What is actually missing

TradFi's answer to ETF fragmentation is the index basket, and on-chain that case is stronger. A single SPL token rebalances automatically, composes across DeFi, and spares the holder the cross-chain logistics of running five positions by hand. But aggregation is the easy half, and branded single-metal bundles already cover part of it. The open layer is active management, in two flavors for two buyers.

For the holder who wants the metal and the upside, the value is an **actively-managed, in-kind, multi-metal index**. Risk-weighting across the metals. Threshold-based rebalancing. Volatility targeting and a deliberate gold-to-silver tilt. Sell discipline, which most baskets skip. A basket that decides, not one that merely holds.

For the holder who wants metals exposure without the price bet, the value is a **market-neutral hedged carry**: long metal paired with a hedge so the position runs roughly delta-neutral, earning from carry instead of direction. We are not putting hard numbers on that here, on purpose. It is early. Any yield it implies is a design target, on a paper hedge, on devnet, no live-capital track record. We name it only to name the second buyer.

And this is a metals story, not a gold story. Silver is core to the basket, not a teaser. Platinum and palladium round out four (gold, silver, platinum, palladium; no copper). Gold is just the most familiar door into the room.

---

## The thesis, and what we are building

Tokenized metals on Solana fragmented across single-asset longs and ETF wrappers: Paxos, Tether, Matrixdock, Ondo, Remora. The missing piece is an actively-managed, in-kind, multi-metal index with a hedged carry on top. That is what we are building.

It is called **hgMETAL**: an oracle-free, in-kind index across four metals, actively rebalanced, no yield overlay on the index itself. The hedged carry is a separate structure, the basket hedged delta-neutral and tranched into hgUSD (a stable senior coupon) and hgYIELD (a levered junior), for the buyer who wants exposure without the directional bet. All three are live today on Solana devnet with a paper (simulated) hedge. No live-capital track record yet. Look at them here: **terminal.hedgents.com**.

---

## Methodology and sources

This article draws on public market-cap and volume data from CoinGecko, CoinMarketCap, and DefiLlama; each issuer's public custody, attestation, and regulatory disclosures (Paxos/KPMG, Tether/BDO Italia, Matrixdock, Oro Finance/RSM); World Gold Council gold-ETF AUM reporting (May 2026); and TradFi fund data from State Street, BlackRock, abrdn, and GraniteShares. Remora, Ondo, and Streamex product details are from their own public materials. Figures are as of June 2026; tokenized-metal markets move quickly, so verify before acting.

This analysis is informational only and does not constitute investment advice.
