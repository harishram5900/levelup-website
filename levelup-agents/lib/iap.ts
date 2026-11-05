"use client";
/**
 * In-app purchases (App Store + Google Play) through RevenueCat. Only used inside the native app;
 * the web keeps Stripe. Needs NEXT_PUBLIC_REVENUECAT_IOS_KEY / NEXT_PUBLIC_REVENUECAT_ANDROID_KEY
 * (public SDK keys) and an entitlement called "pro" in RevenueCat. The server learns about
 * purchases from the RevenueCat webhook (/api/revenuecat), which sets profiles.plan.
 */
import type { PurchasesPackage } from "@revenuecat/purchases-capacitor";
import { isNative, platform } from "./native";

export const ENTITLEMENT = "pro";
const key = () => (platform() === "ios" ? process.env.NEXT_PUBLIC_REVENUECAT_IOS_KEY : platform() === "android" ? process.env.NEXT_PUBLIC_REVENUECAT_ANDROID_KEY : "") ?? "";
export const iapAvailable = () => isNative() && !!key();

let configuredFor: string | null = null;
async function rc(uid: string) {
  const { Purchases } = await import("@revenuecat/purchases-capacitor");
  if (!configuredFor) { await Purchases.configure({ apiKey: key(), appUserID: uid }); configuredFor = uid; }
  else if (configuredFor !== uid) { await Purchases.logIn({ appUserID: uid }); configuredFor = uid; }
  return Purchases;
}

export type ProOffer = { pkg: PurchasesPackage; price: string; period: string; trial: string | null };

/** The Pro subscription as the store sells it (localized price). */
export async function getProOffer(uid: string): Promise<ProOffer | null> {
  const P = await rc(uid);
  const o = await P.getOfferings();
  const pkg = o.current?.monthly ?? o.current?.availablePackages[0];
  if (!pkg) return null;
  const intro = pkg.product.introPrice;
  return {
    pkg, price: pkg.product.priceString,
    period: pkg.packageType === "ANNUAL" ? "year" : "month",
    trial: intro && intro.price === 0 ? `${intro.periodNumberOfUnits} ${intro.periodUnit.toLowerCase()}${intro.periodNumberOfUnits > 1 ? "s" : ""} free` : null,
  };
}

/** Returns true when Pro is active after the purchase; false if the user cancelled. */
export async function buyPro(uid: string, pkg: PurchasesPackage): Promise<boolean> {
  const P = await rc(uid);
  try {
    const r = await P.purchasePackage({ aPackage: pkg });
    return !!r.customerInfo.entitlements.active[ENTITLEMENT];
  } catch (e) {
    if ((e as { userCancelled?: boolean }).userCancelled) return false;
    throw new Error((e as Error).message || "The purchase didn't go through.");
  }
}

export async function restorePro(uid: string): Promise<boolean> {
  const P = await rc(uid);
  const { customerInfo } = await P.restorePurchases();
  return !!customerInfo.entitlements.active[ENTITLEMENT];
}

/** Store subscription management page (cancel, change plan). */
export async function manageSubscription() {
  const { openExternal } = await import("./native");
  await openExternal(platform() === "ios" ? "https://apps.apple.com/account/subscriptions" : "https://play.google.com/store/account/subscriptions?package=tech.levelupinnovations.app");
}
