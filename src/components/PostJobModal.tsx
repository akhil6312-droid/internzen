import React, { useState } from 'react';
import { X, Plus, Sparkles, Building, MapPin, DollarSign, Tag } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PostJobModal: React.FC = () => {
  const { isPostJobModalOpen, setIsPostJobModalOpen, addNewJobOpening } = useApp();

  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('PhonePe');
  const [stipend, setStipend] = useState('₹45,000 / month');
  const [location, setLocation] = useState('Bangalore (Hybrid)');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>(['React', 'Node.js', 'PostgreSQL', 'Docker']);

  if (!isPostJobModalOpen) return null;

  const popularSkills = ['React', 'Node.js', 'TypeScript', 'Docker', 'PostgreSQL', 'Redis', 'Kubernetes', 'Go', 'AWS', 'Kafka'];

  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills(prev => [...prev, trimmed]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(prev => prev.filter(s => s !== skillToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addNewJobOpening({
      title: title.trim(),
      company: company.trim(),
      stipend: stipend.trim(),
      location: location.trim(),
      requiredSkills: skills
    });

    setTitle('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Post New Internship Opening</h3>
              <p className="text-[11px] text-slate-400">Broadcast role and auto-calculate student match scores</p>
            </div>
          </div>
          <button
            onClick={() => setIsPostJobModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Role Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Distributed Systems Intern"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center space-x-1">
                <Building className="w-3 h-3 text-slate-400" />
                <span>Hiring Company</span>
              </label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center space-x-1">
                <DollarSign className="w-3 h-3 text-slate-400" />
                <span>Monthly Stipend</span>
              </label>
              <input
                type="text"
                value={stipend}
                onChange={(e) => setStipend(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>Location / Work Model</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
            />
          </div>

          {/* Taggable Skill Chips */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center space-x-1">
                <Tag className="w-3 h-3 text-slate-400" />
                <span>Required Skill Tags ({skills.length})</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Used for rubric matching</span>
            </label>

            {/* Selected Chips */}
            <div className="flex flex-wrap gap-1.5 mb-2 min-h-[32px] p-2 rounded-xl bg-slate-950/80 border border-slate-800">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-medium"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-red-400 p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {skills.length === 0 && (
                <span className="text-xs text-slate-500 italic">No skills tagged yet.</span>
              )}
            </div>

            {/* Input to add custom skill */}
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Type custom skill and press add..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill(skillInput);
                  }
                }}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => handleAddSkill(skillInput)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
              >
                Add
              </button>
            </div>

            {/* Quick suggested chips */}
            <div className="mt-2 flex flex-wrap gap-1 items-center">
              <span className="text-[10px] text-slate-500 font-mono mr-1">Quick add:</span>
              {popularSkills.filter(s => !skills.includes(s)).slice(0, 6).map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => handleAddSkill(s)}
                  className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsPostJobModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
            >
              Publish & Auto-Match Candidates
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
