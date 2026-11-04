import type { PaletteId } from "./profile";

/** Dashboard color themes. Values are RGB triplets for the CSS variables in globals.css. */
export const PALETTES: { id: PaletteId; name: string; primary: string; secondary: string; cta: string; pro?: boolean }[] = [
  { id: "royal", name: "Royal", primary: "16 91 255", secondary: "77 141 255", cta: "254 133 0" },
  { id: "emerald", name: "Emerald", primary: "5 150 105", secondary: "52 211 153", cta: "250 204 21" },
  { id: "sunset", name: "Sunset", primary: "219 39 119", secondary: "244 114 182", cta: "251 146 60" },
  { id: "violet", name: "Galaxy", primary: "124 58 237", secondary: "167 139 250", cta: "34 211 238" },
  { id: "crimson", name: "Crimson", primary: "220 38 38", secondary: "248 113 113", cta: "250 204 21" },
  { id: "ocean", name: "Ocean", primary: "2 132 199", secondary: "56 189 248", cta: "163 230 53" },
  { id: "gold", name: "Gold", primary: "202 138 4", secondary: "250 204 21", cta: "244 63 94", pro: true },
  { id: "aurora", name: "Aurora", primary: "13 148 136", secondary: "168 85 247", cta: "236 72 153", pro: true },
];

export const paletteById = (id?: string) => PALETTES.find((p) => p.id === id) ?? PALETTES[0];
export const rgb = (triplet: string, a = 1) => `rgb(${triplet} / ${a})`;

export function applyPalette(id: PaletteId) {
  const p = paletteById(id);
  const s = document.documentElement.style;
  s.setProperty("--violet", p.primary);
  s.setProperty("--cyan", p.secondary);
  s.setProperty("--amber", p.cta);
}
