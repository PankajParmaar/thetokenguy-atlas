# thetokenguy-atlas — Phase 1 Setup Log
**Date:** 02-07-2026  
**Status:** COMPLETE

---

## Repo
- **GitHub:** https://github.com/PankajParmaar/thetokenguy-atlas
- **Branch:** main
- **Local path:** C:\Users\pankaj\thetokenguy-atlas

---

## Decisions Made
| Decision | Choice | Reason |
|---|---|---|
| Repo strategy | Two repos (Jekyll stays, new atlas repo) | Incompatible build systems |
| MDX pipeline | Contentlayer2 | Type-safe frontmatter, multi-content-type support |
| Tailwind version | v4 (auto-installed by create-next-app) | Tokens via CSS @theme, no tailwind.config.ts |
| Branch name | main (renamed from master) | GitHub standard |

---

## Step 1 — Project Init

```bash
npx create-next-app@latest thetokenguy-atlas --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd thetokenguy-atlas
```

---

## Step 2 — Dependencies

```bash
npm install contentlayer2 next-contentlayer2 @next/mdx rehype-highlight rehype-slug remark-gfm
npm install d3
npm install @types/d3
```

---

## Step 3 — next.config.ts

```ts
import { withContentlayer } from "next-contentlayer2";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

export default withContentlayer(nextConfig);
```

---

## Step 4 — contentlayer.config.ts (project root)

```ts
import { defineDocumentType, makeSource } from "contentlayer2/source-files";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `journal/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    date: { type: "date", required: true },
    summary: { type: "string", required: true },
    tags: { type: "list", of: { type: "string" }, required: false },
    topic: {
      type: "enum",
      options: ["authentication", "authorization", "access-management", "federation", "governance", "signals-risk", "workload-identity"],
      required: false,
    },
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.replace("journal/", ""),
    },
    url: {
      type: "string",
      resolve: (doc) => `/journal/${doc._raw.flattenedPath.replace("journal/", "")}`,
    },
  },
}));

export default makeSource({
  contentDirPath: "src/content",
  documentTypes: [Post],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeHighlight, rehypeSlug],
  },
});
```

---

## Step 5 — src/app/globals.css (replace entire file)

```css
@import "tailwindcss";

@theme {
  --color-teal: #1D9E75;
  --color-teal-dark: #157A5A;
  --color-teal-glow: #1D9E7533;
  --color-surface: #FFFFFF;
  --color-surface-muted: #F5F7F6;
  --color-surface-dark: #0D1117;
  --color-ink: #0D1117;
  --color-ink-muted: #4B5563;
  --color-ink-faint: #9CA3AF;

  --font-sans: "Inter", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", "Fira Code", monospace;
}

* {
  box-sizing: border-box;
}

body {
  background-color: var(--color-surface);
  color: var(--color-ink);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}
```

---

## Step 6 — Folder Structure

```bash
mkdir -p src/content/journal
mkdir -p src/components/graph
mkdir -p src/components/ui
mkdir -p src/lib
mkdir -p src/app/journal/[slug]
mkdir -p src/app/about
mkdir -p src/app/playbooks
mkdir -p src/app/lab
```

Final structure:
```
src/
  app/
    page.tsx              ← Identity Atlas graph (Phase 2)
    journal/
      page.tsx            ← post list
      [slug]/
        page.tsx          ← individual post
    about/page.tsx
    playbooks/page.tsx
    lab/page.tsx
  content/
    journal/              ← MDX posts go here
  components/
    graph/                ← D3 (Phase 2)
    ui/                   ← shared components
  lib/
    posts.ts              ← post query utilities
```

---

## Step 7 — Git Setup & Push

```bash
# Fix Git PATH (this session only)
$env:PATH += ";C:\Program Files\Git\bin"

# Permanent PATH fix
[System.Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\Program Files\Git\bin", [System.EnvironmentVariableTarget]::User)

# Commit and push
git add .
git commit -m "feat: Phase 1 init"
git push -u origin master

# Fix email privacy block — use GitHub no-reply email from github.com/settings/emails
git config user.email "YOUR_NOREPLY@users.noreply.github.com"
git commit --amend --reset-author --no-edit
git push -u origin master

# Rename master to main (after renaming on GitHub Settings > Branches)
git branch -m master main
git fetch origin
git branch -u origin/main main
git remote set-head origin -a
```

---

## Phase 1 Completed
- [x] Next.js project initialized
- [x] Dependencies installed (Contentlayer2, D3, rehype/remark plugins)
- [x] next.config.ts wired with Contentlayer
- [x] contentlayer.config.ts schema defined
- [x] Design tokens in globals.css (Tailwind v4 @theme)
- [x] Folder structure created
- [x] Route stubs created (/, /journal, /journal/[slug], /about, /playbooks, /lab)
- [x] Pushed to GitHub (PankajParmaar/thetokenguy-atlas, main branch)
- [x] Connected to Vercel — live at thetokenguy-atlas.vercel.app

## Known Issues / Notes
- Git and Ruby PATH not permanent on ThinkPad — permanent fix applied during session via SetEnvironmentVariable (reopen terminal to confirm)
- Vercel team name set to "The Token Guy" (Hobby plan)
- Deploy pipeline confirmed: push to main → auto-deploy on Vercel

## Next Session Start Point — Phase 2 begins
Migrate The Authorization Gap as first MDX post → confirm it renders at /journal/[slug] → begin D3 graph scaffold on homepage.
