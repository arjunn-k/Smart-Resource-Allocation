import { AnimatePresence, motion } from "framer-motion";
import { Plus, Siren, TriangleAlert, Users } from "lucide-react";
import { useEffect, useState } from "react";
import GlassPanel from "../components/GlassPanel";
import { hospitalQuickNeeds, sosTimeline } from "../data/mockData";

export default function HospitalPortal() {
  const [sosActive, setSosActive] = useState(false);
  const [acceptedCount, setAcceptedCount] = useState(4);
  const [needs, setNeeds] = useState(hospitalQuickNeeds);
  const [formValue, setFormValue] = useState("");

  useEffect(() => {
    if (!sosActive) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setAcceptedCount((count) => Math.min(count + 1, 18));
    }, 1800);

    return () => window.clearInterval(timer);
  }, [sosActive]);

  function addNeed() {
    if (!formValue.trim()) {
      return;
    }

    setNeeds((current) => [formValue.trim(), ...current].slice(0, 5));
    setFormValue("");
  }

  return (
    <div className="space-y-6">
      <GlassPanel className="border-red-400/20 bg-red-500/5 p-6 sm:p-8">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.28em] text-red-200/80">Software-only emergency dispatch</p>
            <h2 className="mt-3 text-4xl font-semibold text-slate-900 dark:text-white">High urgency coordination without extra hardware.</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-300">
              Broadcast immediate operational needs, escalate medical shortages, and monitor volunteer acceptance in real time.
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-red-400/40 blur-2xl" />
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setSosActive(true)}
              className="relative rounded-full bg-red-500 px-10 py-6 text-lg font-semibold text-slate-900 dark:text-white shadow-urgent"
            >
              <span className="absolute inset-0 animate-pulseRing rounded-full border border-red-300/60" />
              <span className="relative inline-flex items-center gap-3">
                <Siren className="h-5 w-5" />
                Trigger SOS
              </span>
            </motion.button>
          </div>
        </div>
      </GlassPanel>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <GlassPanel className="border-red-400/15 bg-red-500/[0.03] p-6">
          <div className="flex items-center gap-3">
            <TriangleAlert className="h-5 w-5 text-red-300" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Rapid-entry need broadcast</h3>
          </div>

          <form
            className="mt-6 grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              addNeed();
            }}
          >
            <div className="flex gap-3">
              <input
                value={formValue}
                onChange={(event) => setFormValue(event.target.value)}
                className="min-w-0 flex-1 rounded-2xl border border-black/10 dark:border-white/10 bg-slate-950/70 px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-red-400/40"
                placeholder="Add immediate need"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-2xl border border-red-300/20 bg-red-400/10 px-4 py-3 text-sm font-medium text-red-100"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>

            <div className="grid gap-3">
              {needs.map((need) => (
                <div key={need} className="rounded-2xl border border-black/10 dark:border-white/10 bg-slate-950/50 px-4 py-3 text-slate-900 dark:text-white">
                  {need}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setSosActive(true)}
              className="rounded-2xl bg-red-500 px-5 py-3 font-semibold text-slate-900 dark:text-white transition hover:-translate-y-0.5"
            >
              Broadcast to Network
            </button>
          </form>
        </GlassPanel>

        <GlassPanel className="border-red-400/15 bg-red-500/[0.03] p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Live status timeline</h3>
            <div className="inline-flex items-center gap-2 rounded-full border border-red-300/20 bg-red-400/10 px-4 py-2 text-sm text-red-100">
              <Users className="h-4 w-4" />
              {acceptedCount} volunteers accepted
            </div>
          </div>

          <AnimatePresence>
            {sosActive && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-5 rounded-2xl border border-red-300/20 bg-red-400/10 px-4 py-3 text-sm text-red-50"
              >
                SOS is live. Volunteer acceptance count is actively climbing as the network routes your request.
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6 space-y-4">
            {sosTimeline.map((entry) => (
              <div key={entry.time} className="flex gap-4">
                <div className="mt-1 h-3 w-3 rounded-full bg-red-400 shadow-urgent" />
                <div>
                  <p className="text-sm text-red-200">{entry.time}</p>
                  <p className="text-slate-700 dark:text-slate-200">{entry.event}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
