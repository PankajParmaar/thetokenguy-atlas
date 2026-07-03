"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"

interface IdentityGraphProps {
  onNodeHover?: (slug: string | null) => void
  onNodeClick?: (slug: string | null) => void
}

interface NodeDatum {
  id: string
  x: number
  y: number
  center?: boolean
}

const CX = 300
const CY = 300
const RADIUS = 220

const outerNodeIds = [
  "Users",
  "Applications",
  "Governance",
  "Directory & Graph",
  "Privileged Access",
  "Resources",
  "Signals",
]

const nodes: NodeDatum[] = [
  { id: "Identity", x: CX, y: CY, center: true },
  ...outerNodeIds.map((id, index) => {
    const angle = (2 * Math.PI / 7) * index - Math.PI / 2
    return {
      id,
      x: Math.round(CX + RADIUS * Math.cos(angle)),
      y: Math.round(CY + RADIUS * Math.sin(angle)),
    }
  }),
]

const edgeLabels: Record<string, string> = {
  Users: "Authentication",
  Applications: "Authorization",
  "Directory & Graph": "Federation",
}

const nodeToSlug: Record<string, string> = {
  Users: "users",
  Applications: "applications",
  Governance: "governance",
  "Directory & Graph": "directory",
  "Privileged Access": "privileged-access",
  Resources: "resources",
  Signals: "signals",
}

function getCurvedPath(source: NodeDatum, target: NodeDatum): string {
  const mx = (source.x + target.x) / 2
  const my = (source.y + target.y) / 2
  const dx = target.x - source.x
  const dy = target.y - source.y
  // Perpendicular offset — always curves clockwise for consistent feel
  const offset = 40
  const cpx = mx - dy * offset / Math.hypot(dx, dy)
  const cpy = my + dx * offset / Math.hypot(dx, dy)
  return `M ${source.x} ${source.y} Q ${cpx} ${cpy} ${target.x} ${target.y}`
}

export default function IdentityGraph({ onNodeHover, onNodeClick }: IdentityGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const identity = nodes.find((n) => n.center)!

    // Draw edges
    nodes.slice(1).forEach((target) => {
      const safeClass = target.id.replace(/[\s&]/g, "-")
      const pathD = getCurvedPath(identity, target)

      svg
        .append("path")
        .attr("d", pathD)
        .attr("fill", "none")
        .attr("stroke", "#1D9E75")
        .attr("stroke-width", 1.5)
        .attr("opacity", 0.35)
        .attr("class", `edge edge-${safeClass}`)

      if (edgeLabels[target.id]) {
        const mx = (identity.x + target.x) / 2
        const my = (identity.y + target.y) / 2
        svg
          .append("text")
          .attr("x", mx)
          .attr("y", my - 12)
          .attr("text-anchor", "middle")
          .attr("font-size", "11px")
          .attr("fill", "#94A3B8")
          .attr("class", `edge-label edge-label-${safeClass}`)
          .text(edgeLabels[target.id])
      }
    })

    // Draw nodes
    nodes.forEach((node) => {
      const safeClass = node.id.replace(/[\s&]/g, "-")
      let packetInterval: ReturnType<typeof setInterval> | null = null
      const g = svg.append("g").attr("cursor", "pointer")

      if (node.center) {
        g.append("circle")
          .attr("cx", node.x)
          .attr("cy", node.y)
          .attr("r", 55)
          .attr("fill", "#1D9E7520")
          .attr("class", `node-glow node-glow-${safeClass}`)

        g.append("circle")
          .attr("cx", node.x)
          .attr("cy", node.y)
          .attr("r", 45)
          .attr("fill", "#1D9E75")
          .attr("class", `node node-${safeClass}`)

        g.append("text")
          .attr("x", node.x)
          .attr("y", node.y - 4)
          .attr("text-anchor", "middle")
          .attr("fill", "white")
          .attr("font-size", "14px")
          .attr("font-weight", "bold")
          .attr("class", `node-label node-label-${safeClass}`)
          .text("Identity")

        g.append("text")
          .attr("x", node.x)
          .attr("y", node.y + 10)
          .attr("text-anchor", "middle")
          .attr("fill", "white")
          .attr("font-size", "9px")
          .attr("class", `node-label node-label-${safeClass}`)
          .text("control plane")
      } else {
        g.append("circle")
          .attr("cx", node.x)
          .attr("cy", node.y)
          .attr("r", 18)
          .attr("fill", "#1D9E75")
          .attr("opacity", 1)
          .attr("class", `node node-${safeClass}`)

        g.append("text")
          .attr("x", node.x)
          .attr("y", node.y + 34)
          .attr("text-anchor", "middle")
          .attr("fill", "#1D9E75")
          .attr("font-size", "12px")
          .attr("class", `node-label node-label-${safeClass}`)
          .text(node.id)
      }

      g.on("mouseenter", () => {
        svg.selectAll<SVGCircleElement, unknown>(".node")
          .transition().duration(150).attr("opacity", 0.45)
        svg.selectAll(".node-label")
          .transition().duration(150).attr("opacity", 0.45)
        svg.selectAll("path.edge")
          .transition().duration(150).attr("opacity", 0.1)
        svg.selectAll(".edge-label")
          .transition().duration(150).attr("opacity", 0.15)

        svg.select(".node-Identity")
          .transition().duration(150).attr("opacity", 1)
        svg.select(".node-label-Identity")
          .transition().duration(150).attr("opacity", 1)

        const nodeCircle = node.center
          ? g.select<SVGCircleElement>(".node-Identity")
          : g.select<SVGCircleElement>("circle")

        nodeCircle
          .transition().duration(150)
          .attr("opacity", 1)
          .attr("r", node.center ? 45 : 24)
        g.select("text")
          .transition().duration(150).attr("opacity", 1)

        if (!node.center) {
          svg.select(`path.edge-${safeClass}`)
            .transition().duration(150)
            .attr("opacity", 1)
            .attr("stroke-width", 2.5)
          svg.select(`.edge-label-${safeClass}`)
            .transition().duration(150)
            .attr("opacity", 1)
            .attr("fill", "#1D9E75")

          packetInterval = setInterval(() => {
            const pathEl = svg.select(`path.edge-${safeClass}`).node() as SVGPathElement
            const totalLength = pathEl.getTotalLength()
            const startPoint = pathEl.getPointAtLength(totalLength)

            svg
              .append("circle")
              .attr("class", "packet")
              .attr("cx", startPoint.x)
              .attr("cy", startPoint.y)
              .attr("r", 4)
              .attr("fill", "#1D9E75")
              .attr("opacity", 0.8)
              .transition()
              .duration(1200)
              .ease(d3.easeLinear)
              .attrTween("cx", () => (t) => {
                const point = pathEl.getPointAtLength(totalLength * (1 - t))
                return String(point.x)
              })
              .attrTween("cy", () => (t) => {
                const point = pathEl.getPointAtLength(totalLength * (1 - t))
                return String(point.y)
              })
              .attr("opacity", 0)
              .on("end", function () {
                d3.select(this).remove()
              })
          }, 250)

          onNodeHover?.(nodeToSlug[node.id])
        }
      })

      g.on("mouseleave", () => {
        nodes.forEach((n) => {
          const nc = n.id.replace(/[\s&]/g, "-")
          svg.select(`.node-${nc}`)
            .transition().duration(150)
            .attr("opacity", 1)
        })
        svg.selectAll(".node-label")
          .transition().duration(150).attr("opacity", 1)
        svg.selectAll("path.edge")
          .transition().duration(150)
          .attr("opacity", 0.35)
          .attr("stroke-width", 1.5)
        svg.selectAll(".edge-label")
          .transition().duration(150)
          .attr("opacity", 1)
          .attr("fill", "#94A3B8")
        const nodeCircle = node.center
          ? g.select<SVGCircleElement>(".node-Identity")
          : g.select<SVGCircleElement>("circle")

        nodeCircle
          .transition().duration(150)
          .attr("r", node.center ? 45 : 18)

        if (!node.center) {
          if (packetInterval) {
            clearInterval(packetInterval)
            packetInterval = null
          }
          svg.selectAll(".packet").remove()
          onNodeHover?.(null)
        }
      })

      if (!node.center) {
        g.on("click", () => {
          onNodeClick?.(nodeToSlug[node.id])
        })
      }
    })

    // Pulse ring
    const pulse = svg
      .append("circle")
      .attr("cx", identity.x)
      .attr("cy", identity.y)
      .attr("r", 28)
      .attr("fill", "none")
      .attr("stroke", "#1D9E75")
      .attr("stroke-width", 2)
      .attr("opacity", 0.6)

    function repeat() {
      pulse
        .attr("r", 28).attr("opacity", 0.6)
        .transition().duration(1500).ease(d3.easeLinear)
        .attr("r", 52).attr("opacity", 0)
        .on("end", repeat)
    }
    repeat()

  }, [onNodeHover, onNodeClick])

  return (
    <svg
      ref={svgRef}
      width="600"
      height="600"
      className="overflow-visible"
    />
  )
}