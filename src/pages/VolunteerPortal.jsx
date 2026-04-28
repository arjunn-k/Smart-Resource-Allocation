import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Compass, Radar, Sparkles, Map, MapPin, ExternalLink, X } from "lucide-react";
import { useState } from "react";
import GlassPanel from "../components/GlassPanel";
import { useDispatchState } from "../context/DispatchContext";

const confettiPieces = Array.from({ length: 12 }, (_, index) => ({
  id: index,
  x: (index % 4) * 22 - 30,
  delay: index * 0.03,
}));

function getUrgencyColors(urgency) {
  if (urgency >= 9) return "border-red-400/20 bg-red-400/10 text-red-200";
  if (urgency >= 6) return "border-orange-400/20 bg-orange-400/10 text-orange-200";
  return "border-yellow-400/20 bg-yellow-400/10 text-yellow-200";
}

export default function VolunteerPortal() {
  const { tasks, currentLoggedInVolunteer, assignTask, loading } = useDispatchState();
  const [selectedTask, setSelectedTask] = useState(null);
  const [acceptedTask, setAcceptedTask] = useState(null);

  if (loading || !currentLoggedInVolunteer) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />
      </div>
    );
  }

  // Filter tasks: strictly open, matching skills, within maxDistance
  const recommendedTasks = tasks.filter(
    (t) =>
      t.status === "open" &&
      currentLoggedInVolunteer.skills.includes(t.requiredSkill) &&
      t.distanceKm <= currentLoggedInVolunteer.maxDistance
  ).sort((a, b) => b.urgency - a.urgency);

  function acceptTask(task) {
    setSelectedTask(null);
    setAcceptedTask(task);
    assignTask(task.id, currentLoggedInVolunteer.id);

    window.setTimeout(() => {
      setAcceptedTask(null);
    }, 3000);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <GlassPanel className="p-6">
          <div className="flex items-center gap-3">
            <Radar className="h-5 w-5 text-cyan-300" />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Recommended For You</h2>
          </div>
          <div className="mt-2 text-sm text-slate-500 dark:text-slate-400 flex flex-wrap gap-2">
            Targeting: 
            {currentLoggedInVolunteer.skills.map((skill) => (
              <span key={skill} className="rounded-full bg-cyan-400/10 px-2 py-0.5 text-xs text-cyan-200 border border-cyan-400/20">{skill}</span>
            ))}
            <span className="pl-2">Max range: {currentLoggedInVolunteer.maxDistance}km</span>
          </div>

          <div className="mt-6 grid-noise relative h-[320px] overflow-hidden rounded-[28px] border border-black/10 dark:border-white/10 bg-gradient-to-br from-cyan-400/8 to-green-400/5">
            <div className="absolute inset-8 rounded-full border border-cyan-300/10" />
            <div className="absolute inset-14 rounded-full border border-cyan-300/10" />
            <div className="absolute inset-20 rounded-full border border-cyan-300/10" />
            {recommendedTasks.slice(0, 4).map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  x: [-6, 6, -4],
                  y: [5, -5, 4],
                }}
                transition={{
                  opacity: { duration: 0.35, delay: index * 0.08 },
                  scale: { duration: 0.35, delay: index * 0.08 },
                  x: { repeat: Infinity, duration: 4 + index, repeatType: "reverse" },
                  y: { repeat: Infinity, duration: 3.5 + index, repeatType: "reverse" },
                }}
                className="absolute rounded-full border border-cyan-300/30 bg-cyan-300/15 px-3 py-2 text-xs text-cyan-100 shadow-glow"
                style={{
                  left: `${20 + index * 18}%`,
                  top: `${18 + (index % 2) * 28}%`,
                }}
              >
                {task.distanceKm}km
              </motion.div>
            ))}
            <div className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-3 text-sm text-cyan-100">
              <Compass className="h-4 w-4" />
              Geospatial dispatch optimized
            </div>
          </div>
        </GlassPanel>

        <GlassPanel className="p-6 relative">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-green-300" />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Action Cards</h2>
          </div>

          <AnimatePresence mode="wait">
            {acceptedTask && (
              <motion.div
                key={`celebration-${acceptedTask.id}`}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="relative mt-6 overflow-hidden rounded-[28px] border border-green-400/25 bg-green-400/10 p-6"
              >
                {confettiPieces.map((piece) => (
                  <motion.span
                    key={piece.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: [0, 1, 0], y: [0, 80], x: [0, piece.x] }}
                    transition={{ duration: 1.5, delay: piece.delay, ease: "easeOut" }}
                    className="absolute left-1/2 top-6 h-2 w-2 rounded-full bg-cyan-300"
                  />
                ))}
                <div className="relative flex items-start gap-4">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
                    className="rounded-2xl bg-green-400/20 p-3 text-green-200"
                  >
                    <CheckCircle2 className="h-6 w-6" />
                  </motion.div>
                  <div>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">Task assigned to you!</p>
                    <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
                      You committed to {acceptedTask.title.toLowerCase()} in {acceptedTask.zone}. Dispatch updated your route and impact totals instantly.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6 space-y-3">
            <AnimatePresence initial={false}>
              {recommendedTasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  onClick={() => setSelectedTask(task)}
                  className="cursor-pointer rounded-3xl border border-black/10 dark:border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-glow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-medium text-slate-900 dark:text-white">{task.title}</p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {task.requiredSkill} • {task.distanceKm} km
                      </p>
                    </div>
                    <div className={`mt-1 inline-flex rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em] font-medium ${getUrgencyColors(task.urgency)}`}>
                      Urgency {task.urgency}
                    </div>
                  </div>
                </motion.div>
              ))}

              {recommendedTasks.length === 0 && !acceptedTask && (
                 <div className="text-center p-8 text-slate-400">
                   <p>No urgent tasks matching your profile at the moment.</p>
                 </div>
              )}
            </AnimatePresence>
          </div>
        </GlassPanel>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <GlassPanel className="p-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">Hours volunteered</p>
          <p className="mt-3 text-4xl font-semibold text-green-300">{currentLoggedInVolunteer.hoursLogged}h</p>
        </GlassPanel>
        <GlassPanel className="p-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">Lives impacted</p>
          <p className="mt-3 text-4xl font-semibold text-cyan-300">{currentLoggedInVolunteer.livesImpacted}</p>
        </GlassPanel>
      </div>

      {/* Task Details Modal */}
      <AnimatePresence>
        {selectedTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTask(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg overflow-hidden rounded-[32px] border border-white/10 bg-slate-900 shadow-2xl"
            >
              <div className="p-6 sm:p-8">
                <button 
                  onClick={() => setSelectedTask(null)}
                  className="absolute right-6 top-6 rounded-full bg-white/5 p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
                
                <div className={`inline-flex rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em] font-medium mb-4 ${getUrgencyColors(selectedTask.urgency)}`}>
                  Urgency {selectedTask.urgency}/10
                </div>
                
                <h3 className="text-2xl font-semibold text-white">{selectedTask.title}</h3>
                
                <div className="mt-6 flex flex-col gap-4">
                  <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-4">
                    <MapPin className="h-5 w-5 text-cyan-400" />
                    <div>
                      <p className="text-sm text-slate-400">Location</p>
                      <p className="font-medium text-white">{selectedTask.zone} ({selectedTask.distanceKm} km away)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-4">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                    <div>
                      <p className="text-sm text-slate-400">Required Skills</p>
                      <p className="font-medium text-white">{selectedTask.requiredSkill}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => {}}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-4 font-medium text-white transition hover:bg-white/10"
                  >
                    <ExternalLink className="h-5 w-5" />
                    Open Maps
                  </button>
                  <button 
                    onClick={() => acceptTask(selectedTask)}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 py-4 font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:shadow-cyan-500/40"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                    Accept Task
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
