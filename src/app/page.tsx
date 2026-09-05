import Image from "next/image";
import { WaitlistButton } from "@/components/waitlist-modal";
import { ScientificPeriodicTable } from "@/components/scientific-periodic-table";
import { ScrollMotion } from "@/components/scroll-motion";
import styles from "./page.module.css";

const principles = [
  {
    index: "01",
    label: "Discover",
    text: "One catalog for metal products scattered across chains and venues.",
  },
  {
    index: "02",
    label: "Understand",
    text: "A Metal Passport shows what you actually own, who issues it, and the risks.",
  },
  {
    index: "03",
    label: "Execute",
    text: "Hedgents finds the eligible market and prepares the trade for you to sign.",
  },
  {
    index: "04",
    label: "Control",
    text: "You stay self-custodial. We route the trade; we do not hold the assets.",
  },
];

const metalRows = [
  {
    element: "Au",
    number: "79",
    metal: "Gold",
    priority: "P0",
    lane: "Own · Invest · Hedge",
    status: "First route",
  },
  {
    element: "Ag",
    number: "47",
    metal: "Silver",
    priority: "P0",
    lane: "Own · Invest · Hedge",
    status: "First route",
  },
  {
    element: "U",
    number: "92",
    metal: "Uranium",
    priority: "P1",
    lane: "Invest",
    status: "Verify products",
  },
  {
    element: "Pt",
    number: "78",
    metal: "Platinum",
    priority: "P2",
    lane: "Own · Invest",
    status: "Catalog next",
  },
  {
    element: "Cu",
    number: "29",
    metal: "Copper",
    priority: "P2",
    lane: "Invest · Hedge",
    status: "Catalog next",
  },
];

const exposureRail = [
  { mark: "Au", label: "OWN" },
  { mark: "Ag", label: "INVEST" },
  { mark: "Pt", label: "TRADE" },
  { mark: "Cu", label: "HEDGE" },
  { mark: "U", label: "COMPARE" },
];

const intelligenceRail = [
  { mark: "01", label: "CATALOG" },
  { mark: "02", label: "ELIGIBILITY" },
  { mark: "03", label: "EXECUTION" },
  { mark: "04", label: "RISK" },
  { mark: "05", label: "MONITOR" },
];

function TransitionRail({
  from,
  to,
  items,
  reverse = false,
}: {
  from: string;
  to: string;
  items: Array<{ mark: string; label: string }>;
  reverse?: boolean;
}) {
  return (
    <div className={styles.transitionReveal} data-reveal="rail" aria-hidden="true">
      <div
        className={`${styles.transitionRail} ${reverse ? styles.transitionRailReverse : ""}`}
      >
        <div className={styles.transitionMeta}>
          <span>{from}</span>
          <i />
          <span>{to}</span>
        </div>
        <div className={styles.transitionViewport}>
          <div className={styles.transitionTrack}>
            {[0, 1].map((copy) => (
              <div className={styles.transitionSet} key={copy}>
                {items.map((item) => (
                  <span className={styles.transitionItem} key={`${copy}-${item.mark}`}>
                    <strong>{item.mark}</strong>
                    <small>{item.label}</small>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.transitionAperture}>
          <span>Hg</span>
          <i />
          <small>Route scan</small>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className={styles.page}>
      <ScrollMotion />
      <div className={styles.scrollProgress} aria-hidden="true">
        <span />
      </div>
      <section
        className={styles.hero}
        id="top"
        aria-labelledby="hero-title"
      >
        <ScientificPeriodicTable className={styles.heroTable} />
        <div className={styles.heroAura} aria-hidden="true" />
        <div className={styles.heroShade} aria-hidden="true" />

        <div className={styles.shell}>
          <div className={styles.heroCopy}>
            <div className={styles.eyebrow}>
              <span className={styles.liveDot} />
              Onchain metal discovery + execution
            </div>
            <h1 id="hero-title">
              Trade metals.
              <span>Onchain.</span>
            </h1>
            <p className={styles.heroLead}>
              One interface to find, compare, and trade metal products across
              supported chains and venues.
            </p>
            <div className={styles.heroActions}>
              <WaitlistButton
                source="hero-metal-router"
                label="Get early access"
                className={styles.primaryButton}
              />
            </div>
            <p className={styles.microcopy}>
              Solana-first coverage · Venue-aware · Self-custodial
            </p>
          </div>
        </div>

        <p className={styles.heroCaption}>
          <span>118 elements</span>
          Conventional 18-column layout · metal families highlighted
        </p>
      </section>

      <section className={styles.principleStrip} aria-label="Product principles">
        {principles.map((principle) => (
          <article key={principle.index} data-index={principle.index} data-reveal="up">
            <span>{principle.index}</span>
            <div>
              <h2>{principle.label}</h2>
              <p>{principle.text}</p>
            </div>
          </article>
        ))}
      </section>

      <section className={styles.passportSection} id="how-it-works">
        <div className={styles.shell}>
          <div className={styles.sectionIntro} data-reveal="up">
            <p className={styles.kicker}>The Metal Passport</p>
            <h2>One metal. Very different promises.</h2>
            <p>
              A ticker is not enough. Before you trade, Hedgents separates
              physical ownership, investment exposure, and derivatives—then
              shows the issuer, custody, redemption, fees, liquidity, and
              eligibility behind each product.
            </p>
          </div>

          <div className={styles.passportLayout} data-reveal="up">
            <figure className={styles.materialStudy}>
              <Image
                className={styles.materialImage}
                src="/metal-passport-material-stack-v1.webp"
                alt="A gold cube floating above separated layers of silver, copper, platinum-toned metal, and dark tungsten"
                width={1024}
                height={1536}
                sizes="(max-width: 700px) calc(100vw - 28px), (max-width: 1020px) 300px, 390px"
              />
            </figure>

            <div className={styles.passportCards}>
              <article>
                <div className={styles.cardHeading}>
                  <span className={styles.laneOwn}>OWN</span>
                  <span>01 / Asset-backed token</span>
                </div>
                <h3>Claim on allocated or pooled metal</h3>
                <dl>
                  <div>
                    <dt>You hold</dt>
                    <dd>An issuer-backed token</dd>
                  </div>
                  <div>
                    <dt>Check first</dt>
                    <dd>Custodian, allocation, redemption, jurisdiction</dd>
                  </div>
                </dl>
              </article>

              <article>
                <div className={styles.cardHeading}>
                  <span className={styles.laneInvest}>INVEST</span>
                  <span>02 / Fund or equity</span>
                </div>
                <h3>Price exposure through a financial product</h3>
                <dl>
                  <div>
                    <dt>You hold</dt>
                    <dd>A fund, trust, or tokenized security</dd>
                  </div>
                  <div>
                    <dt>Check first</dt>
                    <dd>Eligibility, market hours, fees, tracking error</dd>
                  </div>
                </dl>
              </article>

              <article>
                <div className={styles.cardHeading}>
                  <span className={styles.laneHedge}>HEDGE</span>
                  <span>03 / Perpetual</span>
                </div>
                <h3>Directional exposure, not metal ownership</h3>
                <dl>
                  <div>
                    <dt>You hold</dt>
                    <dd>A leveraged position on a supported derivatives venue</dd>
                  </div>
                  <div>
                    <dt>Check first</dt>
                    <dd>Venue liquidity, funding, basis, leverage, liquidation</dd>
                  </div>
                </dl>
              </article>
            </div>
          </div>
        </div>
      </section>

      <TransitionRail
        from="Product truth"
        to="Market coverage"
        items={exposureRail}
      />

      <section className={styles.metalsSection} id="metals">
        <div className={styles.shell}>
          <div className={styles.sectionIntroSplit} data-reveal="up">
            <div>
              <p className={styles.kicker}>The metal map</p>
              <h2>Build depth first. Then earn breadth.</h2>
            </div>
            <p>
              Gold and silver prove the core product flow. Uranium proves the
              catalog can cover investment products even when a reliable hedge
              is absent. The rest follow product by product—not as empty tickers.
            </p>
          </div>

          <div className={styles.metalTable} role="table" aria-label="Metal rollout priorities">
            <div className={styles.tableHeader} role="row">
              <span role="columnheader">Element</span>
              <span role="columnheader">Metal</span>
              <span role="columnheader">Exposure lanes</span>
              <span role="columnheader">Status</span>
            </div>
            {metalRows.map((row) => (
              <div
                className={styles.tableRow}
                role="row"
                key={row.element}
                data-symbol={row.element}
                data-reveal="line"
              >
                <span className={styles.elementCell} role="cell">
                  <small>{row.number}</small>
                  <strong>{row.element}</strong>
                </span>
                <span className={styles.metalName} role="cell">
                  <strong>{row.metal}</strong>
                  <small>{row.priority}</small>
                </span>
                <span role="cell">{row.lane}</span>
                <span className={styles.statusCell} role="cell">
                  <i /> {row.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TransitionRail
        from="Market coverage"
        to="Intelligence layer"
        items={intelligenceRail}
        reverse
      />

      <section className={styles.moatSection} id="intelligence">
        <div className={styles.shell}>
          <div className={styles.sectionIntroSplit} data-reveal="up">
            <div>
              <p className={styles.kicker}>More than an aggregator</p>
              <h2>The durable product is the metal intelligence layer.</h2>
            </div>
            <p>
              Liquidity venues can be copied. A trusted registry of metal
              products, eligibility, redemption paths, route quality, and
              cross-venue risk gets stronger with every product integrated.
            </p>
          </div>
          <div className={styles.moatGrid}>
            <article data-index="01" data-reveal="up">
              <span>CATALOG</span>
              <h3>Canonical product registry</h3>
              <p>Every metal product normalized into one honest schema.</p>
            </article>
            <article data-index="02" data-reveal="up">
              <span>ROUTING</span>
              <h3>Best eligible execution</h3>
              <p>Quotes ranked by total outcome, not a promoted venue.</p>
            </article>
            <article data-index="03" data-reveal="up">
              <span>RISK</span>
              <h3>Exposure you can explain</h3>
              <p>Ownership, investment, and hedge risk kept visibly separate.</p>
            </article>
            <article data-index="04" data-reveal="up">
              <span>BUSINESS</span>
              <h3>Aligned revenue</h3>
              <p>Disclosed route fees first; professional monitoring and APIs later.</p>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.finalCta} id="access">
        <div className={styles.finalMark} aria-hidden="true">
          Hg
        </div>
        <div className={styles.shell} data-reveal="up">
          <p className={styles.kicker}>The metals are already tradable. The experience is not.</p>
          <h2>Help us build the front door.</h2>
          <p>
            Join the early-access group for product verification, trade testing,
            and the first gold and silver trades.
          </p>
          <WaitlistButton
            source="final-metal-router"
            label="Request early access"
            className={styles.primaryButton}
          />
        </div>
      </section>
    </div>
  );
}
