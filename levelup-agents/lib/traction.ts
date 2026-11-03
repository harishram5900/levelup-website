/**
 * REAL TRACTION GOES HERE.
 * Leave a value as null until you have a real, verifiable number.
 * Sections that read these only render when a value is set, so nothing made up ever ships.
 */
export const TRACTION: { label: string; value: number | null; suffix?: string }[] = [
  // Founder-provided: total users across LevelUp products (including the earlier LevelUp platform).
  // Keep this wording: it is NOT the user count of the co-founder app alone.
  { label: "Users across LevelUp products", value: 50000, suffix: "+" },
  // Founder-provided: student startups helped across LevelUp products.
  { label: "Student startups helped across LevelUp products", value: 200, suffix: "+" },
  { label: "Agent plans created", value: null }, // TODO: real number after launch
  { label: "Competitions entered", value: null }, // TODO: from user surveys
];

/** Testimonials: add only real quotes with permission. Empty means the section is hidden. */
export const TESTIMONIALS: { quote: string; name: string; business: string }[] = [];
