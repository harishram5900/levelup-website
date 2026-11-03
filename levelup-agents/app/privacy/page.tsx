import type { Metadata } from "next";
import { LegalPage } from "@/components/landing/LegalPage";

export const metadata: Metadata = { title: "Privacy Policy · LevelUp" };

export default function Privacy() {
  return (
    <LegalPage title="Privacy" updated="November 2026">
      <p>LevelUp helps young founders build startups. We collect as little as possible and never sell your data.</p>
      <h2>What we collect</h2>
      <ul>
        <li><b>Account:</b> your email, first name, and confirmation that you are 13 or older.</li>
        <li><b>Your workspace:</b> your startup details, agent answers and results, goals, deck (including images you upload), character and color choices.</li>
        <li><b>Guests:</b> if you don't sign up, everything stays in your own browser and never reaches our servers, except text you send to an agent when AI mode is on.</li>
      </ul>
      <h2>How it's used</h2>
      <ul>
        <li>To run the app and save your progress across devices.</li>
        <li>When AI mode is on, your startup details and answers are sent to our AI provider (Anthropic) to write your plan. They are not used to identify you.</li>
      </ul>
      <h2>Leaderboards</h2>
      <p>Signed-in users appear on the "Everyone" leaderboard with only their first name, startup name and XP (never email or last name). You can hide yourself anytime on the Leaderboard page. Friends you invite or add can always see each other.</p>
      <h2>Kids and teens</h2>
      <p>You must be 13 or older to create an account. Under 13, you can use LevelUp as a guest with nothing stored on our servers. If you believe a child under 13 created an account, contact us and we'll delete it.</p>
      <h2>Security</h2>
      <p>Data is stored with Supabase. Row-level security means each account can only read its own data. Passwords are handled by Supabase Auth and are never visible to us.</p>
      <h2>Your choices</h2>
      <p>You can delete your workspace or your whole account anytime in Settings.</p>
      <h2>Contact</h2>
      <p>Questions or deletion requests: [add your contact email].</p>
    </LegalPage>
  );
}
