"use client";

import { useEffect, useState } from "react";
import type { Dict } from "@/lib/i18n";

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "mt-2 w-full rounded-md border border-line bg-white px-4 py-3 text-ink outline-none transition-[border-color,box-shadow] placeholder:text-muted/70 focus:border-crimson focus:shadow-[0_0_0_3px_rgba(163,24,44,0.18)]";

export function LeadForm({ d }: { d: Dict }) {
  const t = d.form;
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [type, setType] = useState("foreign-investors");
  const [topic, setTopic] = useState("");

  // Cards elsewhere on the page tell the form which client type or practice area the visitor chose.
  useEffect(() => {
    const onType = (e: Event) => setType((e as CustomEvent<string>).detail);
    const onTopic = (e: Event) => setTopic((e as CustomEvent<string>).detail);
    window.addEventListener("lead-type", onType);
    window.addEventListener("lead-topic", onTopic);
    return () => {
      window.removeEventListener("lead-type", onType);
      window.removeEventListener("lead-topic", onTopic);
    };
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    if (topic && !data.message.includes(topic)) data.message = `Re: ${topic}\n\n${data.message}`;
    data.locale = d.htmlLang;
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/leads", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        const code = json.code === "rate" || json.code === "invalid" ? json.code : "failed";
        throw new Error(t.errors[code as keyof typeof t.errors]);
      }
      setStatus("sent");
      setTopic("");
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errors.failed);
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="py-6">
        <svg viewBox="0 0 52 52" className="h-12 w-12 text-crimson" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
          <circle cx="26" cy="26" r="23" strokeWidth="2" />
          <path d="M15 27l8 8 14-16" />
        </svg>
        <h3 className="display mt-5 text-3xl">{t.sentTitle}</h3>
        <p className="mt-3 max-w-[40ch] text-muted">{t.sentBody}</p>
        <button type="button" onClick={() => setStatus("idle")} className="btn mt-7 border border-ink text-ink hover:bg-paper">
          {t.again}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-[15px] font-semibold">{t.name}
          <input name="name" required minLength={2} autoComplete="name" className={field} />
        </label>
        <label className="block text-[15px] font-semibold">{t.email}
          <input name="email" type="email" required autoComplete="email" className={field} />
        </label>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-[15px] font-semibold">{t.phone} <span className="font-normal text-muted">{t.optional}</span>
          <input name="phone" type="tel" autoComplete="tel" className={field} />
        </label>
        <label className="block text-[15px] font-semibold">{t.iAm}
          <select name="type" value={type} onChange={(e) => setType(e.target.value)} className={field}>
            {d.advise.items.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
            <option value="other">{t.other}</option>
          </select>
        </label>
      </div>
      <label className="block text-[15px] font-semibold">{t.message}
        <textarea
          name="message"
          required
          minLength={10}
          rows={5}
          placeholder={topic ? t.placeholderTopic.replace("{topic}", topic) : t.placeholder}
          className={field}
        />
      </label>
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <div className="flex flex-wrap items-center gap-5">
        <button type="submit" disabled={status === "sending"} className="btn bg-crimson px-8 text-white hover:bg-crimson-dark disabled:opacity-60">
          {status === "sending" ? t.sending : t.submit}
        </button>
        <p aria-live="polite" className="text-[15px] font-medium text-crimson">{status === "error" ? error : ""}</p>
      </div>
    </form>
  );
}
