const UPCOMING_POSTS = [
  "The Authorization Gap",
  "Programmatic Tenant Diagnostics: Auditing CA Policy Drift",
  "Programmatic Tenant Diagnostics: Automating Entra ID Security Assessments",
  "Mitigating App Registration Secret Sprawl",
  "CISO Strategic Advisory: Hardening Identity Perimeters Against Lateral Movement",
]

export default function JournalPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white">Journal</h1>
        <p className="mt-3 text-base text-gray-400">
          In-depth practitioner writing on identity security, Entra ID, and Zero Trust.
        </p>

        <ul className="mt-10 space-y-4">
          {UPCOMING_POSTS.map((title) => (
            <li
              key={title}
              className="flex items-center justify-between gap-4 border border-white/10 rounded-lg px-5 py-4"
            >
              <span className="text-white">{title}</span>
              <span className="shrink-0 rounded-full bg-[#1D9E75]/10 px-3 py-1 text-xs font-medium text-[#1D9E75]">
                Coming Soon
              </span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
