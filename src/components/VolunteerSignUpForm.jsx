import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Stethoscope, 
  GraduationCap, 
  ShieldCheck, 
  UploadCloud, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  Loader2,
  Check,
  X,
  Mail,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const categories = [
  { id: 'general', title: 'General Citizen Responder', icon: User, desc: 'Fastest onboarding, no strict affiliation.' },
  { id: 'medical', title: 'Medical Professional', icon: Stethoscope, desc: 'Doctors, Nurses, Paramedics.' },
  { id: 'student', title: 'Government Student Volunteer', icon: GraduationCap, desc: 'NSS, NCC affiliations.' },
  { id: 'ngo', title: 'NGO-Affiliated Volunteer', icon: ShieldCheck, desc: 'Registered NGO network members.' }
];

const skillBadges = [
  'First Aid', 'Logistics & Supply', 'Transport / Driving', 
  'Search & Rescue', 'Counseling', 'Administrative Support',
  'Translation / Local Geo', 'Medical Triage'
];

const VolunteerSignUpForm = ({ onClose }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    volunteerCategory: '',
    idType: '',
    idNumber: '',
    medicalAuth: '',
    regNumber: '',
    studentAffiliation: '',
    collegeInfo: '',
    ngoName: '',
    skills: [],
    consent: false,
    files: {}, // mock file uploads
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // e-KYC verification states
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  
  // Submit state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // UI state for password
  const [showPassword, setShowPassword] = useState(false);

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (key) => {
    setFormData(prev => ({
      ...prev,
      files: { ...prev.files, [key]: 'mock_file_uploaded.pdf' }
    }));
  };

  const toggleSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill) 
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleEKYC = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setShowOtpField(true);
    }, 1000);
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otpValues];
    newOtp[index] = value;
    setOtpValues(newOtp);
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const verifyOTP = () => {
    if (otpValues.join('').length !== 6) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
    }, 1500);
  };

  const submitForm = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          role: 'volunteer',
          skills: formData.skills
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Save session
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setIsSubmitting(false);
      setStep('success');
    } catch (err) {
      console.error("Registration error:", err);
      alert(err.message || "An error occurred during registration");
      setIsSubmitting(false);
    }
  };

  const slideVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3, ease: "easeIn" } }
  };

  // Validations per step
  const isStep1Valid = formData.fullName && formData.mobile && formData.volunteerCategory;
  
  const isStep2Valid = () => {
    switch (formData.volunteerCategory) {
      case 'general':
        return isVerified;
      case 'medical':
        return formData.medicalAuth && formData.regNumber && formData.files['medicalReg'];
      case 'student':
        return formData.studentAffiliation && formData.collegeInfo && formData.files['studentId'];
      case 'ngo':
        return formData.ngoName && formData.files['ngoAuth'];
      default:
        return false;
    }
  };

  const isStep3Valid = formData.skills.length > 0 && formData.consent;

  // Password Strength Logic
  const getPasswordStrength = (password) => {
    if (!password) return { label: '', color: 'bg-transparent', w: 'w-0' };
    let score = 0;
    if (password.length > 7) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) return { label: 'Weak', color: 'bg-red-500', w: 'w-1/3 text-red-500' };
    if (score === 2 || score === 3) return { label: 'Medium', color: 'bg-yellow-400', w: 'w-2/3 text-yellow-500' };
    return { label: 'Strong', color: 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]', w: 'w-full text-green-500' };
  };

  const strength = getPasswordStrength(formData.password);
  
  const isStep4Valid = formData.username && formData.email && formData.password && formData.password === formData.confirmPassword && formData.password.length >= 8;

  return (
    <div className={`${onClose ? 'fixed inset-0 z-[100] overflow-y-auto backdrop-blur-xl bg-slate-50/95 dark:bg-[#060b14]/95' : 'min-h-screen w-full relative overflow-hidden bg-slate-50 dark:bg-[#060b14]'} text-slate-900 dark:text-slate-200 flex flex-col items-center py-8 lg:py-12 px-4 lg:px-8 font-sans transition-colors duration-300`}>
      
      {onClose && (
        <button 
          onClick={onClose} 
          className="fixed top-4 right-4 sm:top-8 sm:right-8 z-50 p-2 bg-slate-200 dark:bg-slate-800 rounded-full hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors shadow-lg"
        >
          <X className="h-6 w-6 text-slate-700 dark:text-slate-300" />
        </button>
      )}

      {/* Decorative Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[30rem] h-[30rem] bg-cyan-400/20 dark:bg-cyan-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-blue-400/20 dark:bg-blue-900/20 rounded-full blur-[120px]" />
      </div>

      <main className="w-full max-w-3xl relative z-10 mt-4 mb-20">
        {step !== 'success' && (
          <div className="bg-white/80 dark:bg-white/[0.03] backdrop-blur-xl border border-slate-200 dark:border-white/[0.08] p-6 md:p-10 rounded-3xl shadow-xl dark:shadow-2xl relative overflow-hidden transition-colors duration-300 w-full">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
            
            {/* Header & Progress Indicator */}
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 mb-6">
                Dynamic Volunteer Registration
              </h1>
              <div className="flex justify-between items-center relative">
                <div className="absolute left-0 top-1/2 -z-10 h-1 w-full -translate-y-1/2 bg-slate-200 dark:bg-slate-800 rounded-full">
                  <motion.div 
                    className="h-full bg-cyan-500 rounded-full dark:shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                    initial={{ width: '0%' }}
                    animate={{ width: `${((step - 1) / 3) * 100}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`h-8 w-8 md:h-10 md:w-10 rounded-full flex items-center justify-center font-bold text-xs md:text-sm border-2 transition-all duration-300
                      ${step === i ? 'bg-white dark:bg-cyan-950 border-cyan-500 dark:border-cyan-400 text-cyan-600 dark:text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]' 
                      : step > i ? 'bg-cyan-500 border-cyan-500 text-white dark:text-slate-900' 
                      : 'bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-500'}`}
                  >
                    {step > i ? <Check size={16} /> : i}
                  </div>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              
              {/* STEP 1: Identity & Category Selection */}
              {step === 1 && (
                <motion.div key="step1" variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-slate-600 dark:text-slate-400 pl-1">Full Name</label>
                      <input type="text" value={formData.fullName} onChange={(e) => updateForm('fullName', e.target.value)} placeholder="Aarav Sharma" className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700/50 rounded-xl py-3 px-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-600 dark:text-slate-400 pl-1">Mobile Number</label>
                      <input type="tel" value={formData.mobile} onChange={(e) => updateForm('mobile', e.target.value)} placeholder="+91 98765 43210" className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700/50 rounded-xl py-3 px-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50" />
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="text-sm text-slate-600 dark:text-slate-400 pl-1 mb-3 block">Select your Volunteer Category</label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {categories.map(cat => {
                        const Icon = cat.icon;
                        const isSelected = formData.volunteerCategory === cat.id;
                        return (
                          <div key={cat.id} onClick={() => updateForm('volunteerCategory', cat.id)} className={`cursor-pointer border-2 rounded-xl p-4 flex items-start gap-4 transition-all ${isSelected ? 'border-cyan-400 bg-cyan-50 dark:bg-cyan-950/20 shadow-sm' : 'border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-600'}`}>
                            <div className={`p-2 rounded-lg ${isSelected ? 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                              <Icon size={20} />
                            </div>
                            <div>
                              <h4 className={`font-medium text-sm lg:text-base leading-tight mb-1 ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>{cat.title}</h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">{cat.desc}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="pt-6 flex justify-between items-center">
                    <button onClick={() => navigate('/')} className="text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 font-medium py-3 px-4 md:px-6 rounded-xl flex items-center gap-2 transition-all">
                      <ArrowLeft className="w-4 h-4 mr-2" /> Cancel & Return
                    </button>
                    <button onClick={() => setStep(2)} disabled={!isStep1Valid} className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition-all">
                      Next: Verification <ArrowRight size={18} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Priority Legal Verification */}
              {step === 2 && (
                <motion.div key="step2" variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                  <div className="flex items-center gap-4 mb-2">
                    <button onClick={() => setStep(1)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors"><ArrowLeft size={18} /></button>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Legal Verification</h2>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-5 md:p-6 min-h-[250px]">
                    
                    {/* General Citizen Responder */}
                    {formData.volunteerCategory === 'general' && (
                      <div className="space-y-5 animate-in fade-in duration-300">
                        <div className="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 p-4 rounded-xl mb-4">
                          <p className="text-sm text-cyan-800 dark:text-cyan-300 flex items-center gap-2 font-medium">
                            <ShieldCheck size={18} /> Data Minimization Active
                          </p>
                          <p className="text-xs text-cyan-700 dark:text-cyan-400 mt-1">No photo document uploads are required or permitted for general citizens per DPDP laws. Please provide an ID number for secure e-KYC.</p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm text-slate-600 dark:text-slate-400 pl-1">Select ID Type</label>
                            <select value={formData.idType} onChange={(e) => updateForm('idType', e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/50 rounded-xl py-3 px-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50">
                              <option value="" disabled>Choose an ID</option>
                              <option value="Aadhaar Card">Aadhaar Card</option>
                              <option value="Voter ID">Voter ID</option>
                              <option value="Driving License">Driving License</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-slate-600 dark:text-slate-400 pl-1">{formData.idType || 'Selected ID'} Number</label>
                            <input type="text" value={formData.idNumber} onChange={(e) => updateForm('idNumber', e.target.value)} placeholder="Enter ID number" className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/50 rounded-xl py-3 px-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50" />
                          </div>
                        </div>

                        <AnimatePresence mode="wait">
                          {isVerified ? (
                            <motion.div key="verified" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-2 flex justify-center md:justify-start">
                              <div className="bg-green-100 dark:bg-green-500/20 border border-green-300 dark:border-green-500/30 text-green-700 dark:text-green-400 px-6 py-3 rounded-xl flex items-center gap-2 font-bold w-full md:w-auto justify-center">
                                <CheckCircle size={20} /> Verified Successfully
                              </div>
                            </motion.div>
                          ) : showOtpField ? (
                            <motion.div key="otp" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-4 space-y-4 overflow-hidden">
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 pl-1">Enter 6-Digit OTP</label>
                                <div className="flex gap-2 justify-center md:justify-start">
                                  {otpValues.map((digit, idx) => (
                                    <input
                                      key={idx}
                                      id={`otp-${idx}`}
                                      type="text"
                                      value={digit}
                                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Backspace' && !digit && idx > 0) {
                                          document.getElementById(`otp-${idx - 1}`).focus();
                                        }
                                      }}
                                      className="w-10 h-12 md:w-12 md:h-14 text-center text-lg font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/50 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                                    />
                                  ))}
                                </div>
                              </div>
                              <div className="flex justify-center md:justify-start">
                                <button onClick={verifyOTP} disabled={otpValues.join('').length !== 6 || isVerifying} className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all w-full md:w-auto justify-center">
                                  {isVerifying ? <><Loader2 size={18} className="animate-spin" /> Verifying...</> : 'Confirm OTP'}
                                </button>
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div key="send" className="pt-2 flex justify-center md:justify-start">
                              <button onClick={handleEKYC} disabled={isVerifying} className="bg-slate-800 hover:bg-slate-700 disabled:bg-slate-300 dark:bg-slate-100 dark:hover:bg-white dark:disabled:bg-slate-700 dark:text-slate-900 dark:disabled:text-slate-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all w-full md:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                                {isVerifying ? <><Loader2 size={18} className="animate-spin" /> Sending OTP...</> : 'Send e-KYC OTP'}
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {/* Medical Professional */}
                    {formData.volunteerCategory === 'medical' && (
                      <div className="space-y-5 animate-in fade-in duration-300">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm text-slate-600 dark:text-slate-400 pl-1">Select Medical Authority</label>
                            <select value={formData.medicalAuth} onChange={(e) => updateForm('medicalAuth', e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/50 rounded-xl py-3 px-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50">
                              <option value="" disabled>Select Authority</option>
                              <option value="NMC Registration">NMC Registration</option>
                              <option value="State Nursing Council">State Nursing Council</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-slate-600 dark:text-slate-400 pl-1">Registration Number</label>
                            <input type="text" value={formData.regNumber} onChange={(e) => updateForm('regNumber', e.target.value)} placeholder="Doc / Reg No." className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/50 rounded-xl py-3 px-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50" />
                          </div>
                        </div>
                        <div className="space-y-2 pt-2">
                          <label className="text-sm font-medium text-slate-700 dark:text-white pl-1">Upload Registration Certificate (PDF/Image)</label>
                          <div onClick={() => handleFileUpload('medicalReg')} className={`mt-1 border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${formData.files['medicalReg'] ? 'border-cyan-400 bg-cyan-50 dark:bg-cyan-950/20' : 'border-slate-300 dark:border-slate-700/70 hover:border-cyan-500/50 hover:bg-slate-100 dark:hover:bg-slate-800/30 bg-white dark:bg-slate-900/30'}`}>
                            {formData.files['medicalReg'] ? (
                              <div className="text-center"><CheckCircle className="mx-auto text-cyan-600 dark:text-cyan-400 mb-2" size={24} /><p className="text-cyan-700 dark:text-cyan-400 font-medium">Uploaded Successfully</p></div>
                            ) : (
                              <div className="text-center"><UploadCloud className="mx-auto text-slate-400 mb-2" size={24} /><p className="text-slate-600 dark:text-slate-300 font-medium text-sm">Click to upload certificate</p></div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Government Student Volunteer */}
                    {formData.volunteerCategory === 'student' && (
                      <div className="space-y-5 animate-in fade-in duration-300">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm text-slate-600 dark:text-slate-400 pl-1">Select Affiliation</label>
                            <select value={formData.studentAffiliation} onChange={(e) => updateForm('studentAffiliation', e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/50 rounded-xl py-3 px-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50">
                              <option value="" disabled>Select Affiliation</option>
                              <option value="NSS">NSS</option>
                              <option value="NCC">NCC</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-slate-600 dark:text-slate-400 pl-1">College Name & Unit Number</label>
                            <input type="text" value={formData.collegeInfo} onChange={(e) => updateForm('collegeInfo', e.target.value)} placeholder="e.g., Presidency College Unit 4" className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/50 rounded-xl py-3 px-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50" />
                          </div>
                        </div>
                        <div className="space-y-2 pt-2">
                          <label className="text-sm font-medium text-slate-700 dark:text-white pl-1">Upload NSS/NCC Identity Card (Image)</label>
                          <div onClick={() => handleFileUpload('studentId')} className={`mt-1 border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${formData.files['studentId'] ? 'border-cyan-400 bg-cyan-50 dark:bg-cyan-950/20' : 'border-slate-300 dark:border-slate-700/70 hover:border-cyan-500/50 hover:bg-slate-100 dark:hover:bg-slate-800/30 bg-white dark:bg-slate-900/30'}`}>
                            {formData.files['studentId'] ? (
                              <div className="text-center"><CheckCircle className="mx-auto text-cyan-600 dark:text-cyan-400 mb-2" size={24} /><p className="text-cyan-700 dark:text-cyan-400 font-medium">Uploaded Successfully</p></div>
                            ) : (
                              <div className="text-center"><UploadCloud className="mx-auto text-slate-400 mb-2" size={24} /><p className="text-slate-600 dark:text-slate-300 font-medium text-sm">Click to upload ID Card</p></div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* NGO-Affiliated Volunteer */}
                    {formData.volunteerCategory === 'ngo' && (
                      <div className="space-y-5 animate-in fade-in duration-300">
                        <div className="space-y-2">
                          <label className="text-sm text-slate-600 dark:text-slate-400 pl-1">Name of Registered NGO</label>
                          <input type="text" value={formData.ngoName} onChange={(e) => updateForm('ngoName', e.target.value)} placeholder="Full registered name" className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/50 rounded-xl py-3 px-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50" />
                        </div>
                        <div className="space-y-2 pt-2">
                          <label className="text-sm font-medium text-slate-700 dark:text-white pl-1">Upload Official Authorization Letter or NGO ID Card</label>
                          <div onClick={() => handleFileUpload('ngoAuth')} className={`mt-1 border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${formData.files['ngoAuth'] ? 'border-cyan-400 bg-cyan-50 dark:bg-cyan-950/20' : 'border-slate-300 dark:border-slate-700/70 hover:border-cyan-500/50 hover:bg-slate-100 dark:hover:bg-slate-800/30 bg-white dark:bg-slate-900/30'}`}>
                            {formData.files['ngoAuth'] ? (
                              <div className="text-center"><CheckCircle className="mx-auto text-cyan-600 dark:text-cyan-400 mb-2" size={24} /><p className="text-cyan-700 dark:text-cyan-400 font-medium">Uploaded Successfully</p></div>
                            ) : (
                              <div className="text-center"><UploadCloud className="mx-auto text-slate-400 mb-2" size={24} /><p className="text-slate-600 dark:text-slate-300 font-medium text-sm">Click to upload letter/ID</p></div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                  </div>

                  <div className="pt-6 flex justify-between items-center">
                    <button onClick={() => setStep(1)} className="text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 font-medium py-3 px-4 md:px-6 rounded-xl flex items-center gap-2 transition-all">
                      <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </button>
                    <button onClick={() => setStep(3)} disabled={!isStep2Valid()} className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition-all">
                      Next Step <ArrowRight size={18} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Finalization & Skills */}
              {step === 3 && (
                <motion.div key="step3" variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                  <div className="flex items-center gap-4 mb-2">
                    <button onClick={() => setStep(2)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors"><ArrowLeft size={18} /></button>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Profile Finalization</h2>
                      <p className="text-slate-500 text-sm">Select skills and accept policies.</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">Highlight Primary Skills</label>
                      <div className="flex flex-wrap gap-3">
                        {skillBadges.map(skill => {
                          const isSelected = formData.skills.includes(skill);
                          return (
                            <button 
                              key={skill} 
                              onClick={() => toggleSkill(skill)}
                              className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${isSelected ? 'bg-cyan-500 text-white border-cyan-500 shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-cyan-400 dark:hover:border-cyan-600'}`}
                            >
                              {skill}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700/50 p-4 rounded-xl flex items-start gap-4">
                      <div className="mt-0.5">
                        <input 
                          type="checkbox" 
                          id="consent" 
                          checked={formData.consent} 
                          onChange={(e) => updateForm('consent', e.target.checked)} 
                          className="w-5 h-5 rounded border-slate-300 text-cyan-500 focus:ring-cyan-500/50 cursor-pointer"
                        />
                      </div>
                      <label htmlFor="consent" className="text-sm text-slate-600 dark:text-slate-300 cursor-pointer leading-relaxed">
                        I consent to the Good Samaritan guidelines and the processing of my volunteer data in accordance with the Digital Personal Data Protection Act of India.
                      </label>
                    </div>
                  </div>

                  <div className="pt-6 flex justify-between items-center">
                    <button onClick={() => setStep(2)} className="text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 font-medium py-3 px-4 md:px-6 rounded-xl flex items-center gap-2 transition-all">
                      <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </button>
                    <button onClick={() => setStep(4)} disabled={!isStep3Valid} className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition-all">
                      Next: Secure Account <ArrowRight size={18} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Secure Account Creation */}
              {step === 4 && (
                <motion.div key="step4" variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                  <div className="flex items-center gap-4 mb-2">
                    <button onClick={() => setStep(3)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors"><ArrowLeft size={18} /></button>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Secure Your Profile</h2>
                      <p className="text-slate-500 text-sm">Create your login credentials to access the deployment dashboard.</p>
                    </div>
                  </div>

                  <div className="space-y-5 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700/50 p-5 md:p-6 rounded-2xl">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm text-slate-600 dark:text-slate-400 pl-1">Username / Display Name</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <User size={18} className="text-slate-400 dark:text-slate-500" />
                          </div>
                          <input type="text" value={formData.username} onChange={(e) => updateForm('username', e.target.value)} placeholder="@rescue_volunteer" className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/50 rounded-xl py-3 pl-11 pr-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm text-slate-600 dark:text-slate-400 pl-1">Email Address</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail size={18} className="text-slate-400 dark:text-slate-500" />
                          </div>
                          <input type="email" value={formData.email} onChange={(e) => updateForm('email', e.target.value)} placeholder="hello@network.org" className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/50 rounded-xl py-3 pl-11 pr-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <label className="text-sm text-slate-600 dark:text-slate-400 pl-1">Create Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Lock size={18} className="text-slate-400 dark:text-slate-500" />
                        </div>
                        <input 
                          type={showPassword ? "text" : "password"} 
                          value={formData.password} 
                          onChange={(e) => updateForm('password', e.target.value)} 
                          placeholder="8+ characters" 
                          className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/50 rounded-xl py-3 pl-11 pr-12 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50" 
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>

                      {/* Password Strength Meter */}
                      <div className="pt-2 px-1">
                        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
                          <div className={`h-full transition-all duration-300 ${strength.w} ${strength.color}`} />
                        </div>
                        <p className={`text-xs mt-1 font-medium transition-colors ${strength.w.split(' ')[1] || 'text-transparent'}`}>
                          {strength.label} Password
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-slate-600 dark:text-slate-400 pl-1">Confirm Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Lock size={18} className="text-slate-400 dark:text-slate-500" />
                        </div>
                        <input 
                          type={showPassword ? "text" : "password"} 
                          value={formData.confirmPassword} 
                          onChange={(e) => updateForm('confirmPassword', e.target.value)} 
                          placeholder="Confirm your password" 
                          className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/50 rounded-xl py-3 pl-11 pr-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50" 
                        />
                      </div>
                      {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                        <p className="text-xs text-red-500 pl-1">Passwords do not match.</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <button onClick={() => setStep(3)} className="text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 font-medium py-3 md:py-4 px-4 md:px-6 rounded-xl flex items-center gap-2 transition-all w-full sm:w-auto justify-center shrink-0">
                      <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </button>
                    <button onClick={submitForm} disabled={!isStep4Valid || isSubmitting} className="w-full sm:flex-1 bg-cyan-400 hover:bg-cyan-300 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-slate-900 dark:text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(34,211,238,0.4)] disabled:shadow-none">
                      {isSubmitting ? <><Loader2 size={20} className="animate-spin" /> Generating Secure Keys...</> : <><ShieldCheck size={20} /> Create Account & Enter Dashboard</>}
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        )}

        {/* SUCCESS STATE */}
        <AnimatePresence>
          {step === 'success' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', bounce: 0.4 }}
              className="bg-white/80 dark:bg-white/[0.03] backdrop-blur-xl border border-cyan-200 dark:border-cyan-500/30 p-10 md:p-14 rounded-3xl shadow-xl dark:shadow-[0_0_50px_rgba(34,211,238,0.15)] text-center relative overflow-hidden w-full max-w-xl mx-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-50 dark:from-cyan-500/5 to-transparent pointer-events-none" />
              
              <motion.div 
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", bounce: 0.6 }}
                className="w-24 h-24 bg-cyan-100 dark:bg-cyan-500/20 border border-cyan-300 dark:border-cyan-400/50 rounded-full flex items-center justify-center mx-auto mb-6 relative"
              >
                <div className="absolute inset-0 rounded-full bg-cyan-200/50 dark:bg-cyan-400/20 animate-ping" />
                <CheckCircle className="text-cyan-600 dark:text-cyan-400 w-12 h-12 relative z-10" />
              </motion.div>
              
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Account Created Successfully!</h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 max-w-md mx-auto leading-relaxed">
                Welcome to the network, <span className="font-semibold text-slate-900 dark:text-white">{formData.username || formData.fullName}</span>. Your {formData.volunteerCategory === 'general' ? 'e-KYC' : 'credentials'} are verified and your profile is secured. Redirecting...
              </p>
              
              <button onClick={() => window.location.href = '/volunteer-dispatch'} className="bg-cyan-100 dark:bg-cyan-900/40 hover:bg-cyan-200 dark:hover:bg-cyan-800 text-cyan-800 dark:text-cyan-100 font-medium py-3 px-8 rounded-xl transition-all border border-cyan-200 dark:border-cyan-700 shadow-sm">
                Enter Dashboard Now
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default VolunteerSignUpForm;
