import { motion } from "framer-motion";
import { Award, Clock, Heart, Star, Shield, Zap, TrendingUp, CheckCircle, Flame } from "lucide-react";
import GlassPanel from "../components/GlassPanel";
import { useDispatchState } from "../context/DispatchContext";

const badgeConfig = {
  "First Responder": { icon: Shield, color: "text-red-500 dark:text-red-400", bg: "bg-red-500/10 dark:bg-red-400/20" },
  "Night Owl": { icon: Star, color: "text-purple-500 dark:text-purple-400", bg: "bg-purple-500/10 dark:bg-purple-400/20" },
  "Life Saver": { icon: Heart, color: "text-rose-500 dark:text-rose-400", bg: "bg-rose-500/10 dark:bg-rose-400/20" },
  "Community Bridge": { icon: TrendingUp, color: "text-blue-500 dark:text-blue-400", bg: "bg-blue-500/10 dark:bg-blue-400/20" },
  "Road Warrior": { icon: Zap, color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-500/10 dark:bg-yellow-400/20" },
  "Heroic Effort": { icon: Flame, color: "text-orange-500 dark:text-orange-400", bg: "bg-orange-500/10 dark:bg-orange-400/20" },
  "Iron Core": { icon: Award, color: "text-slate-600 dark:text-slate-300", bg: "bg-slate-500/10 dark:bg-slate-300/20" },
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

function BadgeCard({ badge }) {
  const config = badgeConfig[badge] || { icon: Award, color: "text-cyan-500 dark:text-cyan-400", bg: "bg-cyan-500/10 dark:bg-cyan-400/20" };
  const Icon = config.icon;

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5, scale: 1.05 }}
      className="flex flex-col items-center justify-center rounded-[24px] border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] p-6 text-center transition hover:border-cyan-400/30 dark:hover:border-white/10 hover:bg-black/[0.05] dark:hover:bg-white/[0.04]"
    >
      <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full ${config.bg} ${config.color} shadow-sm dark:shadow-lg`}>
        <Icon className="h-8 w-8" />
      </div>
      <p className="font-semibold text-slate-900 dark:text-white">{badge}</p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Earned in the field</p>
    </motion.div>
  );
}

export default function VolunteerProfile() {
  const { currentLoggedInVolunteer } = useDispatchState();

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-5xl mx-auto pb-10"
    >
      {/* Profile Header */}
      <GlassPanel className="p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/3 rounded-full bg-cyan-500/10 blur-[80px] dark:blur-[100px]" />
        
        <div className="relative flex flex-col items-center gap-6 md:flex-row md:items-start text-center md:text-left">
          <motion.div 
            variants={itemVariants}
            className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-cyan-400/20 bg-gradient-to-br from-slate-100 to-white dark:from-slate-800 dark:to-slate-900 shadow-xl"
          >
            <span className="text-4xl font-bold bg-gradient-to-br from-cyan-600 to-blue-600 dark:from-cyan-300 dark:to-blue-400 bg-clip-text text-transparent">
              {currentLoggedInVolunteer.avatar}
            </span>
          </motion.div>
          
          <div className="flex-1 mt-2">
            <motion.h1 
              variants={itemVariants}
              className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2"
            >
              {currentLoggedInVolunteer.name}
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="text-slate-500 dark:text-slate-400 font-medium tracking-widest uppercase text-sm mb-4"
            >
              Elite Responder Level 4
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap items-center justify-center md:justify-start gap-2"
            >
              {currentLoggedInVolunteer.skills.map((skill) => (
                <span key={skill} className="rounded-full border border-cyan-500/20 dark:border-cyan-400/20 bg-cyan-500/10 dark:bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-700 dark:text-cyan-100">
                  {skill}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </GlassPanel>

      {/* Impact Stats */}
      <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-3">
        <GlassPanel className="p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 p-4 text-blue-600 dark:text-blue-300">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Hours</p>
              <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{currentLoggedInVolunteer.hoursLogged}</p>
            </div>
          </div>
        </GlassPanel>
        
        <GlassPanel className="p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-green-500/10 dark:bg-green-500/20 p-4 text-green-600 dark:text-green-300">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Tasks Completed</p>
              <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{currentLoggedInVolunteer.tasksCompleted}</p>
            </div>
          </div>
        </GlassPanel>

        <GlassPanel className="p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-rose-500/10 dark:bg-rose-500/20 p-4 text-rose-600 dark:text-rose-300">
              <Heart className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Lives Impacted</p>
              <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{currentLoggedInVolunteer.livesImpacted}</p>
            </div>
          </div>
        </GlassPanel>
      </motion.div>

      {/* Achievements Gallery */}
      <GlassPanel className="p-8">
        <motion.div variants={itemVariants} className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Award className="h-6 w-6 text-yellow-500 dark:text-yellow-400" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Achievements Sandbox</h2>
          </div>
          <span className="rounded-full bg-slate-200 dark:bg-slate-800 px-3 py-1 text-sm font-medium text-slate-700 dark:text-slate-300">
            {currentLoggedInVolunteer.badges.length} Unlocked
          </span>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
        >
          {currentLoggedInVolunteer.badges.map((badge) => (
            <BadgeCard key={badge} badge={badge} />
          ))}
          {/* Empty placeholders for gamification */}
          {Array.from({ length: Math.max(0, 4 - currentLoggedInVolunteer.badges.length) }).map((_, idx) => (
             <motion.div 
               variants={itemVariants} 
               key={`empty-${idx}`} 
               className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-black/10 dark:border-white/10 bg-black/[0.01] dark:bg-white/[0.01] p-6 text-center opacity-50"
             >
               <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-black/5 dark:bg-black/20 text-slate-400 dark:text-slate-600 shadow-inner">
                 <Award className="h-8 w-8" />
               </div>
               <p className="font-semibold text-slate-500">Locked</p>
               <p className="mt-1 text-xs text-slate-400 dark:text-slate-600">Keep helping</p>
             </motion.div>
          ))}
        </motion.div>
      </GlassPanel>
    </motion.div>
  );
}
