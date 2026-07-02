export interface DomainNode {
    id: string
    label: string
    x: number
    y: number
    center?: boolean
  }
  
  export interface DomainRelationship {
    source: string
    target: string
    concept?: string
    icon?: string
  }
  
  export const domains: DomainNode[] = [
    {
      id: "identity",
      label: "Identity",
      x: 400,
      y: 300,
      center: true,
    },
    {
      id: "users",
      label: "Users",
      x: 200,
      y: 150,
    },
    {
      id: "applications",
      label: "Applications",
      x: 400,
      y: 100,
    },
    {
      id: "governance",
      label: "Governance",
      x: 600,
      y: 150,
    },
    {
      id: "directory",
      label: "Directory",
      x: 650,
      y: 300,
    },
    {
      id: "privileged-access",
      label: "Privileged Access",
      x: 600,
      y: 450,
    },
    {
      id: "resources",
      label: "Resources",
      x: 400,
      y: 500,
    },
    {
      id: "signals",
      label: "Signals",
      x: 200,
      y: 450,
    },
  ]
  
  export const relationships: DomainRelationship[] = [
    {
      source: "identity",
      target: "users",
      concept: "Authentication",
      icon: "🪪",
    },
    {
      source: "identity",
      target: "applications",
      concept: "Authorization",
      icon: "🔑",
    },
    {
      source: "identity",
      target: "directory",
      concept: "Federation",
      icon: "🌐",
    },
    {
      source: "identity",
      target: "governance",
    },
    {
      source: "identity",
      target: "privileged-access",
    },
    {
      source: "identity",
      target: "resources",
    },
    {
      source: "identity",
      target: "signals",
    },
  ]