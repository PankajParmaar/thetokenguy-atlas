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

const links = nodes.slice(1).map((n) => ({
  source: "Identity",
  target: n.id,
}))

const edgeLabels: Record<string, string> = {
  Users: "Authentication",
  Applications: "Authorization",
  Directory: "Federation",
}

export default function IdentityGraph() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    links.forEach((link) => {
      const source = nodes.find((n) => n.id === link.source)!
      const target = nodes.find((n) => n.id === link.target)!

      svg
        .append("line")
        .attr("x1", source.x)
        .attr("y1", source.y)
        .attr("x2", target.x)
        .attr("y2", target.y)
        .attr("stroke", "#1D9E75")
        .attr("stroke-width", 1.5)
        .attr("opacity", 0.35)
        .attr("class", `edge edge-${target.id.replace(/\s/g, "-")}`)

      if (edgeLabels[target.id]) {
        const midX = (source.x + target.x) / 2
        const midY = (source.y + target.y) / 2

        svg
          .append("text")
          .attr("x", midX)
          .attr("y", midY - 10)
          .attr("text-anchor", "middle")
          .attr("font-size", "11px")
          .attr("fill", "#94A3B8")
          .attr("class", `edge-label edge-label-${target.id.replace(/\s/g, "-")}`)
          .text(edgeLabels[target.id])
      }
    })

    nodes.forEach((node) => {
      const nodeClass = node.id.replace(/\s/g, "-")

      const g = svg.append("g").attr("cursor", "pointer")

      g.append("circle")
        .attr("cx", node.x)
        .attr("cy", node.y)
        .attr("r", node.center ? 28 : 18)
        .attr("fill", "#1D9E75")
        .attr("opacity", node.center ? 1 : 0.75)
        .attr("class", `node node-${nodeClass}`)

      g.append("text")
        .attr("x", node.x)
        .attr("y", node.y + (node.center ? 44 : 34))
        .attr("text-anchor", "middle")
        .attr("fill", "#1D9E75")
        .attr("font-size", "12px")
        .attr("class", `node-label node-label-${nodeClass}`)
        .text(node.id)

      g.on("mouseenter", function () {
        // Fade everything
        svg.selectAll(".node")
          .transition()
          .duration(150)
          .attr("opacity", 0.2)

        svg.selectAll(".node-label")
          .transition()
          .duration(150)
          .attr("opacity", 0.2)

        svg.selectAll(".edge")
          .transition()
          .duration(150)
          .attr("opacity", 0.1)

        svg.selectAll(".edge-label")
          .transition()
          .duration(150)
          .attr("opacity", 0.15)

        // Identity always stays visible
        svg.select(".node-Identity")
          .transition()
          .duration(150)
          .attr("opacity", 1)

        svg.select(".node-label-Identity")
          .transition()
          .duration(150)
          .attr("opacity", 1)

        // Hovered node
        d3.select(this)
          .select("circle")
          .transition()
          .duration(150)
          .attr("opacity", 1)
          .attr("r", node.center ? 34 : 24)

        d3.select(this)
          .select("text")
          .transition()
          .duration(150)
          .attr("opacity", 1)

        if (!node.center) {
          svg.select(`.edge-${nodeClass}`)
            .transition()
            .duration(150)
            .attr("opacity", 1)
            .attr("stroke-width", 2.5)

          svg.select(`.edge-label-${nodeClass}`)
            .transition()
            .duration(150)
            .attr("opacity", 1)
            .attr("fill", "#1D9E75")
        }
      })

      .on("mouseleave", function () {

        svg.selectAll(".node")
          .transition()
          .duration(150)
          .attr("opacity", function () {
            return d3.select(this).classed("node-Identity") ? 1 : 0.75
          })

        svg.selectAll(".node-label")
          .transition()
          .duration(150)
          .attr("opacity", 1)

        svg.selectAll(".edge")
          .transition()
          .duration(150)
          .attr("opacity", 0.35)
          .attr("stroke-width", 1.5)

        svg.selectAll(".edge-label")
          .transition()
          .duration(150)
          .attr("opacity", 1)
          .attr("fill", "#94A3B8")

        d3.select(this)
          .select("circle")
          .transition()
          .duration(150)
          .attr("r", node.center ? 28 : 18)
      })

      .on("click", function () {
        switch (node.id) {
          case "Applications":
            window.location.href = "/topics/applications"
            break

          default:
            // Remaining topic pages will be added later.
            break
        }
      })
    })
  }, [])

  return <svg ref={svgRef} width="800" height="600" />
}