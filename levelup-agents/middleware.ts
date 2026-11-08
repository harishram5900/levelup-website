import { NextResponse, type NextRequest } from "next/server";

/**
 * App-level firewall. Runs before every request (except static files):
 * - blocks known attack-tool user agents and vulnerability-scanner paths
 * - API: only POST, same-origin, small bodies, and a per-IP rate limit
 * Works alongside the Vercel Firewall rules (see SECURITY.md). The rate limit is per server instance;
 * the Vercel Firewall rate-limit rule is the global one.
 */
const BAD_UA = /(sqlmap|nikto|nmap|masscan|zgrab|acunetix|nessus|wpscan|dirbuster|gobuster|ffuf|nuclei|havij|w3af|openvas|jaeles|commix|xsstrike)/i;
const BAD_PATH = /(\/\.(env|git|svn|hg|htaccess|htpasswd|DS_Store|aws|ssh|npmrc)|wp-admin|wp-login|wp-content|wp-includes|xmlrpc|phpmyadmin|\/pma\/|\.php\d?$|\.asp(x)?$|\.jsp$|cgi-bin|\/vendor\/phpunit|\/actuator|\/server-status|\/config\.(json|ya?ml)|\/backup|\.sql$|\.bak$|\/etc\/passwd|\.\.\/)/i;
const MAX_API_BODY = 64 * 1024;

const hits = new Map<string, number[]>();
function limited(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (now - v[v.length - 1] > windowMs) hits.delete(k);
  return recent.length > limit;
}

const deny = (status: number, msg: string) => new NextResponse(JSON.stringify({ error: msg }), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const ua = req.headers.get("user-agent") ?? "";
  const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();

  if (req.url.length > 2048) return deny(414, "URL too long");
  if (BAD_UA.test(ua)) return deny(403, "Forbidden");
  let decoded = pathname;
  try { decoded = decodeURIComponent(pathname); } catch { return deny(400, "Bad request"); }
  if (BAD_PATH.test(decoded.toLowerCase())) return deny(404, "Not found");

  // Rough flood protection (high enough for a whole school sharing one IP).
  if (limited(`all:${ip}`, 1200, 60_000)) return deny(429, "Too many requests. Slow down a little.");

  if (pathname.startsWith("/api/")) {
    // Character voices are fixed, CDN-cached audio lines: read-only GET, rate-limited in the route.
    if (pathname === "/api/voice" && req.method === "GET") return NextResponse.next();
    if (req.method !== "POST") return deny(405, "Method not allowed");
    const origin = req.headers.get("origin");
    if (origin) {
      try { if (new URL(origin).host !== req.headers.get("host")) return deny(403, "Cross-site request blocked"); }
      catch { return deny(403, "Bad origin"); }
    }
    const len = Number(req.headers.get("content-length") ?? 0);
    if (len > MAX_API_BODY) return deny(413, "Request too large");
    if (!/^application\/json/i.test(req.headers.get("content-type") ?? "") && !pathname.startsWith("/api/account/")) return deny(415, "JSON only");
    const strict = pathname.startsWith("/api/waitlist") || pathname.startsWith("/api/account/") || pathname.startsWith("/api/promo") ? 5 : 30;
    if (limited(`api:${pathname}:${ip}`, strict, 60_000)) return deny(429, "Too many requests. Please wait a minute.");
  }
  return NextResponse.next();
}

export const config = {
  // Everything except Next's static files, images and the favicon.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg).*)"],
};
