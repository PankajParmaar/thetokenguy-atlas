import Link from "next/link";
import { Search } from "lucide-react";

const NAV_LINKS = [
  { label: "Explore", href: "/" },
  { label: "Articles", href: "/journal" },
  { label: "Playbooks", href: "/playbooks" },
  { label: "Lab", href: "/lab" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full h-16 bg-white border-b border-[#e5e7eb]">
      <div className="flex h-full items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2L21 6.5V13.5C21 18 17 21.5 12 23C7 21.5 3 18 3 13.5V6.5L12 2Z"
              fill="#1D9E75"
            />
            <path
              d="M9 12.5L11 14.5L15.5 10"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-bold text-[#0a0a0a]">The Token Guy</span>
            <span className="text-xs text-gray-500">Exploring Identity Systems</span>
          </div>
        </Link>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 text-[#0a0a0a] no-underline hover:text-[#1D9E75] ${
                  link.label === "Explore"
                    ? "after:absolute after:left-0 after:right-0 after:-bottom-[1px] after:h-[2px] after:bg-[#1D9E75]"
                    : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <button
            type="button"
            aria-label="Search"
            className="text-[#0a0a0a] hover:text-[#1D9E75]"
          >
            <Search size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
}
