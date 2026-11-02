"use client";
import { DndContext, KeyboardSensor, PointerSensor, useDraggable, useDroppable, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { GripVertical } from "lucide-react";
import { useState } from "react";
import { CALENDAR, WEEK, type Post } from "@/lib/mock/calendar";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { cn } from "@/lib/utils";

type Day = (typeof WEEK)[number];
const STATUS = { draft: "text-muted bg-fg/[0.06]", scheduled: "text-violet bg-violet/10", posted: "text-good bg-good/10" };

function PostCard({ post }: { post: Post }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: post.id });
  return (
    <motion.div layout layoutId={post.id} ref={setNodeRef} style={{ transform: CSS.Translate.toString(transform) }}
      className={cn("group mb-2 cursor-grab touch-none rounded-xl hairline bg-bg-2 p-3 text-left active:cursor-grabbing", isDragging && "z-50 shadow-2xl ring-1 ring-violet/50")}
      {...attributes} {...listeners} aria-roledescription="Draggable post" aria-label={`${post.title}, ${post.time}. Press space to pick up and arrow keys to move.`}>
      <div className="flex items-center justify-between text-muted"><PlatformIcon name={post.platform} size={14} /><GripVertical size={14} className="opacity-0 transition-opacity group-hover:opacity-100" aria-hidden /></div>
      <p className="mt-1.5 text-[13px] font-medium leading-snug">{post.title}</p>
      <div className="mt-2 flex items-center justify-between text-[11px]"><span className="text-muted">{post.time}</span><span className={cn("rounded-full px-2 py-0.5 font-semibold capitalize", STATUS[post.status])}>{post.status}</span></div>
    </motion.div>
  );
}

function DayColumn({ day, posts }: { day: Day; posts: Post[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: day });
  return (
    <div ref={setNodeRef} className={cn("min-h-[320px] rounded-2xl p-2.5 transition-colors", isOver ? "bg-violet/10 ring-1 ring-violet/40" : "bg-fg/[0.03]")}>
      <p className="mb-3 px-1 text-sm font-semibold">{day}</p>
      {posts.map((p) => <PostCard key={p.id} post={p} />)}
      {posts.length === 0 && <p className="px-1 text-xs text-muted">Drop a post here</p>}
    </div>
  );
}

export function CalendarBoard() {
  const [cols, setCols] = useState(CALENDAR);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }), useSensor(KeyboardSensor));
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over) return;
    const to = over.id as Day;
    setCols((c) => {
      const from = (Object.keys(c) as Day[]).find((d) => c[d].some((p) => p.id === active.id));
      if (!from || from === to) return c;
      const post = c[from].find((p) => p.id === active.id)!;
      return { ...c, [from]: c[from].filter((p) => p.id !== active.id), [to]: [...c[to], post] };
    });
  };
  return (
    <DndContext id="calendar-dnd" sensors={sensors} onDragEnd={onDragEnd}>
      <div className="overflow-x-auto pb-2">
        <div className="grid min-w-[980px] grid-cols-7 gap-3">
          {WEEK.map((d) => <DayColumn key={d} day={d} posts={cols[d]} />)}
        </div>
      </div>
    </DndContext>
  );
}
