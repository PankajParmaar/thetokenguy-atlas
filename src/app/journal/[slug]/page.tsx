import { getPostBySlug, getAllPosts } from "@/lib/posts"
import { MDXRemote } from "next-mdx-remote/rsc"
import { notFound } from "next/navigation"

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  try {
    const post = getPostBySlug(slug)
    return (
      <main className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        <p className="text-sm text-gray-500 mb-8">{post.date}</p>
        <article className="prose prose-neutral max-w-none">
          <MDXRemote source={post.content} />
        </article>
      </main>
    )
  } catch {
    notFound()
  }
}