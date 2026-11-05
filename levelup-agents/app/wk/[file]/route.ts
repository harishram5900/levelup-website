import { NextResponse } from "next/server";

/**
 * App Links (Android) and Universal Links (iOS): lets links to levelupinnovations.tech open inside the
 * LevelUp app (sign-up confirmation, password reset, invites). Served at /.well-known/* via a rewrite.
 * Set in Vercel:
 *   ANDROID_CERT_SHA256  SHA-256 fingerprint(s) of your app signing key, comma-separated
 *                        (Play Console → Setup → App signing → "SHA-256 certificate fingerprint")
 *   APPLE_TEAM_ID        your 10-character Apple Developer Team ID (developer.apple.com → Membership)
 */
const APP_ID = "tech.levelupinnovations.app";
const PATHS = ["/app", "/app/*", "/reset", "/reset/*", "/signin", "/signup", "/join/*"];

export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const headers = { "content-type": "application/json", "cache-control": "public, max-age=3600" };
  if (file === "assetlinks") {
    const fps = (process.env.ANDROID_CERT_SHA256 ?? "").split(",").map((s) => s.trim().toUpperCase()).filter(Boolean);
    return new NextResponse(JSON.stringify(fps.length ? [{ relation: ["delegate_permission/common.handle_all_urls"], target: { namespace: "android_app", package_name: APP_ID, sha256_cert_fingerprints: fps } }] : []), { headers });
  }
  if (file === "aasa") {
    const team = (process.env.APPLE_TEAM_ID ?? "").trim();
    const body = { applinks: { details: team ? [{ appIDs: [`${team}.${APP_ID}`], components: PATHS.map((p) => ({ "/": p })) }] : [] } };
    return new NextResponse(JSON.stringify(body), { headers });
  }
  return new NextResponse("Not found", { status: 404 });
}
