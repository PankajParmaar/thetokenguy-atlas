"use client"

import { forwardRef, useEffect, useRef } from "react"
import * as d3 from "d3"
import * as LucideIcons from "lucide-react"
import { renderToStaticMarkup } from "react-dom/server"

interface IdentityGraphProps {
  onNodeHover?: (node: NodeDatum | null) => void
  onNodeClick?: (node: NodeDatum | null) => void
  onBackgroundClick?: () => void
  pinnedNode?: NodeDatum | null
  activeNodeId?: string | null
}

export interface NodeDatum {
  id: string
  x: number
  y: number
  center?: boolean
}

export const GRAPH_VIEWBOX_WIDTH = 900
export const GRAPH_VIEWBOX_HEIGHT = 760

const CX = 450
const CY = 380
const RADIUS = 190
const H_OUTER = RADIUS + 30
const V_OUTER = RADIUS + 60

const outerNodeIds = [
  { id: "Users", icon: "Users" },
  { id: "Applications", icon: "LayoutGrid" },
  { id: "Governance", icon: "ClipboardList" },
  { id: "Directory & Graph", icon: "Network" },
  { id: "Privileged Access", icon: "Lock" },
  { id: "Resources", icon: "Box" },
  { id: "Signals", icon: "TrendingUp" },
  { id: "Zero Trust", icon: "ShieldAlert" },
]

const outerBasePositions = outerNodeIds.map(({ id }, index) => {
  const angle = (2 * Math.PI / 7) * index - Math.PI / 2
  return {
    id,
    x: CX + RADIUS * Math.cos(angle),
    y: CY + RADIUS * Math.sin(angle),
  }
})

function findOuterBase(id: string) {
  return outerBasePositions.find((n) => n.id === id)!
}

const applicationsX = findOuterBase("Applications").x + 30
const applicationsY = findOuterBase("Applications").y

// Signals mirrors Applications horizontally
const signalsX = CX - (applicationsX - CX)
const signalsY = applicationsY

// Privileged Access mirrors Signals vertically
const privilegedAccessX = signalsX
const privilegedAccessY = CY + (CY - signalsY)

// Directory & Graph mirrors Applications vertically
const directoryX = applicationsX
const directoryY = CY + (CY - applicationsY)

const nodes: NodeDatum[] = [
  { id: "Identity", x: CX, y: CY, center: true },
  ...outerBasePositions.map(({ id, x, y }) => {
    switch (id) {
      case "Applications":
        return { id, x: CX + H_OUTER, y: applicationsY - 20 }
      case "Signals":
        return { id, x: CX - H_OUTER, y: signalsY - 20 }
      case "Privileged Access":
        return { id, x: CX - H_OUTER, y: privilegedAccessY + 30 }
      case "Directory & Graph":
        return { id, x: CX + H_OUTER, y: directoryY + 30 }
      case "Resources":
        return { id, x: CX - H_OUTER, y: CY }
      case "Governance":
        return { id, x: CX + H_OUTER, y: CY }
      case "Zero Trust":
        return { id, x: CX, y: CY + V_OUTER }
      case "Users":
        return { id, x, y: y - 60 }
      default:
        return { id, x, y }
    }
  }).map(({ id, x, y }) => ({ id, x: Math.round(x), y: Math.round(y) })),
]

export const nodeToSlug: Record<string, string> = {
  Users: "users",
  Applications: "applications",
  Governance: "governance",
  "Directory & Graph": "directory",
  "Privileged Access": "privileged-access",
  Resources: "resources",
  Signals: "signals",
  "Zero Trust": "zero-trust",
}

function getLabelPosition(node: NodeDatum): { x: number; y: number; anchor: string } {
  switch (node.id) {
    case "Users":
      // Top node — label above the circle
      return { x: node.x, y: node.y - 42, anchor: "middle" }
    case "Privileged Access":
    case "Directory & Graph":
    case "Applications":
      // Bottom nodes — label below the circle
      return { x: node.x, y: node.y + 48, anchor: "middle" }
    case "Signals":
      // Below the circle, to make room to the side
      return { x: node.x, y: node.y + 48, anchor: "middle" }
    case "Resources":
    case "Governance":
      // Below the circle
      return { x: node.x, y: node.y + 48, anchor: "middle" }
    case "Zero Trust":
      // Bottom node, mirroring Users — label below the circle
      return { x: node.x, y: node.y + 48, anchor: "middle" }
    default:
      return { x: node.x + 42, y: node.y + 5, anchor: "start" }
  }
}

function hashSeed(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0
  }
  return hash
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

interface ControlPointOffset {
  cp1: { x: number; y: number }
  cp2: { x: number; y: number }
}

const fiberControlPoints: Record<string, ControlPointOffset> = {
  // Gentle S, nearly straight
  Users: { cp1: { x: 30, y: 0 }, cp2: { x: -30, y: 0 } },
  // S-curve bowing left then right
  Signals: { cp1: { x: -120, y: 0 }, cp2: { x: 90, y: 0 } },
  // Mirror of Signals
  Applications: { cp1: { x: 120, y: 0 }, cp2: { x: -90, y: 0 } },
  // Gentle curve only, no S-bend
  Resources: { cp1: { x: -60, y: -20 }, cp2: { x: 40, y: 20 } },
  // Mirror of Resources
  Governance: { cp1: { x: 60, y: -20 }, cp2: { x: -40, y: 20 } },
  // Mirror of Signals, vertically
  "Privileged Access": { cp1: { x: -120, y: 0 }, cp2: { x: 90, y: 0 } },
  // Mirror of Applications, vertically
  "Directory & Graph": { cp1: { x: 120, y: 0 }, cp2: { x: -90, y: 0 } },
  // Mirror of Users
  "Zero Trust": { cp1: { x: 0, y: 60 }, cp2: { x: 0, y: -40 } },
}

function getFiberPaths(source: NodeDatum, target: NodeDatum, nodeId: string): string[] {
  const strandCount: number = 12

  // Applications' node was shifted +30px right (see nodes array); keep the S-curve's
  // control points anchored to its original position so only the strand endpoints
  // track the node to its new spot
  const curvatureTarget = nodeId === "Applications" ? { ...target, x: target.x - 30 } : target

  const baseAngle = Math.atan2(curvatureTarget.y - source.y, curvatureTarget.x - source.x)
  const originSpreadDeg = 25
  const terminationSpreadDeg = 15
  const originRadius = 80
  const terminationRadius = 28

  const offsets = fiberControlPoints[nodeId] ?? { cp1: { x: 0, y: 0 }, cp2: { x: 0, y: 0 } }
  const baseSeed = hashSeed(nodeId)

  return Array.from({ length: strandCount }, (_, i) => {
    const t = strandCount === 1 ? 0.5 : i / (strandCount - 1)

    // Origins spread across a +/-25 degree arc on the Identity circle
    const originAngle = baseAngle + ((-originSpreadDeg + originSpreadDeg * 2 * t) * Math.PI) / 180
    const originX = source.x + originRadius * Math.cos(originAngle)
    const originY = source.y + originRadius * Math.sin(originAngle)

    // Terminations spread across a +/-15 degree arc on the outer node circle
    const terminationAngle = baseAngle + Math.PI + ((-terminationSpreadDeg + terminationSpreadDeg * 2 * t) * Math.PI) / 180
    const termX = target.x + terminationRadius * Math.cos(terminationAngle)
    const termY = target.y + terminationRadius * Math.sin(terminationAngle)

    // Control points sit at 35%/65% along the straight Identity-to-node line,
    // then get a per-node perpendicular offset to form the S-curve inflection
    const point35x = source.x + (curvatureTarget.x - source.x) * 0.35
    const point35y = source.y + (curvatureTarget.y - source.y) * 0.35
    const point65x = source.x + (curvatureTarget.x - source.x) * 0.65
    const point65y = source.y + (curvatureTarget.y - source.y) * 0.65

    // Small per-strand jitter on each control point, seeded by nodeId + strand index
    const jitter1x = (seededRandom(baseSeed + i * 13) - 0.5) * 20
    const jitter1y = (seededRandom(baseSeed + i * 17) - 0.5) * 20
    const jitter2x = (seededRandom(baseSeed + i * 19) - 0.5) * 20
    const jitter2y = (seededRandom(baseSeed + i * 23) - 0.5) * 20

    const cp1x = point35x + offsets.cp1.x + jitter1x
    const cp1y = point35y + offsets.cp1.y + jitter1y
    const cp2x = point65x + offsets.cp2.x + jitter2x
    const cp2y = point65y + offsets.cp2.y + jitter2y

    return `M ${originX} ${originY} C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${termX} ${termY}`
  })
}

function getIconSvgString(iconName: string, size = 20): string {
  const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>>)[iconName]
  if (!IconComponent) return ""
  return renderToStaticMarkup(
    <IconComponent
      width={size}
      height={size}
      stroke="#0a0a0a"
      strokeWidth={1.5}
      fill="none"
    />
  )
}

const IdentityGraph = forwardRef<SVGSVGElement, IdentityGraphProps>(function IdentityGraph({
  onNodeHover,
  onNodeClick,
  onBackgroundClick,
  pinnedNode,
  activeNodeId,
}, forwardedRef) {
  const svgRef = useRef<SVGSVGElement>(null)
  const pinnedNodeRef = useRef<NodeDatum | null>(null)
  const activeIntervalsRef = useRef<Map<string, ReturnType<typeof setInterval>>>(new Map())

  useEffect(() => {
    pinnedNodeRef.current = pinnedNode ?? null
  }, [pinnedNode])

  useEffect(() => {
    if (activeNodeId !== null && activeNodeId !== undefined) return
    const svg = d3.select(svgRef.current)
    activeIntervalsRef.current.forEach((interval) => clearInterval(interval))
    activeIntervalsRef.current.clear()
    svg.selectAll("[class^='packet']").remove()
    nodes.forEach((n) => {
      const nc = n.id.replace(/[\s&]/g, "-")
      svg.select(`.node-circle-${nc}`).transition().duration(150)
        .attr("r", n.center ? 80 : 28)
        .attr("fill", n.center ? "#1D9E75" : "white")
        .attr("filter", n.center ? "url(#centerGlow)" : "url(#nodeDropShadow)")
    })
    svg.selectAll(".node-label-text").transition().duration(150).attr("opacity", 1)
    svg.selectAll("path.edge").transition().duration(150).attr("opacity", 0.18).attr("stroke-width", 0.6)
    svg.selectAll(".edge-arrow").transition().duration(150).attr("opacity", 0.15)
  }, [activeNodeId])

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const W = GRAPH_VIEWBOX_WIDTH
    const H = GRAPH_VIEWBOX_HEIGHT

    // Defs
    const defs = svg.append("defs")

    // Center glow filter
    const glowFilter = defs.append("filter").attr("id", "centerGlow").attr("x", "-50%").attr("y", "-50%").attr("width", "200%").attr("height", "200%")
    glowFilter.append("feGaussianBlur").attr("stdDeviation", "8").attr("result", "coloredBlur")
    const feMerge = glowFilter.append("feMerge")
    feMerge.append("feMergeNode").attr("in", "coloredBlur")
    feMerge.append("feMergeNode").attr("in", "SourceGraphic")

    // Node drop shadow
    const shadowFilter = defs.append("filter").attr("id", "nodeDropShadow").attr("x", "-30%").attr("y", "-30%").attr("width", "160%").attr("height", "160%")
    shadowFilter.append("feDropShadow").attr("dx", "0").attr("dy", "2").attr("stdDeviation", "4").attr("flood-color", "#1D9E75").attr("flood-opacity", "0.25")

    // Arrow marker
    defs.append("marker")
      .attr("id", "arrowTeal")
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 9)
      .attr("refY", 5)
      .attr("markerWidth", 5)
      .attr("markerHeight", 5)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M 0 2 L 10 5 L 0 8 z")
      .attr("fill", "#1D9E75")
      .attr("opacity", 0.6)

    // Background particles
    const particleCount = 60
    for (let i = 0; i < particleCount; i++) {
      svg.append("circle")
        .attr("cx", Math.random() * W)
        .attr("cy", Math.random() * H)
        .attr("r", Math.random() * 2.5 + 0.5)
        .attr("fill", "#d1d5db")
        .attr("opacity", Math.random() * 0.2 + 0.05)
        .attr("class", "bg-particle")
    }

    svg.append("rect").attr("width", W).attr("height", H).attr("fill", "transparent")

    const identity = nodes.find((n) => n.center)!
    const activeIntervals = activeIntervalsRef.current

    // Draw fiber-optic bundle edges
    nodes.slice(1).forEach((target) => {
      const safeClass = target.id.replace(/[\s&]/g, "-")
      const paths = getFiberPaths(identity, target, target.id)

      paths.forEach((pathD, i) => {
        svg.append("path")
          .attr("d", pathD)
          .attr("fill", "none")
          .attr("stroke", "#00D4FF")
          .attr("stroke-width", 0.6)
          .attr("opacity", 0.18)
          .attr("class", `edge edge-${safeClass} edge-${safeClass}-${i}`)
      })

      // Spine — single wider path along the direct midpoint, anchoring the bundle
      const mx = (identity.x + target.x) / 2
      const my = (identity.y + target.y) / 2
      svg.append("path")
        .attr("d", `M ${identity.x} ${identity.y} Q ${mx} ${my} ${target.x} ${target.y}`)
        .attr("fill", "none")
        .attr("stroke", "#00D4FF")
        .attr("stroke-width", 1)
        .attr("opacity", 0.15)
        .attr("class", `edge edge-${safeClass} edge-${safeClass}-spine`)
    })

    // Draw nodes
    nodes.forEach((node) => {
      const safeClass = node.id.replace(/[\s&]/g, "-")
      const nodeInfo = outerNodeIds.find(n => n.id === node.id)
      const g = svg.append("g").datum(node).attr("cursor", "pointer")

      if (node.center) {
        // Outer glow ring
        g.append("circle")
          .attr("cx", node.x).attr("cy", node.y)
          .attr("r", 110)
          .attr("fill", "#1D9E7508")
          .attr("stroke", "#1D9E75")
          .attr("stroke-width", 0.5)
          .attr("opacity", 0.4)

        g.append("circle")
          .attr("cx", node.x).attr("cy", node.y)
          .attr("r", 80)
          .attr("fill", "#1D9E75")
          .attr("filter", "url(#centerGlow)")
          .attr("class", `node-circle node-circle-${safeClass}`)

        // Center person icon (SVG foreignObject)
        const iconStr = getIconSvgString("User", 38)
        if (iconStr) {
          const fo = g.append("foreignObject")
            .attr("x", node.x - 19)
            .attr("y", node.y - 57)
            .attr("width", 38)
            .attr("height", 38)
          fo.append("xhtml:div")
            .style("color", "white")
            .style("display", "flex")
            .html(iconStr.replace(/stroke="#0a0a0a"/, 'stroke="white"'))
        }

        g.append("text")
          .attr("x", node.x).attr("y", node.y + 6)
          .attr("text-anchor", "middle")
          .attr("fill", "white")
          .attr("font-size", "18px")
          .attr("font-weight", "700")
          .attr("font-family", "system-ui, sans-serif")
          .attr("class", `node-label-text node-label-center`)
          .text("Identity")

        g.append("text")
          .attr("x", node.x).attr("y", node.y + 26)
          .attr("text-anchor", "middle")
          .attr("fill", "white")
          .attr("font-size", "10px")
          .attr("font-family", "system-ui, sans-serif")
          .attr("opacity", 1)
          .attr("class", `node-label-center`)
          .text("The control plane")

        g.append("text")
          .attr("x", node.x).attr("y", node.y + 42)
          .attr("text-anchor", "middle")
          .attr("fill", "white")
          .attr("font-size", "10px")
          .attr("font-family", "system-ui, sans-serif")
          .attr("opacity", 1)
          .attr("class", `node-label-center`)
          .text("for digital trust")

      } else {
        // White circle node
        g.append("circle")
          .attr("cx", node.x).attr("cy", node.y)
          .attr("r", 28)
          .attr("fill", "white")
          .attr("stroke", "#e5e7eb")
          .attr("stroke-width", 1)
          .attr("opacity", 0.9)
          .attr("filter", "url(#nodeDropShadow)")
          .attr("class", `node-circle node-circle-${safeClass}`)

        // Icon inside circle
        if (nodeInfo) {
          const iconStr = getIconSvgString(nodeInfo.icon, 34)
          if (iconStr) {
            const fo = g.append("foreignObject")
              .attr("x", node.x - 17)
              .attr("y", node.y - 17)
              .attr("width", 34)
              .attr("height", 34)
            fo.append("xhtml:div")
              .style("display", "flex")
              .html(iconStr)
          }
        }

        // Label to the right
        const labelPos = getLabelPosition(node)
        g.append("text")
          .attr("x", labelPos.x)
          .attr("y", labelPos.y)
          .attr("text-anchor", labelPos.anchor)
          .attr("fill", "#0a0a0a")
          .attr("font-size", "13px")
          .attr("font-weight", "600")
          .attr("font-family", "system-ui, sans-serif")
          .attr("class", `node-label-text node-label-${safeClass}`)
          .text(node.id)
      }

      g.on("mouseenter", (event: MouseEvent, d: NodeDatum) => {
        event.stopPropagation()

        svg.selectAll<SVGCircleElement, unknown>(".node-circle")
          .transition().duration(150).attr("opacity", 0.3)
        svg.select(".node-circle-Identity")
          .transition().duration(150).attr("opacity", 1)
        svg.select(".node-glow-Identity")
          .transition().duration(150).attr("opacity", 1)
        svg.selectAll(".node-label-text")
          .transition().duration(150).attr("opacity", 0.3)
        svg.selectAll(".node-label-center")
          .transition().duration(150).attr("opacity", 1)
        svg.selectAll("path.edge")
          .transition().duration(150).attr("opacity", 0.05)

        svg.select(`.node-circle-${safeClass}`)
          .transition().duration(150)
          .attr("opacity", 1)
          .attr("r", node.center ? 84 : 32)
        g.selectAll(".node-label-text")
          .transition().duration(150).attr("opacity", 1)

        if (!node.center) {
          svg.selectAll(`path.edge-${safeClass}`)
            .transition().duration(150)
            .attr("opacity", 0.5)
            .attr("stroke-width", 1.2)

          const existingInterval = activeIntervals.get(node.id)
          if (existingInterval) clearInterval(existingInterval)

          const interval = setInterval(() => {
            const pathEl = svg.select(`path.edge-${safeClass}-0`).node() as SVGPathElement
            if (!pathEl) return
            const totalLength = pathEl.getTotalLength()
            const startPoint = pathEl.getPointAtLength(totalLength)

            svg.append("circle")
              .attr("class", `packet packet-${safeClass}`)
              .attr("cx", startPoint.x)
              .attr("cy", startPoint.y)
              .attr("r", 3)
              .attr("fill", "#1D9E75")
              .attr("opacity", 0.9)
              .transition()
              .duration(1000)
              .ease(d3.easeLinear)
              .attrTween("cx", () => (t) => String(pathEl.getPointAtLength(totalLength * (1 - t)).x))
              .attrTween("cy", () => (t) => String(pathEl.getPointAtLength(totalLength * (1 - t)).y))
              .attr("opacity", 0)
              .on("end", function (this: Element) {
                d3.select(this).remove()
              })

            setTimeout(() => {
              const outwardPathEl = svg.select(`path.edge-${safeClass}-11`).node() as SVGPathElement
              if (!outwardPathEl) return
              const outwardTotalLength = outwardPathEl.getTotalLength()
              const outwardStartPoint = outwardPathEl.getPointAtLength(0)

              svg.append("circle")
                .attr("class", `packet packet-${safeClass}`)
                .attr("cx", outwardStartPoint.x)
                .attr("cy", outwardStartPoint.y)
                .attr("r", 3.5)
                .attr("fill", "white")
                .attr("stroke", "#1D9E75")
                .attr("stroke-width", 1)
                .attr("opacity", 1)
                .transition()
                .duration(1000)
                .ease(d3.easeLinear)
                .attrTween("cx", () => (t) => String(outwardPathEl.getPointAtLength(outwardTotalLength * t).x))
                .attrTween("cy", () => (t) => String(outwardPathEl.getPointAtLength(outwardTotalLength * t).y))
                .attr("opacity", 0.6)
                .on("end", function (this: Element) {
                  d3.select(this).remove()
                })
            }, 100)
          }, 200)

          activeIntervals.set(node.id, interval)
          onNodeHover?.(d)
        }
      })

      g.on("mouseleave", (event: MouseEvent, d: NodeDatum) => {
        event.stopPropagation()
        if (pinnedNodeRef.current?.id === d.id) return

        svg.selectAll(".node-circle").transition().duration(150).attr("opacity", 1)
        svg.selectAll(".node-label-text").transition().duration(150).attr("opacity", 1)
        svg.selectAll("path.edge").transition().duration(150)
          .attr("opacity", 0.18)
          .attr("stroke-width", 0.6)
        svg.select(`.node-circle-${safeClass}`)
          .transition().duration(150)
          .attr("r", node.center ? 80 : 28)

        if (!node.center) {
          const interval = activeIntervals.get(node.id)
          if (interval) { clearInterval(interval); activeIntervals.delete(node.id) }
          svg.selectAll(`.packet-${safeClass}`).remove()
          onNodeHover?.(null)
        }
      })

      if (!node.center) {
        g.on("click", (event: MouseEvent, d: NodeDatum) => {
          event.stopPropagation()
          onNodeClick?.(d)
        })
      }
    })

    // Pulse ring on center
    const pulse = svg.append("circle")
      .attr("cx", identity.x).attr("cy", identity.y)
      .attr("r", 80).attr("fill", "none")
      .attr("stroke", "#1D9E75").attr("stroke-width", 1.5).attr("opacity", 0.5)

    function repeat() {
      pulse.attr("r", 80).attr("opacity", 0.5)
        .transition().duration(2000).ease(d3.easeLinear)
        .attr("r", 120).attr("opacity", 0)
        .on("end", repeat)
    }
    repeat()

    return () => {
      activeIntervals.forEach((interval) => clearInterval(interval))
      activeIntervals.clear()
    }
  }, [onNodeHover, onNodeClick])

  return (
    <svg
      ref={(el) => {
        svgRef.current = el
        if (typeof forwardedRef === "function") forwardedRef(el)
        else if (forwardedRef) forwardedRef.current = el
      }}
      viewBox={`0 0 ${GRAPH_VIEWBOX_WIDTH} ${GRAPH_VIEWBOX_HEIGHT}`}
      preserveAspectRatio="xMidYMid meet"
      className="w-full h-full max-w-full max-h-full overflow-visible"
      onClick={onBackgroundClick}
    />
  )
})

export default IdentityGraph
