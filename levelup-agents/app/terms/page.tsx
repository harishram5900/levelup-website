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
      <h2>Fair use</h2>
      <p>Don't try to break, overload, scrape or attack the service, or access other people's data. We may limit or close accounts that do.</p>
      <h2>Changes</h2>
      <p>We may update these terms and will note the date above.</p>
    </LegalPage>
  );
}
