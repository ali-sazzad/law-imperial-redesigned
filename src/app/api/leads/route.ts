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
const hits = new Map<string, number[]>();

function limited(ip: string) {
  const now = Date.now();
  if (hits.size >= MAX_TRACKED) {
    for (const [key, times] of hits) if (now - times[times.length - 1] >= WINDOW_MS) hits.delete(key);
    if (hits.size >= MAX_TRACKED) hits.clear(); // under sustained flood, reset rather than grow without bound
  }
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

/**
 * Client IP from headers the hosting platform sets itself. A raw x-forwarded-for can be forged by the caller,
 * so only its last hop (the one added by the nearest proxy) is used, and only as a fallback.
 */
function clientIp(req: Request) {
  const h = req.headers;
  return (
    h.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip")?.trim() ||
    h.get("x-forwarded-for")?.split(",").at(-1)?.trim() ||
    "local"
  );
}

/** Responses carry a `code` the page translates, so this route never needs to know the visitor's language. */
export async function POST(req: Request) {
  if (limited(clientIp(req))) return NextResponse.json({ ok: false, code: "rate" }, { status: 429 });

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
