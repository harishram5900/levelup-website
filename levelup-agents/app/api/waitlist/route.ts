import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

/**
 * Stub waitlist endpoint. Stores emails in data/waitlist.json locally.
 * On read-only hosts (e.g. Vercel) the write fails, so it falls back to memory.
 * TODO: replace with a real store (database, Resend audience, Airtable, etc.) before launch.
 */
const FILE = path.join(process.cwd(), "data", "waitlist.json");
const memory = new Set<string>();
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: Request) {
  let email = "";
  try {
    ({ email } = await req.json());
  } catch {
    return NextResponse.json({ error: "Send JSON with an email field." }, { status: 400 });
  }
  email = String(email ?? "").trim().toLowerCase();
  if (!EMAIL.test(email) || email.length > 200) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  try {
    let list: string[] = [];
    try { list = JSON.parse(await fs.readFile(FILE, "utf8")); } catch { /* first signup */ }
    if (!list.includes(email)) list.push(email);
    await fs.mkdir(path.dirname(FILE), { recursive: true });
    await fs.writeFile(FILE, JSON.stringify(list, null, 2));
  } catch {
    memory.add(email); // read-only filesystem: keep it for this server instance only
  }
  return NextResponse.json({ ok: true });
}
