import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, HeartHandshake, MapPinned, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import GlassPanel from "../components/GlassPanel";
import DispatchMap from "../components/DispatchMap";
import LoginModal from "../components/LoginModal";
import { landingStats } from "../data/mockData";
import ThemeToggle from "../components/ThemeToggle";
import VolunteerSignUpForm from "../components/VolunteerSignUpForm";

const featureCards = [
  {
    icon: HeartHandshake,
    title: "Community-first dispatch",
    description: "Match the right responder to the right need in minutes, not hours.",
  },
  {
    icon: MapPinned,
    title: "Geo-aware coverage",
    description: "Live location clusters reveal underserved zones instantly.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted verification",
    description: "Volunteer onboarding and partner workflows stay transparent.",
  },
];

export default function PublicPortal() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  return (
    <div className="space-y-6 pt-16 relative">
      <div className="absolute top-0 right-0 z-50">
        <ThemeToggle />
      </div>
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <GlassPanel className="relative overflow-hidden p-6 sm:p-8 lg:p-10">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-transparent to-red-500/10" />
          <div className="relative flex h-full flex-col justify-between gap-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-cyan-100/80">
                Crisis-ready coordination
              </div>
              <div className="max-w-3xl space-y-4">
                <h2 className="text-4xl font-semibold leading-tight text-slate-900 dark:text-white md:text-6xl">
                  Smart Resource Allocation for rapid, human-centered crisis response.
                </h2>
                <p className="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 md:text-lg">
                  A unified command surface connecting volunteers, NGOs, and hospitals with live signals,
                  urgency-aware prioritization, and modern dispatch UX.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <motion.button
                  onClick={() => setShowRoleSelector(true)}
                  whileHover={{ y: -2, boxShadow: "0 16px 40px rgba(34,211,238,0.25)" }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 rounded-2xl bg-cyan-400 px-5 py-3 font-medium text-white dark:text-slate-950"
                >
                  Join the Response Network
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
                <Link
                  to="/ngo-apply"
                  className="inline-flex items-center gap-2 rounded-2xl border border-cyan-400/50 bg-cyan-400/10 px-5 py-3 font-medium text-cyan-600 dark:text-cyan-400 transition hover:-translate-y-0.5 hover:bg-cyan-400/20"
                >
                  Registration for NGOs
                </Link>
                <Link
                  to="/hospital-apply"
                  className="inline-flex items-center gap-2 flex-wrap rounded-2xl border border-blue-400/50 bg-blue-400/10 px-5 py-3 font-medium text-blue-600 dark:text-blue-400 transition hover:-translate-y-0.5 hover:bg-blue-400/20"
                >
                  Hospital Registration
                </Link>
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-5 py-3 font-medium text-slate-800 dark:text-slate-100 transition hover:-translate-y-0.5 hover:border-cyan-400/30 hover:bg-cyan-400/10"
                >
                  Login to Portal
                </button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {landingStats.map((stat) => (
                <div key={stat.label} className="rounded-3xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-black/20 p-4 backdrop-blur-sm">
                  <p className={`text-3xl font-semibold ${stat.accent}`}>{stat.value}</p>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </GlassPanel>

        <GlassPanel className="p-4 sm:p-5">
          <DispatchMap />
        </GlassPanel>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {featureCards.map((card, index) => {
          const Icon = card.icon;

          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 + index * 0.1 }}
            >
              <GlassPanel className="h-full p-6 transition duration-300 hover:-translate-y-1 hover:shadow-glow">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-slate-900 dark:text-white">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">{card.description}</p>
              </GlassPanel>
            </motion.div>
          );
        })}
      </section>

      {/* Conditionally render the Role Selector Modal */}
      <AnimatePresence>
        {showRoleSelector && <VolunteerSignUpForm onClose={() => setShowRoleSelector(false)} />}
      </AnimatePresence>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
}
