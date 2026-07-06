"use client";

import { useState } from "react";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    // No submission logic yet.
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="flex-1 rounded-md border border-[#e5e7eb] px-3 py-3 text-sm text-[#0a0a0a] outline-none focus:border-[#1D9E75]"
      />
      <button
        type="button"
        onClick={handleSubscribe}
        className="rounded-md bg-[#1D9E75] px-6 py-3 text-sm font-semibold text-white hover:bg-[#17805f]"
      >
        Subscribe
      </button>
    </div>
  );
}
