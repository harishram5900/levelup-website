import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/landing/LegalPage";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy Policy · LevelUp" };

export default function Privacy() {
  return (
    <LegalPage title="Privacy" updated="November 2026">
      <p>LevelUp helps young founders build startups, on the web and in our iOS and Android apps. We collect as little as possible, we never sell your data, and we don&apos;t show ads.</p>
      <h2>What we collect</h2>
      <ul>
        <li><b>Account:</b> your email, first name, and confirmation that you are 13 or older.</li>
        <li><b>Your workspace:</b> your startup details, agent answers and results, goals, notes, AI co-founder chats, deck (including images you upload), character and color choices, XP and streak.</li>
        <li><b>Guests:</b> if you don&apos;t sign up, your workspace stays on your own device and never reaches our servers, except the text you send to an agent or a search (see below).</li>
        <li><b>Payments:</b> if you buy Pro on the web, Stripe processes your payment. We only receive whether you&apos;re subscribed, never your card details.</li>
        <li><b>We don&apos;t collect:</b> your location, contacts, photos library (only images you choose to upload), advertising IDs, or tracking data across other apps and websites.</li>
      </ul>
      <h2>How it&apos;s used</h2>
      <ul>
        <li>To run the app and save your progress across your devices.</li>
        <li><b>AI plans and chat (Pro):</b> your startup details, answers and chats are sent to our AI provider, Anthropic, to write your plans. Anthropic doesn&apos;t use them to train its models.</li>
        <li><b>Live research:</b> when Scout, Traction, Customer or Opportunities searches for you, the niche keywords you type (not your name or email) are sent to public sources such as the Apple App Store, Google Play, Hacker News, GitHub, Reddit and Devpost.</li>
        <li><b>Reminders:</b> the phone app can remind you to keep your streak. These reminders are scheduled on your phone; we don&apos;t run a tracking or push server. Turn them off anytime in your phone&apos;s settings.</li>
      </ul>
      <h2>Leaderboards</h2>
      <p>Signed-in users appear on the &quot;Everyone&quot; leaderboard with only their first name, startup name and XP (never email or last name). You can hide yourself anytime on the Leaderboard page. Friends you invite or add can always see each other.</p>
      <h2>Kids and teens</h2>
      <p>You must be 13 or older to create an account. Under 13, you can use LevelUp as a guest with your workspace stored only on your device. If you believe a child under 13 created an account, contact us and we&apos;ll delete it.</p>
      <h2>Security and storage</h2>
      <p>Data is stored with Supabase. Row-level security means each account can only read its own data. Passwords are handled by Supabase Auth and are never visible to us. All traffic is encrypted (HTTPS).</p>
      <h2>Keeping and deleting your data</h2>
      <p>We keep your data while you have an account. You can delete your workspace or your whole account anytime in Settings, in the app or on the web; account deletion removes your data from our database right away. See <Link href="/delete-account" className="underline">how to delete your account</Link>.</p>
      <h2>Contact</h2>
      <p>{CONTACT_EMAIL ? <>Questions or requests: <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</> : <>Questions or requests: use the contact option on our website.</>}</p>
    </LegalPage>
  );
}
