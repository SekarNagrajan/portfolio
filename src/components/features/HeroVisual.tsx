"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  type AnimationPlaybackControls,
} from "motion/react";
import { Check, Database, Pause, Play, Sparkles, UserRound } from "lucide-react";
import { TechLogo, type TechLogoName } from "@/components/icons/TechLogos";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* The stack, as it appears on the resume. Every node pairs the tech  */
/* with what it does for the business, so recruiters and engineers    */
/* both get a read. Coordinates: SVG user units, viewBox 0 0 100 80.  */
/* ------------------------------------------------------------------ */

const VIEW_H = 80;

type NodeId = "react" | "ts" | "next" | "spring" | "ai" | "sql" | "redis" | "n8n";

type StackNode = {
  id: NodeId;
  label: string;
  x: number;
  y: number;
  icon: ReactNode;
  hub?: { width: number; short?: string; chips: readonly ReactNode[] };
  /** Plain-English job, shown under the tech name. */
  role: string;
  /** One sentence for a non-technical reader. */
  business: string;
  usedIn: readonly string[];
  /** The engineering detail behind it. */
  detail: string;
};

const NODES: readonly StackNode[] = [
  {
    id: "react",
    role: "Apps teams use daily",
    business: "The screens sales reps and port agents work in every day.",
    label: "React 19",
    x: 18,
    y: 11,
    icon: <TechLogo name="react" size={22} />,
    usedIn: ["CRM", "ANCHOR"],
    detail: "App shells, RBAC module gating, reusable DataTable UI and 40+ lazy-loaded screens on TanStack, React Query, Zustand and RTK Query.",
  },
  {
    id: "ts",
    role: "Fewer bugs",
    business: "Catches mistakes while the code is written, long before a customer sees them.",
    label: "TypeScript",
    x: 50,
    y: 11,
    icon: <TechLogo name="typescript" size={20} />,
    usedIn: ["CRM", "ANCHOR", "PAMS E-Com"],
    detail: "Typed end to end. OpenAPI-generated clients keep the React apps in lockstep with Spring.",
  },
  {
    id: "next",
    role: "Customer self-service",
    business: "A portal where shipping customers book cargo and track invoices themselves.",
    label: "Next.js",
    x: 82,
    y: 11,
    icon: <TechLogo name="nextdotjs" size={21} />,
    usedIn: ["PAMS E-Com"],
    detail: "Multi-tenant shipping self-service shell with dynamic theming, feature flags and a shared design system.",
  },
  {
    id: "spring",
    role: "Secure business logic",
    business: "Runs the business rules and checks who is allowed to do what.",
    label: "Spring Boot 4",
    x: 36,
    y: 37,
    icon: <TechLogo name="springboot" size={22} />,
    hub: {
      width: 40,
      short: "Spring",
      chips: [
        <Chip key="j" logo="openjdk">Java 21</Chip>,
        <Chip key="s" logo="springsecurity">Security</Chip>,
        <Chip key="w" logo="jsonwebtokens">JWT</Chip>,
      ],
    },
    usedIn: ["CRM", "ANCHOR"],
    detail: "Secure REST APIs with Spring Security and JWT, plus ~20% of the backend on the VHS financial and EPDA modules.",
  },
  {
    id: "ai",
    role: "Automation",
    business: "Removes manual typing and answers questions in plain English.",
    label: "AI layer",
    x: 80,
    y: 37,
    icon: <Sparkles size={20} />,
    hub: {
      width: 30,
      short: "AI",
      chips: [
        <Chip key="o">OpenAI</Chip>,
        <Chip key="v" logo="googlecloud">Vision</Chip>,
      ],
    },
    usedIn: ["CRM", "ANCHOR"],
    detail: "OpenAI Voice-to-Text, Cloud Vision Image-to-Lead, and the ERAX chatbot that turns questions into SQL.",
  },
  {
    id: "sql",
    role: "Company records",
    business: "Holds the operational and financial records the business runs on.",
    label: "SQL Server",
    x: 20,
    y: 63,
    icon: <Database size={20} />,
    usedIn: ["ANCHOR", "PAMS"],
    detail: "Dual-datasource architecture, stored procedures and indexing for high-throughput operational data.",
  },
  {
    id: "redis",
    role: "Speed",
    business: "Keeps frequently used data instantly available.",
    label: "Redis",
    x: 50,
    y: 63,
    icon: <TechLogo name="redis" size={20} />,
    usedIn: ["Caching"],
    detail: "Caching hot reads so the relational store stays fast under load.",
  },
  {
    id: "n8n",
    role: "Hands-free workflows",
    business: "Automates routine hand-offs between systems.",
    label: "n8n",
    x: 80,
    y: 63,
    icon: <TechLogo name="n8n" size={21} />,
    usedIn: ["CRM"],
    detail: "Workflow automation wired into the enterprise sales flows.",
  },
];

const NODE = Object.fromEntries(NODES.map((n) => [n.id, n])) as Record<NodeId, StackNode>;

type Edge = { a: NodeId; b: NodeId; d: string; kind?: "types" };

const EDGES: readonly Edge[] = [
  { a: "ts", b: "react", d: "M50 11 L18 11", kind: "types" },
  { a: "ts", b: "next", d: "M50 11 L82 11", kind: "types" },
  { a: "react", b: "spring", d: "M18 11 C18 25, 36 23, 36 37" },
  { a: "ts", b: "spring", d: "M50 11 C50 25, 36 23, 36 37", kind: "types" },
  { a: "spring", b: "ai", d: "M36 37 L80 37" },
  { a: "spring", b: "sql", d: "M36 37 C36 51, 20 49, 20 63" },
  { a: "spring", b: "redis", d: "M36 37 C36 51, 50 49, 50 63" },
  { a: "ai", b: "n8n", d: "M80 37 L80 63" },
];

const edgeKey = (e: Pick<Edge, "a" | "b">) => `${e.a}-${e.b}`;
const findEdge = (from: NodeId, to: NodeId) => {
  const fwd = EDGES.find((e) => e.a === from && e.b === to);
  if (fwd) return { edge: fwd, reverse: false };
  const rev = EDGES.find((e) => e.a === to && e.b === from);
  return rev ? { edge: rev, reverse: true } : null;
};

/** Real features from the resume: the business story, then the request path behind it. */
type Flow = {
  id: string;
  product: string;
  domain: string;
  headline: string;
  impact: string;
  myRole: string;
  /** Pops in when the trace completes. */
  outcome: string;
  path: readonly NodeId[];
};

const FLOWS: readonly Flow[] = [
  {
    id: "lead",
    product: "CRM",
    domain: "Sales",
    headline: "Sales reps stopped typing leads by hand",
    impact: "Voice notes and photos become ready-to-use leads automatically, removing manual data entry across the sales floor.",
    myRole: "Integrated the AI voice & image capture",
    outcome: "No manual entry",
    path: ["react", "spring", "ai", "spring", "react"],
  },
  {
    id: "erax",
    product: "ANCHOR",
    domain: "Port operations",
    headline: "Anyone can ask the data a question in plain English",
    impact: "The ERAX assistant writes the database query and answers with an interactive chart. No SQL skills needed.",
    myRole: "Shipped the ERAX AI chatbot",
    outcome: "Answers as charts",
    path: ["react", "spring", "ai", "spring", "sql", "spring", "react"],
  },
  {
    id: "secure",
    product: "ANCHOR",
    domain: "Port operations",
    headline: "Port agents run vessels, accounts and payments in one app",
    impact: "Each team sees only the modules its role allows, across 40+ screens built on one shared foundation.",
    myRole: "Architected ~80% of the frontend",
    outcome: "Role-based access",
    path: ["react", "spring", "sql", "spring", "react"],
  },
  {
    id: "types",
    product: "CRM",
    domain: "Engineering quality",
    headline: "Frontend and backend stay in sync automatically",
    impact: "API changes flow straight into the app's code, so mismatches are caught before release instead of by users.",
    myRole: "Set up generated, type-safe API clients",
    outcome: "Safer releases",
    path: ["spring", "ts", "react"],
  },
];

const HOP_S = 0.75;
const HOLD_MS = 1900;

/* ------------------------------------------------------------------ */
/* HeroVisual — live architecture map of the stack.                   */
/* ------------------------------------------------------------------ */

export function HeroVisual() {
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { margin: "-10% 0px" });
  const reduce = useReducedMotion();

  const [flowIdx, setFlowIdx] = useState(0);
  const [step, setStep] = useState(0);
  const [restart, setRestart] = useState(0);
  const [inspect, setInspect] = useState<NodeId | null>(null);
  const [engaged, setEngaged] = useState(false);
  const [userPaused, setUserPaused] = useState<boolean | null>(null);

  const pathRefs = useRef<Partial<Record<string, SVGPathElement>>>({});
  const packetRef = useRef<SVGCircleElement>(null);
  const flowRef = useRef(0);

  // Reduced-motion visitors start paused; they can still press play.
  const paused = userPaused ?? Boolean(reduce);
  const [hasInspected, setHasInspected] = useState(false);
  // A tapped node holds the tour so the readout isn't overwritten mid-read.
  const running = !paused && inView && !engaged && inspect === null;
  const flow = FLOWS[flowIdx];

  // Trace loop: walk the packet hop by hop, then move to the next flow.
  useEffect(() => {
    if (!running) return;
    let cancelled = false;
    let ctrl: AnimationPlaybackControls | undefined;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const packet = packetRef.current;

    (async () => {
      let f = flowRef.current;
      while (!cancelled) {
        const { path } = FLOWS[f];
        setFlowIdx(f);
        setStep(0);
        await wait(450);
        for (let i = 0; i < path.length - 1 && !cancelled; i++) {
          const hop = findEdge(path[i], path[i + 1]);
          const el = hop && pathRefs.current[edgeKey(hop.edge)];
          if (el && packet) {
            const len = el.getTotalLength();
            packet.style.opacity = "1";
            await new Promise<void>((resolve) => {
              ctrl = animate(0, 1, {
                duration: HOP_S,
                ease: [0.65, 0, 0.35, 1],
                onUpdate: (v) => {
                  const p = el.getPointAtLength((hop.reverse ? 1 - v : v) * len);
                  packet.setAttribute("cx", String(p.x));
                  packet.setAttribute("cy", String(p.y));
                },
                onComplete: resolve,
              });
            });
          }
          if (cancelled) return;
          setStep(i + 1);
          await wait(160);
        }
        if (packet) packet.style.opacity = "0";
        await wait(HOLD_MS);
        f = (f + 1) % FLOWS.length;
        flowRef.current = f;
      }
    })();

    return () => {
      cancelled = true;
      ctrl?.stop();
      if (packet) packet.style.opacity = "0";
    };
  }, [running, restart]);

  const pickFlow = (i: number) => {
    flowRef.current = i;
    setFlowIdx(i);
    setStep(0);
    setUserPaused(false);
    setRestart((r) => r + 1);
  };

  /* Lit state: nodes/edges the trace has reached, or the hovered node's links. */
  const litEdges = new Set<string>();
  const litNodes = new Set<NodeId>();
  if (inspect) {
    litNodes.add(inspect);
    for (const e of EDGES) {
      if (e.a === inspect || e.b === inspect) {
        litEdges.add(edgeKey(e));
        litNodes.add(e.a);
        litNodes.add(e.b);
      }
    }
  } else {
    flow.path.slice(0, step + 1).forEach((n) => litNodes.add(n));
    for (let i = 0; i < step; i++) {
      const hop = findEdge(flow.path[i], flow.path[i + 1]);
      if (hop) litEdges.add(edgeKey(hop.edge));
    }
  }
  const current = inspect ?? flow.path[step];
  const done = step === flow.path.length - 1;

  /* Cursor spotlight */
  const mx = useMotionValue(-400);
  const my = useMotionValue(-400);
  const spotlight = useMotionTemplate`radial-gradient(360px circle at ${mx}px ${my}px, color-mix(in oklab, var(--accent) 12%, transparent), transparent 70%)`;

  const inspected = inspect ? NODE[inspect] : null;

  return (
    <motion.div
      ref={rootRef}
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 90, damping: 18, delay: 0.25 }}
      className="@container glass-lg shadow-glass-lg relative isolate w-full overflow-hidden rounded-3xl"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
      }}
      onPointerEnter={(e) => e.pointerType === "mouse" && setEngaged(true)}
      onPointerLeave={(e) => {
        mx.set(-400);
        my.set(-400);
        // Touch fires pointerleave on finger lift — keep the tapped node inspected.
        if (e.pointerType !== "mouse") return;
        setEngaged(false);
        setInspect(null);
      }}
      onFocus={() => setEngaged(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setEngaged(false);
          setInspect(null);
        }
      }}
    >
      <motion.div aria-hidden style={{ background: spotlight }} className="pointer-events-none absolute inset-0 -z-10" />

      {/* Title bar */}
      <div className="flex items-center gap-3 border-b border-border/60 px-4 py-2.5">
        <span className="hidden gap-1.5 @sm:flex">
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-2.5 rounded-full bg-muted-foreground/25" />
          ))}
        </span>
        <span className="truncate font-mono text-xs text-muted-foreground @md:text-[11px]">
          sekar<span className="text-muted-foreground/50">/</span>
          <span className="text-foreground/90">impact-map</span>
        </span>
        <div className="ml-auto flex items-center gap-1">
          <div role="group" aria-label="Choose a feature to trace" className="flex items-center gap-0.5">
            {FLOWS.map((f, i) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={i === flowIdx}
                aria-label={`Show: ${f.headline} (${f.product})`}
                onClick={() => pickFlow(i)}
                className={cn(
                  "relative rounded-md px-1.5 py-1 font-mono text-[11px] tabular-nums transition-colors pointer-coarse:min-h-11 pointer-coarse:min-w-9 @md:text-[10px]",
                  i === flowIdx ? "text-foreground" : "text-muted-foreground/70 hover:text-foreground",
                )}
              >
                {i === flowIdx && (
                  <motion.span
                    layoutId="flow-tab"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    className="absolute inset-0 rounded-md bg-accent/15 ring-1 ring-accent/40"
                  />
                )}
                <span className="relative">{String(i + 1).padStart(2, "0")}</span>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setUserPaused(!paused)}
            aria-label={paused ? "Play the tour" : "Pause the tour"}
            className="grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground pointer-coarse:size-11"
          >
            {paused ? <Play size={12} /> : <Pause size={12} />}
          </button>
        </div>
      </div>

      {/* Diagram */}
      <div className="relative aspect-[5/4]">
        {/* Tier bands */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {[
            { label: "client", y: 11 },
            { label: "api", y: 37 },
            { label: "data", y: 63 },
          ].map((t) => (
            <span
              key={t.label}
              className="absolute left-2 -translate-y-1/2 rotate-180 font-mono text-[10px] uppercase tracking-[0.2em] @md:text-[9px] text-muted-foreground/50 [writing-mode:vertical-rl] @md:left-3"
              style={{ top: `${(t.y / VIEW_H) * 100}%` }}
            >
              {t.label}
            </span>
          ))}
          {[24, 50].map((y) => (
            <span
              key={y}
              className="absolute inset-x-6 border-t border-dashed border-border/50"
              style={{ top: `${(y / VIEW_H) * 100}%` }}
            />
          ))}
          <div className="absolute inset-0 bg-[radial-gradient(color-mix(in_oklab,var(--foreground)_9%,transparent)_1px,transparent_1px)] [background-size:18px_18px] [mask-image:radial-gradient(ellipse_at_center,#000_40%,transparent_85%)]" />
        </div>

        {/* Wires */}
        <svg aria-hidden viewBox={`0 0 100 ${VIEW_H}`} className="absolute inset-0 size-full overflow-visible">
          {EDGES.map((e, i) => {
            const lit = litEdges.has(edgeKey(e));
            const dim = inspect !== null && !lit;
            return (
              <g key={edgeKey(e)} className="transition-opacity duration-300" style={{ opacity: dim ? 0.25 : 1 }}>
                <motion.path
                  ref={(el) => {
                    if (el) pathRefs.current[edgeKey(e)] = el;
                  }}
                  d={e.d}
                  fill="none"
                  strokeWidth={e.kind === "types" ? 0.25 : 0.35}
                  strokeDasharray={e.kind === "types" ? "0.8 0.8" : undefined}
                  className="stroke-foreground/20"
                  initial={reduce || e.kind === "types" ? false : { pathLength: 0 }}
                  animate={e.kind === "types" ? undefined : { pathLength: 1 }}
                  transition={{ duration: 1, ease: "easeInOut", delay: 0.5 + i * 0.07 }}
                />
                {/* Lit overlay: glow + flowing dashes */}
                <path
                  d={e.d}
                  fill="none"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  className="stroke-accent/20 transition-opacity duration-300"
                  style={{ opacity: lit ? 1 : 0 }}
                />
                <path
                  d={e.d}
                  fill="none"
                  pathLength={100}
                  strokeWidth={0.45}
                  strokeDasharray="2 3"
                  strokeLinecap="round"
                  className={cn("stroke-accent transition-opacity duration-300", lit && "animate-dash")}
                  style={{ opacity: lit ? 1 : 0 }}
                />
                {/* Ambient traffic — unmounted off-screen so SMIL stops */}
                {!reduce && inView && (
                  <circle r={0.55} className="fill-accent/60">
                    <animateMotion dur={`${2.6 + (i % 3) * 0.7}s`} begin={`-${(i * 0.83) % 2.6}s`} repeatCount="indefinite" path={e.d} />
                  </circle>
                )}
              </g>
            );
          })}
          {/* The traced request */}
          <circle
            ref={packetRef}
            r={1.3}
            cx={NODE.react.x}
            cy={NODE.react.y}
            className="fill-accent [filter:drop-shadow(0_0_2px_var(--accent))_drop-shadow(0_0_6px_var(--accent))]"
            style={{ opacity: 0, transition: "opacity 200ms" }}
          />
        </svg>

        {/* Nodes */}
        {NODES.map((n, i) => (
          <NodeView
            key={n.id}
            node={n}
            index={i}
            lit={litNodes.has(n.id)}
            current={current === n.id}
            dim={inspect !== null && !litNodes.has(n.id)}
            selected={inspect === n.id}
            onInspect={(on) => {
              setInspect(on ? n.id : null);
              if (on) setHasInspected(true);
            }}
          />
        ))}
      </div>

      {/* Readout — the business story first, the engineering underneath. */}
      <div className="border-t border-border/60 px-4 py-3.5 @md:px-5">
        <div className="flex min-h-[7.5rem] flex-col justify-center">
          {inspected ? (
            <motion.div key={`n-${inspected.id}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[15px] font-semibold tracking-tight">{inspected.label}</span>
                <span className="text-xs font-medium text-accent">{inspected.role}</span>
                <span className="text-muted-foreground/50">·</span>
                {inspected.usedIn.map((p) => (
                  <span key={p} className="rounded-full border border-border/70 px-2 py-0.5 font-mono text-[11px] text-muted-foreground @md:text-[10px]">
                    {p}
                  </span>
                ))}
              </div>
              <p className="mt-1.5 text-pretty text-[13px] leading-relaxed text-foreground/85">{inspected.business}</p>
              <p className="mt-1.5 hidden text-pretty font-mono text-[10.5px] leading-relaxed text-muted-foreground @sm:block">
                <span className="text-accent/80">tech</span> {inspected.detail}
              </p>
            </motion.div>
          ) : (
            <motion.div key={`f-${flow.id}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
                  {flow.product}
                  <span className="text-muted-foreground/60"> · {flow.domain}</span>
                </span>
                <AnimatePresence>
                  {done && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.7, y: 4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 420, damping: 22 }}
                      className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-xs font-semibold text-accent ring-1 ring-accent/30 @md:text-[10.5px]"
                    >
                      <Check size={11} strokeWidth={3} />
                      {flow.outcome}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <p className="mt-1 text-balance text-[15px] font-semibold leading-snug tracking-tight @md:text-base">{flow.headline}</p>
              <p className="mt-1 hidden text-pretty text-xs leading-relaxed text-muted-foreground @sm:block">{flow.impact}</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <span className="hidden items-center gap-1 text-[11px] text-foreground/80 @sm:inline-flex">
                  <UserRound size={11} className="text-accent" />
                  {flow.myRole}
                </span>
                {!hasInspected && (
                  <span className="hidden text-[11px] text-muted-foreground/80 pointer-coarse:inline">
                    Tap a block to see what it does
                  </span>
                )}
                <ol aria-label="Behind the scenes" className="flex flex-wrap items-center gap-1 font-mono text-[11px] @md:text-[10px]">
                  {flow.path.map((id, i) => (
                    <li key={i} className="flex items-center gap-1">
                      {i > 0 && <span className={cn("transition-colors", i <= step ? "text-accent" : "text-muted-foreground/40")}>→</span>}
                      <span
                        className={cn(
                          "rounded px-1 py-px transition-colors duration-300",
                          i < step && "text-foreground/70",
                          i === step && "bg-accent/15 text-accent",
                          i > step && "text-muted-foreground/50",
                        )}
                      >
                        {NODE[id].label.replace(/ \d+$/, "")}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Building blocks                                                    */
/* ------------------------------------------------------------------ */

function Chip({ logo, children }: { logo?: TechLogoName; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-foreground/[0.06] px-1.5 py-0.5 font-mono text-[9.5px] text-muted-foreground">
      {logo && <TechLogo name={logo} size={10} />}
      {children}
    </span>
  );
}

function NodeView({
  node,
  index,
  lit,
  current,
  dim,
  selected,
  onInspect,
}: {
  node: StackNode;
  index: number;
  lit: boolean;
  current: boolean;
  dim: boolean;
  selected: boolean;
  onInspect: (on: boolean) => void;
}) {
  const { hub } = node;
  return (
    <motion.button
      type="button"
      aria-label={`${node.label}, ${node.role}: ${node.business}`}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: dim ? 0.4 : 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.35 + index * 0.06 }}
      whileHover={{ scale: 1.06 }}
      onPointerEnter={(e) => e.pointerType === "mouse" && onInspect(true)}
      onClick={() => onInspect(!selected)}
      onFocus={() => onInspect(true)}
      className="group/node absolute z-10 rounded-2xl"
      style={{
        left: `${node.x}%`,
        top: `${(node.y / VIEW_H) * 100}%`,
        width: hub ? `${hub.width}%` : undefined,
        x: "-50%",
        y: "-50%",
      }}
    >
      {hub ? (
        <span
          className={cn(
            "relative flex items-center gap-2.5 rounded-2xl border bg-card/85 p-2 text-left shadow-glass backdrop-blur-md transition-[border-color,box-shadow] duration-300 @md:p-2.5",
            lit ? "border-accent/60 shadow-[0_0_30px_-8px_var(--accent)]" : "border-border/70",
          )}
        >
          <Pulse on={current} scale={1.06} className="rounded-2xl" />
          <span
            className={cn(
              "grid size-9 shrink-0 place-items-center rounded-xl transition-colors duration-300 @md:size-10",
              lit ? "bg-accent/15 text-accent" : "bg-foreground/[0.06] text-foreground/80",
            )}
          >
            {node.icon}
          </span>
          <span className="min-w-0">
            <span className="flex items-baseline gap-1.5">
              <span className="truncate text-xs font-semibold tracking-tight text-foreground @md:text-sm">
                {hub.short ? (
                  <>
                    <span className="@md:hidden">{hub.short}</span>
                    <span className="hidden @md:inline">{node.label}</span>
                  </>
                ) : (
                  node.label
                )}
              </span>
            </span>
            <span className={cn("mt-0.5 hidden truncate text-[11px] transition-colors duration-300 @md:block", lit ? "text-accent" : "text-muted-foreground")}>
              {node.role}
            </span>
            <span className="mt-1.5 hidden flex-wrap gap-1 @lg:flex">{hub.chips}</span>
          </span>
        </span>
      ) : (
        <span className="relative block">
          <span
            className={cn(
              "relative grid size-10 place-items-center rounded-xl border bg-card/85 shadow-glass backdrop-blur-md transition-[border-color,color,box-shadow] duration-300 @md:size-12",
              lit ? "border-accent/60 text-accent shadow-[0_0_24px_-6px_var(--accent)]" : "border-border/70 text-foreground/85",
            )}
          >
            <Pulse on={current} className="rounded-xl" />
            {node.icon}
          </span>
          <span className="absolute left-1/2 top-full mt-1 flex -translate-x-1/2 flex-col items-center rounded-md bg-card/80 px-1.5 py-0.5">
            <span
              className={cn(
                "whitespace-nowrap font-mono text-[11px] transition-colors duration-300 @md:text-[10.5px]",
                lit ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {node.label}
            </span>
            <span
              className={cn(
                "hidden whitespace-nowrap text-[10px] transition-colors duration-300 @md:block",
                lit ? "text-accent" : "text-muted-foreground/70",
              )}
            >
              {node.role}
            </span>
          </span>
        </span>
      )}
    </motion.button>
  );
}

/** Expanding ring on the node the trace is currently at. */
function Pulse({ on, scale = 1.35, className }: { on: boolean; scale?: number; className?: string }) {
  if (!on) return null;
  return (
    <motion.span
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 ring-2 ring-accent", className)}
      initial={{ opacity: 0.7, scale: 1 }}
      animate={{ opacity: 0, scale }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
    />
  );
}
