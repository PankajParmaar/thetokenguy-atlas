export interface Topic {
    slug: string
    title: string
    description: string
    node: string
    icon: string
  }
  
  export const topics: Topic[] = [
    {
      slug: "applications",
      title: "Applications",
      description:
        "Applications are where identity becomes useful. They request tokens, validate permissions, and enforce authorization.",
      node: "Applications",
      icon: "🔑",
    },
    {
      slug: "users",
      title: "Users",
      description:
        "Human identities interacting with systems through authentication.",
      node: "Users",
      icon: "🪪",
    },
    {
      slug: "directory",
      title: "Directory",
      description:
        "Directories synchronize and federate identities across systems.",
      node: "Directory",
      icon: "🌐",
    },
    {
      slug: "governance",
      title: "Governance",
      description:
        "Govern identity lifecycle, access reviews and compliance.",
      node: "Governance",
      icon: "📋",
    },
    {
      slug: "signals",
      title: "Signals",
      description:
        "Risk signals and telemetry powering adaptive access decisions.",
      node: "Signals",
      icon: "📈",
    },
    {
      slug: "privileged-access",
      title: "Privileged Access",
      description:
        "Protect administrative identities and privileged operations.",
      node: "Privileged Access",
      icon: "🛡️",
    },
    {
      slug: "resources",
      title: "Resources",
      description:
        "Resources protected by identity and authorization controls.",
      node: "Resources",
      icon: "📦",
    },
  ]
  
  export function getTopic(slug: string) {
    return topics.find((topic) => topic.slug === slug)
  }