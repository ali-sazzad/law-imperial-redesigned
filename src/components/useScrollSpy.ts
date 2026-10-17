"use client";

import { useEffect, useState } from "react";

/** Height of the sticky header, so sections land just below it instead of underneath. */
function headerHeight() {
  return document.querySelector("header")?.getBoundingClientRect().height ?? 0;
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

let cancelScroll: (() => void) | null = null;

/**
 * Short, interruptible scroll to a section. Browser-native smooth scrolling takes seconds on a page this long
 * and feels frozen, so this runs a fixed ~0.3-0.7s animation and gives up the moment the visitor scrolls themselves.
 */
export function scrollToSection(id: string, onDone?: () => void) {
  cancelScroll?.();
  const el = id === "top" ? null : document.getElementById(id);
  if (id !== "top" && !el) return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const target = Math.max(0, Math.min(max, el ? el.getBoundingClientRect().top + window.scrollY - headerHeight() : 0));
  const from = window.scrollY;
  const dist = target - from;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduce || Math.abs(dist) < 4) {
    window.scrollTo({ top: target, behavior: "instant" });
    onDone?.();
    return;
  }

  const duration = Math.min(700, 300 + Math.abs(dist) * 0.06);
  const start = performance.now();
  let raf = 0;
  const stop = () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("wheel", stop);
    window.removeEventListener("touchstart", stop);
    window.removeEventListener("keydown", stop);
    cancelScroll = null;
  };
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    window.scrollTo({ top: from + dist * easeInOut(t), behavior: "instant" });
    if (t < 1) raf = requestAnimationFrame(step);
    else { stop(); onDone?.(); }
  };
  window.addEventListener("wheel", stop, { passive: true });
  window.addEventListener("touchstart", stop, { passive: true });
  window.addEventListener("keydown", stop);
  cancelScroll = stop;
  raf = requestAnimationFrame(step);
}

/**
 * Which navigation section the visitor is in, worked out from scroll position on every frame they scroll.
 * `ids` are the sections shown in the menu; `extra` are other page sections (like Contact) that should
 * clear the highlight when reached, so the menu never claims you are somewhere you've left.
 */
export function useScrollSpy(ids: string[], extra: string[] = []) {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join("|") + "#" + extra.join("|");

  useEffect(() => {
    const all = [...ids, ...extra];
    let raf = 0;
    const compute = () => {
      raf = 0;
      const line = headerHeight() + 80;
      let current: string | null = null;
      for (const id of all) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      // Reaching the very bottom of the page counts as the last section.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) current = all[all.length - 1];
      setActive(current && ids.includes(current) ? current : null);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(compute); };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return active;
}

/** One listener turns every in-page "#section" link on the site into the controlled scroll above. */
export function useAnchorScrolling() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      const id = a?.getAttribute("href")?.slice(1);
      if (!a || !id) return;
      if (id !== "top" && !document.getElementById(id)) return;
      e.preventDefault();
      scrollToSection(id, () => history.replaceState(null, "", id === "top" ? window.location.pathname : `#${id}`));
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
}
