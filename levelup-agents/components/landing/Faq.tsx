import { Accordion } from "@/components/ui/Accordion";

const FAQ = [
  { q: "Do I still need to film anything?", a: "Yes, for now. Send raw clips or photos from your phone and the agents handle the rest: ideas, scripts, editing, captions and posting. Real footage of your business performs better than stock video anyway." },
  { q: "Will it sound like a robot?", a: "No. You set your tone once and the Script and Review agents keep every post in your voice. You can approve, edit or reject anything before it goes live." },
  { q: "Which platforms does it post to?", a: "TikTok, Instagram Reels, YouTube Shorts and Facebook. Connections are being built now and turn on during the beta." },
  { q: "What does it cost?", a: "LevelUp is free during the beta. After that, plans start at $29 a month, a small fraction of a typical agency retainer." },
  { q: "Is my content and data safe?", a: "Your brand info and footage are only used to make your content. You can export or delete everything at any time." },
  { q: "What is Nurture Flow?", a: "An upcoming feature that finds leads from your content and sends each one a personal follow-up. It isn't live yet. Join the waitlist to hear when it is." },
];

export function Faq() {
  return <Accordion items={FAQ} />;
}
