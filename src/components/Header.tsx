"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { localeCookie, type Locale } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n";
import { digits } from "@/lib/i18n/digits";
import { firm } from "@/lib/site";
import { useAnchorScrolling, useScrollSpy } from "./useScrollSpy";

const tel = (p: string) => `tel:${p.replace(/\s/g, "")}`;

/**
 * Two always-visible buttons, so a Nepali reader never has to hunt for the language option.
 * Switching keeps the section in the URL hash and remembers the choice for the next visit.
 */
function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const options: { code: Locale; text: string }[] = [
    { code: "en", text: "English" },
    { code: "ne", text: "नेपाली" },
  ];

  function choose(e: React.MouseEvent<HTMLAnchorElement>, code: Locale) {
    e.preventDefault();
    if (code === locale) return;
    document.cookie = `${localeCookie}=${code}; path=/; max-age=31536000; samesite=lax`;
    window.location.assign(`/${code}${window.location.hash}`);
  }

  return (
    <div role="group" aria-label={label} className="flex rounded-md border border-line bg-white p-0.5 text-[15px]">
      {options.map((o) => {
        const active = o.code === locale;
        return (
          <a
            key={o.code}
            href={`/${o.code}`}
            lang={o.code}
            hrefLang={o.code}
            aria-current={active ? "true" : undefined}
            onClick={(e) => choose(e, o.code)}
            className={`inline-flex min-h-9 items-center rounded px-3 font-medium transition-colors ${
              active ? "bg-ink text-white" : "text-ink hover:bg-paper"
            }`}
          >
            {o.text}
          </a>
        );
      })}
    </div>
  );
}

/** The favicon mark, reused as the logo so browser tab and header match. */
function LogoMark() {
  return (
    <svg viewBox="0 0 64 64" className="h-10 w-10 shrink-0" aria-hidden="true">
      <rect width="64" height="64" rx="12" fill="#0f2238" />
      <path d="M0 56 L14 44 L24 51 L38 34 L49 46 L64 38 V64 H0Z" fill="#19314d" />
      <g fill="#fff"><rect x="19" y="12" width="26" height="5" /><rect x="29" y="12" width="6" height="31" /><rect x="19" y="38" width="26" height="5" /></g>
      <rect x="19" y="48" width="26" height="4" fill="#d92a43" />
    </svg>
  );
}

const icon = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

/**
 * Phone and tablet navigation: a thumb-reach action bar (Call, Message, Menu) and a bottom sheet.
 * The sheet closes on a tap outside it, a swipe down, Escape, or choosing a link, and returns focus to the Menu button.
 */
function MobileNav({ d, locale }: { d: Dict; locale: Locale }) {
  const [open, setOpen] = useState(false);
  const [drag, setDrag] = useState(0);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const startY = useRef<number | null>(null);
  const ids = useRef(d.nav.map((n) => n.id)).current;
  const active = useScrollSpy(ids, ["contact"]);

  const close = useCallback(() => {
    setOpen(false);
    setDrag(0);
    menuBtn.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    panel.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return close();
      if (e.key !== "Tab" || !panel.current) return;
      const f = panel.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    // Leaving mobile width (e.g. rotating a tablet) should not leave a locked, invisible sheet behind.
    const mq = window.matchMedia("(min-width: 1280px)");
    const onMq = () => mq.matches && close();
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      root.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open, close]);

  const onDown = (e: React.PointerEvent) => { startY.current = e.clientY; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); };
  const onMove = (e: React.PointerEvent) => { if (startY.current !== null) setDrag(Math.max(0, e.clientY - startY.current)); };
  const onUp = () => {
    if (startY.current === null) return;
    startY.current = null;
    if (drag > 90) close(); else setDrag(0);
  };

  const barItem = "flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[13px] font-semibold";

  return (
    <>
      <nav aria-label={d.ui.mobileBar} className="on-dark fixed inset-x-0 bottom-0 z-40 border-t border-ink-line bg-ink pb-[env(safe-area-inset-bottom)] text-white xl:hidden">
        <div className="mx-auto flex max-w-xl items-stretch">
          <a href={tel(firm.phones[0])} className={`${barItem} hover:bg-ink-2`}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" {...icon} aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" /></svg>
            {d.ui.call}
          </a>
          <a href="#contact" className={`${barItem} bg-crimson hover:bg-crimson-dark`}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" {...icon} aria-hidden="true"><path d="M4 5h16v11H9l-5 4z" /></svg>
            {d.ui.message}
          </a>
          <button ref={menuBtn} type="button" aria-haspopup="dialog" aria-expanded={open} aria-controls="mobile-sheet" onClick={() => setOpen(true)} className={`${barItem} hover:bg-ink-2`}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" {...icon} aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10" /></svg>
            {d.ui.menu}
          </button>
        </div>
      </nav>

      {open && (
        <div className="fixed inset-0 z-[60] xl:hidden">
          {/* Tapping anywhere outside the sheet closes it. */}
          <div className="sheet-backdrop absolute inset-0 bg-ink/60" onClick={close} aria-hidden="true" />
          <div
            ref={panel}
            id="mobile-sheet"
            role="dialog"
            aria-modal="true"
            aria-label={d.ui.menu}
            tabIndex={-1}
            style={{ transform: drag ? `translateY(${drag}px)` : undefined, transition: startY.current === null ? "transform 0.2s" : "none" }}
            className="sheet-panel absolute inset-x-0 bottom-0 mx-auto flex max-h-[88svh] max-w-xl flex-col rounded-t-2xl bg-white shadow-2xl outline-none"
          >
            <div onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} className="shrink-0 cursor-grab touch-none select-none px-5 pb-2 pt-3">
              <span aria-hidden="true" className="mx-auto block h-1.5 w-12 rounded-full bg-line" />
              <div className="mt-3 flex items-center justify-between">
                <p className="display text-2xl">{d.ui.menu}</p>
                <button type="button" onClick={close} aria-label={d.ui.menuClose} className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-paper">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" {...icon} aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
                </button>
              </div>
            </div>

            <div className="overflow-y-auto overscroll-contain px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              <ul>
                {d.nav.map((l) => {
                  const here = active === l.id;
                  return (
                    <li key={l.id} className="border-b border-line">
                      <a
                        href={`#${l.id}`}
                        onClick={() => setOpen(false)}
                        aria-current={here ? "location" : undefined}
                        className={`flex min-h-14 items-center justify-between gap-4 text-lg font-medium ${here ? "text-crimson" : ""}`}
                      >
                        <span className="flex items-center gap-3">
                          <span aria-hidden="true" className={`h-2 w-2 rounded-full ${here ? "bg-crimson" : "bg-line"}`} />
                          {l.label}
                        </span>
                        <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-muted rtl:rotate-180" {...icon} aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
                      </a>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-5 grid gap-3">
                <a href="#contact" onClick={() => setOpen(false)} className="btn bg-crimson text-white hover:bg-crimson-dark">{d.cta}</a>
                <div className="grid gap-3 sm:grid-cols-2">
                  {firm.phones.map((p) => (
                    <a key={p} href={tel(p)} className="btn border border-ink text-ink hover:bg-paper">{d.ui.call}: {digits(p, locale)}</a>
                  ))}
                </div>
              </div>
              <p className="mt-5 text-center text-sm text-muted">{d.hoursShort}</p>
              <p className="mt-1 text-center text-xs text-muted/80">{d.ui.sheetHint}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function Header({ d, locale }: { d: Dict; locale: Locale }) {
  const ids = useRef(d.nav.map((n) => n.id)).current;
  const active = useScrollSpy(ids, ["contact"]);
  useAnchorScrolling();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className={`sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur transition-shadow ${scrolled ? "shadow-[0_6px_20px_-12px_rgba(15,34,56,0.35)]" : ""}`}>
        <div className="on-dark hidden bg-ink text-sm text-white/80 sm:block">
          <div className="container-page flex min-h-10 items-center justify-between gap-6">
            <p>{d.hoursShort}</p>
            <p className="flex items-center gap-5">
              {firm.phones.map((p) => (
                <a key={p} href={tel(p)} className="hover:text-white hover:underline">{digits(p, locale)}</a>
              ))}
            </p>
          </div>
        </div>

        <div className="container-page flex h-16 items-center justify-between gap-4">
          <a href={`/${locale}`} className="flex items-center gap-3" aria-label={d.ui.homeLabel}>
            <LogoMark />
            <span className="flex flex-col leading-tight">
              <span className="display text-[1.45rem]">{d.brand.lead}</span>
              <span className="text-[13px] text-muted">{d.brand.rest}</span>
            </span>
          </a>

          <nav aria-label={d.ui.primaryNav} className="hidden h-full items-stretch gap-7 xl:flex">
            {d.nav.map((l) => {
              const here = active === l.id;
              return (
                <a
                  key={l.id}
                  href={`#${l.id}`}
                  aria-current={here ? "location" : undefined}
                  className={`group relative flex items-center text-[15px] font-medium transition-colors ${here ? "text-ink" : "text-ink/70 hover:text-ink"}`}
                >
                  {l.label}
                  <span aria-hidden="true" className={`absolute inset-x-0 bottom-0 h-0.5 bg-crimson transition-transform duration-200 ${here ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSwitcher locale={locale} label={d.ui.language} />
            <a href="#contact" className="btn hidden bg-crimson text-white hover:bg-crimson-dark xl:inline-flex">{d.cta}</a>
          </div>
        </div>
      </header>
      <MobileNav d={d} locale={locale} />
    </>
  );
}
