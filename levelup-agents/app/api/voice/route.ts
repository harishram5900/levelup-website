import { NextResponse } from "next/server";
import { lineText, type CharacterId } from "@/lib/cofounder/lines";

/**
 * Character voices. GET /api/voice?c=pip&l=intro returns MP3 audio from ElevenLabs.
 * Only fixed lines are allowed, and every response is cached by the CDN for a year, so each
 * line costs voice credits once. Without ELEVENLABS_API_KEY it returns 501 and the app falls
 * back to the device's built-in voice.
 */
export const runtime = "nodejs";

// Default ElevenLabs premade voices; override any of them with ELEVENLABS_VOICE_PIP etc.
const VOICES: Record<CharacterId, { id: string; stability: number; style: number }> = {
  pip: { id: "TX3LPaxmHKxFdv7VOQHJ", stability: 0.55, style: 0.2 },   // Liam: young, clear
  blaze: { id: "IKne3meq5aSn9XLyUdCD", stability: 0.3, style: 0.6 },  // Charlie: energetic
  sage: { id: "JBFqnCBsd6RMkjVDRZzb", stability: 0.7, style: 0.25 },  // George: warm, wise
  nova: { id: "cgSgspJ2msm6clMCkdW9", stability: 0.45, style: 0.45 }, // Jessica: playful
  rocco: { id: "iP95p4xoKVk53GoZ742B", stability: 0.45, style: 0.4 }, // Chris: casual
};

const hits = new Map<string, number[]>();
function allowed(key: string, limit = 40, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) { hits.set(key, recent); return false; }
  hits.set(key, [...recent, now]);
  return true;
}

export async function GET(req: Request) {
  const u = new URL(req.url);
  const c = (u.searchParams.get("c") ?? "") as CharacterId;
  const l = u.searchParams.get("l") ?? "";
  const text = VOICES[c] ? lineText(c, l) : null;
  if (!text) return NextResponse.json({ error: "Unknown line" }, { status: 404 });

  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) return NextResponse.json({ error: "Voice not configured" }, { status: 501, headers: { "cache-control": "public, s-maxage=300" } });

  const ip = (req.headers.get("x-forwarded-for") ?? "local").split(",")[0].trim();
  if (!allowed(ip)) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const v = VOICES[c];
  const voiceId = process.env[`ELEVENLABS_VOICE_${c.toUpperCase()}`] || v.id;
  try {
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_64`, {
      method: "POST",
      headers: { "xi-api-key": key, "content-type": "application/json", accept: "audio/mpeg" },
      body: JSON.stringify({ text, model_id: "eleven_flash_v2_5", voice_settings: { stability: v.stability, similarity_boost: 0.8, style: v.style, use_speaker_boost: true } }),
    });
    if (!r.ok) {
      console.error("ElevenLabs error", r.status, (await r.text()).slice(0, 200));
      return NextResponse.json({ error: "Voice unavailable" }, { status: 502 });
    }
    return new Response(await r.arrayBuffer(), {
      headers: { "content-type": "audio/mpeg", "cache-control": "public, max-age=86400, s-maxage=31536000, immutable" },
    });
  } catch (err) {
    console.error("ElevenLabs request failed", err);
    return NextResponse.json({ error: "Voice unavailable" }, { status: 502 });
  }
}
