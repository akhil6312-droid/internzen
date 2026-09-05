import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  GraduationCap, 
  Building2, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  User, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Building,
  Target,
  Briefcase,
  HelpCircle
} from 'lucide-react';
import { RegisteredUser } from '../../types';
import { loginUser, registerUser } from '../../services/dbService';

interface AuthPortalProps {
  onLoginSuccess: (user: RegisteredUser) => void;
  onOpenContact?: () => void;
}

const TARGET_ROLE_OPTIONS = [
  'Full-Stack Web Development',
  'AI / Machine Learning',
  'DevOps & Cloud',
  'Mobile App Dev',
  'Cybersecurity',
  'Data Science',
  'Other (Type custom role)',
];

export const AuthPortal: React.FC<AuthPortalProps> = ({ onLoginSuccess, onOpenContact }) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sign In State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign Up State
  const [signUpRole, setSignUpRole] = useState<'student' | 'recruiter'>('student');
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [targetRole, setTargetRole] = useState(TARGET_ROLE_OPTIONS[0]);
  const [customTargetRole, setCustomTargetRole] = useState('');
  const [university, setUniversity] = useState('');
  const [batch, setBatch] = useState('Class of 2026');
  const [company, setCompany] = useState('');
  const [designation, setDesignation] = useState('Campus Talent Partner');

  // Handle 1-Click Quick Demo Sign In
  const handleQuickDemoStudent = () => {
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      // First try student@internzen.com, then aman.sharma@campus.edu
      let res = loginUser('student@internzen.com', 'password123');
      if (!res.success) {
        res = loginUser('aman.sharma@campus.edu', 'password123');
      }
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setError(res.error || 'Failed to authenticate student demo.');
      }
      setIsLoading(false);
    }, 150);
  };

  const handleQuickDemoRecruiter = () => {
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      // First try recruiter@internzen.com, then recruiter@technova.com
      let res = loginUser('recruiter@internzen.com', 'password123');
      if (!res.success) {
        res = loginUser('recruiter@technova.com', 'password123');
      }
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setError(res.error || 'Failed to authenticate recruiter demo.');
      }
      setIsLoading(false);
    }, 150);
  };

  // Submit Sign In
  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!signInEmail.trim() || !signInPassword.trim()) {
      setError('Please provide both email and password.');
      return;
    }

    setIsLoading(true);
    const res = loginUser(signInEmail, signInPassword);
    setIsLoading(false);

    if (res.success && res.user) {
      onLoginSuccess(res.user);
    } else {
      setError(res.error || 'Invalid email or password credentials.');
    }
  };

  // Submit Sign Up
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!signUpName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!signUpEmail.trim() || !signUpEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!signUpPassword || signUpPassword.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    if (signUpRole === 'student' && !university.trim()) {
      setError('Please enter your university or college name.');
      return;
    }

    if (signUpRole === 'student' && targetRole === 'Other (Type custom role)' && !customTargetRole.trim()) {
      setError('Please type your custom internship specialization.');
      return;
    }

    if (signUpRole === 'recruiter' && !company.trim()) {
      setError('Please enter your hiring organization name.');
      return;
    }

    const finalSpecialization = signUpRole === 'student'
      ? (targetRole === 'Other (Type custom role)' ? customTargetRole.trim() : targetRole)
      : undefined;

    setIsLoading(true);
    const res = registerUser({
      name: signUpName,
      email: signUpEmail,
      password: signUpPassword,
      role: signUpRole,
      targetRole: finalSpecialization,
      specialization: finalSpecialization,
      university: signUpRole === 'student' ? university : undefined,
      college: signUpRole === 'student' ? university : undefined,
      batch: signUpRole === 'student' ? batch : undefined,
      company: signUpRole === 'recruiter' ? company : undefined,
      designation: signUpRole === 'recruiter' ? designation : undefined,
    });
    setIsLoading(false);

    if (res.success && res.user) {
      onLoginSuccess(res.user);
    } else {
      setError(res.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-violet-500/30 selection:text-white relative overflow-hidden">
      {/* Ambient background lighting effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-violet-600/20 via-indigo-600/15 to-transparent blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-600/10 blur-3xl rounded-full" />
        <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-blue-600/10 blur-3xl rounded-full" />
      </div>

      {/* Top Header Strip */}
      <header className="relative z-10 w-full border-b border-slate-800/60 bg-slate-950/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/25 ring-1 ring-violet-400/30">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Intern<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-400">Zen</span>
              </span>
              <span className="hidden sm:inline-block ml-2.5 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
                Auth Gate
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
            <span className="hidden md:inline">15+ Corporate Tech Leaders Verified</span>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-semibold">Network Live</span>
            {onOpenContact && (
              <button
                type="button"
                onClick={onOpenContact}
                className="ml-1 inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[44px] rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white hover:border-violet-500/50 hover:bg-slate-800 transition-all cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-violet-400" />
                <span>Contact Us</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Authentication Card Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-lg">
          {/* Hero Branding Tag */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 mb-3 shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>Transparent Placement Intelligence & Skill Gap Navigator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-400">InternZen</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-sm mx-auto">
              Authenticate to access deterministic skill matching, direct corporate applications, and instant learning tracks.
            </p>
          </div>

          {/* Auth Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative">
            {/* Tab Switcher: Sign In vs Create Account */}
            <div className="flex items-center p-1 bg-slate-950 border border-slate-800/90 rounded-2xl mb-6 shadow-inner">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('signin');
                  setError(null);
                }}
                className={`flex-1 py-2.5 min-h-[44px] text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'signin'
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-500/25'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('signup');
                  setError(null);
                }}
                className={`flex-1 py-2.5 min-h-[44px] text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'signup'
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-500/25'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Create Account</span>
              </button>
            </div>

            {/* Error Banner */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 shadow-sm"
              >
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </motion.div>
            )}

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'signin' ? (
                /* SIGN IN VIEW */
                <motion.form
                  key="signin"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  onSubmit={handleSignInSubmit}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        placeholder="e.g. aman.sharma@campus.edu"
                        aria-label="Email address"
                        required
                        className="w-full pl-10 pr-4 py-2.5 min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-violet-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        placeholder="••••••••"
                        aria-label="Password"
                        required
                        className="w-full pl-10 pr-10 py-2.5 min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-violet-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200 transition-colors"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full min-h-[44px] mt-2 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/25 ring-1 ring-violet-400/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                  >
                    <span>Sign In to Platform</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* 1-Click Demo Evaluation Row */}
                  <div className="pt-4 border-t border-slate-800/80 mt-5">
                    <div className="text-center mb-2.5">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        — Rapid Evaluation Accounts —
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={handleQuickDemoStudent}
                        disabled={isLoading}
                        className="p-3 rounded-2xl bg-slate-950/80 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-left transition-all group cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-violet-300">
                            <GraduationCap className="w-4 h-4 text-violet-400" />
                            <span>Student Account</span>
                          </div>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30 font-bold">
                            Demo 1-Click
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-slate-400 leading-tight">
                          student@internzen.com
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Pass: <span className="font-mono text-slate-400">password123</span>
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={handleQuickDemoRecruiter}
                        disabled={isLoading}
                        className="p-3 rounded-2xl bg-slate-950/80 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-left transition-all group cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-emerald-300">
                            <Building2 className="w-4 h-4 text-emerald-400" />
                            <span>Recruiter Account</span>
                          </div>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                            Demo 1-Click
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-slate-400 leading-tight">
                          recruiter@internzen.com
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Pass: <span className="font-mono text-slate-400">password123</span>
                        </p>
                      </button>
                    </div>
                  </div>
                </motion.form>
              ) : (
                /* CREATE ACCOUNT VIEW */
                <motion.form
                  key="signup"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onSubmit={handleSignUpSubmit}
                  className="space-y-3.5"
                >
                  {/* Persona Selector (Student vs Recruiter) */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      I am registering as:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSignUpRole('student')}
                        className={`p-2.5 min-h-[44px] rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                          signUpRole === 'student'
                            ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <GraduationCap className="w-4 h-4 text-indigo-400" />
                        <span>Student Candidate</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSignUpRole('recruiter')}
                        className={`p-2.5 min-h-[44px] rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                          signUpRole === 'recruiter'
                            ? 'bg-violet-600/20 border-violet-500 text-white shadow-sm'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Building2 className="w-4 h-4 text-violet-400" />
                        <span>Recruiter / Talent Lead</span>
                      </button>
                    </div>
                  </div>

                  {/* Name Field */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={signUpName}
                        onChange={(e) => setSignUpName(e.target.value)}
                        placeholder="e.g. Priya Verma"
                        aria-label="Full Name"
                        required
                        className="w-full pl-10 pr-4 py-2 min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-violet-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        placeholder="e.g. priya.verma@college.edu"
                        aria-label="Email address"
                        required
                        className="w-full pl-10 pr-4 py-2 min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-violet-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Password (min. 6 characters)
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        placeholder="••••••••"
                        aria-label="Password"
                        required
                        className="w-full pl-10 pr-10 py-2 min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-violet-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200 transition-colors"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Persona-specific fields */}
                  {signUpRole === 'student' ? (
                    <>
                      {/* Target Role - Dual Mode (Preset Chips/Dropdown + Custom Input) */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-semibold text-slate-300">
                            Target Internship Specialization
                          </label>
                          {targetRole === 'Other (Type custom role)' && (
                            <span className="text-[10px] text-violet-400 font-bold uppercase tracking-wider">
                              Custom Input Mode
                            </span>
                          )}
                        </div>

                        {/* Mode A: Dropdown Selector */}
                        <div className="relative">
                          <Target className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <select
                            value={targetRole}
                            onChange={(e) => setTargetRole(e.target.value)}
                            aria-label="Target Internship Specialization"
                            className="w-full pl-10 pr-4 py-2 min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500 transition-colors cursor-pointer"
                          >
                            {TARGET_ROLE_OPTIONS.map((opt) => (
                              <option key={opt} value={opt} className="bg-slate-900 text-white">
                                {opt}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Mode A: Fast Selection Chips */}
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {TARGET_ROLE_OPTIONS.map((opt) => {
                            const isSelected = targetRole === opt;
                            const isOther = opt === 'Other (Type custom role)';
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setTargetRole(opt)}
                                className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all border ${
                                  isSelected
                                    ? 'bg-violet-600/30 border-violet-500 text-violet-200 shadow-sm font-semibold'
                                    : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                                }`}
                              >
                                {isOther ? '✏️ Other (Custom)' : opt}
                              </button>
                            );
                          })}
                        </div>

                        {/* Mode B: Custom Text Input Revealed When "Other" is Selected */}
                        {targetRole === 'Other (Type custom role)' && (
                          <div className="mt-2.5 p-3 rounded-xl bg-violet-950/20 border border-violet-500/40 animate-in fade-in slide-in-from-top-1 duration-200">
                            <label className="block text-xs font-semibold text-violet-300 mb-1">
                              Custom Specialization / Domain *
                            </label>
                            <input
                              type="text"
                              value={customTargetRole}
                              onChange={(e) => setCustomTargetRole(e.target.value)}
                              placeholder="e.g. Blockchain & Web3, Embedded Systems / IoT, UI/UX Design"
                              aria-label="Custom Target Domain"
                              required
                              autoFocus
                              className="w-full px-3.5 py-2 min-h-[44px] bg-slate-950 border border-violet-500/60 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition-all"
                            />
                            <p className="text-[10px] text-slate-400 mt-1">
                              Your custom specialization will be stored in your profile and highlighted on your candidate dashboard.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* University & Batch */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            University / College
                          </label>
                          <div className="relative">
                            <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              value={university}
                              onChange={(e) => setUniversity(e.target.value)}
                              placeholder="e.g. IIT Bombay"
                              aria-label="University or College"
                              required
                              className="w-full pl-10 pr-4 py-2 min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-violet-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Graduation Batch
                          </label>
                          <input
                            type="text"
                            value={batch}
                            onChange={(e) => setBatch(e.target.value)}
                            placeholder="e.g. Class of 2026"
                            aria-label="Graduation Batch"
                            className="w-full px-4 py-2 min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-violet-500"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Recruiter Company & Designation */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Hiring Organization
                          </label>
                          <div className="relative">
                            <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              value={company}
                              onChange={(e) => setCompany(e.target.value)}
                              placeholder="e.g. CRED / Razorpay"
                              aria-label="Hiring Organization"
                              required
                              className="w-full pl-10 pr-4 py-2 min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-violet-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Designation
                          </label>
                          <div className="relative">
                            <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              value={designation}
                              onChange={(e) => setDesignation(e.target.value)}
                              placeholder="e.g. Lead Tech Recruiter"
                              aria-label="Designation"
                              className="w-full pl-10 pr-4 py-2 min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-violet-500"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full min-h-[44px] mt-2 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/25 ring-1 ring-violet-400/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                  >
                    <span>Create Account & Enter Platform</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer Strip */}
      <footer className="relative z-10 w-full border-t border-slate-800/60 bg-slate-950/70 backdrop-blur-xl py-3 px-4 text-center text-[11px] text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>InternZen &bull; Deterministic Linear Skill Matching &bull; Persistent Multi-User Client Engine</span>
          {onOpenContact && (
            <button
              type="button"
              onClick={onOpenContact}
              className="text-violet-400 hover:text-violet-300 underline font-semibold transition-colors cursor-pointer min-h-[44px] flex items-center"
            >
              Need Help? Contact TEAM Zenith
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};
