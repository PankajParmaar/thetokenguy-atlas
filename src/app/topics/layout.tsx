export default function TopicsLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <main className="min-h-screen bg-white text-slate-900">
        <div className="mx-auto max-w-6xl px-8 py-12">
          {children}
        </div>
      </main>
    )
  }