import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ToastContainer } from './components/ToastContainer';
import { PostJobModal } from './components/PostJobModal';
import { CandidateDetailModal } from './components/CandidateDetailModal';
import { StudentView } from './views/StudentView';
import { RecruiterView } from './views/RecruiterView';
import { TpoView } from './views/TpoView';

const DashboardContent: React.FC = () => {
  const { activeRole, activeNavTab, setActiveNavTab, curriculumGaps, jobOpenings, addToast } = useApp();

  // If user clicked on a secondary nav tab, render a focused modal/view or the primary role dashboard
  const renderTabContent = () => {
    if (activeNavTab === 'dashboard' || activeNavTab === 'skill-mirror') {
      if (activeRole === 'student') return <StudentView />;
      if (activeRole === 'recruiter') return <RecruiterView />;
      return <TpoView />;
    }

    if (activeNavTab === 'job-feed') {
      return (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans']">
                Active Internship Openings Feed
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Curated opportunities matched against your verified skills
              </p>
            </div>
            <button
              onClick={() => setActiveNavTab('dashboard')}
              className="text-xs text-emerald-400 hover:underline font-semibold"
            >
              &larr; Back to Dashboard
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {jobOpenings.map((job) => (
              <div key={job.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 hover:border-slate-700 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold font-mono">
                      {job.company.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{job.title}</h3>
                      <p className="text-xs text-slate-400">{job.company} • {job.location}</p>
                    </div>
                  </div>
                </div>

                <div className="text-xs font-mono text-emerald-400 font-bold">
                  {job.stipend}
                </div>

                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-mono font-bold mb-1.5">Required Skills:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {job.requiredSkills.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-mono">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-mono text-[11px]">{job.postedDate}</span>
                  <button
                    onClick={() => addToast('Application Sent', `Applied to ${job.title} @ ${job.company}`, 'success')}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-md shadow-emerald-600/20 active:scale-95"
                  >
                    1-Click Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeNavTab === 'workshops') {
      return (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans']">
                Campus Remedial & Industry Workshops
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Specialized training sessions scheduled to resolve hiring deficits
              </p>
            </div>
            <button
              onClick={() => setActiveNavTab('dashboard')}
              className="text-xs text-emerald-400 hover:underline font-semibold"
            >
              &larr; Back to Dashboard
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {curriculumGaps.map((gap) => (
              <div key={gap.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-start justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase ${
                    gap.remedialScheduled ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {gap.remedialScheduled ? 'Confirmed Lab' : 'Proposed Intervention'}
                  </span>
                  <span className="text-xs text-rose-400 font-mono font-bold">
                    {gap.gapPercentage}% Deficit
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white">
                  {gap.workshopTitle || `Hands-On Industry Mastery: ${gap.skillName}`}
                </h3>
                <p className="text-xs text-slate-400">
                  Target: {gap.affectedGroup} • {gap.department}
                </p>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">
                    {gap.scheduledDate || 'Date: Scheduling in progress'}
                  </span>
                  <button
                    onClick={() => addToast('Enrolled in Workshop', `Registered for ${gap.skillName} lab.`, 'success')}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all"
                  >
                    RSVP Workshop
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeNavTab === 'analytics') {
      return (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans']">
                Macro Talent Placement Intelligence
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Aggregated analytics across industry demand and institutional benchmarks
              </p>
            </div>
            <button
              onClick={() => setActiveNavTab('dashboard')}
              className="text-xs text-emerald-400 hover:underline font-semibold"
            >
              &larr; Back to Dashboard
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400 font-mono">PLACEMENTS VELOCITY</div>
              <div className="text-3xl font-extrabold text-white mt-1">84.2%</div>
              <p className="text-xs text-emerald-400 mt-1">+12% over last academic year</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400 font-mono">VISITING TECH RECRUITERS</div>
              <div className="text-3xl font-extrabold text-indigo-400 mt-1">48</div>
              <p className="text-xs text-slate-400 mt-1">PhonePe, Zerodha, Swiggy, CRED</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400 font-mono">AVERAGE STIPEND</div>
              <div className="text-3xl font-extrabold text-emerald-400 mt-1">₹42,500</div>
              <p className="text-xs text-slate-400 mt-1">For 6-month pre-placement offers</p>
            </div>
          </div>
        </div>
      );
    }

    if (activeNavTab === 'settings') {
      return (
        <div className="max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 animate-in fade-in duration-200">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white font-['Plus_Jakarta_Sans']">
              System & Matching Engine Settings
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Configure matching weights, GitHub sync intervals, and notification preferences
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <div className="font-bold text-white">Live GitHub Verification Engine</div>
                <div className="text-slate-400">Scan public commit history for genuine framework mastery</div>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-emerald-500 rounded" />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <div className="font-bold text-white">Recruiter 1-Click Fast Track</div>
                <div className="text-slate-400">Automatically bypass initial recruiter screening for &gt;85% matches</div>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-emerald-500 rounded" />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <div className="font-bold text-white">Departmental Gap Alerts</div>
                <div className="text-slate-400">Trigger alerts to HOD when a deficit exceeds 50% threshold</div>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-emerald-500 rounded" />
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 min-h-screen">
      <Header />
      <main className="flex-1 p-6 md:p-8 max-w-[1440px] w-full mx-auto space-y-8">
        {renderTabContent()}
      </main>
      
      {/* Modals & Toasts */}
      <PostJobModal />
      <CandidateDetailModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-[#030712] text-slate-100 flex font-['Plus_Jakarta_Sans'] antialiased">
        <Sidebar />
        <DashboardContent />
      </div>
    </AppProvider>
  );
}
