import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional().default(""),
  type: z.enum(["foreign-investors", "nepali-companies", "ngos", "nepalis-abroad", "other"]),
  message: z.string().trim().min(10).max(4000),
  locale: z.enum(["en", "ne"]).optional().default("en"),
  website: z.string().max(0).optional(), // honeypot
});

const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 5;
const MAX_TRACKED = 5000;

// Best-effort limiter: memory is per server instance. Use a shared store (Redis, Upstash) if abuse becomes real.
// Map keeps insertion order, so re-inserting on every hit makes the first key the least recently used.
const hits = new Map<string, number[]>();

function limited(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.delete(key);
  hits.set(key, recent);
  while (hits.size > MAX_TRACKED) hits.delete(hits.keys().next().value as string);
  return recent.length > MAX_PER_WINDOW;
}

/**
 * Who is calling. Only a header the hosting platform overwrites is trusted: x-vercel-forwarded-for on Vercel, or the
 * one named in TRUSTED_IP_HEADER behind your own proxy. Anything else could be forged by the caller, so it is
 * ignored and everyone shares one bucket (stricter, never bypassable). IPv6 is grouped by /64 so one host
 * cannot dodge the limit by rotating addresses within its own range.
 */
function clientKey(req: Request) {
  const name = process.env.VERCEL ? "x-vercel-forwarded-for" : process.env.TRUSTED_IP_HEADER;
  const ip = (name && req.headers.get(name)?.split(",")[0]?.trim()) || "unknown";
  if (!ip.includes(":")) return ip;
  const groups = ip.split("::")[0].split(":").slice(0, 4);
  return groups.join(":") + "::/64";
}

/** Responses carry a `code` the page translates, so this route never needs to know the visitor's language. */
export async function POST(req: Request) {
  if (limited(clientKey(req))) return NextResponse.json({ ok: false, code: "rate" }, { status: 429 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, code: "invalid", fields: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const { website: _honeypot, ...lead } = parsed.data;

  const hook = process.env.LEAD_WEBHOOK_URL;
  if (hook) {
    try {
      const res = await fetch(hook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...lead, source: "lawimperial.com", receivedAt: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error(String(res.status));
    } catch {
      return NextResponse.json({ ok: false, code: "failed" }, { status: 502 });
    }
  } else if (process.env.NODE_ENV === "production") {
    // Never log visitors' details, and never pretend a message was delivered when nothing is configured to receive it.
    return NextResponse.json({ ok: false, code: "failed" }, { status: 503 });
  } else {
    console.info("[lead:dev]", lead);
  }
  return NextResponse.json({ ok: true });
}
