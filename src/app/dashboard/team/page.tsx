"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus, Mail, Trash2, CheckCircle2, Clock,
  MoreHorizontal, Plus, X, GripVertical, Flag,
  Circle, Loader2, ChevronDown,
} from "lucide-react";
import { useEventStore, type TeamMember, type TeamRole, type EventTask, type TaskStatus } from "@/lib/store/eventStore";
import { useAuthStore } from "@/lib/store/authStore";
import { cn, formatDate } from "@/lib/utils";
import { toast } from "sonner";

const ROLE_LABELS: Record<TeamRole, string> = {
  owner: "Owner",
  "co-organizer": "Co-organizer",
  volunteer: "Volunteer",
  viewer: "Viewer",
};

const ROLE_COLORS: Record<TeamRole, string> = {
  owner: "bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-400",
  "co-organizer": "bg-violet-50 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400",
  volunteer: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  viewer: "bg-muted text-muted-foreground",
};

const STATUS_COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: "todo", label: "To Do", color: "text-muted-foreground" },
  { id: "in_progress", label: "In Progress", color: "text-amber-600 dark:text-amber-400" },
  { id: "done", label: "Done", color: "text-emerald-600 dark:text-emerald-400" },
];

const PRIORITY_COLORS = {
  low: "text-muted-foreground",
  medium: "text-amber-500",
  high: "text-rose-500",
};

function AddTaskModal({
  status,
  eventId,
  members,
  onClose,
}: {
  status: TaskStatus;
  eventId: string;
  members: TeamMember[];
  onClose: () => void;
}) {
  const { addTask } = useEventStore();
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium" as EventTask["priority"],
    assigneeId: "",
    dueDate: "",
  });

  function save() {
    if (!form.title.trim()) return;
    addTask({
      eventId,
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      status,
      priority: form.priority,
      assigneeId: form.assigneeId || undefined,
      dueDate: form.dueDate || undefined,
    });
    toast.success("Task added");
    onClose();
  }

  const inputClass =
    "w-full px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400 transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 12 }}
        className="w-full max-w-md bg-card border border-border rounded-2xl shadow-card-xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="text-sm font-semibold text-foreground">Add Task</div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-5 py-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Title *</label>
            <input
              type="text"
              placeholder="e.g. Send venue contract"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className={inputClass}
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Description</label>
            <textarea
              placeholder="Optional notes..."
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={2}
              className={inputClass + " resize-none"}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Priority</label>
              <select
                value={form.priority}
                onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value as EventTask["priority"] }))}
                className={inputClass}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Due date</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
                className={inputClass}
              />
            </div>
          </div>
          {members.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Assign to</label>
              <select
                value={form.assigneeId}
                onChange={(e) => setForm((f) => ({ ...f, assigneeId: e.target.value }))}
                className={inputClass}
              >
                <option value="">Unassigned</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="flex gap-3 px-5 py-4 border-t border-border">
          <button onClick={onClose} className="btn-secondary flex-1 justify-center text-sm">Cancel</button>
          <button onClick={save} disabled={!form.title.trim()} className="btn-primary flex-1 justify-center text-sm">
            Add Task
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function TaskCard({ task, members }: { task: EventTask; members: TeamMember[] }) {
  const { updateTask, deleteTask } = useEventStore();
  const assignee = members.find((m) => m.id === task.assigneeId);

  const cycleStatus = () => {
    const order: TaskStatus[] = ["todo", "in_progress", "done"];
    const next = order[(order.indexOf(task.status) + 1) % order.length];
    updateTask(task.id, { status: next });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-card border border-border rounded-xl p-3.5 shadow-card hover:shadow-card-md transition-all group"
    >
      <div className="flex items-start gap-2">
        <button
          onClick={cycleStatus}
          className="mt-0.5 flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          title="Cycle status"
        >
          {task.status === "done" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          ) : task.status === "in_progress" ? (
            <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
          ) : (
            <Circle className="w-4 h-4" />
          )}
        </button>
        <div className="flex-1 min-w-0">
          <div className={cn("text-sm font-medium text-foreground leading-snug", task.status === "done" && "line-through text-muted-foreground")}>
            {task.title}
          </div>
          {task.description && (
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{task.description}</p>
          )}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Flag className={cn("w-3 h-3", PRIORITY_COLORS[task.priority])} />
            {task.dueDate && (
              <span className="text-[10px] text-muted-foreground">{formatDate(task.dueDate + "T00:00:00", "short")}</span>
            )}
            {assignee && (
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <span className="w-4 h-4 rounded-full bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-400 flex items-center justify-center text-[8px] font-bold">
                  {assignee.initials}
                </span>
                {assignee.name.split(" ")[0]}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => { deleteTask(task.id); toast.success("Task removed"); }}
          className="opacity-0 group-hover:opacity-100 p-1 rounded text-muted-foreground hover:text-rose-500 transition-all flex-shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

export default function TeamPage() {
  const { teamMembers, addTeamMember, removeTeamMember, updateMemberRole, tasks, event } = useEventStore();
  const { user } = useAuthStore();
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<TeamRole>("co-organizer");
  const [inviting, setInviting] = useState(false);
  const [addingToColumn, setAddingToColumn] = useState<TaskStatus | null>(null);

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    if (!/\S+@\S+\.\S+/.test(inviteEmail)) {
      toast.error("Enter a valid email address");
      return;
    }
    setInviting(true);
    await new Promise((r) => setTimeout(r, 800));
    addTeamMember(inviteEmail, inviteRole, user?.name ?? "Organizer");
    toast.success(`Invite sent to ${inviteEmail}`, {
      description: `They'll receive an email to join as ${ROLE_LABELS[inviteRole]}.`,
    });
    setInviteEmail("");
    setInviting(false);
  };

  const tasksByStatus = (status: TaskStatus) =>
    tasks.filter((t) => t.eventId === event._id && t.status === status);

  const allMembers = teamMembers.filter((m) => m.status === "active" || m.status === "pending");

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="page-title">Team</h2>
        <p className="page-subtitle">Invite collaborators and manage tasks together</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── Team Members ─────────────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Invite form */}
          <div className="card-base p-5">
            <div className="section-label mb-4">Invite a team member</div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Email address</label>
                <input
                  type="email"
                  placeholder="colleague@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleInvite()}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as TeamRole)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all"
                >
                  <option value="co-organizer">Co-organizer</option>
                  <option value="volunteer">Volunteer</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              <button
                onClick={handleInvite}
                disabled={inviting || !inviteEmail.trim()}
                className="btn-primary w-full justify-center text-sm"
              >
                {inviting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    Send Invite
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Member list */}
          <div className="card-base overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {allMembers.length} {allMembers.length === 1 ? "member" : "members"}
              </div>
            </div>
            {allMembers.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <UserPlus className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No team members yet</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {allMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 px-5 py-3.5 group">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {member.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium text-foreground truncate">{member.name}</div>
                        {member.status === "pending" && (
                          <span className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400">
                            <Clock className="w-3 h-3" /> pending
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">{member.email}</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <select
                        value={member.role}
                        onChange={(e) => {
                          if (member.role === "owner") return;
                          updateMemberRole(member.id, e.target.value as TeamRole);
                        }}
                        disabled={member.role === "owner"}
                        className={cn(
                          "text-[10px] font-semibold px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none",
                          ROLE_COLORS[member.role]
                        )}
                      >
                        {Object.entries(ROLE_LABELS).map(([val, label]) => (
                          <option key={val} value={val}>{label}</option>
                        ))}
                      </select>
                      {member.role !== "owner" && (
                        <button
                          onClick={() => { removeTeamMember(member.id); toast.success("Member removed"); }}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded text-muted-foreground hover:text-rose-500 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Task Board ───────────────────────────────────────────────── */}
        <div className="lg:col-span-2">
          <div className="section-label mb-4">Task Board</div>
          <div className="grid grid-cols-3 gap-4">
            {STATUS_COLUMNS.map((col) => {
              const colTasks = tasksByStatus(col.id);
              return (
                <div key={col.id} className="flex flex-col gap-3">
                  {/* Column header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={cn("text-xs font-semibold uppercase tracking-wider", col.color)}>
                        {col.label}
                      </span>
                      <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                        {colTasks.length}
                      </span>
                    </div>
                    <button
                      onClick={() => setAddingToColumn(col.id)}
                      className="w-6 h-6 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Task cards */}
                  <div className="space-y-2.5 min-h-[120px]">
                    <AnimatePresence mode="popLayout">
                      {colTasks.map((task) => (
                        <TaskCard key={task.id} task={task} members={allMembers} />
                      ))}
                    </AnimatePresence>
                    {colTasks.length === 0 && (
                      <button
                        onClick={() => setAddingToColumn(col.id)}
                        className="w-full border border-dashed border-border rounded-xl py-4 text-xs text-muted-foreground hover:bg-muted/40 hover:border-brand-200 transition-all"
                      >
                        + Add task
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add task modal */}
      <AnimatePresence>
        {addingToColumn && (
          <AddTaskModal
            status={addingToColumn}
            eventId={event._id ?? ""}
            members={allMembers}
            onClose={() => setAddingToColumn(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
