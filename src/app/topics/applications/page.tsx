import Link from "next/link"
import { getAllPosts } from "@/lib/posts"
import { getTopic } from "@/lib/topics"

export default async function ApplicationsPage() {
  const topic = getTopic("applications")

  const posts = getAllPosts()

  const topicPosts = posts.filter(
    (post) => post.topic === "applications"
  )

  return (
    <div className="space-y-12">

      <section className="space-y-4">
        <p className="text-5xl">{topic?.icon}</p>

        <h1 className="text-5xl font-semibold tracking-tight">
          {topic?.title}
        </h1>

        <p className="max-w-3xl text-lg leading-8 text-slate-600">
          {topic?.description}
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          Journal
        </h2>

        {topicPosts.length === 0 ? (
          <p className="text-slate-500">
            No journal entries yet.
          </p>
        ) : (
          <div className="space-y-6">
            {topicPosts.map((post) => (
              <article
                key={post.slug}
                className="rounded-2xl border border-slate-200 p-6 transition hover:border-teal-500"
              >
                <Link href={`/journal/${post.slug}`}>
                  <h3 className="text-xl font-semibold hover:text-teal-600">
                    {post.title}
                  </h3>
                </Link>

                <p className="mt-2 text-slate-600">
                  {post.summary}
                </p>

                <p className="mt-4 text-sm text-slate-400">
                  {post.date}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-dashed border-slate-300 p-8">
        <h2 className="text-xl font-semibold">
          Coming Soon
        </h2>

        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-600">
          <li>Interactive Authorization Flow</li>
          <li>Playbooks</li>
          <li>Identity Labs</li>
          <li>Related Topics</li>
        </ul>
      </section>

    </div>
  )
}