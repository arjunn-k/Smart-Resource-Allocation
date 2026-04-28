import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ShieldCheck, ArrowRight, ArrowLeft, UploadCloud, Search, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const VolunteerRoleSelector = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [volunteerType, setVolunteerType] = useState(null);
  
  // Mock form states
  const [otpSent, setOtpSent] = useState(false);

  const handleSelection = (type) => {
    setVolunteerType(type);
    setStep(2);
  };

  const slideVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3, ease: "easeIn" } }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-50/95 dark:bg-[#060b14]/95 backdrop-blur-xl text-slate-900 dark:text-slate-200 flex items-center justify-center p-4 lg:p-8 font-sans transition-colors duration-300">
      
      {onClose && (
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 sm:top-8 sm:right-8 z-50 p-2 bg-slate-200 dark:bg-slate-800 rounded-full hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors shadow-lg"
        >
          <X className="h-6 w-6 text-slate-700 dark:text-slate-300" />
        </button>
      )}

      {/* Background Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-96 h-96 bg-green-400/20 dark:bg-green-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-400/20 dark:bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />

      <main className="w-full max-w-3xl relative z-10">
        <div className="bg-white/80 dark:bg-white/[0.03] backdrop-blur-xl border border-slate-200 dark:border-white/[0.08] p-8 md:p-12 rounded-3xl shadow-xl dark:shadow-2xl relative overflow-hidden transition-colors duration-300">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

          <AnimatePresence mode="wait">
            {/* STEP 1: Selection Phase */}
            {step === 1 && (
              <motion.div
                key="step1"
                variants={slideVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="text-center mb-10">
                  <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 mb-3">
                    How are you volunteering today?
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base max-w-lg mx-auto">
                    Select your operational capacity to ensure you are matched with the right emergency requests and permissions.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* CARD 1: Independent Responder */}
                  <motion.div 
                    whileHover={{ y: -4, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelection('independent')}
                    className="cursor-pointer bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:border-green-400/50 dark:hover:border-green-500/50 rounded-2xl p-6 transition-all group flex flex-col h-full shadow-sm hover:shadow-md dark:shadow-none"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-green-100 dark:group-hover:bg-green-500/20 group-hover:text-green-600 dark:group-hover:text-green-400 rounded-xl transition-colors">
                        <User size={28} strokeWidth={2} />
                      </div>
                      <span className="inline-block bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20 rounded-full px-3 py-1 text-xs font-semibold">
                        Fastest Setup
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Independent Citizen</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed flex-grow">
                      Act quickly under the Good Samaritan guidelines. No NGO affiliation required. Perfect for immediate on-ground assistance and local rapid responses.
                    </p>

                    <div className="mt-6 flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      Continue as Independent <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>

                  {/* CARD 2: NGO-Affiliated Volunteer */}
                  <motion.div 
                    whileHover={{ y: -4, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelection('ngo_affiliated')}
                    className="cursor-pointer bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:border-purple-400/50 dark:hover:border-purple-500/50 rounded-2xl p-6 transition-all group flex flex-col h-full shadow-sm hover:shadow-md dark:shadow-none"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-purple-100 dark:group-hover:bg-purple-500/20 group-hover:text-purple-600 dark:group-hover:text-purple-400 rounded-xl transition-colors">
                        <ShieldCheck size={28} strokeWidth={2} />
                      </div>
                      <span className="inline-block bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20 rounded-full px-3 py-1 text-xs font-semibold">
                        Requires Admin Approval
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">NGO Representative</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed flex-grow">
                      Link your profile to a verified NGO network for official deployment. Access specialized resources, team dispatch tools, and official credentials.
                    </p>

                    <div className="mt-6 flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      Link to your NGO <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Conditional Forms based on Selection */}
            {step === 2 && volunteerType === 'independent' && (
              <motion.div
                key="form-independent"
                variants={slideVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <div className="flex items-center gap-4 mb-8">
                  <button onClick={() => setStep(1)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
                    <ArrowLeft size={20} />
                  </button>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Independent Verification</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Fast-track setup via SMS protocol.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-slate-600 dark:text-slate-400 pl-1">Mobile Number</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700/50 rounded-xl py-3 px-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all font-medium"
                    />
                  </div>
                  
                  {otpSent && (
                    <div className="space-y-2 pt-2">
                      <label className="text-sm text-slate-600 dark:text-slate-400 pl-1">One Time Password</label>
                      <input
                        type="text"
                        placeholder="0 0 0 0 0 0"
                        className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700/50 rounded-xl py-3 px-4 tracking-[0.5em] text-center text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all font-bold"
                      />
                    </div>
                  )}
                </div>

                <div className="pt-6">
                  <button 
                    onClick={() => setOtpSent(true)}
                    className="w-full bg-green-500 hover:bg-green-400 text-white dark:text-slate-950 font-bold py-3 px-8 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                  >
                    {otpSent ? 'Verify & Create Profile' : 'Send OTP'}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && volunteerType === 'ngo_affiliated' && (
              <motion.div
                key="form-ngo"
                variants={slideVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <div className="flex items-center gap-4 mb-6">
                  <button onClick={() => setStep(1)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
                    <ArrowLeft size={20} />
                  </button>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Organization Linking</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Connect your profile to an official entity.</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm text-slate-600 dark:text-slate-400 pl-1">Search Verified NGOs</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search size={18} className="text-slate-400 dark:text-slate-500" />
                      </div>
                      <input
                        type="text"
                        placeholder="Type NGO name or registration ID..."
                        className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700/50 rounded-xl py-3 pl-12 pr-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-white pl-1">Upload NGO ID/Authorization Letter</label>
                    <div className="mt-1 border-2 border-dashed border-slate-300 dark:border-slate-700/70 hover:border-purple-500/50 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/30 dark:hover:bg-slate-800/30 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all">
                      <div className="bg-slate-200 dark:bg-slate-800 p-4 rounded-full mb-4 text-slate-500 dark:text-slate-400">
                        <UploadCloud size={32} />
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 font-medium">Click to upload your ID card</p>
                      <p className="text-slate-500 text-xs mt-2">PDF, JPG or PNG up to 5MB</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button className="w-full bg-purple-500 hover:bg-purple-400 text-white dark:text-slate-950 font-bold py-3 px-8 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                    Submit Request to Admin
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default VolunteerRoleSelector;
