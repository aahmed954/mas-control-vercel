import fetch from "node-fetch";

export default async function handler(req: any, res: any) {
  try {
    const CONTROL_API_URL = process.env.CONTROL_API_URL || "http://192.168.68.55:8088";
    const CONTROL_API_KEY = process.env.CONTROL_API_KEY;
    if (!CONTROL_API_KEY) return res.status(500).json({ ok: false, error: "Missing CONTROL_API_KEY" });

    // Optional overrides via query string, e.g. ?collection=mas_embeddings
    const qs = new URLSearchParams(req.query as Record<string,string>);
    qs.set("key", CONTROL_API_KEY);

    const url = `${CONTROL_API_URL.replace(/\/+$/,'')}/system-check/run?${qs.toString()}`;
    const r = await fetch(url, { method: "GET", timeout: 1000 * 180 });
    const data = await r.json();
    return res.status(200).json({ ok: true, source: "starlord", data });
  } catch (e: any) {
    return res.status(502).json({ ok: false, error: String(e?.message || e) });
  }
}