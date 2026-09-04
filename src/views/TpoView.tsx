import React from 'react';
import { 
  BarChart3, 
  AlertTriangle, 
  Calendar, 
  CheckCircle2, 
  GraduationCap, 
  Users, 
  TrendingUp, 
  ArrowRight,
  Sparkles,
  Building,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TpoView: React.FC = () => {
  const { curriculumGaps, triggerRemedialTraining, addToast } = useApp();

  const totalGapsCount = curriculumGaps.length;
  const scheduledCount = curriculumGaps.filter(g => g.remedialScheduled).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* ========================================================
          TPO HEADER & MACRO STATS
         ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <h2 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans'] tracking-tight">
              College TPO & Placement Health Command Center
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Institutional Diagnostic Engine • Monitoring <strong className="text-white">1,240 Pre-Final & Final Year Candidates</strong> against 2026 recruiter rubrics
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-mono">ACCREDITATION CYCLE:</span>
          <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold font-mono">
            NAAC A++ / NIRF '26
          </span>
        </div>
      </div>

      {/* TPO Top Metrics Row */}
      <section className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase">
            <span>Cohort Size</span>
            <Users className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-1">1,240</div>
          <div className="text-[11px] text-slate-400 mt-0.5">CS, IT, & Data Science</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase">
            <span>Avg Readiness</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">78.4%</div>
          <div className="text-[11px] text-emerald-500/90 mt-0.5">+4.2% post-remedial labs</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase">
            <span>Critical Gaps</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-extrabold text-rose-400 mt-1">
            {curriculumGaps.filter(g => g.industryDemand === 'Critical').length} Skills
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Impacting Tier-1 Placements</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase">
            <span>Active Remedials</span>
            <Calendar className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-indigo-400 mt-1">
            {scheduledCount} of {totalGapsCount}
          </div>
          <div className="text-[11px] text-indigo-400/90 mt-0.5">Workshops Authorized</div>
        </div>
      </section>

      {/* ========================================================
          1. MACRO PLACEMENT HEALTH ANALYTICS (BAR CHART)
         ======================================================== */}
      <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-bold text-white font-['Plus_Jakarta_Sans']">
                Top Curriculum Gaps vs. Industry Demand
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Empirical variance between departmental syllabus outcomes and hiring rubrics of visiting tech recruiters
            </p>
          </div>

          <div className="flex items-center space-x-3 text-[11px] font-mono">
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
              <span className="text-slate-300">Critical (&gt;50% Deficit)</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500" />
              <span className="text-slate-300">High Demand</span>
            </span>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="space-y-4">
          {curriculumGaps.map((gap) => {
            const isCritical = gap.gapPercentage >= 50;
            return (
              <div key={gap.id} className="space-y-1.5 group">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-200 group-hover:text-white transition-colors">
                      {gap.skillName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      • {gap.affectedGroup}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                      gap.industryDemand === 'Critical' 
                        ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30' 
                        : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30'
                    }`}>
                      {gap.industryDemand} Demand
                    </span>
                    <span className="font-extrabold font-mono text-sm text-white w-14 text-right">
                      {gap.gapPercentage}%
                    </span>
                  </div>
                </div>

                {/* Bar */}
                <div className="h-4 rounded-full bg-slate-950 p-0.5 border border-slate-800 overflow-hidden relative">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out shadow-sm ${
                      isCritical
                        ? 'bg-gradient-to-r from-rose-600 via-pink-500 to-amber-500 shadow-rose-500/20'
                        : 'bg-gradient-to-r from-indigo-600 to-cyan-500 shadow-indigo-500/20'
                    }`}
                    style={{ width: `${gap.gapPercentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-0.5">
                  <span>{gap.studentsCount} students lack verified production mastery</span>
                  {gap.remedialScheduled && (
                    <span className="text-emerald-400 flex items-center">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Intervention Scheduled: {gap.scheduledDate}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          2. ACTIONABLE INTERVENTION PANEL (DEPARTMENT TABLE)
         ======================================================== */}
      <section className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white font-['Plus_Jakarta_Sans']">
                Actionable Departmental Intervention Panel
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Directly authorize hands-on remedial labs with visiting engineers to eliminate placement gating deficits
            </p>
          </div>

          <span className="text-xs text-slate-400 font-mono">
            Pending Interventions: <strong className="text-amber-400">{curriculumGaps.filter(g => !g.remedialScheduled).length}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              <tr>
                <th className="py-3 px-5">Academic Department</th>
                <th className="py-3 px-5">Curriculum Deficit</th>
                <th className="py-3 px-5">Deficit %</th>
                <th className="py-3 px-5">Impacted Students</th>
                <th className="py-3 px-5">Remedial Status</th>
                <th className="py-3 px-5 text-right">Intervention Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {curriculumGaps.map((gap) => (
                <tr key={gap.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center space-x-2">
                      <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-semibold text-white">{gap.department}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-5">
                    <span className="font-bold text-slate-200">{gap.skillName}</span>
                    <span className={`block text-[10px] uppercase font-mono ${
                      gap.industryDemand === 'Critical' ? 'text-rose-400' : 'text-indigo-400'
                    }`}>
                      {gap.industryDemand} Recruiter Requirement
                    </span>
                  </td>

                  <td className="py-3.5 px-5">
                    <span className="font-mono font-bold text-rose-400">
                      {gap.gapPercentage}%
                    </span>
                  </td>

                  <td className="py-3.5 px-5 font-mono text-slate-300">
                    {gap.studentsCount} Students
                  </td>

                  <td className="py-3.5 px-5">
                    {gap.remedialScheduled ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Workshop Scheduled
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Needs Remediation
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={() => triggerRemedialTraining(gap.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                        gap.remedialScheduled
                          ? 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-rose-400'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20 active:scale-95'
                      }`}
                    >
                      {gap.remedialScheduled ? 'Cancel Lab' : 'Trigger Remedial Training'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
};
