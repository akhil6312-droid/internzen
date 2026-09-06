import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  Sparkles, 
  ArrowRight, 
  GraduationCap, 
  Building2, 
  ShieldCheck, 
  Sliders, 
  Zap, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Award,
  Layers,
  HelpCircle,
  Briefcase,
  Play
} from 'lucide-react';
import { Job, ThemeOption, UserAccount } from '../../types';
import { ThemeToggle } from '../common/ThemeToggle';
import { formatTimeAgo } from '../../utils/timeAgo';

interface LandingPageProps {
  onOpenAuth: (mode?: 'signin' | 'signup', targetPersona?: 'student' | 'recruiter') => void;
  onExplorePortal: (persona: 'student' | 'recruiter') => void;
  currentTheme: ThemeOption;
  onThemeChange: (theme: ThemeOption) => void;
  onOpenContact?: () => void;
  currentUser: UserAccount | null;
  jobs: Job[];
}

const CYCLING_TEXTS = [
  'Crack Distributed Systems',
  'Land AI / ML Internships',
  'Hire in High-Growth Web3',
  'Scale Cloud Architectures',
  'Bridge Empirical Skill Gaps',
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuth,
  onExplorePortal,
  currentTheme,
  onThemeChange,
  onOpenContact,
  currentUser,
  jobs,
}) => {
  // Cycling text index
  const [textIndex, setTextIndex] = useState(0);

  // Bento Card 1: Interactive slider for skill readiness demo
  const [demoSkillProficiency, setDemoSkillProficiency] = useState(78);

  // Bento Card 2: Candidate dispatch simulation
  const [simulationStep, setSimulationStep] = useState<'idle' | 'dispatching' | 'delivered'>('idle');

  // Hero Card mouse hover tilt
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Rotate hero cycling domain headline
  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % CYCLING_TEXTS.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  // Filter top 4 corporate jobs for the featured live preview
  const featuredJobs = jobs.slice(0, 4);

  // Handle interactive simulation
  const handleRunSimulation = () => {
    setSimulationStep('dispatching');
    setTimeout(() => {
      setSimulationStep('delivered');
      setTimeout(() => {
        setSimulationStep('idle');
      }, 3500);
    }, 900);
  };

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
    setTilt({ x, y });
  };

  const handleCardMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const isDark = currentTheme !== 'light' && currentTheme !== 'modern-light';

  return (
    <div className={`min-h-screen flex flex-col selection:bg-violet-500/30 selection:text-white relative transition-colors duration-200 overflow-x-hidden ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-tr from-violet-600/15 via-indigo-600/10 to-transparent blur-3xl rounded-full" />
        <div className="absolute top-1/3 -right-40 w-[550px] h-[550px] bg-emerald-600/10 blur-3xl rounded-full" />
        <div className="absolute bottom-10 -left-40 w-[500px] h-[500px] bg-cyan-600/10 blur-3xl rounded-full" />
      </div>

      {/* Top Public Header */}
      <header className={`sticky top-0 z-40 w-full border-b backdrop-blur-xl transition-all ${
        isDark ? 'border-slate-800/80 bg-slate-950/85' : 'border-slate-200/90 bg-white/90 shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Logo & Brand Identity */}
          <div className="flex items-center space-x-3.5 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/25 ring-1 ring-violet-400/30">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white font-bold">
                  Intern<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-400">Zen</span>
                </span>
                <span className={`hidden sm:inline-flex text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                  isDark ? 'bg-violet-500/10 text-violet-300 border-violet-500/20' : 'bg-violet-50 text-violet-700 border-violet-200'
                }`}>
                  Job Portal
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Public Navigation Links */}
          <nav className={`hidden md:flex items-center space-x-6 text-xs font-semibold ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            <a href="#ecosystem" className="hover:text-violet-400 transition-colors">
              Ecosystem
            </a>
            <a href="#engine" className="hover:text-violet-400 transition-colors">
              Skill Match Engine
            </a>
            <a href="#roles" className="hover:text-violet-400 transition-colors">
              Live Roles
            </a>
            <a href="#team-zenith" className="hover:text-violet-400 transition-colors">
              TEAM Zenith
            </a>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Universal Day/Night Mode Switcher */}
            <ThemeToggle currentTheme={currentTheme} onThemeChange={onThemeChange} />

            {currentUser ? (
              /* Authenticated User Quick Links */
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onExplorePortal(currentUser.role)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 min-h-[44px] rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/25 ring-1 ring-violet-400/30 transition-all cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Go to Dashboard ({currentUser.role === 'student' ? 'Student' : 'Recruiter'})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              /* Unauthenticated CTAs */
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => onOpenAuth('signin')}
                  className={`px-3 sm:px-4 py-2 min-h-[44px] rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    isDark 
                      ? 'text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-850 border-slate-800' 
                      : 'text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border-slate-200 shadow-sm'
                  }`}
                >
                  Sign In
                </button>

                <button
                  type="button"
                  onClick={() => onOpenAuth('signup', 'student')}
                  className="px-3.5 sm:px-4 py-2 min-h-[44px] rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/25 ring-1 ring-violet-400/30 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Get Started Free</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 w-full">
        {/* HERO SECTION */}
        <section className="relative pt-12 sm:pt-16 pb-16 lg:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-inner border ${
                  isDark ? 'bg-slate-900/90 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-sm'
                }`}
              >
                <Sparkles className="w-4 h-4 text-violet-400 animate-spin-slow" />
                <span>Skill-Based Internship & Hiring Portal</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </motion.div>

              <h1 className={`text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Find your dream internship or{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-400">
                  hire top student talent.
                </span>
              </h1>

              {/* Dynamic cycling domain headline */}
              <div className="h-10 sm:h-12 flex items-center justify-center lg:justify-start">
                <div className={`text-sm sm:text-lg font-bold flex items-center gap-2 ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <span>Explore Roles in:</span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={textIndex}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.28 }}
                      className={`px-3 py-1 rounded-lg font-mono border ${
                        isDark ? 'bg-violet-500/10 border-violet-500/30 text-violet-300' : 'bg-violet-50 border-violet-200 text-violet-700'
                      }`}
                    >
                      {CYCLING_TEXTS[textIndex]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>

              <p className={`text-sm sm:text-base max-w-2xl mx-auto lg:mx-0 leading-relaxed ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                InternZen matches students with real internships based on their skills. See exactly what skills you need, learn what you're missing, and apply directly to top companies.
              </p>

              {/* Dual Action CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (currentUser) {
                      onExplorePortal('student');
                    } else {
                      onOpenAuth('signup', 'student');
                    }
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 min-h-[48px] rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-xl shadow-violet-500/25 ring-1 ring-violet-400/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.98]"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Find Internships</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (currentUser) {
                      onExplorePortal('recruiter');
                    } else {
                      onOpenAuth('signup', 'recruiter');
                    }
                  }}
                  className={`w-full sm:w-auto px-6 py-3.5 min-h-[48px] rounded-xl text-xs sm:text-sm font-bold border transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-sm active:scale-[0.98] ${
                    isDark 
                      ? 'bg-slate-900 hover:bg-slate-850 border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white' 
                      : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800 hover:text-slate-950'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-violet-500" />
                  <span>Post a Job / Hire Talent</span>
                </button>
              </div>

              {/* Trust Metric Micro Strip */}
              <div className={`pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-medium ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>100% Free for Students</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Verified Skill Matching</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-violet-500" />
                  <span>Direct Company Applications</span>
                </div>
              </div>
            </div>

            {/* Right Hero Interactive 3D/Floating Match Meter Card */}
            <div className="lg:col-span-5 flex justify-center">
              <motion.div
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
                animate={{
                  rotateX: tilt.y,
                  rotateY: tilt.x,
                  y: [0, -6, 0],
                }}
                transition={{
                  y: { repeat: Infinity, duration: 4.5, ease: 'easeInOut' },
                  rotateX: { type: 'spring', stiffness: 300, damping: 20 },
                  rotateY: { type: 'spring', stiffness: 300, damping: 20 },
                }}
                style={{ perspective: 1000 }}
                className={`w-full max-w-md rounded-3xl p-6 shadow-2xl relative overflow-hidden group cursor-pointer border transition-colors ${
                  isDark
                    ? 'bg-slate-900/90 border-slate-800 text-slate-100 backdrop-blur-xl'
                    : 'bg-white border-slate-200 text-slate-900 shadow-xl'
                }`}
              >
                {/* Glow badge overlay */}
                <div className="absolute -top-16 -right-16 w-36 h-36 bg-violet-600/20 blur-2xl rounded-full" />
                <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-emerald-600/20 blur-2xl rounded-full" />

                {/* Card Header: PhonePe live candidate preview */}
                <div className={`flex items-center justify-between pb-4 border-b relative z-10 ${
                  isDark ? 'border-slate-800/80' : 'border-slate-200'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-400 text-sm shadow-inner">
                      PP
                    </div>
                    <div>
                      <div className={`text-xs font-bold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        <span>PhonePe</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      </div>
                      <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Backend Systems Engineer</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-mono text-[10px] font-bold">
                      ₹1,00,000/mo
                    </span>
                  </div>
                </div>

                {/* Match Meter Score Indicator */}
                <div className="py-5 relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                      <span className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Linear Skill Match</span>
                    </div>
                    <span className="text-2xl font-black text-emerald-500 font-mono">94%</span>
                  </div>

                  {/* Progress gauge */}
                  <div className={`w-full h-3 rounded-full overflow-hidden p-0.5 border ${
                    isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
                  }`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '94%' }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full shadow-lg shadow-emerald-500/25"
                    />
                  </div>
                  <div className={`flex justify-between items-center text-[10px] mt-1 font-mono ${
                    isDark ? 'text-slate-500' : 'text-slate-500'
                  }`}>
                    <span>Threshold: 75%</span>
                    <span className="text-emerald-500 font-semibold">Unlocked for Instant Apply</span>
                  </div>
                </div>

                {/* Weighted Skill Rubrics */}
                <div className="space-y-2 relative z-10">
                  <div className={`text-[11px] font-bold uppercase tracking-wider flex items-center justify-between ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    <span>Validated Rubrics</span>
                    <span className={`text-[10px] font-normal font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Weight / Match</span>
                  </div>

                  {[
                    { name: 'Distributed Systems', weight: '35%', score: '100%', status: 'verified' },
                    { name: 'Go / Golang', weight: '25%', score: '100%', status: 'verified' },
                    { name: 'Redis & In-Memory Caching', weight: '20%', score: '100%', status: 'verified' },
                    { name: 'Docker & Kubernetes', weight: '20%', score: '70%', status: 'partial' },
                  ].map((sk) => (
                    <div
                      key={sk.name}
                      className={`flex items-center justify-between p-2 rounded-xl border text-xs ${
                        isDark
                          ? 'bg-slate-950/60 border-slate-800/80 text-slate-200'
                          : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{sk.name}</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>{sk.weight}</span>
                        <span className={`font-bold ${isDark ? 'text-emerald-300' : 'text-emerald-600'}`}>{sk.score}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Interactive CTA button on card */}
                <div className={`mt-4 pt-3 border-t flex items-center justify-between relative z-10 ${
                  isDark ? 'border-slate-800/80' : 'border-slate-200'
                }`}>
                  <span className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Ready for Direct Outreach</span>
                  <button
                    type="button"
                    onClick={() => onOpenAuth('signup', 'student')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1 cursor-pointer ${
                      isDark
                        ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/30'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white border-transparent shadow-sm'
                    }`}
                  >
                    <span>Instant Apply (Demo)</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* LIVE ECOSYSTEM TICKER SECTION */}
        <section id="ecosystem" className={`py-8 border-y backdrop-blur-md ${
          isDark ? 'border-slate-800/80 bg-slate-950/50' : 'border-slate-200 bg-white/70'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className={`p-4 rounded-2xl border shadow-sm ${
                isDark ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400 font-mono">
                  15+
                </div>
                <div className={`text-xs font-bold mt-1 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>Tier-1 Tech Giants</div>
                <div className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>PhonePe, CRED, Razorpay, Zerodha</div>
              </div>

              <div className={`p-4 rounded-2xl border shadow-sm ${
                isDark ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 font-mono">
                  500+
                </div>
                <div className={`text-xs font-bold mt-1 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>Verified Skill Rubrics</div>
                <div className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Cross-disciplinary weighted criteria</div>
              </div>

              <div className={`p-4 rounded-2xl border shadow-sm ${
                isDark ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 font-mono">
                  ₹45,000
                </div>
                <div className={`text-xs font-bold mt-1 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>Avg. Monthly Stipend</div>
                <div className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Transparent compensation disclosures</div>
              </div>

              <div className={`p-4 rounded-2xl border shadow-sm ${
                isDark ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-purple-400 font-mono">
                  0%
                </div>
                <div className={`text-xs font-bold mt-1 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>Resume Keyword Filtering</div>
                <div className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Transparent linear evaluation engine</div>
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE BENTO-GRID SECTION */}
        <section id="engine" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 shadow-inner border ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-sm'
            }`}>
              <Sliders className="w-3.5 h-3.5 text-violet-400" />
              <span>Interactive Architecture Bento</span>
            </div>
            <h2 className={`text-2xl sm:text-4xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              An Engine Built for Transparent Placement Success
            </h2>
            <p className={`text-xs sm:text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Explore the interactive components that bridge the chasm between student preparedness and corporate talent acquisition.
            </p>
          </div>

          {/* Bento Cards Container */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Skill Mirror Diagnostic (Interactive Slider) */}
            <div className={`rounded-3xl p-6 shadow-xl flex flex-col justify-between border ${
              isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-md'
            }`}>
              <div>
                <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-4">
                  <Sliders className="w-5 h-5" />
                </div>
                <h3 className={`text-base font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  1. Skill Mirror Diagnostic
                </h3>
                <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Drag the slider below to simulate real-time readiness calculation based on empirical requirement weights:
                </p>

                {/* Interactive Slider Widget */}
                <div className={`p-4 rounded-2xl border space-y-3 ${
                  isDark ? 'bg-slate-950 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex justify-between items-center text-xs">
                    <span className={isDark ? 'text-slate-300 font-semibold' : 'text-slate-700 font-semibold'}>
                      Simulated Readiness:
                    </span>
                    <span className="font-mono font-bold text-violet-500 text-sm">
                      {demoSkillProficiency}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={demoSkillProficiency}
                    onChange={(e) => setDemoSkillProficiency(Number(e.target.value))}
                    className={`w-full accent-violet-500 cursor-pointer h-2 rounded-lg ${
                      isDark ? 'bg-slate-800' : 'bg-slate-200'
                    }`}
                    aria-label="Simulate skill readiness"
                  />

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-slate-400">
                      {demoSkillProficiency >= 75 ? (
                        <span className="text-emerald-500 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Unlocked to Apply
                        </span>
                      ) : (
                        <span className="text-amber-500 font-semibold">
                          Gap: {75 - demoSkillProficiency}% needed
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Σ (w_i × p_i)</span>
                  </div>
                </div>
              </div>

              <div className={`mt-6 pt-4 border-t ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
                <button
                  type="button"
                  onClick={() => onOpenAuth('signup', 'student')}
                  className={`w-full py-2.5 min-h-[44px] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isDark 
                      ? 'text-violet-300 hover:text-white bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/30' 
                      : 'text-violet-700 hover:text-white bg-violet-50 hover:bg-violet-600 border border-violet-200'
                  }`}
                >
                  <span>Test on Real Profile</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 2: Instant Candidate Dispatch (Animated Interactive Pipeline) */}
            <div className={`rounded-3xl p-6 shadow-xl flex flex-col justify-between border ${
              isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-md'
            }`}>
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className={`text-base font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  2. Closed-Loop Dispatch
                </h3>
                <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Candidate verification dispatches straight into recruiter alerts without ATS middleman drop-offs.
                </p>

                {/* Simulation Widget */}
                <div className={`p-4 rounded-2xl border space-y-3 ${
                  isDark ? 'bg-slate-950 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between text-xs">
                    <span className={isDark ? 'text-slate-300 font-semibold' : 'text-slate-700 font-semibold'}>
                      Recruiter Alert Pipe:
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {simulationStep === 'idle' && 'Waiting'}
                      {simulationStep === 'dispatching' && 'Pinging Recruiter...'}
                      {simulationStep === 'delivered' && 'Alert Received! 🎯'}
                    </span>
                  </div>

                  <div className={`relative h-12 rounded-xl border flex items-center justify-around px-2 overflow-hidden ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}>
                    <div className={`flex items-center gap-1 text-[11px] ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      <GraduationCap className="w-4 h-4 text-violet-400" />
                      <span>Student</span>
                    </div>

                    <div className={`flex-1 mx-2 relative h-1 rounded-full overflow-hidden ${
                      isDark ? 'bg-slate-800' : 'bg-slate-200'
                    }`}>
                      {simulationStep !== 'idle' && (
                        <motion.div
                          initial={{ x: '-100%' }}
                          animate={{ x: '100%' }}
                          transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
                          className="h-full w-12 bg-gradient-to-r from-transparent via-violet-400 to-transparent"
                        />
                      )}
                    </div>

                    <div className={`flex items-center gap-1 text-[11px] ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      <Building2 className="w-4 h-4 text-emerald-500" />
                      <span>Recruiter</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRunSimulation}
                    disabled={simulationStep !== 'idle'}
                    className={`w-full py-2 min-h-[44px] rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
                      isDark 
                        ? 'bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border-indigo-500/30' 
                        : 'bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white border-indigo-200 shadow-sm'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Run Live Dispatch Simulation</span>
                  </button>
                </div>
              </div>

              <div className={`mt-6 pt-4 border-t ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
                <button
                  type="button"
                  onClick={() => onOpenAuth('signup', 'recruiter')}
                  className={`w-full py-2.5 min-h-[44px] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isDark
                      ? 'text-indigo-300 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30'
                      : 'text-indigo-700 hover:text-white bg-indigo-50 hover:bg-indigo-600 border border-indigo-200'
                  }`}
                >
                  <span>Recruiter Notification Hub</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 3: Curated 3-Track Remediation */}
            <div className={`rounded-3xl p-6 shadow-xl flex flex-col justify-between border ${
              isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-md'
            }`}>
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className={`text-base font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  3. 3-Track Remediation
                </h3>
                <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Every identified missing skill offers immediate learning options with instant match recalculation:
                </p>

                {/* 3 Tracks Preview Badges */}
                <div className="space-y-2">
                  <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                    isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Video Track</span>
                    </div>
                    <span className={`text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>FreeCodeCamp (2h 30m)</span>
                  </div>

                  <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                    isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-500" />
                      <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Interactive Track</span>
                    </div>
                    <span className={`text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Coursera Free Audit</span>
                  </div>

                  <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                    isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Documentation</span>
                    </div>
                    <span className={`text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Official Reference (45m)</span>
                  </div>
                </div>
              </div>

              <div className={`mt-6 pt-4 border-t ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
                <button
                  type="button"
                  onClick={() => onOpenAuth('signup', 'student')}
                  className={`w-full py-2.5 min-h-[44px] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isDark
                      ? 'text-emerald-300 hover:text-white bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30'
                      : 'text-emerald-700 hover:text-white bg-emerald-50 hover:bg-emerald-600 border border-emerald-200'
                  }`}
                >
                  <span>Explore Learning Hub</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* LIVE OPPORTUNITIES CAROUSEL / MINI FEED */}
        <section id="roles" className={`py-16 border-t ${
          isDark ? 'border-slate-800/80 bg-slate-950/40' : 'border-slate-200 bg-slate-100/50'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-2 shadow-inner border ${
                  isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-sm'
                }`}>
                  <Briefcase className="w-3.5 h-3.5 text-violet-400" />
                  <span>Featured Corporate Openings</span>
                </div>
                <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  High-Stipend Tier-1 Openings Live Now
                </h2>
                <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  100% validated skill weights with transparent monthly compensation.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onOpenAuth('signup', 'student')}
                className={`px-4 py-2.5 min-h-[44px] rounded-xl border text-xs font-bold transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer ${
                  isDark 
                    ? 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-violet-300 hover:text-white' 
                    : 'bg-white hover:bg-slate-50 border-slate-300 text-violet-700 hover:text-violet-900 shadow-sm'
                }`}
              >
                <span>View All 15+ Openings</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Featured Top 4 Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredJobs.map((job) => (
                <motion.div
                  key={job.id}
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  className={`rounded-2xl p-5 shadow-lg flex flex-col justify-between group transition-all border ${
                    isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-md'
                  }`}
                >
                  <div>
                    {/* Header: Company & Work Mode */}
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-sm text-violet-400 ${
                        isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
                      }`}>
                        {job.company.slice(0, 2).toUpperCase()}
                      </div>
                      <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${
                        isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                      }`}>
                        {job.workMode || 'Remote'}
                      </span>
                    </div>

                    <h3 className={`text-sm font-bold group-hover:text-violet-400 transition-colors line-clamp-1 ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {job.title}
                    </h3>
                    <div className={`text-xs mb-2 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{job.company}</div>

                    {/* Stipend & Time-Ago */}
                    <div className={`flex items-center justify-between text-xs py-2 border-y mb-3 ${
                      isDark ? 'border-slate-800/80' : 'border-slate-200'
                    }`}>
                      <span className="font-mono font-bold text-emerald-500">{job.stipend}</span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(job.createdAt)}
                      </span>
                    </div>

                    {/* Required Skills Chips */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {job.requirements.slice(0, 3).map((r) => (
                        <span
                          key={r.skillId}
                          className={`px-2 py-0.5 rounded-md border text-[10px] font-medium ${
                            isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                          }`}
                        >
                          {r.skillName} ({r.weight}%)
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Apply Trigger CTA */}
                  <button
                    type="button"
                    onClick={() => onOpenAuth('signup', 'student')}
                    className={`w-full py-2.5 min-h-[44px] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                      isDark 
                        ? 'bg-violet-600/15 hover:bg-violet-600 text-violet-300 hover:text-white border-violet-500/30' 
                        : 'bg-violet-50 hover:bg-violet-600 text-violet-700 hover:text-white border-violet-200 shadow-sm'
                    }`}
                  >
                    <span>Check Match & Apply</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Lock Overlay Banner */}
            <div className={`mt-8 p-6 rounded-2xl border text-center relative overflow-hidden ${
              isDark 
                ? 'bg-gradient-to-r from-violet-950/40 via-slate-900/90 to-indigo-950/40 border-violet-500/20' 
                : 'bg-white border-slate-200 shadow-md'
            }`}>
              <div className="max-w-xl mx-auto space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-400">
                  <Layers className="w-4 h-4" />
                  <span>11 More Live Opportunities Await</span>
                </div>
                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Unlock all 15+ Verified Openings with Instant Linear Diagnostics
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Join hundreds of campus applicants matching with high-stipend engineering roles today.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => onOpenAuth('signup', 'student')}
                    className="px-6 py-2.5 min-h-[44px] rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md shadow-violet-500/25 transition-all cursor-pointer"
                  >
                    Sign Up to Unlock Full Catalog
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TEAM ZENITH & CONTACT SECTION */}
        <section id="team-zenith" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className={`rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border ${
            isDark ? 'bg-slate-900/90 border-slate-800 backdrop-blur-xl' : 'bg-white border-slate-200 shadow-xl'
          }`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-xs font-bold text-violet-400">
                  <Award className="w-3.5 h-3.5 text-violet-400" />
                  <span>Official Platform Team</span>
                </div>

                <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Crafted by TEAM Zenith
                </h2>

                <p className={`text-xs sm:text-sm leading-relaxed max-w-2xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  InternZen is engineered to democratize campus placement intelligence. Have inquiries regarding corporate partnerships, university integrations, or technical verification? Our core engineering team is always ready to connect.
                </p>

                <div className={`flex flex-wrap items-center gap-4 pt-2 text-xs font-mono ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <a
                    href="mailto:akhilgondaliya.6312@gmail.com"
                    className={`px-3 py-1.5 min-h-[44px] rounded-xl border transition-all flex items-center gap-2 ${
                      isDark 
                        ? 'bg-slate-950 border-slate-800 hover:border-violet-500/50 hover:text-white' 
                        : 'bg-slate-50 border-slate-200 hover:border-violet-400 hover:text-slate-900'
                    }`}
                  >
                    <span>akhilgondaliya.6312@gmail.com</span>
                    <ExternalLink className="w-3 h-3 text-violet-400" />
                  </a>

                  <a
                    href="tel:+919316972573"
                    className={`px-3 py-1.5 min-h-[44px] rounded-xl border transition-all flex items-center gap-2 ${
                      isDark 
                        ? 'bg-slate-950 border-slate-800 hover:border-violet-500/50 hover:text-white' 
                        : 'bg-slate-50 border-slate-200 hover:border-violet-400 hover:text-slate-900'
                    }`}
                  >
                    <span>+91 9316972573</span>
                    <ExternalLink className="w-3 h-3 text-emerald-500" />
                  </a>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
                <button
                  type="button"
                  onClick={onOpenContact}
                  className="w-full py-3.5 min-h-[44px] rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/25 ring-1 ring-violet-400/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Open Contact Us Modal</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenAuth('signup', 'student')}
                  className={`w-full py-3.5 min-h-[44px] rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isDark 
                      ? 'bg-slate-950 hover:bg-slate-850 border-slate-800 text-slate-300 hover:text-white' 
                      : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800 hover:text-slate-950'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  <span>Create Free Account</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Public Footer */}
      <footer className={`relative z-10 border-t py-8 backdrop-blur-sm text-xs ${
        isDark ? 'border-slate-800/80 bg-slate-950/80 text-slate-500' : 'border-slate-200 bg-white text-slate-600'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>InternZen</span>
            <span>&bull;</span>
            <span>Internship & Job Portal by TEAM Zenith</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px] text-slate-400">
            <span>Skill Matching: <code className="text-violet-400">100% Verified</code></span>
            <span>&bull;</span>
            <button
              type="button"
              onClick={onOpenContact}
              className="text-violet-400 hover:text-violet-300 underline font-medium cursor-pointer"
            >
              Contact Support
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
