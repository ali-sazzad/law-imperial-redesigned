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

const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

/** Responses carry a `code` the page translates, so this route never needs to know the visitor's language. */
export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (limited(ip)) return NextResponse.json({ ok: false, code: "rate" }, { status: 429 });

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
  } else {
    console.info("[lead]", lead);
  }
  return NextResponse.json({ ok: true });
}
