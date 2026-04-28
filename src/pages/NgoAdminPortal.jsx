import { AnimatePresence, motion } from "framer-motion";
import { ListTodo, Sparkles, Filter, UserPlus } from "lucide-react";
import { useState } from "react";
import GlassPanel from "../components/GlassPanel";
import VolunteerBulkUpload from "../components/VolunteerBulkUpload";
import { ngoMetrics } from "../data/mockData";
import { useDispatchState } from "../context/DispatchContext";

function getUrgencyColors(urgency) {
  if (urgency >= 9) return "border-red-400/20 bg-red-400/10 text-red-200";
  if (urgency >= 6) return "border-orange-400/20 bg-orange-400/10 text-orange-200";
  return "border-yellow-400/20 bg-yellow-400/10 text-yellow-200";
}

function getUrgencyLabel(urgency) {
  if (urgency >= 9) return "Critical";
  if (urgency >= 6) return "High";
  return "Moderate";
}

export default function NgoAdminPortal() {
  const { tasks, volunteers, assignTask, loading, refreshData } = useDispatchState();
  const [skillFilter, setSkillFilter] = useState("All");
  const [assigningTask, setAssigningTask] = useState(null);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />
      </div>
    );
  }

  const openTasks = tasks.filter((t) => t.status === "open");

  const filteredQueue = openTasks.filter((task) => {
    if (skillFilter === "All") return true;
    return task.requiredSkill === skillFilter;
  });

  const sortedQueue = [...filteredQueue].sort((a, b) => b.urgency - a.urgency);

  const uniqueSkills = ["All", ...new Set(tasks.map((t) => t.requiredSkill))];

  function handleAssign(taskId, volunteerId) {
    assignTask(taskId, volunteerId);
    setAssigningTask(null);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        {ngoMetrics.map((metric) => (
          <GlassPanel key={metric.label} className="p-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">{metric.label}</p>
            <p className={`mt-3 text-4xl font-semibold ${metric.tone}`}>
              {metric.label === "Total Unresolved Needs" ? openTasks.length : metric.value}
            </p>
          </GlassPanel>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <VolunteerBulkUpload onUploadComplete={refreshData} />

        {/* Needs Queue Column */}
        <GlassPanel className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-red-500/10 p-3 text-red-300">
                <ListTodo className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Live Needs Queue</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Triage and assign unfulfilled tasks</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              <select
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                className="rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white outline-none focus:border-cyan-400"
              >
                {uniqueSkills.map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-cyan-400/15 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
            <Sparkles className="h-4 w-4" />
            Showing {sortedQueue.length} open tasks. Sorted by descending urgency.
          </div>

          <div className="mt-6 space-y-4">
            <AnimatePresence initial={false}>
              {sortedQueue.map((task, index) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, x: 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 220, damping: 24 }}
                  className="rounded-3xl border border-black/10 dark:border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-1 hover:shadow-glow"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="text-lg font-medium text-slate-900 dark:text-white">{task.title}</p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {task.zone} • {task.distanceKm} km away
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] ${getUrgencyColors(task.urgency)}`}>
                        {getUrgencyLabel(task.urgency)} - {task.urgency}/10
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-black/5 dark:border-white/5 pt-4">
                    <div className="rounded-full border border-cyan-300/15 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-100">
                      Requires: {task.requiredSkill}
                    </div>
                    
                    <div className="relative">
                      {assigningTask === task.id ? (
                        <div className="flex items-center gap-2">
                          <select 
                            className="rounded-xl border border-cyan-400/30 bg-black/5 dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white outline-none transition"
                            onChange={(e) => handleAssign(task.id, e.target.value)}
                            defaultValue=""
                          >
                            <option value="" disabled>Select Volunteer...</option>
                            {volunteers.filter(v => v.skills.includes(task.requiredSkill)).map(v => (
                              <option key={v.id} value={v.id}>{v.name} ({v.maxDistance}km max)</option>
                            ))}
                          </select>
                          <button 
                            onClick={() => setAssigningTask(null)}
                            className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setAssigningTask(task.id)}
                          className="flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200 transition hover:bg-cyan-400/20"
                        >
                          <UserPlus className="h-4 w-4" />
                          Assign Volunteer
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {sortedQueue.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-3xl border border-dashed border-white/10 p-8 text-center text-slate-400"
                >
                  <ListTodo className="mx-auto h-8 w-8 mb-3 opacity-50" />
                  No open tasks match the current filter.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
