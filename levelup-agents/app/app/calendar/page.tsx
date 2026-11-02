import { CalendarBoard } from "@/components/app/CalendarBoard";
import { SampleTag } from "@/components/ui/Badge";

export default function CalendarPage() {
  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div><h2 className="font-display text-3xl font-bold">This week</h2><p className="mt-1 text-muted">Drag a post to another day to reschedule it.</p></div>
        <SampleTag />
      </div>
      <CalendarBoard />
    </div>
  );
}
