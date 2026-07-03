"use client"

import { useState } from "react"

import IdentityGraph from "@/components/graph/IdentityGraph"
import NodeContextPanel from "@/components/NodeContextPanel"

export default function HomePage() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [pinnedNode, setPinnedNode] = useState<string | null>(null)

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8fafc",
      }}
    >
      <div style={{ position: "relative" }}>
        <IdentityGraph
          onNodeHover={setHoveredNode}
          onNodeClick={setPinnedNode}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: "-340px",
            transform: "translateY(-50%)",
          }}
        >
          <NodeContextPanel
            hoveredNode={hoveredNode}
            pinnedNode={pinnedNode}
            onUnpin={() => setPinnedNode(null)}
          />
        </div>
      </div>
    </div>
  )
}
