import { NextResponse, type NextRequest } from "next/server";
import { enquirySchema, fieldErrors, type Enquiry } from "@/lib/enquiry";

/*
 * Enquiry endpoint.
 * Delivery (any that are configured run; at least one must succeed in production):
 *   - RESEND_API_KEY + ENQUIRY_TO (+ ENQUIRY_FROM): email via Resend REST API (no SDK).
 *   - CRM_WEBHOOK_URL (+ CRM_WEBHOOK_SECRET): JSON POST for the client's CRM.
 * In development with nothing configured, the lead is logged instead.
 */

const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > LIMIT;
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function summary(e: Enquiry) {
  const rows: [string, string][] = [
    ["Intent", e.intent],
    ["Project", e.project],
    ["Name", e.name],
    ["Phone", e.phone],
    ["Email", e.email || "-"],
    ["Configuration", e.config ?? "-"],
    ["Level of interest", e.level !== undefined ? String(e.level) : "-"],
    ["Preferred visit", e.visitDate ? `${e.visitDate} ${e.visitWindow || ""}`.trim() : "-"],
    ["Message", e.message || "-"],
    ["Consent", "Given on form submission"],
  ];
  return rows;
}

async function sendEmail(e: Enquiry) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_TO;
  if (!key || !to) return null;
  const from = process.env.ENQUIRY_FROM ?? "Rubics Realty website <onboarding@resend.dev>";
  const rows = summary(e);
  const html = `<h2>New ${esc(e.intent)} enquiry</h2><table cellpadding="6">${rows
    .map(([k, v]) => `<tr><th align="left">${esc(k)}</th><td>${esc(v)}</td></tr>`)
    .join("")}</table>`;
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: to.split(",").map((s) => s.trim()),
      reply_to: e.email || undefined,
      subject: `Website enquiry: ${e.intent} · ${e.name}`,
      html,
      text,
    }),
  });
  return res.ok;
}

async function sendWebhook(e: Enquiry) {
  const url = process.env.CRM_WEBHOOK_URL;
  if (!url) return null;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.CRM_WEBHOOK_SECRET ? { "X-Webhook-Secret": process.env.CRM_WEBHOOK_SECRET } : {}),
    },
    body: JSON.stringify({ ...e, website: undefined, source: "rubicsrealty.com", receivedAt: new Date().toISOString() }),
  });
  return res.ok;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "Too many attempts. Please call us instead." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot filled: pretend success, drop silently.
  if (body && typeof body === "object" && "website" in body && String((body as { website: unknown }).website ?? "").length > 0) {
    return NextResponse.json({ ok: true });
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: fieldErrors(parsed.error) }, { status: 422 });
  }
  const lead = parsed.data;

  const results = await Promise.allSettled([sendEmail(lead), sendWebhook(lead)]);
  const delivered = results.some((r) => r.status === "fulfilled" && r.value === true);
  const configured = results.some((r) => r.status === "fulfilled" && r.value !== null) || results.some((r) => r.status === "rejected");

  if (!configured) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[enquiry] (dev, no delivery configured) ${JSON.stringify({ ...lead, website: undefined })}`);
      return NextResponse.json({ ok: true, dev: true });
    }
    console.error("[enquiry] No delivery configured in production. Set RESEND_API_KEY + ENQUIRY_TO or CRM_WEBHOOK_URL.");
    return NextResponse.json({ ok: false, error: "We could not send this right now. Please call 1800 209 6363." }, { status: 503 });
  }
  if (!delivered) {
    console.error("[enquiry] Delivery failed", results);
    return NextResponse.json({ ok: false, error: "We could not send this right now. Please call 1800 209 6363." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
