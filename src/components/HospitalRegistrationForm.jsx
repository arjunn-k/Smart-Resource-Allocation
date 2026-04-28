import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  MapPin, 
  PhoneCall, 
  User, 
  FileCheck, 
  UploadCloud, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  Loader2,
  Check,
  X,
  Stethoscope,
  Activity,
  AlertTriangle
} from 'lucide-react';

const establishmentTypes = [
  'Government Hospital',
  'Private Multi-Specialty',
  'Private Clinic/Nursing Home',
  'Dedicated Blood Bank'
];

const HospitalRegistrationForm = ({ onClose }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1
    hospitalName: '',
    address: '',
    city: '',
    establishmentType: '',
    nodalOfficer: '',
    emergencyContact: '',
    // Step 2
    ceaNumber: '',
    files: {},
    isNABH: false,
    nabhId: '',
    // Step 3
    totalBeds: '',
    icuBeds: '',
    hasBloodBank: false,
    hasTraumaCenter: false,
    hasAmbulance: false,
    // Step 4
    agreeUpdates: false,
    agreeValidity: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (key) => {
    setFormData(prev => ({
      ...prev,
      files: { ...prev.files, [key]: 'mock_file_uploaded.pdf' }
    }));
  };

  const submitForm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('success');
    }, 2000);
  };

  const slideVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3, ease: "easeIn" } }
  };

  // Validations per step
  const isStep1Valid = formData.hospitalName && formData.address && formData.city && formData.establishmentType && formData.nodalOfficer && formData.emergencyContact;
  
  const isStep2Valid = formData.ceaNumber && formData.files['ceaCert'] && formData.files['fireNoc'] && formData.files['bmwAuth'] && (!formData.isNABH || formData.nabhId);

  const isStep3Valid = formData.totalBeds && formData.icuBeds;

  const isStep4Valid = formData.agreeUpdates && formData.agreeValidity;

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#060b14] text-slate-900 dark:text-slate-200 flex flex-col items-center py-8 lg:py-16 px-4 lg:px-8 font-sans transition-colors duration-300 relative">
      
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
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-cyan-400/20 dark:bg-cyan-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-blue-400/20 dark:bg-blue-900/20 rounded-full blur-[120px]" />
      </div>

      <main className="w-full max-w-3xl relative z-10 mt-4 mb-20">
        {step !== 'success' && (
          <div className="bg-white/80 dark:bg-white/[0.03] backdrop-blur-xl border border-slate-200 dark:border-white/[0.08] p-6 md:p-10 rounded-3xl shadow-xl dark:shadow-2xl relative overflow-hidden transition-colors duration-300 w-full">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
            
            {/* Header & Progress Indicator */}
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 mb-6">
                Hospital & Clinical Establishment
              </h1>
              <div className="flex justify-between items-center relative">
                <div className="absolute left-0 top-1/2 -z-10 h-1 w-full -translate-y-1/2 bg-slate-200 dark:bg-slate-800 rounded-full">
                  <motion.div 
                    className="h-full bg-cyan-500 rounded-full dark:shadow-[0_0_10px_rgba(34,211,238,0.8)]"
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
              
              {/* STEP 1: Hospital Identity & Type */}
              {step === 1 && (
                <motion.div key="step1" variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm text-slate-600 dark:text-slate-400 pl-1">Official Hospital Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Building2 size={18} className="text-slate-400 dark:text-slate-500" />
                      </div>
                      <input type="text" value={formData.hospitalName} onChange={(e) => updateForm('hospitalName', e.target.value)} placeholder="e.g. City General Hospital" className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700/50 rounded-xl py-3 pl-11 pr-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-slate-600 dark:text-slate-400 pl-1">Registered Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <MapPin size={18} className="text-slate-400 dark:text-slate-500" />
                        </div>
                        <input type="text" value={formData.address} onChange={(e) => updateForm('address', e.target.value)} placeholder="Full street address" className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700/50 rounded-xl py-3 pl-11 pr-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-600 dark:text-slate-400 pl-1">City / District</label>
                      <input type="text" value={formData.city} onChange={(e) => updateForm('city', e.target.value)} placeholder="District" className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700/50 rounded-xl py-3 px-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-slate-600 dark:text-slate-400 pl-1">Establishment Type</label>
                    <select value={formData.establishmentType} onChange={(e) => updateForm('establishmentType', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700/50 rounded-xl py-3 px-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50">
                      <option value="" disabled>Select establishment category</option>
                      {establishmentTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-slate-600 dark:text-slate-400 pl-1">Nodal Officer Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <User size={18} className="text-slate-400 dark:text-slate-500" />
                        </div>
                        <input type="text" value={formData.nodalOfficer} onChange={(e) => updateForm('nodalOfficer', e.target.value)} placeholder="Full Name" className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700/50 rounded-xl py-3 pl-11 pr-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-600 dark:text-slate-400 pl-1">24/7 Emergency Contact</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <PhoneCall size={18} className="text-slate-400 dark:text-slate-500" />
                        </div>
                        <input type="tel" value={formData.emergencyContact} onChange={(e) => updateForm('emergencyContact', e.target.value)} placeholder="+91 ..." className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700/50 rounded-xl py-3 pl-11 pr-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 flex items-center justify-between">
                    <button onClick={() => navigate('/')} className="text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 font-medium py-3 px-4 md:px-6 rounded-xl flex items-center gap-2 transition-all">
                      <ArrowLeft size={18} /> Cancel & Return
                    </button>
                    <button onClick={() => setStep(2)} disabled={!isStep1Valid} className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition-all">
                      Next Step <ArrowRight size={18} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Government Legal Compliance */}
              {step === 2 && (
                <motion.div key="step2" variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                  <div className="flex items-center gap-4 mb-2">
                    <button onClick={() => setStep(1)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors"><ArrowLeft size={18} /></button>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Legal Compliance</h2>
                      <p className="text-slate-500 text-sm">Regulatory body verifications.</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700/50 p-5 md:p-6 rounded-2xl space-y-6">
                    
                    <div className="space-y-2">
                      <label className="text-sm text-slate-600 dark:text-slate-400 pl-1">Clinical Establishment Registration Number</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FileCheck size={18} className="text-slate-400 dark:text-slate-500" />
                        </div>
                        <input type="text" value={formData.ceaNumber} onChange={(e) => updateForm('ceaNumber', e.target.value)} placeholder="e.g., CEA/MH/2023/123" className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/50 rounded-xl py-3 pl-11 pr-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 uppercase" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      {/* Dropzone 1 */}
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-700 dark:text-slate-300 pl-1 text-center block">Clinical Registration (PDF/IMG)</label>
                        <div onClick={() => handleFileUpload('ceaCert')} className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all h-32 ${formData.files['ceaCert'] ? 'border-cyan-400 bg-cyan-50 dark:bg-cyan-950/20' : 'border-slate-300 dark:border-slate-700/70 hover:border-cyan-500/50 hover:bg-slate-100 dark:hover:bg-slate-800/30 bg-white dark:bg-slate-900/30'}`}>
                          {formData.files['ceaCert'] ? (
                            <div className="text-center"><CheckCircle className="mx-auto text-cyan-600 dark:text-cyan-400 mb-1" size={24} /><p className="text-cyan-700 dark:text-cyan-400 font-medium text-xs">Uploaded</p></div>
                          ) : (
                            <div className="text-center"><UploadCloud className="mx-auto text-slate-400 mb-1" size={24} /><p className="text-slate-500 font-medium text-xs">Click to upload</p></div>
                          )}
                        </div>
                      </div>

                      {/* Dropzone 2 */}
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-700 dark:text-slate-300 pl-1 text-center block">Valid Fire NOC (PDF)</label>
                        <div onClick={() => handleFileUpload('fireNoc')} className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all h-32 ${formData.files['fireNoc'] ? 'border-cyan-400 bg-cyan-50 dark:bg-cyan-950/20' : 'border-slate-300 dark:border-slate-700/70 hover:border-cyan-500/50 hover:bg-slate-100 dark:hover:bg-slate-800/30 bg-white dark:bg-slate-900/30'}`}>
                          {formData.files['fireNoc'] ? (
                            <div className="text-center"><CheckCircle className="mx-auto text-cyan-600 dark:text-cyan-400 mb-1" size={24} /><p className="text-cyan-700 dark:text-cyan-400 font-medium text-xs">Uploaded</p></div>
                          ) : (
                            <div className="text-center"><UploadCloud className="mx-auto text-slate-400 mb-1" size={24} /><p className="text-slate-500 font-medium text-xs">Click to upload</p></div>
                          )}
                        </div>
                      </div>

                      {/* Dropzone 3 */}
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-700 dark:text-slate-300 pl-1 text-center block">BMW Authorization (PDF)</label>
                        <div onClick={() => handleFileUpload('bmwAuth')} className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all h-32 ${formData.files['bmwAuth'] ? 'border-cyan-400 bg-cyan-50 dark:bg-cyan-950/20' : 'border-slate-300 dark:border-slate-700/70 hover:border-cyan-500/50 hover:bg-slate-100 dark:hover:bg-slate-800/30 bg-white dark:bg-slate-900/30'}`}>
                          {formData.files['bmwAuth'] ? (
                            <div className="text-center"><CheckCircle className="mx-auto text-cyan-600 dark:text-cyan-400 mb-1" size={24} /><p className="text-cyan-700 dark:text-cyan-400 font-medium text-xs">Uploaded</p></div>
                          ) : (
                            <div className="text-center"><UploadCloud className="mx-auto text-slate-400 mb-1" size={24} /><p className="text-slate-500 font-medium text-xs">Click to upload</p></div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-3">
                        <input 
                          type="checkbox" 
                          id="nabh" 
                          checked={formData.isNABH} 
                          onChange={(e) => updateForm('isNABH', e.target.checked)} 
                          className="w-5 h-5 rounded border-slate-300 text-cyan-500 focus:ring-cyan-500/50 cursor-pointer"
                        />
                        <label htmlFor="nabh" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                          We are NABH Accredited.
                        </label>
                      </div>
                      
                      <AnimatePresence>
                        {formData.isNABH && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="pt-4 overflow-hidden">
                            <input type="text" value={formData.nabhId} onChange={(e) => updateForm('nabhId', e.target.value)} placeholder="Please enter your NABH Accreditation ID" className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/50 rounded-xl py-3 px-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                  </div>

                  <div className="pt-6 flex items-center justify-between">
                    <button onClick={() => setStep(1)} className="text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 font-medium py-3 px-4 md:px-6 rounded-xl flex items-center gap-2 transition-all">
                      <ArrowLeft size={18} /> Back
                    </button>
                    <button onClick={() => setStep(3)} disabled={!isStep2Valid} className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition-all">
                      Next Step <ArrowRight size={18} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Crisis Infrastructure & Capacity */}
              {step === 3 && (
                <motion.div key="step3" variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                  <div className="flex items-center gap-4 mb-2">
                    <button onClick={() => setStep(2)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors"><ArrowLeft size={18} /></button>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Crisis Infrastructure</h2>
                      <p className="text-slate-500 text-sm">Real-time resource metrics.</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700/50 p-5 md:p-6 rounded-2xl space-y-6">
                    
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-xl flex items-start gap-3">
                      <AlertTriangle className="text-blue-500 mt-0.5 shrink-0" size={18} />
                      <p className="text-sm text-blue-800 dark:text-blue-300">
                        This data defines your initial routing capacity during a mass casualty event. Ensure operational statistics are accurate.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400 pl-1">Total Operational Beds</label>
                        <input type="number" min="0" value={formData.totalBeds} onChange={(e) => updateForm('totalBeds', e.target.value)} placeholder="e.g. 500" className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/50 rounded-xl py-3 px-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400 pl-1">Dedicated ICU Beds</label>
                        <input type="number" min="0" value={formData.icuBeds} onChange={(e) => updateForm('icuBeds', e.target.value)} placeholder="e.g. 50" className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/50 rounded-xl py-3 px-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50" />
                      </div>
                    </div>

                    <div className="space-y-4 pt-2">
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400 pl-1">Specialized Preparedness Settings</label>
                      
                      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-200 dark:divide-slate-800">
                        
                        <div className="p-4 flex items-center justify-between">
                          <label htmlFor="bloodbank" className="font-medium text-slate-700 dark:text-slate-300 cursor-pointer">In-house Blood Bank</label>
                          <button id="bloodbank" onClick={() => updateForm('hasBloodBank', !formData.hasBloodBank)} className={`w-12 h-6 rounded-full transition-colors relative ${formData.hasBloodBank ? 'bg-cyan-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
                            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${formData.hasBloodBank ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </div>

                        <div className="p-4 flex items-center justify-between">
                          <label htmlFor="trauma" className="font-medium text-slate-700 dark:text-slate-300 cursor-pointer">Level-1 Trauma Center</label>
                          <button id="trauma" onClick={() => updateForm('hasTraumaCenter', !formData.hasTraumaCenter)} className={`w-12 h-6 rounded-full transition-colors relative ${formData.hasTraumaCenter ? 'bg-cyan-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
                            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${formData.hasTraumaCenter ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </div>

                        <div className="p-4 flex items-center justify-between">
                          <label htmlFor="ambulance" className="font-medium text-slate-700 dark:text-slate-300 cursor-pointer">Active Ambulance Fleet</label>
                          <button id="ambulance" onClick={() => updateForm('hasAmbulance', !formData.hasAmbulance)} className={`w-12 h-6 rounded-full transition-colors relative ${formData.hasAmbulance ? 'bg-cyan-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
                            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${formData.hasAmbulance ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </div>

                      </div>
                    </div>

                  </div>

                  <div className="pt-6 flex items-center justify-between">
                    <button onClick={() => setStep(2)} className="text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 font-medium py-3 px-4 md:px-6 rounded-xl flex items-center gap-2 transition-all">
                      <ArrowLeft size={18} /> Back
                    </button>
                    <button onClick={() => setStep(4)} disabled={!isStep3Valid} className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition-all">
                      Next: Terms & Policy <ArrowRight size={18} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Protocol & Finalization */}
              {step === 4 && (
                <motion.div key="step4" variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                  <div className="flex items-center gap-4 mb-2">
                    <button onClick={() => setStep(3)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors"><ArrowLeft size={18} /></button>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Disaster Protocol & Finalization</h2>
                      <p className="text-slate-500 text-sm">Review terms and submit application.</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Disaster Coordination Agreement</label>
                      <div className="h-40 overflow-y-auto bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 p-4 rounded-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 space-y-3 custom-scrollbar">
                        <p>1. <strong>Integration Acknowledgment:</strong> By entering the Crisis Dispatch Grid, your clinical establishment agrees to operate as a coordinated node under the Unified Command Center during active emergencies.</p>
                        <p>2. <strong>Resource Commitments:</strong> The facility must honor incoming patient routing directives corresponding to available ICU and standard operational capacities as reported at the time of Crisis Tier escalation.</p>
                        <p>3. <strong>Data Transparency:</strong> All legal verifications, Clinical Establishment Acts (CEA) numbers, and Fire Safety credentials must reflect active, legal operations. Intentional misrepresentation is subject to immediate removal from the active routing algorithm.</p>
                        <p>4. <strong>Communication Requirements:</strong> Real-time status hooks must be maintained through the administrative dashboard when a mass-casualty or natural disaster mode is declared by the centralized state authorities.</p>
                      </div>
                    </div>

                    <div className="space-y-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700/50 p-5 rounded-2xl">
                      <div className="flex items-start gap-4">
                        <div className="mt-0.5">
                          <input 
                            type="checkbox" 
                            id="agreeUpdates" 
                            checked={formData.agreeUpdates} 
                            onChange={(e) => updateForm('agreeUpdates', e.target.checked)} 
                            className="w-5 h-5 rounded border-slate-300 text-cyan-500 focus:ring-cyan-500/50 cursor-pointer"
                          />
                        </div>
                        <label htmlFor="agreeUpdates" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer leading-relaxed">
                          We agree to provide real-time updates on ICU/Bed availability during an active declared crisis.
                        </label>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="mt-0.5">
                          <input 
                            type="checkbox" 
                            id="agreeValidity" 
                            checked={formData.agreeValidity} 
                            onChange={(e) => updateForm('agreeValidity', e.target.checked)} 
                            className="w-5 h-5 rounded border-slate-300 text-cyan-500 focus:ring-cyan-500/50 cursor-pointer"
                          />
                        </div>
                        <label htmlFor="agreeValidity" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer leading-relaxed">
                          We confirm that all uploaded legal documents are currently valid under Indian Law.
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 flex flex-col sm:flex-row items-center gap-4 justify-between">
                    <button onClick={() => setStep(3)} className="text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 font-medium py-3 md:py-4 px-4 md:px-6 rounded-xl flex items-center gap-2 transition-all w-full sm:w-auto justify-center shrink-0">
                      <ArrowLeft size={18} /> Back
                    </button>
                    <button onClick={submitForm} disabled={!isStep4Valid || isSubmitting} className="w-full sm:flex-1 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)] disabled:shadow-none">
                      {isSubmitting ? (
                        <><Loader2 size={20} className="animate-spin" /> Verifying with State Health Database...</>
                      ) : (
                        <><Building2 size={20} /> Submit Hospital Verification</>
                      )}
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
                <Building2 className="text-cyan-600 dark:text-cyan-400 w-12 h-12 relative z-10" />
              </motion.div>
              
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Application Submitted</h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 max-w-md mx-auto leading-relaxed">
                Thank you, <span className="font-semibold text-slate-900 dark:text-white">{formData.hospitalName}</span>. Your facility infrastructure details and legal verifications have been submitted. Your facility will be added to the Crisis Dispatch Grid upon manual review.
              </p>
              
              <button onClick={() => window.location.href = '/'} className="bg-cyan-100 dark:bg-cyan-900/40 hover:bg-cyan-200 dark:hover:bg-cyan-800 text-cyan-800 dark:text-cyan-100 font-medium py-3 px-8 rounded-xl transition-all border border-cyan-200 dark:border-cyan-700 shadow-sm">
                Return to Portal
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default HospitalRegistrationForm;
