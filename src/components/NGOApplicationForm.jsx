import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  UploadCloud, 
  CheckCircle, 
  FileText, 
  ArrowRight,
  ShieldCheck,
  Building,
  Briefcase,
  Globe,
  Loader2,
  Check
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const NGOApplicationForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  
  // STATE MANAGEMENT
  const [formData, setFormData] = useState({
    ngoName: '',
    officialEmail: '',
    selectedEntities: [], // Array for multiple selections
    files: {}, // Object mapping entity names/keys to uploaded simulated files
    fcraNumber: '' // Specifically for INGO
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (entityTitle) => {
    setFormData((prev) => {
      const isSelected = prev.selectedEntities.includes(entityTitle);
      const newEntities = isSelected 
        ? prev.selectedEntities.filter((item) => item !== entityTitle)
        : [...prev.selectedEntities, entityTitle];
      
      // Clean up files map if a user unchecks an option
      const newFiles = { ...prev.files };
      let newFcraNumber = prev.fcraNumber;
      
      if (isSelected) {
        if (entityTitle === 'International NGO (Branch/Liaison Office in India)') {
          delete newFiles['RBI_Approval'];
          delete newFiles['FCRA_Clearance'];
          newFcraNumber = '';
        } else {
          delete newFiles[entityTitle];
        }
      }

      return { ...prev, selectedEntities: newEntities, files: newFiles, fcraNumber: newFcraNumber };
    });
  };

  const handleFileUpload = (fileKey) => {
    setFormData((prev) => ({
      ...prev,
      files: { ...prev.files, [fileKey]: 'mocked-file.pdf' }
    }));
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Mock 2-second API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  const getDocumentLabel = (entityType) => {
    switch (entityType) {
      case 'Registered Trust (Indian Trusts Act)':
        return 'Upload Trust Deed (PDF)';
      case 'Registered Society (Societies Registration Act)':
        return 'Upload Society Registration Certificate (PDF)';
      case 'Section 8 Company (Companies Act)':
        return 'Upload Certificate of Incorporation (PDF)';
      case 'RBI_Approval':
        return 'Upload RBI Branch Office Approval Letter (PDF)';
      case 'FCRA_Clearance':
        return 'Upload FCRA Clearance Certificate (PDF)';
      default:
        return 'Upload Document (PDF)';
    }
  };

  const isStep3Valid = () => {
    if (formData.selectedEntities.length === 0) return false;
    for (const entity of formData.selectedEntities) {
      if (entity === 'International NGO (Branch/Liaison Office in India)') {
         if (!formData.files['RBI_Approval'] || !formData.files['FCRA_Clearance'] || !formData.fcraNumber.trim()) return false;
      } else {
         if (!formData.files[entity]) return false;
      }
    }
    return true;
  };

  const slideVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3, ease: "easeIn" } }
  };

  const renderStepIndicator = () => (
    <div className="flex justify-between items-center mb-10 relative">
      <div className="absolute left-0 top-1/2 -z-10 h-1 w-full -translate-y-1/2 bg-slate-200 dark:bg-slate-800 rounded-full">
        <motion.div 
          className="h-full bg-cyan-500 rounded-full dark:shadow-[0_0_10px_rgba(6,182,212,0.8)]"
          initial={{ width: '0%' }}
          animate={{ width: `${((step - 1) / 3) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
      {[1, 2, 3, 4].map((i) => (
        <div 
          key={i} 
          className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-300
            ${step === i 
              ? 'bg-white dark:bg-cyan-950 border-cyan-500 dark:border-cyan-400 text-cyan-600 dark:text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)] dark:shadow-[0_0_15px_rgba(34,211,238,0.5)]' 
              : step > i 
                ? 'bg-cyan-500 border-cyan-500 text-white dark:text-slate-900' 
                : 'bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-500'}`}
        >
          {step > i ? <Check size={20} /> : i}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#060b14] text-slate-900 dark:text-slate-200 flex items-center justify-center p-4 lg:p-8 font-sans selection:bg-cyan-200 dark:selection:bg-cyan-900 selection:text-cyan-900 dark:selection:text-cyan-50 transition-colors duration-300 relative">
      
      <div className="absolute top-4 right-4 sm:top-8 sm:right-8 z-50">
        <ThemeToggle />
      </div>

      {/* Background glowing orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-96 h-96 bg-cyan-400/20 dark:bg-cyan-900/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-400/20 dark:bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />

      <main className="w-full max-w-2xl relative z-10 pt-16 sm:pt-0">
        
        {!isSuccess ? (
          <div className="bg-white/80 dark:bg-white/[0.03] backdrop-blur-xl border border-slate-200 dark:border-white/[0.08] p-8 md:p-10 rounded-3xl shadow-xl dark:shadow-2xl relative overflow-hidden transition-colors duration-300">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
            
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 mb-2">
                NGO Partnership Application
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">
                Join our network to amplify local social impact.
              </p>
            </div>

            {renderStepIndicator()}

            <div className="relative min-h-[400px]">
              <AnimatePresence mode="wait">
                {/* STEP 1: Basic Organization Details */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    variants={slideVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-5"
                  >
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                      <Building2 className="text-cyan-600 dark:text-cyan-400" size={24} />
                      Basic Organization Details
                    </h2>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm text-slate-600 dark:text-slate-400 pl-1">Official NGO Name</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Building size={18} className="text-slate-400 dark:text-slate-500" />
                          </div>
                          <input
                            type="text"
                            name="ngoName"
                            value={formData.ngoName}
                            onChange={handleInputChange}
                            placeholder="e.g., Hope Foundation"
                            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700/50 rounded-xl py-3 pl-12 pr-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all font-medium"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm text-slate-600 dark:text-slate-400 pl-1">Official Email</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail size={18} className="text-slate-400 dark:text-slate-500" />
                          </div>
                          <input
                            type="email"
                            name="officialEmail"
                            value={formData.officialEmail}
                            onChange={handleInputChange}
                            placeholder="contact@ngo.org"
                            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700/50 rounded-xl py-3 pl-12 pr-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 flex justify-between">
                      <button 
                        onClick={() => navigate('/')}
                        className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium py-3 px-6 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors border border-transparent dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-500"
                      >
                        Back to Home
                      </button>
                      <button 
                        onClick={nextStep}
                        disabled={!formData.ngoName || !formData.officialEmail}
                        className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed text-white dark:text-slate-950 font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] disabled:shadow-none"
                      >
                        Next Step <ArrowRight size={18} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Legal Entity Selection (Multi-select) */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    variants={slideVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-5"
                  >
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                      <ShieldCheck className="text-cyan-600 dark:text-cyan-400" size={24} />
                      Legal Framework
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">
                      Under which frameworks is your NGO registered in India?
                    </p>
                    <p className="text-slate-500 text-xs italic mb-6">
                      Select all the legal structures that apply to your organization. You may select multiple.
                    </p>
                    
                    <div className="space-y-4">
                      {[
                        { title: 'Registered Trust (Indian Trusts Act)', icon: Building2 },
                        { title: 'Registered Society (Societies Registration Act)', icon: Briefcase },
                        { title: 'Section 8 Company (Companies Act)', icon: Building },
                        { title: 'International NGO (Branch/Liaison Office in India)', icon: Globe }
                      ].map((entity) => {
                        const Icon = entity.icon;
                        const isSelected = formData.selectedEntities.includes(entity.title);
                        
                        return (
                          <div 
                            key={entity.title}
                            onClick={() => handleCheckboxChange(entity.title)}
                            className={`cursor-pointer p-5 rounded-2xl border-2 transition-all flex items-center gap-4 group
                              ${isSelected 
                                ? 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.15)] dark:shadow-[0_0_20px_rgba(34,211,238,0.2)]' 
                                : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/50 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}
                          >
                            <div className={`p-3 rounded-full flex-shrink-0 transition-colors
                              ${isSelected ? 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300'}`}>
                              <Icon size={24} />
                            </div>
                            <div className="flex-grow">
                              <h3 className={`font-medium text-lg leading-tight ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
                                {entity.title}
                              </h3>
                            </div>
                            
                            <div className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 transition-all
                              ${isSelected ? 'bg-cyan-500 border-cyan-400' : 'border-2 border-slate-300 dark:border-slate-600 group-hover:border-slate-400 dark:group-hover:border-slate-500'}`}>
                              {isSelected && <Check size={16} className="text-white dark:text-slate-950 font-bold" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-6 flex justify-between">
                      <button 
                        onClick={prevStep}
                        className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium py-3 px-6 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        Back
                      </button>
                      <button 
                        onClick={nextStep}
                        disabled={formData.selectedEntities.length === 0}
                        className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed text-white dark:text-slate-950 font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] disabled:shadow-none"
                      >
                        Next Step <ArrowRight size={18} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: Dynamic Multi Document Uploads */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    variants={slideVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-5"
                  >
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                      <FileText className="text-cyan-600 dark:text-cyan-400" size={24} />
                      Document Uploads
                    </h2>
                    
                    <div className="space-y-6">
                      {formData.selectedEntities.map((entityName) => {
                        
                        // Custom Nested Input Group
                        if (entityName === 'International NGO (Branch/Liaison Office in India)') {
                          return (
                            <div key={entityName} className="space-y-6 pt-2 pb-4 border-b border-slate-200 dark:border-white/5 last:border-0 last:pb-0">
                              <h3 className="text-lg font-medium text-cyan-600 dark:text-cyan-500">{entityName}</h3>
                              
                              <div className="space-y-2">
                                <label className="text-sm text-slate-600 dark:text-slate-400 pl-1">Foreign Contribution Regulation Act (FCRA) Registration Number</label>
                                <input
                                  type="text"
                                  name="fcraNumber"
                                  value={formData.fcraNumber}
                                  onChange={handleInputChange}
                                  placeholder="Enter FCRA Registration Number"
                                  className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700/50 rounded-xl py-3 px-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all font-medium"
                                />
                              </div>

                              <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-white pl-1">{getDocumentLabel('RBI_Approval')}</label>
                                <div 
                                  className={`mt-1 border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all
                                    ${formData.files['RBI_Approval'] ? 'border-cyan-400 bg-cyan-50 dark:bg-cyan-950/20' : 'border-slate-300 dark:border-slate-700/70 hover:border-cyan-500/50 hover:bg-slate-100 dark:hover:bg-slate-800/30 bg-slate-50 dark:bg-slate-900/30'}`}
                                  onClick={() => handleFileUpload('RBI_Approval')}
                                >
                                  {formData.files['RBI_Approval'] ? (
                                    <div className="text-center">
                                      <CheckCircle className="mx-auto text-cyan-600 dark:text-cyan-400 mb-2" size={28} />
                                      <p className="text-cyan-700 dark:text-cyan-400 font-medium">Uploaded Successfully</p>
                                    </div>
                                  ) : (
                                    <div className="text-center">
                                      <UploadCloud className="mx-auto text-slate-400 mb-2" size={28} />
                                      <p className="text-slate-600 dark:text-slate-300 font-medium">Click to upload</p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-white pl-1">{getDocumentLabel('FCRA_Clearance')}</label>
                                <div 
                                  className={`mt-1 border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all
                                    ${formData.files['FCRA_Clearance'] ? 'border-cyan-400 bg-cyan-50 dark:bg-cyan-950/20' : 'border-slate-300 dark:border-slate-700/70 hover:border-cyan-500/50 hover:bg-slate-100 dark:hover:bg-slate-800/30 bg-slate-50 dark:bg-slate-900/30'}`}
                                  onClick={() => handleFileUpload('FCRA_Clearance')}
                                >
                                  {formData.files['FCRA_Clearance'] ? (
                                    <div className="text-center">
                                      <CheckCircle className="mx-auto text-cyan-600 dark:text-cyan-400 mb-2" size={28} />
                                      <p className="text-cyan-700 dark:text-cyan-400 font-medium">Uploaded Successfully</p>
                                    </div>
                                  ) : (
                                    <div className="text-center">
                                      <UploadCloud className="mx-auto text-slate-400 mb-2" size={28} />
                                      <p className="text-slate-600 dark:text-slate-300 font-medium">Click to upload</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        }

                        // Standard Input Dropzones
                        return (
                          <div key={entityName} className="space-y-2 pt-2 pb-4 border-b border-slate-200 dark:border-white/5 last:border-0 last:pb-0">
                            <label className="text-sm font-medium text-slate-700 dark:text-white pl-1">{getDocumentLabel(entityName)}</label>
                            <div 
                              className={`mt-1 border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all
                                ${formData.files[entityName] ? 'border-cyan-400 bg-cyan-50 dark:bg-cyan-950/20' : 'border-slate-300 dark:border-slate-700/70 hover:border-cyan-500/50 hover:bg-slate-100 dark:hover:bg-slate-800/30 bg-slate-50 dark:bg-slate-900/30'}`}
                              onClick={() => handleFileUpload(entityName)}
                            >
                              {formData.files[entityName] ? (
                                <div className="text-center flex flex-col items-center">
                                  <div className="bg-cyan-100 dark:bg-cyan-500/20 p-3 rounded-full mb-3 text-cyan-600 dark:text-cyan-400">
                                    <CheckCircle size={32} />
                                  </div>
                                  <p className="text-cyan-700 dark:text-cyan-400 font-medium text-sm">{getDocumentLabel(entityName)}</p>
                                </div>
                              ) : (
                                <div className="text-center flex flex-col items-center">
                                  <div className="bg-slate-200 dark:bg-slate-800 p-3 rounded-full mb-3 text-slate-500 dark:text-slate-400">
                                    <UploadCloud size={32} />
                                  </div>
                                  <p className="text-slate-600 dark:text-slate-300 font-medium">Click to upload or drag and drop</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <div className="pt-6 flex justify-between border-t border-slate-200 dark:border-slate-800">
                      <button 
                        onClick={prevStep}
                        className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium py-3 px-6 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        Back
                      </button>
                      <button 
                        onClick={nextStep}
                        disabled={!isStep3Valid()}
                        className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed text-white dark:text-slate-950 font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] disabled:shadow-none"
                      >
                        Review Form <ArrowRight size={18} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: Submit & Success */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    variants={slideVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Review Form</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Please ensure all details are correct before submitting.</p>
                    
                    <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 space-y-4">
                      
                      <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                        <div>
                          <p className="text-slate-500 mb-1">Organization Name</p>
                          <p className="text-slate-900 dark:text-white font-medium">{formData.ngoName}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 mb-1">Email</p>
                          <p className="text-slate-900 dark:text-white font-medium">{formData.officialEmail}</p>
                        </div>
                        
                        <div className="col-span-2 pt-4 border-t border-slate-200 dark:border-slate-700/50">
                          <p className="text-slate-500 mb-3">Legal Frameworks & Documents</p>
                          <div className="space-y-3">
                            {formData.selectedEntities.map((entity) => {
                              if (entity === 'International NGO (Branch/Liaison Office in India)') {
                                return (
                                  <div key={entity} className="flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-lg gap-3">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                      <span className="inline-block bg-cyan-100 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/20 rounded-md px-3 py-1 font-medium text-[13px] leading-tight max-w-sm">
                                        {entity}
                                      </span>
                                      <span className="text-slate-500 dark:text-slate-400 text-sm">FCRA: <span className="text-slate-900 dark:text-white font-medium">{formData.fcraNumber}</span></span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                      <div className="flex items-center gap-2 text-sm text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-800/50 p-2 rounded border border-slate-200 dark:border-slate-700/50 flex-1">
                                        <FileText size={16} className={formData.files['RBI_Approval'] ? "text-cyan-600 dark:text-cyan-400" : "text-slate-400 dark:text-slate-500"} />
                                        {formData.files['RBI_Approval'] ? "RBI Approval Uploaded" : "Missing File"}
                                      </div>
                                      <div className="flex items-center gap-2 text-sm text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-800/50 p-2 rounded border border-slate-200 dark:border-slate-700/50 flex-1">
                                        <FileText size={16} className={formData.files['FCRA_Clearance'] ? "text-cyan-600 dark:text-cyan-400" : "text-slate-400 dark:text-slate-500"} />
                                        {formData.files['FCRA_Clearance'] ? "FCRA Clearance Uploaded" : "Missing File"}
                                      </div>
                                    </div>
                                  </div>
                                )
                              }
                              return (
                                <div key={entity} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-lg gap-3">
                                  <span className="inline-block bg-cyan-100 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/20 rounded-md px-3 py-1 font-medium text-[13px] leading-tight max-w-sm">
                                    {entity}
                                  </span>
                                  
                                  <div className="flex items-center gap-2 text-sm text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-800/50 p-2 rounded border border-slate-200 dark:border-slate-700/50 w-full sm:w-auto overflow-hidden">
                                    <FileText size={16} className={formData.files[entity] ? "text-cyan-600 dark:text-cyan-400 flex-shrink-0" : "text-slate-400 dark:text-slate-500 flex-shrink-0"} />
                                    {formData.files[entity] ? "Uploaded Successfully" : "Missing File"}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>

                    </div>

                    <div className="pt-4 flex justify-between items-center">
                      <button 
                        onClick={prevStep}
                        disabled={isSubmitting}
                        className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium py-3 px-6 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors disabled:opacity-50"
                      >
                        Edit Details
                      </button>
                      <button 
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            Submit Form <CheckCircle size={18} />
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          /* SUCCESS SCREEN */
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
            className="bg-white/80 dark:bg-white/[0.03] backdrop-blur-xl border border-cyan-200 dark:border-cyan-500/30 p-10 md:p-14 rounded-3xl shadow-xl dark:shadow-[0_0_50px_rgba(34,211,238,0.15)] text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-50 dark:from-cyan-500/5 to-transparent pointer-events-none" />
            
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", bounce: 0.6 }}
              className="w-24 h-24 bg-cyan-100 dark:bg-cyan-500/20 border border-cyan-300 dark:border-cyan-400/50 rounded-full flex items-center justify-center mx-auto mb-6 relative"
            >
              <div className="absolute inset-0 rounded-full bg-cyan-200/50 dark:bg-cyan-400/20 animate-ping" />
              <CheckCircle className="text-cyan-600 dark:text-cyan-400 w-12 h-12 relative z-10" />
            </motion.div>
            
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Application Submitted!</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 max-w-md mx-auto leading-relaxed">
              Our team will verify your documents against government databases within <span className="text-cyan-600 dark:text-cyan-400 font-semibold">24 hours</span>. We'll be in touch shortly.
            </p>
            
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-medium py-3 px-8 rounded-xl transition-all border border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 hover:shadow-lg"
            >
              Return to Home
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default NGOApplicationForm;
