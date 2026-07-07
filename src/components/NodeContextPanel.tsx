"use client"

import Link from "next/link"
import * as LucideIcons from "lucide-react"

import { topics } from "@/lib/topics"
import { NodeDatum, nodeToSlug } from "@/components/graph/IdentityGraph"

interface NodeContextPanelProps {
  node: NodeDatum | null
  isPinned: boolean
  onUnpin: () => void
}

const placeholderCounts = {
  topics: 12,
  articles: 48,
  playbooks: 8,
  labs: 15,
}

export default function NodeContextPanel({
  node,
  isPinned,
  onUnpin,
}: NodeContextPanelProps) {
  const topic = topics.find((t) => t.slug === (node ? nodeToSlug[node.id] : null))
  const isHorizontal = node?.id === "Users" || node?.id === "Zero Trust"
  const isZeroTrust = node?.id === "Zero Trust"
  const isUsers = node?.id === "Users"

  return (
    <div
      style={{ pointerEvents: isPinned ? 'auto' : 'none' }}
      className={`
        relative rounded-xl border border-teal-500 bg-white shadow-md
        transition-all duration-200
        ${isHorizontal ? 'w-[560px]' : 'w-64'}
        ${topic ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"}
      `}
    >
      {topic && (
        <>
          {isPinned && (
            <button
              type="button"
              onClick={onUnpin}
              aria-label="Unpin panel"
              className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 z-10"
            >
              ×
            </button>
          )}

          {isHorizontal ? (
            <div className="flex flex-row pt-1 px-2 pb-3 gap-3">
              <div className="flex flex-col justify-center gap-2 flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  {(() => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const IconComponent = topic.lucideIcon
                      ? (LucideIcons as Record<string, any>)[topic.lucideIcon]
                      : null
                    return IconComponent
                      ? <IconComponent size={24} stroke="#000000" strokeWidth={1.5} />
                      : <span className="text-2xl">{topic.icon}</span>
                  })()}
                  <h2 className="text-lg font-bold text-slate-900">{topic.title}</h2>
                </div>
                <p className="text-sm leading-5 text-slate-600">{topic.description}</p>
                <Link
                  href={`/topics/${topic.slug}`}
                  className="mt-1 text-sm font-semibold text-teal-600 transition-colors hover:text-teal-700"
                >
                  Click to explore →
                </Link>
              </div>

              <div className="w-px bg-slate-200 self-stretch" />

              <div className="flex flex-col justify-center gap-2 text-sm w-fit shrink-0">
                <div className="flex justify-start gap-2">
                  <span className="text-slate-500">Topics</span>
                  {!isZeroTrust && !isUsers && <span className="font-semibold">{placeholderCounts.topics}</span>}
                </div>
                <div className="flex justify-start gap-2">
                  <span className="text-slate-500">Articles</span>
                  {!isZeroTrust && !isUsers && <span className="font-semibold">{placeholderCounts.articles}</span>}
                </div>
                <div className="flex justify-start gap-2">
                  <span className="text-slate-500">Playbooks</span>
                  {!isZeroTrust && !isUsers && <span className="font-semibold">{placeholderCounts.playbooks}</span>}
                </div>
                <div className="flex justify-start gap-2">
                  <span className="text-slate-500">Labs &amp; Tools</span>
                  {!isZeroTrust && !isUsers && <span className="font-semibold">{placeholderCounts.labs}</span>}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col pt-1 px-2 pb-3">
              <div className="flex items-center gap-2">
                {(() => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const IconComponent = topic.lucideIcon
                    ? (LucideIcons as Record<string, any>)[topic.lucideIcon]
                    : null
                  return IconComponent
                    ? <IconComponent size={22} stroke="#000000" strokeWidth={1.5} />
                    : <span className="text-2xl">{topic.icon}</span>
                })()}
                <h2 className="text-base font-bold text-slate-900">{topic.title}</h2>
              </div>
              <p className="mt-0.5 text-xs leading-5 text-slate-600">{topic.description}</p>
              <hr className="my-1.5 border-slate-200" />
              <div className="space-y-1 text-xs">
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
              <div className="mt-auto pt-1.5">
                <Link
                  href={`/topics/${topic.slug}`}
                  className="text-sm font-semibold text-teal-600 transition-colors hover:text-teal-700"
                >
                  Click to explore →
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
