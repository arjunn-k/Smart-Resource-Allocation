import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowLeft, Loader2, ShieldCheck, HeartPulse, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RoleBasedLogin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // Extract role from location state or URL params, default to volunteer
  const queryParams = new URLSearchParams(location.search);
  const paramRole = queryParams.get('role');
  const stateRole = location.state?.role;
  const role = stateRole || paramRole || 'volunteer';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const getRoleConfig = () => {
    switch (role) {
      case 'ngo':
        return {
          title: "NGO Admin Command Center",
          icon: <ShieldCheck className="w-12 h-12 text-purple-400 mb-4 mx-auto" />,
          idLabel: "NGO Darpan ID / Authorized Email",
          passLabel: "System-Issued Password",
          helperText: "🔒 Credentials are provisioned by the State Nodal Officer after document verification.",
          bottomText: "Not registered yet?",
          bottomLinkText: "Apply for Partnership.",
          bottomLinkTo: "/ngo-apply",
          colorClass: "bg-purple-500 hover:bg-purple-400 border-purple-500",
          shadowClass: "shadow-[0_0_20px_rgba(168,85,247,0.4)]",
          accentText: "text-purple-400"
        };
      case 'hospital':
        return {
          title: "Hospital Emergency Portal",
          icon: <HeartPulse className="w-12 h-12 text-rose-400 mb-4 mx-auto" />,
          idLabel: "Clinical Registration Number",
          passLabel: "System-Issued Password",
          helperText: "🔒 Secure credentials are provided post-verification.",
          bottomText: "",
          bottomLinkText: "Register your facility.",
          bottomLinkTo: "/hospital-apply",
          colorClass: "bg-rose-500 hover:bg-rose-400 border-rose-500",
          shadowClass: "shadow-[0_0_20px_rgba(244,63,94,0.4)]",
          accentText: "text-rose-400"
        };
      case 'volunteer':
      default:
        return {
          title: "Volunteer Portal Login",
          icon: <User className="w-12 h-12 text-emerald-400 mb-4 mx-auto" />,
          idLabel: "Email Address",
          passLabel: "Password",
          helperText: null,
          bottomText: "Don't have an account?",
          bottomLinkText: "Sign up here.",
          bottomLinkTo: "/volunteer-signup",
          colorClass: "bg-emerald-500 hover:bg-emerald-400 border-emerald-500",
          shadowClass: "shadow-[0_0_20px_rgba(16,185,129,0.4)]",
          accentText: "text-emerald-400"
        };
    }
  };

  const config = getRoleConfig();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!identifier || !password) return;

    setIsLoading(true);
    setError('');

    const result = await login(identifier, password);
    
    setIsLoading(false);
    if (!result.success) {
      setError(result.message || 'Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#060b14] flex flex-col items-center justify-center p-4 lg:p-8 font-sans transition-colors duration-300 relative overflow-hidden">
      
      {/* Decorative Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className={`absolute top-[-10%] left-[-10%] w-[30rem] h-[30rem] rounded-full blur-[120px] opacity-20 ${config.bgOrbClass || 'bg-cyan-500'}`} style={{ backgroundColor: config.colorClass.split(' ')[0].replace('bg-', '') }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-blue-500/20 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <button 
          onClick={() => navigate('/')} 
          className="absolute -top-16 left-0 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white flex items-center gap-2 transition-colors font-medium"
        >
          <ArrowLeft size={18} /> Back to Portal
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/80 dark:bg-white/[0.03] backdrop-blur-xl border border-slate-200 dark:border-white/[0.08] p-8 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden text-center"
        >
          {config.icon}
          
          <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 mb-8">
            {config.title}
          </h1>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-5 text-left">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 pl-1">
                {config.idLabel}
              </label>
              <input 
                type="text" 
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={`Enter your ${config.idLabel.toLowerCase()}`}
                className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700/50 rounded-xl py-3 px-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all font-medium"
                style={{ '--tw-ring-color': 'currentcolor' }}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 pl-1">
                {config.passLabel}
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700/50 rounded-xl py-3 pl-4 pr-12 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all font-medium"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              {config.helperText && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed pl-1 pr-1">
                  {config.helperText}
                </p>
              )}
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={!identifier || !password || isLoading}
                className={`w-full text-white font-bold py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${config.colorClass} ${config.shadowClass} disabled:shadow-none border border-transparent`}
              >
                {isLoading ? (
                  <><Loader2 size={20} className="animate-spin" /> Authenticating...</>
                ) : (
                  'Authenticate & Login'
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 text-sm text-slate-500 dark:text-slate-400">
            {config.bottomText}{' '}
            <Link to={config.bottomLinkTo} className={`font-semibold hover:underline transition-colors ${config.accentText}`}>
              {config.bottomLinkText}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RoleBasedLogin;
