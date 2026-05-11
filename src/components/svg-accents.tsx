export function FleetRoleRail() {
  return (
    <svg aria-hidden="true" viewBox="0 0 1120 130" className="hidden h-auto w-full lg:block" fill="none">
      <defs>
        <linearGradient id="fleet-rail" x1="42" y1="62" x2="1078" y2="62">
          <stop stopColor="#C9A84C" stopOpacity="0.1" />
          <stop offset="0.5" stopColor="#C9A84C" stopOpacity="0.54" />
          <stop offset="1" stopColor="#7BA3C8" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <path d="M42 62H1078" stroke="url(#fleet-rail)" strokeWidth="1.5" />
      <path d="M232 62C320 10 414 10 502 62C590 114 684 114 772 62C840 22 928 22 1010 62" stroke="rgba(36,50,101,0.18)" strokeDasharray="7 10" />
      {[
        [118, "MULTIPLY", "signing"],
        [340, "STABLE", "signing"],
        [560, "JLP", "signing"],
        [780, "RISK", "read-only"],
        [1002, "SIGNAL", "read-only"],
      ].map(([x, title, sub], i) => (
        <g key={title as string}>
          <circle cx={x as number} cy="62" r="15" fill={i < 3 ? "#C9A84C" : "#7BA3C8"} opacity={i < 3 ? "0.82" : "0.48"} />
          <circle cx={x as number} cy="62" r="27" stroke={i < 3 ? "#C9A84C" : "#7BA3C8"} opacity="0.18" />
          <text
            x={x as number}
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
            x={x as number}
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
      ))}
    </svg>
  );
}
