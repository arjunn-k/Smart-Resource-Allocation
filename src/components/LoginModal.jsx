import { AnimatePresence, motion } from "framer-motion";
import { UserRound, Building2, HeartPulse, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginModal({ isOpen, onClose }) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    onClose();
    navigate(`/login?role=${role}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-[32px] border border-white/10 bg-slate-900 shadow-2xl"
          >
            <div className="p-6 sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">Select Demo Role</h3>
                  <p className="mt-1 text-sm text-slate-400">Choose an RBAC persona to log in.</p>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-full bg-white/5 p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid gap-3">
                <button
                  onClick={() => handleRoleSelection("volunteer")}
                  className="group flex w-full items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:border-cyan-500/30 hover:bg-cyan-500/10"
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 group-hover:scale-110 transition-transform">
                    <UserRound className="h-6 w-6" />
                  </div>
                  <div className="text-left text-white">
                    <p className="font-semibold">Login as Volunteer</p>
                    <p className="text-xs text-slate-400 group-hover:text-cyan-200/70">Access dispatches & profile</p>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleSelection("ngo")}
                  className="group flex w-full items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:border-purple-500/30 hover:bg-purple-500/10"
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div className="text-left text-white">
                    <p className="font-semibold">Login as NGO Admin</p>
                    <p className="text-xs text-slate-400 group-hover:text-purple-200/70">Access triage & assignments</p>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleSelection("hospital")}
                  className="group flex w-full items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:border-rose-500/30 hover:bg-rose-500/10"
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 group-hover:scale-110 transition-transform">
                    <HeartPulse className="h-6 w-6" />
                  </div>
                  <div className="text-left text-white">
                    <p className="font-semibold">Login as Hospital Staff</p>
                    <p className="text-xs text-slate-400 group-hover:text-rose-200/70">Access emergency SOS panel</p>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
