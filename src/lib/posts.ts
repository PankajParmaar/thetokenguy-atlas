import fs from "fs"
import path from "path"
import matter from "gray-matter"

const postsDir = path.join(process.cwd(), "src/content/journal")

export function getAllPosts() {
  const files = fs.readdirSync(postsDir)
  return files
    .filter((f) => f.endsWith(".mdx"))
    .map((filename) => {
      const slug = filename.replace(".mdx", "")
      const raw = fs.readFileSync(path.join(postsDir, filename), "utf-8")
      const { data } = matter(raw)
      return { slug, ...data, date: data.date ? new Date(data.date).toISOString().split("T")[0] : "" } as {
        slug: string
        title: string
        date: string
        summary: string
        tags?: string[]
        topic?: string
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string) {
  const filepath = path.join(postsDir, `${slug}.mdx`)
  const raw = fs.readFileSync(filepath, "utf-8")
  const { data, content } = matter(raw)
  return { slug, content, ...data, date: data.date ? new Date(data.date).toISOString().split("T")[0] : "" } as {
    slug: string
    title: string
    date: string
    summary: string
    content: string
    tags?: string[]
    topic?: string
  }
}