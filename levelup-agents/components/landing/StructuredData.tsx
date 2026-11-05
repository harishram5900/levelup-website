import { FAQ } from "./Faq";
import { SITE_URL } from "@/lib/site";

/** JSON-LD so search engines and AI answer engines understand what LevelUp is (SEO + AEO). */
export function StructuredData() {
  const data = [
    { "@context": "https://schema.org", "@type": "Organization", name: "LevelUp Innovations", url: SITE_URL, logo: `${SITE_URL}/icons/icon-512.png` },
    {
      "@context": "https://schema.org", "@type": "SoftwareApplication", name: "LevelUp: AI Co-Founder", url: SITE_URL,
      applicationCategory: "BusinessApplication", operatingSystem: "Web, iOS, Android",
      description: "An AI co-founder for young entrepreneurs: 12 agents that validate your idea, find customers and real competitors, build your pitch, price your product and plan your launch, plus 300+ competitions, grants and programs.",
      offers: [{ "@type": "Offer", price: "0", priceCurrency: "USD", name: "Student (free)" }, { "@type": "Offer", price: "9", priceCurrency: "USD", name: "Pro (monthly)" }],
      audience: { "@type": "PeopleAudience", suggestedMinAge: 13 },
    },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
