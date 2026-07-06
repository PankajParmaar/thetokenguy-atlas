export interface Topic {
  slug: string
  title: string
  description: string
  node: string
  icon: string
  lucideIcon: string
}

export const topics: Topic[] = [
  {
    slug: "users",
    title: "Users",
    description: "Human identities interacting with systems through authentication.",
    node: "Users",
    icon: "🪪",
    lucideIcon: "Users",
  },
  {
    slug: "applications",
    title: "Applications",
    description: "Applications are where identity becomes useful. They request tokens, validate permissions, and enforce authorization.",
    node: "Applications",
    icon: "🔑",
    lucideIcon: "LayoutGrid",
  },
  {
    slug: "governance",
    title: "Governance",
    description: "Govern identity lifecycle, access reviews and compliance.",
    node: "Governance",
    icon: "📋",
    lucideIcon: "ClipboardList",
  },
  {
    slug: "directory",
    title: "Directory & Graph",
    description: "Directories synchronize and federate identities across systems.",
    node: "Directory & Graph",
    icon: "🌐",
    lucideIcon: "Network",
  },
  {
    slug: "privileged-access",
    title: "Privileged Access",
    description: "Protect administrative identities and privileged operations.",
    node: "Privileged Access",
    icon: "🛡️",
    lucideIcon: "Lock",
  },
  {
    slug: "resources",
    title: "Resources",
    description: "Resources protected by identity and authorization controls.",
    node: "Resources",
    icon: "📦",
    lucideIcon: "Box",
  },
  {
    slug: "signals",
    title: "Signals",
    description: "Risk signals and telemetry powering adaptive access decisions.",
    node: "Signals",
    icon: "📈",
    lucideIcon: "TrendingUp",
  },
  {
    slug: "zero-trust",
    title: "Zero Trust",
    description: "Never trust, always verify. Zero Trust eliminates implicit trust and enforces continuous validation across every identity, device, and request.",
    node: "Zero Trust",
    icon: "🔒",
    lucideIcon: "ShieldAlert",
  },
]

export function getTopic(slug: string) {
  return topics.find((topic) => topic.slug === slug)
}
