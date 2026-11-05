import type { Metadata } from "next";
import { LegalPage } from "@/components/landing/LegalPage";

export const metadata: Metadata = { title: "Terms · LevelUp" };

export default function Terms() {
  return (
    <LegalPage title="Terms" updated="November 2026">
      <p>By using LevelUp you agree to these terms.</p>
      <h2>Who can use LevelUp</h2>
      <p>Anyone can use LevelUp as a guest. You must be 13 or older to create an account. If you're under 18, use LevelUp with a parent or guardian's knowledge, especially before raising money, signing agreements or sharing personal details.</p>
      <h2>Advice, not guarantees</h2>
      <p>Agent plans, playbooks and recommendations are educational guidance, not legal, financial or investment advice. Always check the details of competitions, programs and investors on their official sites. LevelUp is not affiliated with the organizations or people it mentions.</p>
      <h2>Your content</h2>
      <p>You own your ideas, answers, decks and uploads. Only upload images you have the right to use.</p>
      <h2>Be kind: zero tolerance for abuse</h2>
      <p>Names, startup names, team goals and anything else other people can see must not be offensive, hateful, sexual, threatening, bullying, or impersonate someone. There is no tolerance for objectionable content or abusive users. You can report or block anyone from the leaderboard; we review reports, remove offending content and close the accounts of people who break this rule.</p>
      <h2>Subscriptions</h2>
      <p>LevelUp Pro is a monthly subscription you can cancel anytime. If you subscribe on the web, billing is handled by Stripe and you can cancel in Settings. If you subscribe through the App Store or Google Play, that store handles billing and cancellation under its own terms. Under 18? A parent or guardian should make the purchase.</p>
      <h2>AI-generated content</h2>
      <p>Plans, research summaries and chat replies are written with AI and may contain mistakes. Check important facts, deadlines and links yourself before relying on them.</p>
      <h2>Fair use</h2>
      <p>Don't try to break, overload, scrape or attack the service, or access other people's data. We may limit or close accounts that do.</p>
      <h2>Changes</h2>
      <p>We may update these terms and will note the date above.</p>
    </LegalPage>
  );
}
