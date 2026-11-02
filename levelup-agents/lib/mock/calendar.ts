import type { Platform } from "@/components/ui/PlatformIcon";

export type Post = { id: string; title: string; platform: Platform; time: string; status: "draft" | "scheduled" | "posted" };
export const WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

// Sample week of posts for the drag-and-drop calendar.
export const CALENDAR: Record<(typeof WEEK)[number], Post[]> = {
  Mon: [{ id: "p1", title: "Meet the team in 15 seconds", platform: "tiktok", time: "6:30pm", status: "posted" }],
  Tue: [
    { id: "p2", title: "Before and after: shop makeover", platform: "instagram", time: "12:00pm", status: "posted" },
    { id: "p3", title: "3 questions customers always ask", platform: "youtube", time: "5:00pm", status: "scheduled" },
  ],
  Wed: [{ id: "p4", title: "How we pack every order", platform: "tiktok", time: "7:00pm", status: "scheduled" }],
  Thu: [{ id: "p5", title: "Weekend special announcement", platform: "facebook", time: "10:00am", status: "draft" }],
  Fri: [
    { id: "p6", title: "Customer story: first visit", platform: "instagram", time: "6:00pm", status: "scheduled" },
    { id: "p7", title: "Trend remix: “day in my life”", platform: "tiktok", time: "8:00pm", status: "draft" },
  ],
  Sat: [],
  Sun: [{ id: "p8", title: "Week recap in 20 seconds", platform: "youtube", time: "4:00pm", status: "draft" }],
};
