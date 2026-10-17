"use client";

import { useEffect, useState } from "react";

/** Appears after the first screen. */
export function BackToTop({ label }: { label: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 800);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;
  return (
    <a
      href="#top"
      aria-label={label}
      className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] right-4 xl:bottom-8 xl:right-8 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-ink text-white shadow-lg ring-1 ring-white/20 hover:bg-crimson sm:right-8"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </a>
  );
}
