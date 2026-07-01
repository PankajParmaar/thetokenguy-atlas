import { getAllPosts } from "@/lib/posts"
import Link from "next/link"

export default function JournalPage() {
  const posts = getAllPosts()

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Journal</h1>
      {posts.map((post) => (
        <div key={post.slug} className="mb-8">
          <Link href={`/journal/${post.slug}`} className="text-xl font-semibold hover:underline">
            {post.title}
          </Link>
          <p className="text-sm text-gray-500 mt-1">{post.date}</p>
          <p className="mt-2 text-gray-700">{post.summary}</p>
        </div>
      ))}
    </main>
  )
}