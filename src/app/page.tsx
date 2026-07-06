"use client"

import { useState, useCallback } from "react"
import IdentityGraph, { NodeDatum } from "@/components/graph/IdentityGraph"
import NodeContextPanel from "@/components/NodeContextPanel"

const panelPositionByNodeId: Record<string, { left: number; top: number }> = {
  Applications: { left: 90, top: -60 },
  Governance: { left: 90, top: -60 },
  "Directory & Graph": { left: 90, top: -60 },
  Signals: { left: -420, top: -60 },
  Resources: { left: -420, top: -60 },
  "Privileged Access": { left: -420, top: -60 },
  Users: { left: 50, top: -300 },
  "Zero Trust": { left: 50, top: -15 },
}

function getPanelPosition(node: NodeDatum): { left: number; top: number } {
  const offset = panelPositionByNodeId[node.id] ?? { left: 50, top: -60 }
  return { left: node.x + offset.left, top: node.y + offset.top }
}

export default function HomePage() {
  const [hoveredNode, setHoveredNode] = useState<NodeDatum | null>(null)
  const [pinnedNode, setPinnedNode] = useState<NodeDatum | null>(null)

  const activeNode = pinnedNode ?? hoveredNode

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
      onClick={pinnedNode ? handleClose : undefined}
    >
      <div
        style={{ position: "relative" }}
        onClick={(e) => e.stopPropagation()}
      >
        <IdentityGraph
          onNodeHover={setHoveredNode}
          onNodeClick={handleNodeClick}
          onBackgroundClick={handleBackgroundClick}
          pinnedNode={pinnedNode}
          activeNodeId={activeNode?.id ?? null}
        />
        {activeNode !== null && (
          <div
            style={{
              position: "absolute",
              left: getPanelPosition(activeNode).left,
              top: getPanelPosition(activeNode).top,
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
  )
}
