export function FleetRoleRail() {
  return (
    <svg aria-hidden="true" viewBox="0 0 1120 130" className="hidden h-auto w-full lg:block" fill="none">
      <defs>
        <linearGradient id="fleet-rail" x1="42" y1="62" x2="1078" y2="62">
          <stop stopColor="#C9A84C" stopOpacity="0.1" />
          <stop offset="0.5" stopColor="#C9A84C" stopOpacity="0.54" />
          <stop offset="1" stopColor="#7BA3C8" stopOpacity="0.2" />
        </linearGradient>
        <filter id="fleet-glow" x="-20%" y="-120%" width="140%" height="340%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <path id="fleet-wave-path" d="M232 62C320 10 414 10 502 62C590 114 684 114 772 62C840 22 928 22 1010 62" />
      </defs>
      <path d="M42 62H1078" stroke="rgba(36,50,101,0.12)" strokeWidth="1.5" />
      <path
        d="M42 62H1078"
        stroke="url(#fleet-rail)"
        strokeWidth="1.5"
        strokeDasharray="1036"
        strokeDashoffset="1036"
      >
        <animate attributeName="stroke-dashoffset" from="1036" to="0" dur="1.4s" begin="0.15s" fill="freeze" />
      </path>
      <use href="#fleet-wave-path" stroke="rgba(36,50,101,0.18)" strokeDasharray="7 10" />
      <use href="#fleet-wave-path" stroke="#C9A84C" strokeOpacity="0.22" strokeWidth="1.2" strokeDasharray="36 260" filter="url(#fleet-glow)">
        <animate attributeName="stroke-dashoffset" values="300;0;-300" dur="5.5s" repeatCount="indefinite" />
      </use>
      <circle r="4" fill="#C9A84C" opacity="0.78" filter="url(#fleet-glow)">
        <animateMotion dur="5.4s" repeatCount="indefinite" path="M118 62H1002" />
      </circle>
      <circle r="3" fill="#7BA3C8" opacity="0.48">
        <animateMotion dur="6.8s" begin="1.1s" repeatCount="indefinite" path="M1002 62H118" />
      </circle>
      {(
        [
          // x — chosen so 6 nodes space evenly across the 42-1078 rail
          // (118 → 1002 in equal steps of ~177).
          // Three authority classes — gold/SIGNS, slate/ROUTES, blue/READ —
          // mirror the fleet.tsx card-grid colour scheme.
          [118, "ONYC", "signing", "signs"],
          [295, "STABLE", "signing", "signs"],
          [472, "JLP", "signing", "signs"],
          [649, "ALLOCATOR", "routes", "routes"],
          [826, "RISK", "read-only", "read"],
          [1002, "SIGNAL", "read-only", "read"],
        ] as Array<[number, string, string, "signs" | "routes" | "read"]>
      ).map(([x, title, sub, tier], i) => {
        // Gold for the three Solana-tx signers, slate-blue for the
        // single allocator (signs mesh envelopes only, can never sign a
        // Solana tx — wallet crate compile-time absent), neutral blue
        // for the two read-only observers.
        const color = tier === "signs" ? "#C9A84C" : tier === "routes" ? "#7BA3C8" : "#7BA3C8";
        const fillOpacity = tier === "signs" ? "0.82" : tier === "routes" ? "0.62" : "0.48";
        const pulseDur = tier === "signs" ? "2.4s" : tier === "routes" ? "2.8s" : "3.2s";
        return (
          <g key={title}>
            <circle cx={x} cy="62" r="34" fill={color} opacity="0.03">
              <animate attributeName="r" values="25;38;25" dur={pulseDur} begin={`${i * 0.18}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.12;0.02;0.12" dur={pulseDur} begin={`${i * 0.18}s`} repeatCount="indefinite" />
            </circle>
            <circle cx={x} cy="62" r="15" fill={color} opacity={fillOpacity} />
            <circle cx={x} cy="62" r="27" stroke={color} opacity="0.18" />
            <text
              x={x}
              y="28"
              textAnchor="middle"
              fontSize="10"
              fontFamily="var(--font-geist-mono), monospace"
              fill="rgba(36,50,101,0.72)"
              letterSpacing="0"
            >
              {title}
            </text>
            <text
              x={x}
              y="103"
              textAnchor="middle"
              fontSize="9"
              fontFamily="var(--font-geist-mono), monospace"
              fill="rgba(36,50,101,0.38)"
              letterSpacing="0"
            >
              {sub}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
