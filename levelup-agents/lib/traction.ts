/**
 * REAL TRACTION GOES HERE.
 * Leave a value as null until you have a real, verifiable number.
 * Sections that read these only render when a value is set, so nothing made up ever ships.
 */
export const TRACTION: { label: string; value: number | null; suffix?: string }[] = [
  { label: "Businesses on the waitlist", value: null }, // TODO: real waitlist count
  { label: "Posts published by agents", value: null }, // TODO: real number after launch
  { label: "Hours saved per week (avg.)", value: null, suffix: "h" }, // TODO: from user surveys
];

/** Testimonials: add only real quotes with permission. Empty means the section is hidden. */
export const TESTIMONIALS: { quote: string; name: string; business: string }[] = [];
