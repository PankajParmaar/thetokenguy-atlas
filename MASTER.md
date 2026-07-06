---
tags: [master, thetokenguy, identity-atlas]
last-updated: 02-07-2026
---

# The Token Guy — Master Context File

## What This Is
This file is the single source of truth for the thetokenguy.net rebuild project.
Any AI assistant reading this should treat it as the project bible.
Do not contradict decisions marked as FINAL. Raise conflicts explicitly.

---

## The Person
- **Name:** Pankaj Parmar
- **Role:** Senior Technical Advisor, Microsoft
- **Domain:** Entra ID, Hybrid Identity, Conditional Access, Zero Trust, Non-Human Identity
- **Positioning:** Machine identity governance and autonomous access control is the next critical security frontier
- **Brand:** The Token Guy (human voice) → IDAM.CORE (technical series) → Token Security (future consulting)
- **Style:** Tony Redmond-style depth progression. No fluff. Practitioner voice only.

---

## The Website
- **Domain:** thetokenguy.net
- **Current state:** Jekyll/Chirpy blog, live on GitHub Pages, posts indexed on Bing
- **Target state:** Identity Atlas — a full custom web experience rebuilt in Next.js
- **Identity Atlas is not a separate site** — it IS thetokenguy.net, rebuilt

---

## The Vision — Identity Atlas
The interactive node graph is the soul of the site. Identity is the control plane for digital trust. Everything radiates outward from that center node — Users, Applications, Governance, Directory & Graph, Privileged Access, Resources, Signals, Trust.

Visitors land on the graph. They explore by clicking nodes. Each node leads to content — articles, playbooks, or lab tools — organized by identity domain, not by date.

This is not a blog with a fancy homepage. It is an explorable knowledge system that happens to have a journal.

---
## Identity Atlas Learning Philosophy  
  
Identity Atlas is not documentation.  
  
Identity Atlas is not a blog.  
  
Identity Atlas is an explorable learning system.  
  
The interface itself should teach.  
  
Users should gain intuition through interaction before they gain depth through reading.  
  
Learning sequence:  
  
Observe  
→ Interact  
→ Discover  
→ Understand  
→ Read  
→ Master  
  
Articles are not the primary learning mechanism.  
  
Articles deepen understanding after curiosity has been created.  
  
***Every interaction should teach***

---

## Tech Stack — FINAL
- **Framework:** Next.js (React)
- **Graph visualization:** D3.js
- **Content:** MDX (existing markdown posts migrate cleanly)
- **Hosting:** Vercel (free tier)
- **Subscriber list:** Supabase (free tier)
- **Styling:** Tailwind CSS
- **Repo:** GitHub (existing, pankajparmaar)

---

## Design Language — FINAL
- **Primary color:** Teal (#1D9E75)
- **Background:** Near-white or deep dark (dark mode first)
- **Logo:** Teal shield + "ID" in black + IDAM.CORE bold wordmark
- **Typography:** Clean, technical, no decorative fonts
- **Graph nodes:** Teal glow, white labels, connecting lines with directional flow animation
- **Feel:** Stripe-meets-security-research. Dense but navigable.
- ## Vision Reference
![Identity Atlas Vision](Assets/identity-atlas-vision-v1.png)
![[ChatGPT Image Jul 2, 2026, 07_30_49 AM.png]]- Light mode default, dark mode toggle
- Teal on white, graph glow effect
- See image for exact layout reference

---

## Site Structure
- **/** — Identity Atlas graph (hero experience)
- **/journal** — article/blog list (replaces Jekyll home)
- **/playbooks** — step-by-step operational guides
- **/lab** — tools, scripts, utilities
- **/about** — practitioner bio
- **/topics** — taxonomy index (Authentication, Authorization, Access Management, Federation, Governance, Signals & Risk, Workload Identity)

---

## Content Already Live (Jekyll)
- The Authorization Gap
- Programmatic Tenant Diagnostics: Auditing CA Policy Drift
- Programmatic Tenant Diagnostics: Automating Entra ID Security Assessments
- Mitigating App Registration Secret Sprawl
- CISO Strategic Advisory: Hardening Identity Perimeters Against Lateral Movement

All migrate to /journal as MDX files.

---

## Build Phases
### Phase 1 — Foundation (Weeks 1-3)
- Next.js project setup on Vercel
- Design system (Tailwind, colors, typography)
- Basic routing (/, /journal, /about)
- MDX pipeline — existing posts rendering

### Phase 2 — The Graph (Weeks 4-6)
- D3.js identity graph on homepage
- Node interaction (hover, click, expand)
- Node → content linking

### Phase 3 — Content System (Weeks 7-8)
- Playbooks structure and first 3 playbooks
- Topics taxonomy page
- Search

### Phase 4 — Polish & Launch (Weeks 9-10)
- Dark mode
- Subscriber form (Supabase)
- SEO, sitemap, redirects from old Jekyll URLs
- Go live — replace Jekyll

---

## AI Collaboration Model

### Roles

- **Claude:** Project architect, planner, reviewer, and implementation task generator.
    
- **Antigravity IDE (Gemini CLI):** Code implementation only. Till the time I do not specifically call out, assume gemini CLI is unavailable
    
- **ChatGPT:** Optional support for repetitive code generation, debugging, documentation, and validation.

Claude.ai (Pro) → Claude Code Handoff Rules

Claude.ai = architecture, planning, and prompt generation only. No code written here.
Claude Code = sole implementation tool when Gemini CLI is unavailable.
Claude.ai generates one targeted implementation prompt per task, scoped to the minimum files needed.
Prompts are copy-paste ready for Claude Code — no interpretation required.
Token economy: Claude.ai sessions are planning-only. All token spend on code generation happens in Claude Code.
    

### Session Protocol

- Always read **MASTER.md** and **CURRENT.md** before starting.
    
- Treat **MASTER.md** as the project source of truth.
    
- Treat **CURRENT.md** as the current implementation state.
    
- Record all final architectural and implementation decisions in **MASTER.md**.
    

### Claude → Antigravity Handoff Rules

Before generating any implementation prompt for Antigravity:

1. Break every feature into the smallest independently implementable task.
    
2. Prefer tasks that modify **one file**. Never exceed **three files** unless absolutely necessary.
    
3. Reference only the exact files required for the task.
    
4. Never instruct Antigravity to scan, understand, or index the entire repository.
    
5. Provide only the minimum context needed for that specific implementation.
    
6. Every implementation prompt must include:
    
    - Target file(s)
        
    - Exact function/component/section to modify
        
    - Precise implementation instructions
        
    - Expected behavior
        
    - Clear acceptance criteria
        
7. Do not bundle multiple features into a single prompt.
    
8. Do not include refactoring, optimization, cleanup, documentation, or unrelated improvements unless explicitly requested.
    
9. After each implementation, stop and wait for verification before generating the next task.
    
10. If additional repository context is required, request only the specific file(s) needed rather than expanding the scope.
    
11. Optimize every implementation prompt to minimize context size and token consumption.
    
12. Assume previous verified implementations are correct unless a regression is reported.
    

### Guiding Principle

Claude plans. Antigravity implements. Keep every implementation prompt narrowly scoped, deterministic, and as token-efficient as possible.

---

## Decisions Log
| Date       | Decision                                               | Status |
| ---------- | ------------------------------------------------------ | ------ |
| 02-07-2026 | Next.js + D3.js + Vercel stack                         | FINAL  |
| 02-07-2026 | Identity Atlas = thetokenguy.net rebuild, not separate | FINAL  |
| 02-07-2026 | Interactive graph is v1 requirement, not optional      | FINAL  |
| 02-07-2026 | Jekyll stays live until Phase 4 complete               | FINAL  |
| 02-07-2026 | Dark mode first                                        | FINAL  |
| 02-07-2026 | Light mode default, dark toggle available              | FINAL  |