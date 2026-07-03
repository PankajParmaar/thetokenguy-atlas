"use client"

import Link from "next/link"

import { topics } from "@/lib/topics"

interface NodeContextPanelProps {
  hoveredNode: string | null
  pinnedNode: string | null
  onUnpin: () => void
}

const placeholderCounts = {
  topics: 12,
  articles: 48,
  playbooks: 8,
  labs: 15,
}

export default function NodeContextPanel({
  hoveredNode,
  pinnedNode,
  onUnpin,
}: NodeContextPanelProps) {
  const activeSlug = pinnedNode ?? hoveredNode
  const topic = topics.find((t) => t.slug === activeSlug)
  const isPinned = pinnedNode !== null

  return (
    <aside
      className={`
        relative w-80 rounded-xl border border-teal-500 bg-white shadow-md
        transition-all duration-200
        ${
          topic
            ? "translate-x-0 opacity-100"
            : "pointer-events-none translate-x-4 opacity-0"
        }
      `}
    >
      {topic && (
        <div className="flex h-full flex-col p-6">
          {isPinned && (
            <button
              type="button"
              onClick={onUnpin}
              aria-label="Unpin panel"
              className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              ×
            </button>
          )}

          <div className="flex items-center gap-3">
            <span className="text-3xl">{topic.icon}</span>
            <h2 className="text-xl font-bold text-slate-900">{topic.title}</h2>
          </div>

          <p className="mt-4 text-sm leading-6 text-slate-600">
            {topic.description}
          </p>

          <hr className="my-6 border-slate-200" />

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Topics</span>
              <span className="font-semibold">{placeholderCounts.topics}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Articles</span>
              <span className="font-semibold">{placeholderCounts.articles}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Playbooks</span>
              <span className="font-semibold">{placeholderCounts.playbooks}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Labs &amp; Tools</span>
              <span className="font-semibold">{placeholderCounts.labs}</span>
            </div>
          </div>

          <div className="mt-auto pt-8">
            <Link
              href={`/topics/${topic.slug}`}
              className="font-semibold text-teal-600 transition-colors hover:text-teal-700"
            >
              Click to explore →
            </Link>
          </div>
        </div>
      )}
    </aside>
  )
}
