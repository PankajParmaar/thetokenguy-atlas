"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import Link from "next/link"
import {
  Clock,
  Calendar,
  Terminal,
  Fingerprint,
  Lock,
  UserPlus,
  GitBranch,
  Shield,
  Activity,
  Cpu,
  MoreHorizontal,
  ShieldCheck,
  User,
  Code,
  GitMerge,
  UserCheck,
} from "lucide-react"
import IdentityGraph, {
  NodeDatum,
  GRAPH_VIEWBOX_WIDTH,
  GRAPH_VIEWBOX_HEIGHT,
} from "@/components/graph/IdentityGraph"
import NodeContextPanel from "@/components/NodeContextPanel"

const PANEL_WIDTH = 380
const PANEL_HEIGHT = 400
const NODE_OFFSET = 24
const FALLBACK_VIEWPORT_WIDTH = 1440
const FALLBACK_VIEWPORT_HEIGHT = 900

function getNodeScreenPosition(
  node: NodeDatum,
  svgRect: DOMRect | null
): { x: number; y: number } {
  if (!svgRect) {
    return { x: node.x, y: node.y }
  }

  // preserveAspectRatio="xMidYMid meet" letterboxes the viewBox content
  // inside the SVG's rendered box, so map through the actual content
  // rect (not the raw bounding box) to keep node <-> screen space exact.
  const scale = Math.min(
    svgRect.width / GRAPH_VIEWBOX_WIDTH,
    svgRect.height / GRAPH_VIEWBOX_HEIGHT
  )
  const renderedWidth = GRAPH_VIEWBOX_WIDTH * scale
  const renderedHeight = GRAPH_VIEWBOX_HEIGHT * scale
  const letterboxX = (svgRect.width - renderedWidth) / 2
  const letterboxY = (svgRect.height - renderedHeight) / 2

  return {
    x: (node.x / GRAPH_VIEWBOX_WIDTH) * renderedWidth + svgRect.left + letterboxX,
    y: (node.y / GRAPH_VIEWBOX_HEIGHT) * renderedHeight + svgRect.top + letterboxY,
  }
}

function getPanelPosition(
  node: NodeDatum,
  svgRect: DOMRect | null
): { left: number; top: number } {
  const { x: nodeScreenX, y: nodeScreenY } = getNodeScreenPosition(node, svgRect)

  const viewportWidth =
    typeof window !== "undefined" ? window.innerWidth : FALLBACK_VIEWPORT_WIDTH
  const viewportHeight =
    typeof window !== "undefined" ? window.innerHeight : FALLBACK_VIEWPORT_HEIGHT

  let top: number
  if (node.id === "Users") {
    // Users sits at the top edge of the graph — always flip below.
    top = nodeScreenY - 102
  } else if (node.id === "Zero Trust") {
    // Zero Trust sits at the bottom — render below the node, shifted right to clear the graph.
    top = nodeScreenY + 96
  } else if (
    node.id === "Signals" ||
    node.id === "Privileged Access" ||
    node.id === "Applications" ||
    node.id === "Directory & Graph"
  ) {
    // These nodes cluster near vertical mid-screen — the open-above/open-below
    // thresholds below invert the upper/lower pairs relative to each other
    // because PANEL_HEIGHT is large relative to their spacing. Center on the
    // node instead, same as Resources/Governance.
    top = nodeScreenY - PANEL_HEIGHT / 2
  } else if (nodeScreenY < viewportHeight * 0.4) {
    top = nodeScreenY + NODE_OFFSET
  } else if (nodeScreenY > viewportHeight * 0.6) {
    top = nodeScreenY - NODE_OFFSET - PANEL_HEIGHT
  } else {
    top = nodeScreenY - PANEL_HEIGHT / 2
  }

  let left: number
  if (node.id === "Zero Trust") {
    left = nodeScreenX + 40
  } else if (
    node.id === "Signals" ||
    node.id === "Resources" ||
    node.id === "Privileged Access"
  ) {
    // Left-side nodes — open the panel to the left, away from the graph.
    left = nodeScreenX - PANEL_WIDTH - NODE_OFFSET + 96
  } else if (
    node.id === "Applications" ||
    node.id === "Governance" ||
    node.id === "Directory & Graph"
  ) {
    // Right-side nodes — open the panel to the right, away from the graph,
    // with extra breathing room between the node and the panel edge.
    left = nodeScreenX + NODE_OFFSET + 36
  } else if (nodeScreenX < viewportWidth * 0.5) {
    left = nodeScreenX + NODE_OFFSET
  } else {
    left = nodeScreenX - PANEL_WIDTH - NODE_OFFSET
  }

  if (node.id === "Users") {
    left = left + 38
  }

  if (
    node.id === "Signals" ||
    node.id === "Resources" ||
    node.id === "Privileged Access" ||
    node.id === "Applications" ||
    node.id === "Governance"
  ) {
    top = top + 96
  }

  if (node.id === "Privileged Access") {
    top = top + 96
  }

  top = Math.max(top, 80)
  left = Math.max(left, 16)
  left = Math.min(left, viewportWidth - PANEL_WIDTH - 16)
  top = Math.min(top, viewportHeight - PANEL_HEIGHT - 16)

  if (node.id === "Privileged Access") {
    // Resources sits vertically centered on the left side and its top is
    // never higher on screen than this ceiling (same clamp as above). Force
    // Privileged Access to render at least 150px below that ceiling so the
    // two flyouts can never land on the same vertical position, since
    // Privileged Access sits lower on the graph than Resources.
    const resourcesMaxTop = viewportHeight - PANEL_HEIGHT - 16
    top = Math.max(top, resourcesMaxTop + 150)
  }

  if (node.id === "Directory & Graph") {
    // Governance sits vertically centered on the right side and its top is
    // never higher on screen than this ceiling (same clamp as above). Force
    // Directory & Graph to render at least 150px below that ceiling so the
    // two flyouts can never land on the same vertical position, since
    // Directory & Graph sits lower on the graph than Governance — the
    // mirror image of Privileged Access/Resources on the left side.
    const governanceMaxTop = viewportHeight - PANEL_HEIGHT - 16
    top = Math.max(top, governanceMaxTop + 150)
  }

  if (node.id === "Zero Trust") {
    // The clamp above caps top before the raw offset can push the panel any
    // lower, so shift down after clamping to actually move it on screen.
    top = top + 286
  }

  return { left, top }
}

const EXPLORE_TOPICS = [
  { label: "Authentication", icon: Fingerprint, description: "Verify who you are" },
  { label: "Authorization", icon: Lock, description: "Control what you can do" },
  { label: "Access Management", icon: UserPlus, description: "Manage access lifecycle" },
  { label: "Federation", icon: GitBranch, description: "Trust across domains" },
  { label: "Governance", icon: Shield, description: "Policies and compliance" },
  { label: "Signals & Risk", icon: Activity, description: "Detect and respond" },
  { label: "Workload Identity", icon: Cpu, description: "Machines and services" },
  { label: "More", icon: MoreHorizontal, description: "All domains" },
]

const SMALL_INSIGHTS = [
  {
    tag: "ZERO TRUST",
    title: "Hardening Identity Perimeters Against Lateral Movement",
    meta: "12 min read · Jun 29, 2026",
  },
  {
    tag: "IDENTITY GOVERNANCE",
    title: "Privileged Access Review that Actually Works",
    meta: "9 min read · Jun 29, 2026",
  },
]

const PLAYBOOKS = [
  { title: "Secure a New Entra Tenant", icon: Shield, steps: "12 STEPS" },
  { title: "Conditional Access Baseline", icon: ShieldCheck, steps: "18 STEPS" },
  { title: "Break Glass Accounts", icon: User, steps: "9 STEPS" },
  { title: "SCIM Troubleshooting", icon: Code, steps: "10 STEPS" },
  { title: "Cross Tenant Access", icon: GitMerge, steps: "14 STEPS" },
  { title: "PIM Implementation", icon: UserCheck, steps: "15 STEPS" },
]

export default function HomePage() {
  const [hoveredNode, setHoveredNode] = useState<NodeDatum | null>(null)
  const [pinnedNode, setPinnedNode] = useState<NodeDatum | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const activeNode = pinnedNode ?? hoveredNode
  // Read live on every render (not cached in state) so the panel stays
  // correctly placed across scroll/resize without needing extra listeners.
  const svgRect = svgRef.current?.getBoundingClientRect() ?? null

  const handleClose = useCallback(() => {
    setPinnedNode(null)
    setHoveredNode(null)
  }, [])

  const handleNodeClick = useCallback((d: NodeDatum | null) => {
    setPinnedNode(prev => prev?.id === d?.id ? null : d)
  }, [])

  const handleBackgroundClick = useCallback(() => {
    handleClose()
  }, [handleClose])

  useEffect(() => {
    window.addEventListener("scroll", handleClose)
    return () => window.removeEventListener("scroll", handleClose)
  }, [handleClose])

  return (
    <>
    <div
      style={{
        width: "100%",
        height: "calc(100vh - 64px)",
        margin: 0,
        padding: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        backgroundColor: "#ffffff",
      }}
      onClick={pinnedNode ? handleClose : undefined}
    >
      <div
        style={{ position: "relative", width: "100%", height: "100%" }}
        onClick={(e) => e.stopPropagation()}
      >
        <IdentityGraph
          ref={svgRef}
          onNodeHover={setHoveredNode}
          onNodeClick={handleNodeClick}
          onBackgroundClick={handleBackgroundClick}
          pinnedNode={pinnedNode}
          activeNodeId={activeNode?.id ?? null}
        />
        {activeNode !== null && (
          <div
            style={{
              position: "fixed",
              left: getPanelPosition(activeNode, svgRect).left,
              top: getPanelPosition(activeNode, svgRect).top,
            }}
          >
            <NodeContextPanel
              node={activeNode}
              isPinned={pinnedNode !== null}
              onUnpin={handleClose}
            />
          </div>
        )}
      </div>
    </div>

    <section className="w-full bg-white px-6 py-20 lg:px-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 lg:flex-row lg:items-center">
        <div className="lg:w-[60%]">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#1D9E75]">
            Journal
          </span>
          <h2
            className="mt-4 font-bold leading-tight text-[#0a0a0a]"
            style={{ fontSize: "48px" }}
          >
            Programmatic Tenant Diagnostics: Automating Security Analysis at Scale
          </h2>
          <p className="mt-4 text-base text-[#6b7280]">
            A hardened administrative script to rapidly map cross-tenant trust boundaries and misconfigurations.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-[#6b7280]">
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              8 min read
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              Jun 29, 2026
            </span>
            <span>·</span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">
              Automation
            </span>
          </div>
          <Link
            href="/journal"
            className="mt-6 inline-block font-semibold text-[#1D9E75] hover:text-[#17805f]"
          >
            Read the journal →
          </Link>
        </div>

        <div className="lg:w-[40%]">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#0f172a]">
            <svg
              viewBox="0 0 400 300"
              className="absolute inset-0 h-full w-full"
              preserveAspectRatio="xMidYMid slice"
            >
              <line x1="30" y1="60" x2="220" y2="60" stroke="#1D9E75" strokeWidth="1" opacity="0.4" />
              <line x1="30" y1="60" x2="30" y2="180" stroke="#1D9E75" strokeWidth="1" opacity="0.4" />
              <line x1="30" y1="180" x2="150" y2="240" stroke="#1D9E75" strokeWidth="1" opacity="0.3" />
              <line x1="150" y1="240" x2="320" y2="200" stroke="#1D9E75" strokeWidth="1" opacity="0.3" />
              <line x1="220" y1="60" x2="320" y2="120" stroke="#1D9E75" strokeWidth="1" opacity="0.3" />
              <line x1="320" y1="120" x2="320" y2="200" stroke="#1D9E75" strokeWidth="1" opacity="0.3" />
              <line x1="80" y1="100" x2="220" y2="60" stroke="#1D9E75" strokeWidth="0.75" opacity="0.2" />
              <line x1="80" y1="100" x2="30" y2="180" stroke="#1D9E75" strokeWidth="0.75" opacity="0.2" />

              <circle cx="30" cy="60" r="3" fill="#1D9E75" opacity="0.8" />
              <circle cx="220" cy="60" r="4" fill="#1D9E75" opacity="0.9" />
              <circle cx="30" cy="180" r="3" fill="#1D9E75" opacity="0.7" />
              <circle cx="80" cy="100" r="2.5" fill="#1D9E75" opacity="0.6" />
              <circle cx="150" cy="240" r="3.5" fill="#1D9E75" opacity="0.8" />
              <circle cx="320" cy="120" r="3" fill="#1D9E75" opacity="0.7" />
              <circle cx="320" cy="200" r="4" fill="#1D9E75" opacity="0.9" />
              <circle cx="370" cy="40" r="2" fill="#1D9E75" opacity="0.4" />
              <circle cx="60" cy="250" r="2" fill="#1D9E75" opacity="0.3" />
            </svg>
            <Terminal
              className="absolute bottom-4 right-4 text-[#1D9E75]"
              size={28}
            />
          </div>
        </div>
      </div>
    </section>

    <section className="w-full bg-white px-6 py-20 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#1D9E75]">
            Explore Topics
          </span>
          <Link
            href="/topics"
            className="text-sm font-semibold text-[#1D9E75] hover:text-[#17805f]"
          >
            View all topics →
          </Link>
        </div>

        <div className="mt-10 flex gap-8 overflow-x-auto lg:grid lg:grid-cols-8 lg:overflow-visible">
          {EXPLORE_TOPICS.map(({ label, icon: Icon, description }) => (
            <div
              key={label}
              className="flex w-32 shrink-0 flex-col items-center text-center lg:w-auto"
            >
              <Icon size={24} className="text-[#1D9E75]" />
              <span className="mt-3 text-sm font-bold text-[#0a0a0a]">
                {label}
              </span>
              <span className="mt-1 text-xs text-[#6b7280]">
                {description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="w-full bg-[#f8fafc] px-6 py-20 lg:px-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 lg:flex-row">
        <div className="lg:w-[60%]">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#1D9E75]">
            Recent Insights
          </span>

          <div className="mt-6 relative overflow-hidden rounded-xl bg-white p-8 shadow-sm">
            <div className="absolute right-8 top-8 hidden h-24 w-32 rounded-lg bg-[#0f172a] sm:block" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#1D9E75]">
              Conditional Access
            </span>
            <h3 className="mt-3 max-w-md text-2xl font-bold text-[#0a0a0a]">
              Auditing Conditional Access Policies at Scale
            </h3>
            <p className="mt-3 max-w-md text-base text-[#6b7280]">
              Operationally extract, decrypt, and diff Conditional Access policies to flag risk and drift.
            </p>
            <p className="mt-4 text-sm text-[#6b7280]">10 min read · Jun 29, 2026</p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {SMALL_INSIGHTS.map(({ tag, title, meta }) => (
              <div
                key={title}
                className="flex flex-col rounded-xl bg-white p-6 shadow-sm"
              >
                <span className="text-xs font-semibold uppercase tracking-widest text-[#1D9E75]">
                  {tag}
                </span>
                <h4 className="mt-3 text-base font-bold text-[#0a0a0a]">
                  {title}
                </h4>
                <p className="mt-3 text-sm text-[#6b7280]">{meta}</p>
                <span className="mt-4 font-semibold text-[#1D9E75]">→</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:w-[40%]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#1D9E75]">
              Playbooks
            </span>
            <Link
              href="/playbooks"
              className="text-sm font-semibold text-[#1D9E75] hover:text-[#17805f]"
            >
              View all playbooks →
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            {PLAYBOOKS.map(({ title, icon: Icon, steps }) => (
              <div
                key={title}
                className="flex flex-col rounded-lg bg-[#0f172a] p-5"
              >
                <Icon size={22} className="text-[#1D9E75]" />
                <h4 className="mt-4 text-sm font-bold text-white">{title}</h4>
                <span className="mt-3 inline-block w-fit rounded-full bg-[#1D9E75]/15 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-[#1D9E75]">
                  {steps}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
    </>
  )
}
