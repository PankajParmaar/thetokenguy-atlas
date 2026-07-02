"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"

const nodes = [
  { id: "Identity", x: 400, y: 300, center: true },
  { id: "Users", x: 200, y: 150 },
  { id: "Applications", x: 400, y: 100 },
  { id: "Governance", x: 600, y: 150 },
  { id: "Directory", x: 650, y: 300 },
  { id: "Privileged Access", x: 600, y: 450 },
  { id: "Resources", x: 400, y: 500 },
  { id: "Signals", x: 200, y: 450 },
]

const links = nodes.slice(1).map((n) => ({ source: "Identity", target: n.id }))

export default function IdentityGraph() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    links.forEach((link) => {
      const source = nodes.find((n) => n.id === link.source)!
      const target = nodes.find((n) => n.id === link.target)!
      svg.append("line")
        .attr("x1", source.x).attr("y1", source.y)
        .attr("x2", target.x).attr("y2", target.y)
        .attr("stroke", "#1D9E75").attr("stroke-width", 1.5).attr("opacity", 0.4)
    })

    nodes.forEach((node) => {
      const g = svg.append("g").attr("cursor", "pointer")

      g.append("circle")
        .attr("cx", node.x).attr("cy", node.y)
        .attr("r", node.center ? 28 : 18)
        .attr("fill", "#1D9E75")
        .attr("opacity", node.center ? 1 : 0.75)
        .attr("class", `node-${node.id.replace(/\s/g, "-")}`)

      g.append("text")
        .attr("x", node.x).attr("y", node.y + (node.center ? 44 : 34))
        .attr("text-anchor", "middle")
        .attr("fill", "#1D9E75").attr("font-size", "12px")
        .text(node.id)

      g.on("mouseenter", function () {
        d3.select(this).select("circle")
          .transition().duration(150)
          .attr("r", node.center ? 34 : 24)
          .attr("opacity", 1)
      })
      .on("mouseleave", function () {
        d3.select(this).select("circle")
          .transition().duration(150)
          .attr("r", node.center ? 28 : 18)
          .attr("opacity", node.center ? 1 : 0.75)
      })
      .on("click", function () {
        if (!node.center) {
          window.location.href = `/topics/${node.id.toLowerCase().replace(/\s/g, "-")}`
        }
      })
    })
  }, [])

  return <svg ref={svgRef} width="800" height="600" />
}