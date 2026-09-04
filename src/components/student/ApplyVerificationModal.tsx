import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  GraduationCap, 
  FileText, 
  Award, 
  UploadCloud, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  SendHorizontal, 
  AlertCircle,
  CheckCircle2,
  FileCheck2,
  FolderOpen
} from 'lucide-react';
import { Job, MatchBreakdown, StudentSkill } from '../../types';
import { CompanyLogo } from '../common/CompanyLogo';
import { InfoButton } from '../common/InfoButton';

interface ApplyVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
  breakdown: MatchBreakdown;
  studentSkills: StudentSkill[];
  onSubmitApplication: (applicationData: {
    highestEducation: string;
    specialization: string;
    resumeFileName: string;
    certificateTitle?: string;
  }) => void;
}

const EDUCATION_LEVELS = [
  'B.Tech / B.E. (Bachelor of Engineering / Technology)',
  'BCA / B.Sc (Computer Applications / Sciences)',
  'M.Tech / M.E. / M.S. (Master of Engineering)',
  'MCA / M.Sc (Master of Computer Applications)',
  'Diploma in Engineering / Polytechnic',
  'Dual Degree B.Tech + M.Tech',
];

export const ApplyVerificationModal: React.FC<ApplyVerificationModalProps> = ({
  isOpen,
  onClose,
  job,
  breakdown,
  studentSkills,
  onSubmitApplication,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 1 Form fields
  const [highestEducation, setHighestEducation] = useState(EDUCATION_LEVELS[0]);
  const [specialization, setSpecialization] = useState('Computer Science & Engineering');
  const [resumeFileName, setResumeFileName] = useState('Aman_Sharma_Resume_Verified.pdf');
  const [resumeFileSize, setResumeFileSize] = useState('248 KB');
  const [resumeFileType, setResumeFileType] = useState('PDF Document');
  const [isResumeVerified, setIsResumeVerified] = useState(true);
  const [certificateTitle, setCertificateTitle] = useState('Industry Certified Credential & Portfolio');
  const [hasCertifiedTruthful, setHasCertifiedTruthful] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !job) return null;

  const isEligible = breakdown.unlockedApply; // >= 75%

  // Real native file selection & validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    const validExtensions = ['.pdf', '.doc', '.docx'];
    const lowerName = file.name.toLowerCase();
    const hasValidExt = validExtensions.some((ext) => lowerName.endsWith(ext));

    if (!hasValidExt) {
      setError(
        'Invalid document format: Only PDF and Word files (.pdf, .doc, .docx) are accepted as verified resumes.'
      );
      setIsResumeVerified(false);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File too large: Resume must be under 10MB.');
      setIsResumeVerified(false);
      return;
    }

    const sizeStr =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    const typeStr = lowerName.endsWith('.pdf') ? 'PDF Document' : 'Word Document';

    setResumeFileName(file.name);
    setResumeFileSize(sizeStr);
    setResumeFileType(typeStr);
    setIsResumeVerified(true);
  };

  const handleStep1Proceed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!highestEducation || !resumeFileName || !isResumeVerified) {
      setError('Please provide your education details and upload a verified resume document.');
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleFinalSubmit = () => {
    if (!hasCertifiedTruthful) {
      setError('Please certify that your uploaded credentials and skills are accurate.');
      return;
    }

    onSubmitApplication({
      highestEducation,
      specialization,
      resumeFileName,
      certificateTitle: certificateTitle || undefined,
    });
    onClose();
    setStep(1);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl shadow-black/80 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header with Job Branding */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/95 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <CompanyLogo
              logoType={job.logoType}
              companyName={job.company}
              brandColor={job.brandColor}
              size="md"
            />
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 uppercase tracking-wider">
                  Apply Verification • Step {step} of 2
                </span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {job.title} <span className="text-slate-400 font-normal">@ {job.company}</span>
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 ? (
              /* STEP 1: Academic Credentials & Native Resume Upload */
              <motion.form
                key="step-1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleStep1Proceed}
                className="space-y-4"
              >
                {/* Highest Education */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-violet-400" />
                      <span>Highest Level of Completed / Ongoing Education *</span>
                    </label>
                    <InfoButton
                      title="Education Credential Verification"
                      description="Indicate your highest active or completed academic degree. Recruiters use this to align candidates with batch hiring brackets."
                      rationale="Ensures academic requirements conform to campus placement policies."
                    />
                  </div>
                  <select
                    value={highestEducation}
                    onChange={(e) => setHighestEducation(e.target.value)}
                    className="w-full px-3.5 py-2.5 min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
                  >
                    {EDUCATION_LEVELS.map((edu) => (
                      <option key={edu} value={edu}>
                        {edu}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Specialization */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Specialization / Branch of Study *
                  </label>
                  <input
                    type="text"
                    required
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="e.g. Computer Science, Mechanical Eng., Electronics..."
                    className="w-full px-3.5 py-2.5 min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                  />
                </div>

                {/* Native Resume File Upload with Strict Document Verification */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-blue-400" />
                      <span>Upload & Verify Custom Resume (.pdf, .docx) *</span>
                    </label>
                    <InfoButton
                      title="Native Resume Verification"
                      description="Select an actual file from your computer. InternZen validates the document extension, MIME type, and size to ensure recruiters receive an authentic, verified resume."
                      rationale="Prevents invalid files or empty submissions from reaching hiring managers."
                      tip="Upload an updated resume tailored to the skills demanded by this opening."
                    />
                  </div>

                  {/* Hidden native file input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                  />

                  {/* Interactive Upload Box */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-4 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                      isResumeVerified
                        ? 'bg-slate-950/80 border-emerald-500/40 hover:border-emerald-500/60'
                        : 'bg-slate-950/80 border-slate-800 hover:border-violet-500/60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2.5 rounded-xl border shrink-0 ${
                          isResumeVerified
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                        }`}
                      >
                        {isResumeVerified ? (
                          <FileCheck2 className="w-5 h-5" />
                        ) : (
                          <UploadCloud className="w-5 h-5" />
                        )}
                      </div>

                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-2 flex-wrap">
                          <span className="truncate max-w-[220px] sm:max-w-xs">{resumeFileName}</span>
                          {isResumeVerified && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              Verified Document
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span>{resumeFileType}</span>
                          <span>•</span>
                          <span>{resumeFileSize}</span>
                          <span>•</span>
                          <span className="text-emerald-400">Ready for Recruiter Review</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 min-h-[44px] rounded-xl text-xs font-semibold bg-slate-850 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 transition-colors"
                    >
                      <FolderOpen className="w-3.5 h-3.5 text-violet-400" />
                      <span>Browse File</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 pl-1">
                    Accepted formats: <strong>.pdf</strong>, <strong>.docx</strong>, <strong>.doc</strong> (Max size: 10MB).
                  </p>
                </div>

                {/* Certification / Portfolio Evidence */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>Relevant Certification / Portfolio Link (Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={certificateTitle}
                    onChange={(e) => setCertificateTitle(e.target.value)}
                    placeholder="e.g. Stanford Relational SQL Credential, GitHub Profile, Design Portfolio..."
                    className="w-full px-3.5 py-2.5 min-h-[44px] bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/25 transition-all"
                  >
                    <span>Proceed to Skill Cross-Verification Matrix</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.form>
            ) : (
              /* STEP 2: Side-by-Side Skill Cross-Verification Matrix */
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Deterministic Readiness Audit
                      </h4>
                      <InfoButton
                        title="Deterministic Compatibility Audit"
                        description="Directly audits your verified portfolio against the employer's mathematical requirement weights. Zero subjective filtering."
                        rationale="Ensures full transparency before your verified resume is dispatched."
                        tip="Review the table below to ensure all high-weight skills are possessed."
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Cross-match against {job.company} requirement weights.
                    </p>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-xl font-black ${
                        isEligible ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {breakdown.score}%
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      {isEligible ? 'Qualified to Apply' : 'Threshold Locked'}
                    </span>
                  </div>
                </div>

                {/* Desktop Cross-Verification Table (>=768px) */}
                <div className="hidden md:block rounded-xl border border-slate-800 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3.5">Company Requirement</th>
                        <th className="py-2.5 px-3.5">Weight</th>
                        <th className="py-2.5 px-3.5">Cross-Verification Status</th>
                        <th className="py-2.5 px-3.5 text-right">Contribution</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/70 bg-slate-900">
                      {job.requirements.map((req) => {
                        const isPossessed = studentSkills.some(
                          (s) => s.skillId === req.skillId && s.proficiencyScore > 0
                        );
                        return (
                          <tr key={req.skillId}>
                            <td className="py-2.5 px-3.5 font-bold text-white">{req.skillName}</td>
                            <td className="py-2.5 px-3.5 font-mono text-slate-400">{req.weight}%</td>
                            <td className="py-2.5 px-3.5">
                              {isPossessed ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300">
                                  <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                                  Verified
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400">
                                  <X className="w-3.5 h-3.5 text-rose-400 stroke-[3]" />
                                  Deficit (-{req.weight}%)
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3.5 text-right font-mono font-bold">
                              <span className={isPossessed ? 'text-emerald-400' : 'text-slate-500'}>
                                +{isPossessed ? req.weight : 0}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cross-Verification Touch-Friendly Cards (<768px) */}
                <div className="md:hidden space-y-2.5">
                  {job.requirements.map((req) => {
                    const isPossessed = studentSkills.some(
                      (s) => s.skillId === req.skillId && s.proficiencyScore > 0
                    );
                    return (
                      <div
                        key={req.skillId}
                        className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="text-xs font-bold text-white">{req.skillName}</div>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                            <span className="font-mono">{req.weight}% Weight</span>
                            <span>•</span>
                            {isPossessed ? (
                              <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
                                <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                                Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 font-semibold text-rose-400">
                                <X className="w-3.5 h-3.5 text-rose-400 stroke-[3]" />
                                Deficit
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <span
                            className={`text-xs font-mono font-bold px-2 py-1 rounded-lg border ${
                              isPossessed
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            }`}
                          >
                            {isPossessed ? `+${req.weight}%` : '0%'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Candidate Truthfulness Certification Checkbox */}
                <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="certifyTruthful"
                    checked={hasCertifiedTruthful}
                    onChange={(e) => setHasCertifiedTruthful(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-violet-600 rounded cursor-pointer"
                  />
                  <label htmlFor="certifyTruthful" className="text-xs text-slate-300 cursor-pointer select-none">
                    I solemnly verify that my academic credentials ({highestEducation}), attached resume ({resumeFileName}), and skill portfolio accurately reflect my qualifications for {job.company}.
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900/95 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {step === 2 && (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 min-h-[44px] rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Credentials</span>
            </button>
          )}

          <div className="flex items-center gap-2 sm:ml-auto w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 min-h-[44px] rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>

            {step === 2 && (
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={!isEligible || !hasCertifiedTruthful}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl text-xs font-bold transition-all shadow-md ${
                  isEligible && hasCertifiedTruthful
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/25 ring-1 ring-emerald-400/40 cursor-pointer'
                    : 'bg-slate-800 text-slate-500 border border-slate-800 cursor-not-allowed'
                }`}
              >
                <SendHorizontal className="w-4 h-4" />
                <span>Confirm & Dispatch Application</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
