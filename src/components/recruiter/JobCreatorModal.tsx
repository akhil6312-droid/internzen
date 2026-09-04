import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle
} from 'lucide-react';
import { Job, JobRequirement } from '../../types';
import { ALL_SKILLS } from '../../data/seed';
import { validateRequirementsTotal } from '../../engine/matching';
import { InfoButton } from '../common/InfoButton';

interface JobCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveJob: (newJob: Job) => void;
}

export const JobCreatorModal: React.FC<JobCreatorModalProps> = ({
  isOpen,
  onClose,
  onSaveJob,
}) => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [stipend, setStipend] = useState('₹25,000 / month');
  const [location, setLocation] = useState('Remote / Hybrid');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState<JobRequirement[]>([
    { skillId: 'sk-py', skillName: 'Python', weight: 40 },
    { skillId: 'sk-sql', skillName: 'SQL', weight: 30 },
    { skillId: 'sk-docker', skillName: 'Docker', weight: 30 },
  ]);

  const [domain, setDomain] = useState<'software' | 'mechanical' | 'teaching' | 'electrical' | 'business'>('software');
  const [selectedCatalogSkill, setSelectedCatalogSkill] = useState(ALL_SKILLS[0].id);

  if (!isOpen) return null;

  const validation = validateRequirementsTotal(requirements);

  const handleWeightChange = (index: number, newWeight: number) => {
    const updated = [...requirements];
    updated[index].weight = Math.max(0, Math.min(100, Math.round(newWeight) || 0));
    setRequirements(updated);
  };

  const handleRemoveRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const handleAddRequirement = () => {
    const catalogItem = ALL_SKILLS.find((s) => s.id === selectedCatalogSkill);
    if (!catalogItem) return;

    if (requirements.some((r) => r.skillId === catalogItem.id)) {
      return; // Already added
    }

    // Default to remaining weight if positive, else 10
    const defaultWeight = validation.difference > 0 ? validation.difference : 10;
    setRequirements([
      ...requirements,
      { skillId: catalogItem.id, skillName: catalogItem.name, weight: defaultWeight, domain: catalogItem.domain },
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validation.isValid || !title.trim() || !company.trim()) return;

    const newJob: Job = {
      id: `job-${Date.now()}`,
      title: title.trim(),
      company: company.trim(),
      stipend: stipend.trim(),
      location: location.trim(),
      description: description.trim() || 'Opportunity created via Recruiter Intelligence Studio.',
      requirements,
      domain,
      logoType: company.toLowerCase().replace(/\s+/g, ''),
      brandColor: domain === 'software' ? '#8b5cf6' : domain === 'mechanical' ? '#0284c7' : domain === 'teaching' ? '#ea580c' : domain === 'electrical' ? '#dc2626' : '#0ea5e9',
    };

    onSaveJob(newJob);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl shadow-black/80 overflow-hidden"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900 sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Post Skill-First Internship
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Define deterministic skill weights. Must sum to exactly 100%.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Job Basics */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              1. Role Metadata
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Job Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Data Analyst Intern"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TechNova"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Monthly Stipend
                </label>
                <input
                  type="text"
                  value={stipend}
                  onChange={(e) => setStipend(e.target.value)}
                  placeholder="e.g. ₹25,000 / month"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Location & Work Mode
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Bengaluru / Hybrid"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Engineering / Career Discipline
                </label>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
                >
                  <option value="software">Software, Data & Cloud</option>
                  <option value="mechanical">Mechanical & CAD Design</option>
                  <option value="teaching">Education & Pedagogy</option>
                  <option value="electrical">Electronics & Embedded IoT</option>
                  <option value="business">Business & Financial Risk</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Brief Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Key deliverables, responsibilities, and team overview..."
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 resize-none"
              />
            </div>
          </div>

          {/* Dynamic Skill Weight Allocator */}
          <div className="space-y-4 pt-2 border-t border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    2. Dynamic Skill Weight Allocator
                  </h3>
                  <InfoButton
                    title="100% Weight Conservation Rule"
                    description="Every role's skill requirement weights must sum to exactly 100%. This ensures mathematical normalization so applicant scores across different openings are directly comparable."
                    rationale="Prevents arbitrary grade inflation and establishes a consistent 0-100% candidate qualification scale."
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Assign percentage weights. InternZen requires exact 100% allocation for deterministic scoring.
                </p>
              </div>

              {/* Real-Time Total Weight Validator Badge */}
              <div className="shrink-0">
                {validation.isValid ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Valid: 100% Allocated
                  </span>
                ) : validation.total < 100 ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Remaining: {validation.difference}% needed
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Excess: +{Math.abs(validation.difference)}% over limit
                  </span>
                )}
              </div>
            </div>

            {/* Visual Sum Progress Bar */}
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className={`h-full transition-all duration-300 ${
                  validation.isValid
                    ? 'bg-emerald-500'
                    : validation.total < 100
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(100, validation.total)}%` }}
              />
            </div>

            {/* List of Requirement Sliders */}
            <div className="space-y-2.5">
              {requirements.map((req, index) => (
                <div
                  key={req.skillId}
                  className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-3"
                >
                  <div className="w-32 sm:w-36 font-semibold text-xs text-white truncate">
                    {req.skillName}
                  </div>

                  <input
                    type="range"
                    min="5"
                    max="80"
                    step="5"
                    value={req.weight}
                    onChange={(e) => handleWeightChange(index, Number(e.target.value))}
                    className="flex-1 accent-violet-500 cursor-pointer"
                  />

                  <div className="flex items-center gap-1 w-20 justify-end">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={req.weight}
                      onChange={(e) => handleWeightChange(index, Number(e.target.value))}
                      className="w-14 px-2 py-1 text-right bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono font-bold text-white focus:outline-none focus:border-violet-500"
                    />
                    <span className="text-xs text-slate-400 font-mono">%</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveRequirement(index)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition-colors"
                    title="Remove requirement"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Skill to Opening */}
            <div className="flex items-center gap-2 pt-2">
              <select
                value={selectedCatalogSkill}
                onChange={(e) => setSelectedCatalogSkill(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
              >
                {ALL_SKILLS.map((skill) => (
                  <option key={skill.id} value={skill.id}>
                    {skill.name} ({skill.category})
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleAddRequirement}
                className="flex items-center gap-1 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold transition-colors border border-slate-700"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Skill</span>
              </button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!validation.isValid || !title.trim() || !company.trim()}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                validation.isValid && title.trim() && company.trim()
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-violet-500/25 cursor-pointer ring-1 ring-violet-400/40'
                  : 'bg-slate-800 text-slate-500 border border-slate-800 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Publish Opening (100% Validated)</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
