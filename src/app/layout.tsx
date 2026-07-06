import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Mail } from "lucide-react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SubscribeForm from "@/components/SubscribeForm";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Identity Atlas",
  description: "The interconnected universe of identity engineering.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <Navbar />
        {children}
        <section className="w-full bg-white px-6 py-20 lg:px-20">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-2xl font-bold text-[#0a0a0a]">Stay updated</h3>
              <p className="mt-3 text-base text-[#6b7280]">
                Get the latest articles, playbooks, and tools delivered to your inbox.
              </p>
              <p className="mt-2 text-sm text-[#6b7280]">
                No spam. Unsubscribe anytime.
              </p>
            </div>
            <div className="lg:w-[420px]">
              <SubscribeForm />
            </div>
          </div>
        </section>
        <footer className="w-full border-t border-[#e5e7eb] bg-white px-6 pb-10 pt-14 lg:px-20">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="h-12 w-12 rounded-full bg-gray-300" />
              <h4 className="mt-4 font-bold text-[#0a0a0a]">
                Why this journal exists
              </h4>
              <p className="mt-3 text-sm text-[#6b7280]">
                Identity is the foundation of every interaction in modern
                systems. This journal explores the patterns, protocols, and
                engineering decisions that build secure, scalable, and
                resilient identity architectures.
              </p>
              <Link
                href="/about"
                className="mt-4 inline-block font-semibold text-[#1D9E75] hover:text-[#17805f]"
              >
                More about the author →
              </Link>
            </div>

            <div>
              <h4 className="font-bold text-[#0a0a0a]">Explore</h4>
              <div className="mt-4 flex flex-col gap-3 text-sm">
                <Link href="/journal" className="text-[#6b7280] hover:text-[#1D9E75]">
                  Articles
                </Link>
                <Link href="/playbooks" className="text-[#6b7280] hover:text-[#1D9E75]">
                  Playbooks
                </Link>
                <Link href="/lab" className="text-[#6b7280] hover:text-[#1D9E75]">
                  Lab
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-[#0a0a0a]">Topics</h4>
              <div className="mt-4 flex flex-col gap-3 text-sm">
                <Link href="/topics/authentication" className="text-[#6b7280] hover:text-[#1D9E75]">
                  Authentication
                </Link>
                <Link href="/topics/authorization" className="text-[#6b7280] hover:text-[#1D9E75]">
                  Authorization
                </Link>
                <Link href="/topics/zero-trust" className="text-[#6b7280] hover:text-[#1D9E75]">
                  Zero Trust
                </Link>
                <Link href="/topics" className="text-[#6b7280] hover:text-[#1D9E75]">
                  All Topics
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-[#0a0a0a]">Resources</h4>
              <div className="mt-4 flex flex-col gap-3 text-sm">
                <Link href="/about" className="text-[#6b7280] hover:text-[#1D9E75]">
                  About
                </Link>
                <Link href="/rss" className="text-[#6b7280] hover:text-[#1D9E75]">
                  RSS Feed
                </Link>
                <Link href="/changelog" className="text-[#6b7280] hover:text-[#1D9E75]">
                  Changelog
                </Link>
              </div>

              <h4 className="mt-6 font-bold text-[#0a0a0a]">Connect</h4>
              <div className="mt-4 flex items-center gap-4">
                <a
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="text-[#6b7280] hover:text-[#1D9E75]"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                    <rect x="2" y="9" width="4" height="12"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg>
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="text-[#6b7280] hover:text-[#1D9E75]"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                  </svg>
                </a>
                <a
                  href="mailto:pankajleo6885@gmail.com"
                  aria-label="Email"
                  className="text-[#6b7280] hover:text-[#1D9E75]"
                >
                  <Mail size={20} />
                </a>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-7xl">
            <p className="text-sm text-[#6b7280]">
              © 2026 The Token Guy. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}