import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Eye, 
  EyeOff, 
  GraduationCap, 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Zap,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { RegisteredUser } from '../../types';
import { loginUser, registerUser } from '../../services/dbService';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'signin' | 'signup';
  onClose: () => void;
  onLoginSuccess: (user: RegisteredUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'signin',
  onClose,
  onLoginSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sign in form state
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign up form state
  const [signUpRole, setSignUpRole] = useState<'student' | 'recruiter'>('student');
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [batch, setBatch] = useState('Class of 2026');
  const [company, setCompany] = useState('');
  const [designation, setDesignation] = useState('Talent Acquisition Lead');

  if (!isOpen) return null;

  // 1-Click Quick Demo Login as Aman Sharma (Student)
  const handleQuickDemoStudent = () => {
    const res = loginUser('aman.sharma@campus.edu', 'password123');
    if (res.success && res.user) {
      onLoginSuccess(res.user);
      onClose();
    } else {
      setError(res.error || 'Failed to authenticate student demo.');
    }
  };

  // 1-Click Quick Demo Login as TechNova (Recruiter)
  const handleQuickDemoRecruiter = () => {
    const res = loginUser('recruiter@technova.com', 'password123');
    if (res.success && res.user) {
      onLoginSuccess(res.user);
      onClose();
    } else {
      setError(res.error || 'Failed to authenticate recruiter demo.');
    }
  };

  // Handle Sign In submission
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!signInEmail.trim() || !signInPassword.trim()) {
      setError('Please fill in both email and password.');
      return;
    }

    const res = loginUser(signInEmail, signInPassword);
    if (res.success && res.user) {
      onLoginSuccess(res.user);
      onClose();
    } else {
      setError(res.error || 'Invalid credentials. User not found or incorrect password.');
    }
  };

  // Handle Sign Up submission
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!signUpName.trim() || !signUpEmail.trim() || !signUpPassword.trim()) {
      setError('Please complete all required fields.');
      return;
    }

    if (signUpPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    const res = registerUser({
      name: signUpName.trim(),
      email: signUpEmail.trim(),
      password: signUpPassword,
      role: signUpRole,
      university: signUpRole === 'student' ? college.trim() || 'Delhi Technological University' : undefined,
      college: signUpRole === 'student' ? college.trim() || 'Delhi Technological University' : undefined,
      targetRole: signUpRole === 'student' ? department.trim() : undefined,
      batch: signUpRole === 'student' ? batch.trim() : undefined,
      company: signUpRole === 'recruiter' ? company.trim() || 'Tech Innovators Corp' : undefined,
      designation: signUpRole === 'recruiter' ? designation.trim() : undefined,
    });

    if (res.success && res.user) {
      onLoginSuccess(res.user);
      onClose();
    } else {
      setError(res.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl shadow-black/80 overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-violet-400">
                InternZen Account Portal
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              {activeTab === 'signin' ? 'Welcome Back' : 'Create InternZen Profile'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close auth dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click Quick Demo Login Shortcuts */}
        <div className="p-4 bg-slate-950/70 border-b border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              Instant Hackathon Demo Logins
            </span>
            <span className="text-[10px] text-slate-500 font-mono">1-Click</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleQuickDemoStudent}
              type="button"
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-violet-500/40 text-left transition-all group cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-300" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate group-hover:text-indigo-300">
                  Aman Sharma
                </div>
                <div className="text-[10px] text-slate-400 truncate">Student (85% Match)</div>
              </div>
            </button>

            <button
              onClick={handleQuickDemoRecruiter}
              type="button"
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-violet-500/40 text-left transition-all group cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shrink-0">
                <Building2 className="w-3.5 h-3.5 text-violet-300" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate group-hover:text-violet-300">
                  TechNova
                </div>
                <div className="text-[10px] text-slate-400 truncate">Recruiter Studio</div>
              </div>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="p-4 pb-0">
          <div className="relative p-1 bg-slate-950 border border-slate-800 rounded-xl flex items-center">
            <button
              type="button"
              onClick={() => {
                setActiveTab('signin');
                setError(null);
              }}
              className={`relative z-10 flex-1 py-1.5 text-xs font-bold rounded-lg text-center transition-colors cursor-pointer ${
                activeTab === 'signin' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {activeTab === 'signin' && (
                <motion.div
                  layoutId="authTabSlider"
                  className="absolute inset-0 bg-violet-600 rounded-lg shadow-sm"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
              <span className="relative z-10">Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('signup');
                setError(null);
              }}
              className={`relative z-10 flex-1 py-1.5 text-xs font-bold rounded-lg text-center transition-colors cursor-pointer ${
                activeTab === 'signup' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {activeTab === 'signup' && (
                <motion.div
                  layoutId="authTabSlider"
                  className="absolute inset-0 bg-violet-600 rounded-lg shadow-sm"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
              <span className="relative z-10">Create Account</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-4 mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Container */}
        <div className="p-4 sm:p-5">
          <AnimatePresence mode="wait">
            {activeTab === 'signin' ? (
              /* Sign In Form */
              <motion.form
                key="signin-form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSignIn}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="e.g. student@campus.edu or recruiter@company.com"
                    className="w-full px-3.5 py-2.5 min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-300">
                      Password
                    </label>
                    <span className="text-[11px] text-violet-400 hover:underline cursor-pointer">
                      Demo mode: any password
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 pr-10 min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full min-h-[44px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/25 transition-all active:scale-[0.98] cursor-pointer"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </motion.form>
            ) : (
              /* Sign Up Form */
              <motion.form
                key="signup-form"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSignUp}
                className="space-y-3"
              >
                {/* Role Switcher */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    I am registering as:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSignUpRole('student')}
                      className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        signUpRole === 'student'
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>Student</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSignUpRole('recruiter')}
                      className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        signUpRole === 'recruiter'
                          ? 'bg-violet-600/20 border-violet-500 text-violet-300 shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Recruiter</span>
                    </button>
                  </div>
                </div>

                {/* Common Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      placeholder={signUpRole === 'student' ? 'e.g. Priya Sen' : 'e.g. Vikram Malhotra'}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {signUpRole === 'student' ? 'College Email *' : 'Work Email *'}
                    </label>
                    <input
                      type="email"
                      required
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      placeholder={signUpRole === 'student' ? 'priya@iitd.ac.in' : 'vikram@company.com'}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 min-h-[44px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Mobile Number (Optional)
                    </label>
                    <div className="flex items-center rounded-xl bg-slate-950 border border-slate-800 focus-within:border-violet-500 transition-colors overflow-hidden">
                      <span className="px-2.5 py-2 bg-slate-900 border-r border-slate-800 text-[11px] font-mono text-slate-300 font-bold shrink-0">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        value={signUpPhone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setSignUpPhone(val);
                        }}
                        placeholder="98765 43210"
                        className="w-full px-3 py-2 min-h-[44px] bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Password * (min. 6 characters)
                    </label>
                    <input
                      type="password"
                      required
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      placeholder="Create a secure password"
                      className="w-full px-3 py-2 min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>

                {/* Role-Specific Fields */}
                {signUpRole === 'student' ? (
                  <div className="space-y-2.5 pt-1">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        College / University Name
                      </label>
                      <input
                        type="text"
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                        placeholder="e.g. Delhi Technological University"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 min-h-[44px]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Department
                        </label>
                        <input
                          type="text"
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 min-h-[44px]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Graduation Batch
                        </label>
                        <input
                          type="text"
                          value={batch}
                          onChange={(e) => setBatch(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 min-h-[44px]"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="e.g. Razorpay, Swiggy"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 min-h-[44px]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Designation
                      </label>
                      <input
                        type="text"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        placeholder="e.g. Campus Talent Lead"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 min-h-[44px]"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full mt-3 min-h-[44px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/25 transition-all active:scale-[0.98] cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Register & Launch {signUpRole === 'student' ? 'Student' : 'Recruiter'} Studio</span>
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Modal Footer note */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/60 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Deterministic Skill Engine • LocalStorage Secured Session</span>
        </div>
      </motion.div>
    </div>
  );
};
