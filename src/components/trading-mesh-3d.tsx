"use client";

import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Html } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

// ── Daemon config ──

const GOLD = "#C9A84C";
const STEEL = "#7BA3C8";

const NODES = [
  {
    id: "multiply",
    label: "multiply",
    role: "Kamino LST + leverage",
    signs: true,
    position: [0, 0.6, 0] as [number, number, number],
    size: 0.45,
  },
  {
    id: "stable-yield",
    label: "stable-yield",
    role: "Kamino USDC supply",
    signs: true,
    position: [-1.9, -0.15, 0.9] as [number, number, number],
    size: 0.4,
  },
  {
    id: "hedgedjlp",
    label: "hedgedjlp",
    role: "JLP + Jupiter Perps",
    signs: true,
    position: [1.9, -0.15, 0.9] as [number, number, number],
    size: 0.4,
  },
  {
    id: "riskwatcher",
    label: "riskwatcher",
    role: "Risk Officer · read-only",
    signs: false,
    position: [-1.5, 0.9, -1.1] as [number, number, number],
    size: 0.35,
  },
  {
    id: "researcher",
    label: "researcher",
    role: "Signal Publisher · read-only",
    signs: false,
    position: [1.5, 0.9, -1.1] as [number, number, number],
    size: 0.35,
  },
];

// All 10 pairs
const EDGES: [number, number][] = [];
for (let i = 0; i < NODES.length; i++)
  for (let j = i + 1; j < NODES.length; j++)
    EDGES.push([i, j]);

// ── Single box node ──

function DaemonNode({ node }: { node: (typeof NODES)[number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const color = node.signs ? GOLD : STEEL;

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * (node.signs ? 0.28 : 0.18);
      meshRef.current.rotation.x += delta * 0.09;
    }
  });

  return (
    <group position={node.position}>
      {/* Box node */}
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[node.size, node.size, node.size]} />
        <meshStandardMaterial
          color={color}
          metalness={node.signs ? 0.65 : 0.35}
          roughness={node.signs ? 0.25 : 0.5}
          emissive={color}
          emissiveIntensity={hovered ? 0.55 : node.signs ? 0.18 : 0.08}
        />
      </mesh>

      {/* Wireframe shell */}
      <mesh>
        <boxGeometry args={[node.size * 1.35, node.size * 1.35, node.size * 1.35]} />
        <meshBasicMaterial
          color={color}
          wireframe
          transparent
          opacity={hovered ? 0.35 : 0.12}
        />
      </mesh>

      {/* Html label */}
      <Html
        center
        position={[0, -(node.size * 1.6 + 0.35), 0]}
        style={{ pointerEvents: "none" }}
      >
        <div className="flex flex-col items-center gap-0.5 select-none">
          <span
            className="font-mono whitespace-nowrap"
            style={{ fontSize: "9px", color: "rgba(255,255,255,0.5)" }}
          >
            {node.label}
          </span>
          <span
            className="font-mono rounded px-1 uppercase tracking-wider"
            style={{
              fontSize: "7px",
              color: node.signs ? GOLD : STEEL,
              border: `1px solid ${node.signs ? "rgba(201,168,76,0.4)" : "rgba(123,163,200,0.4)"}`,
              padding: "1px 4px",
            }}
          >
            {node.signs ? "signs" : "read"}
          </span>
        </div>
      </Html>

      {/* Hover card */}
      {hovered && (
        <Html center position={[0, node.size * 1.5 + 0.3, 0]} style={{ pointerEvents: "none" }}>
          <div
            className="rounded border whitespace-nowrap px-3 py-2 text-center"
            style={{
              background: "rgba(8,14,36,0.92)",
              borderColor: "rgba(201,168,76,0.25)",
              backdropFilter: "blur(12px)",
            }}
          >
            <p
              className="font-mono font-semibold"
              style={{ fontSize: "10px", color: GOLD }}
            >
              {node.role}
            </p>
          </div>
        </Html>
      )}
    </group>
  );
}

// ── Animated data packet ──

function DataPacket({
  from,
  to,
  speed,
  offset,
  signs,
}: {
  from: THREE.Vector3;
  to: THREE.Vector3;
  speed: number;
  offset: number;
  signs: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const t = useRef(offset % 1);

  useFrame((_, delta) => {
    t.current += delta * speed;
    if (t.current > 1) t.current -= 1;
    if (ref.current) {
      ref.current.position.lerpVectors(from, to, t.current);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.055, 6, 6]} />
      <meshBasicMaterial color={signs ? GOLD : STEEL} />
    </mesh>
  );
}

// ── Connection lines + packets ──

function Connections() {
  const packets: {
    from: THREE.Vector3;
    to: THREE.Vector3;
    speed: number;
    offset: number;
    signs: boolean;
  }[] = [];

  // 8 packets distributed across edges
  const edgeIndices = [0, 1, 2, 3, 5, 7, 3, 6];
  edgeIndices.forEach((eIdx, i) => {
    const [a, b] = EDGES[eIdx % EDGES.length];
    const fromSigns = NODES[a].signs;
    const toSigns = NODES[b].signs;
    packets.push({
      from: new THREE.Vector3(...NODES[a].position),
      to: new THREE.Vector3(...NODES[b].position),
      speed: 0.12 + (i % 3) * 0.06,
      offset: i * 0.13,
      signs: fromSigns || toSigns,
    });
  });

  return (
    <group>
      {EDGES.map(([a, b], i) => {
        const fromNode = NODES[a];
        const toNode = NODES[b];
        const bothSigning = fromNode.signs && toNode.signs;
        const anyReading = !fromNode.signs || !toNode.signs;
        return (
          <Line
            key={i}
            points={[
              new THREE.Vector3(...fromNode.position),
              new THREE.Vector3(...toNode.position),
            ]}
            color={bothSigning ? GOLD : STEEL}
            lineWidth={bothSigning ? 0.7 : 0.4}
            transparent
            opacity={anyReading && !bothSigning ? 0.15 : 0.3}
          />
        );
      })}
      {packets.map((p, i) => (
        <DataPacket key={i} {...p} />
      ))}
    </group>
  );
}

// ── Floor grid ──

function FloorGrid() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.3, 0]}>
      <planeGeometry args={[12, 12, 22, 22]} />
      <meshBasicMaterial
        color="#1a2a4a"
        wireframe
        transparent
        opacity={0.12}
      />
    </mesh>
  );
}

// ── R3F Scene ──

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[3, 3, 3]} color={GOLD} intensity={1.4} />
      <pointLight position={[-3, 2, -2]} color={STEEL} intensity={0.9} />
      <FloorGrid />
      <Connections />
      {NODES.map((n) => (
        <DaemonNode key={n.id} node={n} />
      ))}
      <OrbitControls
        autoRotate
        autoRotateSpeed={0.45}
        enableZoom={false}
        enablePan={false}
        dampingFactor={0.08}
        maxPolarAngle={Math.PI * 0.72}
        minPolarAngle={Math.PI * 0.15}
      />
    </>
  );
}

// ── Daemon status strip ──

type MetricPair = [string, string];

const BASE_METRICS: Record<string, MetricPair> = {
  multiply:      ["APY 14.2%", "LTV 52%"],
  "stable-yield":["APY 8.7%",  "util 91%"],
  hedgedjlp:     ["PnL +2.1%", "δ 0.03"],
  riskwatcher:   ["alerts 0",  "up 99.9%"],
  researcher:    ["sig/min 12","lat 8ms"],
};

const STATUS: Record<string, { label: string; color: string; pulse: boolean }> = {
  multiply:      { label: "MAINNET", color: GOLD,    pulse: true },
  "stable-yield":{ label: "MAINNET", color: GOLD,    pulse: true },
  hedgedjlp:     { label: "SIM",     color: "#D4A843", pulse: false },
  riskwatcher:   { label: "INFRA",   color: STEEL,   pulse: false },
  researcher:    { label: "INFRA",   color: STEEL,   pulse: false },
};

function nudge(val: string): string {
  const match = val.match(/^([^\d-]*)([+-]?\d+\.?\d*)(%?)(.*)$/);
  if (!match) return val;
  const [, prefix, num, pct, suffix] = match;
  const n = parseFloat(num);
  const delta = (Math.random() - 0.5) * 0.4;
  const next = (n + delta).toFixed(num.includes(".") ? (num.split(".")[1]?.length ?? 1) : 0);
  return `${prefix}${next}${pct}${suffix}`;
}

function DaemonCard({ daemonId }: { daemonId: string }) {
  const node = NODES.find((n) => n.id === daemonId)!;
  const status = STATUS[daemonId];
  const [metrics, setMetrics] = useState<MetricPair>(BASE_METRICS[daemonId]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setMetrics([nudge(BASE_METRICS[daemonId][0]), nudge(BASE_METRICS[daemonId][1])]);
      setTick((t) => t + 1);
    }, 2500 + Math.random() * 500);
    return () => clearInterval(id);
  }, [daemonId]);

  return (
    <div
      className="flex-1 min-w-0 flex flex-col gap-1 px-3 py-2 rounded border"
      style={{
        borderColor: node.signs
          ? "rgba(201,168,76,0.2)"
          : "rgba(123,163,200,0.15)",
        backgroundColor: node.signs
          ? "rgba(201,168,76,0.04)"
          : "rgba(123,163,200,0.03)",
      }}
    >
      {/* Header row */}
      <div className="flex items-center gap-1.5">
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{
            backgroundColor: status.color,
            boxShadow: status.pulse ? `0 0 5px ${status.color}` : "none",
          }}
        />
        <span
          className="font-mono truncate"
          style={{ fontSize: "9px", color: "rgba(255,255,255,0.55)" }}
        >
          {node.label}
        </span>
        <span
          className="ml-auto font-mono rounded shrink-0"
          style={{
            fontSize: "7px",
            color: status.color,
            border: `1px solid ${status.color}44`,
            padding: "1px 4px",
          }}
        >
          {status.label}
        </span>
      </div>

      {/* Metrics */}
      <div className="flex gap-2">
        {metrics.map((m, i) => (
          <AnimatePresence key={i} mode="wait">
            <motion.span
              key={`${tick}-${i}`}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.25 }}
              className="font-mono"
              style={{ fontSize: "9px", color: node.signs ? GOLD : STEEL }}
            >
              {m}
            </motion.span>
          </AnimatePresence>
        ))}
      </div>
    </div>
  );
}

function DaemonStrip() {
  return (
    <div
      className="flex gap-1.5 px-3 py-2.5"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        backgroundColor: "rgba(0,0,0,0.15)",
        backdropFilter: "blur(8px)",
      }}
    >
      {NODES.map((n) => (
        <DaemonCard key={n.id} daemonId={n.id} />
      ))}
    </div>
  );
}

// ── Export ──

export function TradingMesh3D() {
  return (
    <div className="w-full flex flex-col" style={{ height: "clamp(400px, 52vh, 640px)" }}>
      {/* 3D scene — top 64% */}
      <div className="flex-1 cursor-grab active:cursor-grabbing min-h-0">
        <Canvas
          camera={{ position: [0, 1.5, 5.8], fov: 46 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 1.5]}
          style={{ width: "100%", height: "100%" }}
        >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      {/* Daemon status strip — bottom ~36% */}
      <DaemonStrip />
    </div>
  );
}
