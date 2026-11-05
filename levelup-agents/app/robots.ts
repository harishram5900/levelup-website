import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/** Public pages are indexable (including by AI answer engines); private app pages and APIs are not. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/app/", "/reset", "/wk/"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
