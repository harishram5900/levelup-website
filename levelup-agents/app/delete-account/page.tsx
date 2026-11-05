import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/landing/LegalPage";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = { title: "Delete your account · LevelUp" };

/** Public page the app stores ask for: how to delete a LevelUp account and what gets deleted. */
export default function DeleteAccount() {
  return (
    <LegalPage title="Delete account" updated="November 2026">
      <p>You can delete your LevelUp account and all of its data at any time, from the app or the website.</p>
      <h2>In the app or on the web</h2>
      <ul>
        <li>Sign in, then open <b>Settings</b> (in the phone app: <b>More → Settings</b>).</li>
        <li>Tap <b>Delete my account</b> and confirm.</li>
      </ul>
      <p><Link href="/app/settings" className="underline">Open Settings</Link></p>
      <h2>Can&apos;t sign in?</h2>
      <p>{CONTACT_EMAIL ? <>Email <a className="underline" href={`mailto:${CONTACT_EMAIL}?subject=Delete%20my%20LevelUp%20account`}>{CONTACT_EMAIL}</a> from the address on your account with the subject &quot;Delete my LevelUp account&quot;. We&apos;ll delete it within 7 days and confirm by email.</> : <>Use the contact option on our website from the address on your account and we&apos;ll delete it within 7 days.</>}</p>
      <h2>What gets deleted</h2>
      <ul>
        <li>Your account (email, name, sign-in).</li>
        <li>Your startup profile, every agent plan, goals, notes, AI co-founder chats, deck and uploaded images, XP, streak, friends and team membership, and leaderboard entry.</li>
      </ul>
      <h2>What we keep</h2>
      <p>Nothing from your workspace. If you paid on the web, Stripe keeps payment records that the law requires (we never hold your card details). Guest data lives only on your device; clear it in Settings or by uninstalling the app.</p>
    </LegalPage>
  );
}
