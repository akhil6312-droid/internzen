import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Search, 
  Check, 
  Plus, 
  ArrowRight, 
  ArrowLeft, 
  Cpu, 
  Code2, 
  Wrench, 
  GraduationCap, 
  TrendingUp, 
  CheckCircle2 
} from 'lucide-react';
import { SkillDomain, StudentSkill } from '../../types';
import { ALL_SKILLS } from '../../data/seed';
import { InfoButton } from '../common/InfoButton';

interface MultiSkillDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentSkills: StudentSkill[];
  onAddSkills: (skillsToAdd: { id: string; name: string; domain?: SkillDomain }[]) => void;
}

const DOMAIN_OPTIONS: {
  id: SkillDomain;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}[] = [
  {
    id: 'software',
    title: 'Software, Data & Cloud',
    subtitle: 'Python, SQL, React, Node.js, Docker, AI/ML',
    icon: Code2,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10 border-indigo-500/30',
  },
  {
    id: 'mechanical',
    title: 'Mechanical & CAD Design',
    subtitle: 'SolidWorks, CATIA, FEA, Thermodynamics, GD&T',
    icon: Wrench,
    color: 'text-sky-400',
    bg: 'bg-sky-500/10 border-sky-500/30',
  },
  {
    id: 'teaching',
    title: 'Education & Pedagogy',
    subtitle: 'Curriculum Design, Teaching, Mentorship, EdTech',
    icon: GraduationCap,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/30',
  },
  {
    id: 'electrical',
    title: 'Electronics & Embedded IoT',
    subtitle: 'Embedded C, PCB Design, Arduino, Circuit Analysis',
    icon: Cpu,
    color: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/30',
  },
  {
    id: 'business',
    title: 'Business, Finance & Strategy',
    subtitle: 'Financial Modeling, Valuation, Excel, Market Research',
    icon: TrendingUp,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/30',
  },
];

export const MultiSkillDrawer: React.FC<MultiSkillDrawerProps> = ({
  isOpen,
  onClose,
  currentSkills,
  onAddSkills,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedDomains, setSelectedDomains] = useState<SkillDomain[]>(['software', 'mechanical']);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([]);

  if (!isOpen) return null;

  const currentSkillSet = new Set(
    currentSkills
      .filter((s) => s.proficiencyScore > 0)
      .map((s) => s.skillId.toLowerCase())
  );

  // Toggle domain in Step 1
  const toggleDomain = (domainId: SkillDomain) => {
    if (selectedDomains.includes(domainId)) {
      if (selectedDomains.length > 1) {
        setSelectedDomains(selectedDomains.filter((d) => d !== domainId));
      }
    } else {
      setSelectedDomains([...selectedDomains, domainId]);
    }
  };

  // Filter catalog skills by selected domains and search query
  const availableSkills = ALL_SKILLS.filter((skill) => {
    const sName = skill.name || (skill as unknown as { skillName?: string }).skillName || '';
    const sCat = skill.category || '';
    const inDomain = selectedDomains.includes(skill.domain) || skill.domain === 'soft_skill';
    const matchesSearch =
      sName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sCat.toLowerCase().includes(searchQuery.toLowerCase());
    return inDomain && matchesSearch;
  });

  // Toggle individual skill selection
  const toggleSkillSelect = (skillId: string) => {
    if (selectedSkillIds.includes(skillId)) {
      setSelectedSkillIds(selectedSkillIds.filter((id) => id !== skillId));
    } else {
      setSelectedSkillIds([...selectedSkillIds, skillId]);
    }
  };

  // Select all visible skills that aren't already possessed
  const handleSelectAllVisible = () => {
    const unpossessedVisible = availableSkills
      .filter((s) => !currentSkillSet.has(s.id.toLowerCase()))
      .map((s) => s.id);
    setSelectedSkillIds(Array.from(new Set([...selectedSkillIds, ...unpossessedVisible])));
  };

  // Submit batch add
  const handleBatchAdd = () => {
    const toAdd = ALL_SKILLS.filter((s) => selectedSkillIds.includes(s.id)).map((s) => ({
      id: s.id,
      name: s.name || (s as unknown as { skillName?: string }).skillName || 'Skill',
      domain: s.domain,
    }));

    if (toAdd.length > 0) {
      onAddSkills(toAdd);
      setSelectedSkillIds([]);
      onClose();
      setStep(1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative z-10 w-full max-w-xl bg-slate-900 border-l border-slate-800 h-full shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Drawer Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 backdrop-blur-md sticky top-0 z-20">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                Step {step} of 2
              </span>
              <span className="text-xs text-slate-400">
                {step === 1 ? 'Select Your Domains' : 'Choose Skills & Competencies'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">
                {step === 1 ? 'Select Fields of Expertise' : 'Multi-Skill Portfolio Catalog'}
              </h2>
              <InfoButton
                title="Cross-Disciplinary Catalog"
                description="Browse competencies across Software, Mechanical Design, Teaching, Core Electronics, and Business. Selected skills are added directly to your profile and immediately factor into job match scores."
                rationale="Supports students seeking multi-disciplinary or core engineering placement opportunities."
              />
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body with 2-Step Flow */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              /* STEP 1: Domain Selection */
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  Choose one or more domains. InternZen supports cross-disciplinary careers in Software, Mechanical Engineering, Education, Core Electronics, and Finance.
                </div>

                <div className="space-y-2.5">
                  {DOMAIN_OPTIONS.map((domain) => {
                    const isSelected = selectedDomains.includes(domain.id);
                    const Icon = domain.icon;

                    return (
                      <div
                        key={domain.id}
                        onClick={() => toggleDomain(domain.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-slate-850 border-violet-500 shadow-md shadow-violet-500/10 ring-1 ring-violet-500/30'
                            : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div className={`p-3 rounded-xl border ${domain.bg}`}>
                            <Icon className={`w-5 h-5 ${domain.color}`} />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white">{domain.title}</h4>
                            <p className="text-xs text-slate-400 mt-0.5">{domain.subtitle}</p>
                          </div>
                        </div>

                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                            isSelected
                              ? 'bg-violet-600 border-violet-500 text-white'
                              : 'border-slate-700 bg-slate-900'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              /* STEP 2: Skill Catalog */
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Search Bar & Quick Select */}
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search skills across selected domains..."
                      className="w-full pl-10 pr-4 py-2.5 min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                      autoFocus
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                    <span>
                      Showing {availableSkills.length} skills in {selectedDomains.length} fields
                    </span>
                    <button
                      type="button"
                      onClick={handleSelectAllVisible}
                      className="text-violet-400 hover:text-violet-300 font-semibold p-2 min-h-[44px] flex items-center"
                    >
                      Select All Unpossessed
                    </button>
                  </div>
                </div>

                {/* Skill Items List */}
                <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
                  {availableSkills.map((skill) => {
                    const isAlreadyPossessed = currentSkillSet.has(skill.id.toLowerCase());
                    const isSelected = selectedSkillIds.includes(skill.id);

                    return (
                      <div
                        key={skill.id}
                        onClick={() => !isAlreadyPossessed && toggleSkillSelect(skill.id)}
                        className={`p-3 min-h-[44px] rounded-xl border flex items-center justify-between transition-all ${
                          isAlreadyPossessed
                            ? 'bg-slate-950/40 border-slate-800/60 opacity-60 cursor-not-allowed'
                            : isSelected
                            ? 'bg-slate-800 border-violet-500 shadow-sm cursor-pointer'
                            : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 cursor-pointer'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{skill.name}</span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
                              {skill.domain}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 capitalize">
                            Type: {skill.category.replace('_', ' ')}
                          </span>
                        </div>

                        {isAlreadyPossessed ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Possessed</span>
                          </span>
                        ) : (
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                              isSelected
                                ? 'bg-violet-600 border-violet-500 text-white'
                                : 'border-slate-700 bg-slate-900'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Drawer Sticky Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900/95 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {step === 1 ? (
            <>
              <div className="text-xs text-slate-400">
                <strong className="text-white">{selectedDomains.length}</strong> fields selected
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={selectedDomains.length === 0}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/25 transition-all"
              >
                <span>Continue to Skill Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change Domains</span>
              </button>

              <button
                type="button"
                onClick={handleBatchAdd}
                disabled={selectedSkillIds.length === 0}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl text-xs font-bold transition-all shadow-md ${
                  selectedSkillIds.length > 0
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/25 ring-1 ring-emerald-400/40 cursor-pointer'
                    : 'bg-slate-800 text-slate-500 border border-slate-800 cursor-not-allowed'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Add {selectedSkillIds.length} Selected Skills</span>
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
