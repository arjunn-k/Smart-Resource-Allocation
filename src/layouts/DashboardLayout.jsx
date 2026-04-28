import { Activity, Building2, HeartPulse, UserRound, Menu, Award, LogOut } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "../components/ThemeToggle";

const navConfig = {
  ngoAdmin: [
    { to: "/ngo-admin", label: "NGO Data Hub", icon: Building2 },
    { to: "#task-mgmt", label: "Task Management", icon: Activity }, // placeholder
  ],
  volunteer: [
    { to: "/volunteer-dispatch", label: "Nearby Tasks", icon: UserRound },
    { to: "/volunteer-profile", label: "My Profile", icon: Award },
  ],
  hospitalStaff: [
    { to: "/hospital-crisis", label: "Emergency SOS", icon: HeartPulse },
  ],
};

function NavItem({ item, onClick }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      onClick={onClick}
      className={({ isActive }) =>
        [
          "group flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition-all duration-300",
          isActive
            ? "border-cyan-400/40 bg-cyan-400/10 text-slate-900 dark:text-white shadow-glow"
            : "border-black/[0.08] dark:border-white/8 bg-black/5 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:-translate-y-0.5 hover:border-black/[0.15] dark:border-white/15 hover:bg-black/[0.04] dark:bg-white/8 hover:text-slate-900 dark:text-white",
        ].join(" ")
      }
    >
      <Icon className="h-4 w-4 text-cyan-300 transition-transform duration-300 group-hover:scale-110" />
      <span>{item.label}</span>
    </NavLink>
  );
}

export default function DashboardLayout({ children }) {
  const [open, setOpen] = useState(false);
  const { currentUserRole, logout } = useAuth();
  
  const navItems = currentUserRole ? navConfig[currentUserRole] : [];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid bg-[size:24px_24px] opacity-20" />
      <div className="mx-auto flex min-h-screen max-w-[1680px] flex-col gap-6 px-4 py-4 lg:flex-row lg:px-6">
        <aside className="glass-panel sticky top-4 z-30 flex items-center justify-between rounded-[28px] p-4 lg:h-[calc(100vh-2rem)] lg:w-[290px] lg:flex-col lg:items-stretch lg:justify-start lg:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-300">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">Crisis OS</p>
              <h1 className="text-sm font-semibold text-slate-900 dark:text-white">Workspace</h1>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              type="button"
              className="rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-3 text-slate-700 dark:text-slate-200"
              onClick={() => setOpen((value) => !value)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          <nav
            className={[
              "mt-0 hidden flex-1 flex-col gap-3 lg:mt-10 lg:flex",
              open ? "absolute left-0 right-0 top-[88px] z-40 flex rounded-[28px] border border-black/10 dark:border-white/10 bg-white/95 dark:bg-slate-950/95 p-4 backdrop-blur-xl shadow-2xl" : "",
            ].join(" ")}
          >
            {navItems.map((item) => (
              <NavItem key={item.to} item={item} onClick={() => setOpen(false)} />
            ))}

            <div className="mt-auto pt-6">
              <button 
                onClick={logout}
                className="group flex w-full items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500 dark:text-red-400 transition-all duration-300 hover:bg-red-500/20"
              >
                <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                <span>Logout Session</span>
              </button>
            </div>
          </nav>

          <div className="mt-6 hidden rounded-3xl border border-black/10 dark:border-white/10 bg-gradient-to-br from-cyan-400/15 to-white/5 p-4 lg:block">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs uppercase tracking-[0.25em] text-cyan-200/70">Theme Control</p>
              <ThemeToggle className="!p-2 border-0 bg-transparent dark:bg-transparent" />
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-200">Role: <strong className="capitalize">{currentUserRole}</strong></p>
          </div>
        </aside>

        <main className="flex-1 pb-6">{children}</main>
      </div>
    </div>
  );
}
