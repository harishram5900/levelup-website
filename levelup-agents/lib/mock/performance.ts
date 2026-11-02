// Sample data: views per platform over 14 days.
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const PERFORMANCE = Array.from({ length: 14 }, (_, i) => {
  const t = i / 13;
  const wave = Math.sin(i * 0.9) * 0.12;
  return {
    day: `${days[i % 7]} ${i < 7 ? "W1" : "W2"}`,
    tiktok: Math.round(1800 + t * 3200 + wave * 2400),
    reels: Math.round(1200 + t * 2100 + wave * 1600),
    shorts: Math.round(700 + t * 1500 + wave * 900),
    facebook: Math.round(400 + t * 600 + wave * 300),
  };
});
