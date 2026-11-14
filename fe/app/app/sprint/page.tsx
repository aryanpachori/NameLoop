"use client";

import { useState } from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { ChannelChip, ChannelMark, channelLabel } from "@/components/channel-mark";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { StateBadge } from "@/components/state-badge";
import { Button } from "@/components/ui/button";
import { Segmented } from "@/components/ui/segmented";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useWorkspace } from "@/lib/store";
import type { RecordState, SprintPost, SprintPostStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const STATUS: Record<SprintPostStatus, { state: RecordState; label: string }> = {
  draft: { state: "ai_working", label: "Draft" },
  waiting_approval: { state: "waiting_approval", label: "Waiting approval" },
  scheduled: { state: "scheduled", label: "Scheduled" },
  posted: { state: "live", label: "Posted" },
  failed: { state: "failed", label: "Failed" },
};

function PostStatus({ status }: { status: SprintPostStatus }) {
  return <StateBadge state={STATUS[status].state} label={STATUS[status].label} />;
}

function dayLabel(startDate: string, day: number) {
  const d = new Date(startDate);
  d.setDate(d.getDate() + day - 1);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

type View = "week" | "month" | "list";

function SortableRow({
  post,
  startDate,
  onOpen,
}: {
  post: SprintPost;
  startDate: string;
  onOpen: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: post.id,
  });
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "surface flex items-center gap-3 p-3",
        isDragging && "relative z-10 border-foreground"
      )}
    >
      <button
        type="button"
        aria-label={`Drag ${post.title}`}
        className="cursor-grab touch-none rounded-[8px] p-1 text-muted-foreground hover:bg-muted active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" />
      </button>
      <div className="w-16 shrink-0">
        <p className="font-[family-name:var(--font-geist-mono)] text-13 tabular-nums">Day {post.day}</p>
        <p className="text-12 text-muted-foreground">{dayLabel(startDate, post.day)}</p>
      </div>
      <ChannelMark id={post.channelId} />
      <button
        type="button"
        onClick={onOpen}
        className="min-w-0 flex-1 truncate text-left text-14 font-medium hover:underline"
      >
        {post.title}
      </button>
      <PostStatus status={post.status} />
    </li>
  );
}

function PostPreview({ post, brandName }: { post: SprintPost; brandName: string }) {
  const handle = brandName.toLowerCase().replace(/\s+/g, "");
  const shell = "rounded-[12px] border border-border bg-background p-4";
  if (post.channelId === "email") {
    return (
      <div className={shell}>
        <p className="text-12 text-muted-foreground">To: prospect@company.com</p>
        <p className="mt-1 text-14 font-medium">{post.title}</p>
        <hr className="my-3 border-border" />
        <p className="whitespace-pre-wrap text-14">{post.body}</p>
      </div>
    );
  }
  if (post.channelId === "instagram" || post.channelId === "tiktok") {
    return (
      <div className={shell}>
        <div className="mb-3 flex aspect-square items-center justify-center rounded-[8px] bg-muted text-13 text-muted-foreground">
          Visual for {channelLabel(post.channelId)}
        </div>
        <p className="text-14">
          <span className="font-semibold">{handle}</span> {post.body}
        </p>
      </div>
    );
  }
  if (post.channelId === "x") {
    return (
      <div className={shell}>
        <p className="text-14">
          <span className="font-semibold">{brandName}</span>{" "}
          <span className="text-muted-foreground">@{handle}</span>
        </p>
        <p className="mt-1 whitespace-pre-wrap text-14">{post.body}</p>
        <p className="mt-2 text-12 text-muted-foreground">{post.body.length}/280</p>
      </div>
    );
  }
  return (
    <div className={shell}>
      <div className="flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-full bg-muted text-13 font-medium">
          {brandName[0]}
        </span>
        <div>
          <p className="text-14 font-medium">{brandName}</p>
          <p className="text-12 text-muted-foreground">{channelLabel(post.channelId)} · Now</p>
        </div>
      </div>
      <p className="mt-3 whitespace-pre-wrap text-14">{post.body}</p>
    </div>
  );
}

export default function SprintPage() {
  const { state, reorderSprint, toggleAutopilot, updateSprintPost } = useWorkspace();
  const { sprint, tenant } = state;
  const [view, setView] = useState<View>("list");
  const [week, setWeek] = useState(String(Math.min(3, Math.ceil(sprint.dayOf21 / 7))));
  const [openId, setOpenId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const posts = [...sprint.posts].sort((a, b) => a.day - b.day);
  const open = sprint.posts.find((p) => p.id === openId) ?? null;
  const waiting = posts.filter((p) => p.status === "waiting_approval").length;

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = posts.findIndex((p) => p.id === active.id);
    const to = posts.findIndex((p) => p.id === over.id);
    reorderSprint(arrayMove(posts, from, to).map((p) => p.id));
    toast.message("Sprint reordered");
  }

  const dayCell = (day: number, compact: boolean) => {
    const dayPosts = posts.filter((p) => p.day === day);
    const isToday = day === sprint.dayOf21;
    return (
      <div
        key={day}
        className={cn(
          "flex min-h-24 flex-col gap-1 rounded-[8px] border border-border p-2",
          isToday && "border-foreground bg-muted/50",
          day < sprint.dayOf21 && "text-muted-foreground"
        )}
      >
        <p className="font-[family-name:var(--font-geist-mono)] text-12 tabular-nums">
          {compact ? day : `Day ${day} · ${dayLabel(sprint.startDate, day)}`}
        </p>
        {dayPosts.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setOpenId(p.id)}
            className="flex items-center gap-1.5 rounded-[6px] bg-card px-1.5 py-1 text-left text-12 ring-1 ring-border hover:bg-muted"
          >
            <ChannelMark id={p.channelId} />
            <span className={cn("truncate", compact && "hidden sm:inline")}>{p.title}</span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Sprint"
        title={`Day ${sprint.dayOf21} of 21`}
        description={`${waiting} waiting for your approval. Drag rows in list view to reorder.`}
        actions={
          <label className="flex items-center gap-3 rounded-[8px] border border-border bg-card px-3 py-2">
            <span>
              <span className="block text-14 font-medium">Autopilot</span>
              <span className="block text-12 text-muted-foreground">
                {tenant.autopilotTrusted ? "Trusted" : "Approvals still required"}
              </span>
            </span>
            <Switch
              checked={sprint.autopilot}
              onCheckedChange={() => {
                toggleAutopilot();
                toast.message(sprint.autopilot ? "Autopilot off" : "Autopilot on. Approvals still apply.");
              }}
              aria-label="Autopilot"
            />
          </label>
        }
      />

      <div>
        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-foreground transition-[width] duration-200 ease-out"
            style={{ width: `${(sprint.dayOf21 / 21) * 100}%` }}
          />
        </div>
        <p className="mt-1 font-[family-name:var(--font-geist-mono)] text-12 text-muted-foreground">
          Started {dayLabel(sprint.startDate, 1)} · ends {dayLabel(sprint.startDate, 21)}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Segmented
          aria-label="Sprint view"
          value={view}
          onChange={setView}
          options={[
            { value: "week", label: "Week" },
            { value: "month", label: "Month" },
            { value: "list", label: "List" },
          ]}
        />
        {view === "week" ? (
          <Segmented
            aria-label="Week"
            value={week}
            onChange={setWeek}
            options={[
              { value: "1", label: "Week 1" },
              { value: "2", label: "Week 2" },
              { value: "3", label: "Week 3" },
            ]}
          />
        ) : null}
      </div>

      {posts.length === 0 ? (
        <EmptyState
          title="No posts in this sprint"
          description="Once channels are connected, NameLoop drafts your 21-day plan here."
        />
      ) : null}

      {posts.length > 0 && view === "list" ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={posts.map((p) => p.id)} strategy={verticalListSortingStrategy}>
            <ol className="space-y-2">
              {posts.map((post) => (
                <SortableRow
                  key={post.id}
                  post={post}
                  startDate={sprint.startDate}
                  onOpen={() => setOpenId(post.id)}
                />
              ))}
            </ol>
          </SortableContext>
        </DndContext>
      ) : null}

      {posts.length > 0 && view === "week" ? (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 7 }, (_, i) => (Number(week) - 1) * 7 + i + 1).map((day) =>
            dayCell(day, false)
          )}
        </div>
      ) : null}

      {posts.length > 0 && view === "month" ? (
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: 21 }, (_, i) => i + 1).map((day) => dayCell(day, true))}
        </div>
      ) : null}

      <Sheet open={open !== null} onOpenChange={(next) => !next && setOpenId(null)}>
        <SheetContent className="sm:max-w-md">
          {open ? (
            <>
              <SheetHeader>
                <SheetTitle>{open.title}</SheetTitle>
                <SheetDescription>
                  Day {open.day} · {dayLabel(sprint.startDate, open.day)}
                </SheetDescription>
              </SheetHeader>
              <div className="flex-1 space-y-4 overflow-y-auto px-4">
                <div className="flex items-center gap-2">
                  <ChannelChip id={open.channelId} />
                  <PostStatus status={open.status} />
                </div>
                <PostPreview post={open} brandName={tenant.name} />
                <div className="space-y-1.5">
                  <label htmlFor="post-body" className="text-12 text-muted-foreground">
                    Edit copy
                  </label>
                  <Textarea
                    id="post-body"
                    rows={5}
                    className="rounded-[8px]"
                    value={open.body}
                    onChange={(event) => updateSprintPost(open.id, { body: event.target.value })}
                  />
                </div>
              </div>
              <SheetFooter>
                {open.status === "waiting_approval" || open.status === "draft" ? (
                  <Button
                    onClick={() => {
                      updateSprintPost(open.id, { status: "scheduled" });
                      toast.success("Approved and scheduled");
                    }}
                  >
                    Approve and schedule
                  </Button>
                ) : null}
                {open.status === "failed" ? (
                  <Button
                    onClick={() => {
                      updateSprintPost(open.id, { status: "scheduled" });
                      toast.message("Retry scheduled");
                    }}
                  >
                    Retry
                  </Button>
                ) : null}
                {open.status === "scheduled" ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      updateSprintPost(open.id, { status: "draft" });
                      toast.message("Moved back to draft");
                    }}
                  >
                    Unschedule
                  </Button>
                ) : null}
              </SheetFooter>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
