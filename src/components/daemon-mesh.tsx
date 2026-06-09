"use client";

import { motion } from "framer-motion";

const NODES = [
  { id: "researcher",  x: 110, y: 75,  readOnly: true,  label: "researcher" },
  { id: "riskwatcher", x: 310, y: 75,  readOnly: true,  label: "riskwatcher" },
  { id: "stable",      x: 210, y: 235, readOnly: false, label: "stable-yield" },
  { id: "onyc",    x: 70,  y: 390, readOnly: false, label: "onyc" },
  { id: "hedgedjlp",  x: 350, y: 390, readOnly: false, label: "hedgedjlp" },
];

const EDGES = [
  ["researcher",  "riskwatcher"],
  ["researcher",  "stable"],
  ["researcher",  "onyc"],
  ["researcher",  "hedgedjlp"],
  ["riskwatcher", "stable"],
  ["riskwatcher", "onyc"],
  ["riskwatcher", "hedgedjlp"],
  ["stable",      "onyc"],
  ["stable",      "hedgedjlp"],
  ["onyc",    "hedgedjlp"],
];

// Which edges carry animated data packets
const PACKETS = [
  { from: "researcher",  to: "stable",     dur: "2.8s", begin: "0s" },
  { from: "riskwatcher", to: "onyc",   dur: "3.2s", begin: "1.1s" },
  { from: "stable",      to: "hedgedjlp",  dur: "2.4s", begin: "0.6s" },
  { from: "researcher",  to: "hedgedjlp",  dur: "3.6s", begin: "1.8s" },
  { from: "riskwatcher", to: "stable",     dur: "2.6s", begin: "2.2s" },
];

function nodeById(id: string) {
  return NODES.find((n) => n.id === id)!;
}

function pathD(fromId: string, toId: string) {
  const a = nodeById(fromId);
  const b = nodeById(toId);
  return `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
}

export function DaemonMesh() {
  return (
    <svg
      viewBox="0 0 420 480"
      className="w-full h-full max-w-[480px]"
      aria-hidden="true"
    >
      {/* Invisible paths for animateMotion */}
      <defs>
        {PACKETS.map((p) => (
          <path
            key={`def-${p.from}-${p.to}`}
            id={`path-${p.from}-${p.to}`}
            d={pathD(p.from, p.to)}
          />
        ))}
      </defs>

      {/* Edge lines */}
      {EDGES.map(([a, b]) => {
        const na = nodeById(a);
        const nb = nodeById(b);
        return (
          <motion.line
            key={`${a}-${b}`}
            x1={na.x} y1={na.y}
            x2={nb.x} y2={nb.y}
            stroke="rgba(255,255,255,0.10)"
            strokeWidth="1"
            strokeDasharray="4 6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          />
        );
      })}

      {/* Animated data packets */}
      {PACKETS.map((p) => (
        <circle
          key={`pkt-${p.from}-${p.to}`}
          r="3"
          fill="var(--gold)"
          opacity="0.85"
        >
          <animateMotion
            dur={p.dur}
            begin={p.begin}
            repeatCount="indefinite"
          >
            <mpath href={`#path-${p.from}-${p.to}`} />
          </animateMotion>
        </circle>
      ))}

      {/* Nodes */}
      {NODES.map((node, i) => (
        <g key={node.id}>
          {/* Pulse ring for signing nodes */}
          {!node.readOnly && (
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={16}
              fill="none"
              stroke="var(--gold)"
              strokeWidth="1"
              initial={{ scale: 1, opacity: 0.4 }}
              animate={{ scale: [1, 1.7, 1], opacity: [0.4, 0, 0.4] }}
              transition={{
                duration: 2.5,
                delay: i * 0.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ transformOrigin: `${node.x}px ${node.y}px` }}
            />
          )}

          {/* Node circle */}
          <motion.circle
            cx={node.x}
            cy={node.y}
            r={node.readOnly ? 9 : 12}
            fill={node.readOnly ? "rgba(255,255,255,0.25)" : "var(--gold)"}
            stroke={node.readOnly ? "rgba(255,255,255,0.5)" : "var(--gold)"}
            strokeWidth="1.5"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.3 + i * 0.12,
              type: "spring",
              stiffness: 200,
            }}
          />

          {/* Label */}
          <motion.text
            x={node.x}
            y={node.y + (node.readOnly ? 24 : 28)}
            textAnchor="middle"
            fontSize="9"
            fontFamily="var(--font-geist-mono), monospace"
            fill="rgba(255,255,255,0.45)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
          >
            {node.label}
          </motion.text>

          {/* Read-only badge */}
          {node.readOnly && (
            <motion.text
              x={node.x}
              y={node.y + 36}
              textAnchor="middle"
              fontSize="7.5"
              fontFamily="var(--font-geist-mono), monospace"
              fill="rgba(255,255,255,0.25)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }}
            >
              read-only
            </motion.text>
          )}
        </g>
      ))}

      {/* Legend */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.4 }}
      >
        <circle cx={38} cy={448} r={5} fill="var(--gold)" />
        <text x={48} y={452} fontSize="8.5" fontFamily="var(--font-geist-mono), monospace" fill="rgba(255,255,255,0.35)">
          signs txs
        </text>
        <circle cx={115} cy={448} r={4} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
        <text x={125} y={452} fontSize="8.5" fontFamily="var(--font-geist-mono), monospace" fill="rgba(255,255,255,0.35)">
          read-only
        </text>
        <text x={38} y={466} fontSize="8" fontFamily="var(--font-geist-mono), monospace" fill="rgba(255,255,255,0.2)">
          libp2p · Ed25519 · signed CBOR
        </text>
      </motion.g>
    </svg>
  );
}
