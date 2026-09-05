import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Mail, 
  Phone, 
  Copy, 
  Check, 
  Compass, 
  Sparkles, 
  ExternalLink,
  Users
} from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCopySuccess?: (msg: string) => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  onCopySuccess,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen) return null;

  const contactData = {
    platform: 'InternZen Placement Intelligence',
    team: 'TEAM Zenith',
    email: 'akhilgondaliya.6312@gmail.com',
    phone: '+91 9316972573',
    location: 'India • Remote / Campus Placement Operations',
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    if (onCopySuccess) {
      onCopySuccess(`Copied ${label}: ${text}`);
    }
    setTimeout(() => {
      setCopiedField(null);
    }, 2500);
  };

  const handleCopyAll = () => {
    const fullSummary = `Platform: ${contactData.platform}\nTeam: ${contactData.team}\nEmail: ${contactData.email}\nPhone: ${contactData.phone}`;
    navigator.clipboard.writeText(fullSummary);
    setCopiedField('all');
    if (onCopySuccess) {
      onCopySuccess('Contact details copied to clipboard! 📋');
    }
    setTimeout(() => {
      setCopiedField(null);
    }, 2500);
  };

  return (
    <AnimatePresence>
      <div 
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        className="fixed inset-0 z-[100] overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="relative w-full max-w-md max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto"
        >
          {/* Ambient Lighting */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-violet-600/20 via-indigo-600/10 to-transparent blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-emerald-600/10 via-teal-600/5 to-transparent blur-2xl pointer-events-none" />

          {/* Header with Pinned Close Button */}
          <div className="p-5 sm:p-6 border-b border-slate-800/80 flex items-center justify-between relative z-10 shrink-0 bg-slate-900/95">
            <div className="flex items-center gap-3 pr-10">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/30 ring-1 ring-violet-400/30">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400">
                    Official Support
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                  Contact TEAM Zenith
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="absolute top-5 right-5 z-10 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 transition-colors cursor-pointer"
              aria-label="Close Contact Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="p-5 sm:p-6 space-y-4 relative z-10 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {/* Team Zenith Badge */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-950/40 via-indigo-950/30 to-slate-900 border border-violet-500/30">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-violet-300 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-violet-400" />
                  <span>Engineering & Product Core</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-bold border border-violet-500/30">
                  {contactData.team}
                </span>
              </div>
              <h3 className="text-sm font-extrabold text-white">
                {contactData.platform}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Empowering skill-first placement matching, deterministic career gap diagnostics, and institutional placement drives.
              </p>
            </div>

            {/* Direct Channels */}
            <div className="space-y-3">
              {/* Email Card */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3 group hover:border-violet-500/50 transition-all">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-violet-400" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Support & Partnerships Email
                    </span>
                    <a
                      href={`mailto:${contactData.email}`}
                      className="text-xs font-bold text-white hover:text-violet-300 truncate block transition-colors"
                      title="Send Email"
                    >
                      {contactData.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href={`mailto:${contactData.email}`}
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Open mail client"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleCopy(contactData.email, 'Email')}
                    className="p-2 rounded-xl text-slate-400 hover:text-violet-300 hover:bg-violet-500/10 transition-colors cursor-pointer"
                    title="Copy Email"
                  >
                    {copiedField === 'Email' ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Phone Card */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3 group hover:border-emerald-500/50 transition-all">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Direct Phone / WhatsApp
                    </span>
                    <a
                      href={`tel:${contactData.phone.replace(/\s+/g, '')}`}
                      className="text-xs font-mono font-bold text-white hover:text-emerald-300 truncate block transition-colors"
                      title="Call Phone Number"
                    >
                      {contactData.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href={`tel:${contactData.phone.replace(/\s+/g, '')}`}
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Call directly"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleCopy(contactData.phone, 'Phone')}
                    className="p-2 rounded-xl text-slate-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                    title="Copy Phone"
                  >
                    {copiedField === 'Phone' ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Action Button: Copy All */}
            <button
              type="button"
              onClick={handleCopyAll}
              className="w-full min-h-[44px] py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/25 ring-1 ring-violet-400/30 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]"
            >
              {copiedField === 'all' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>Contact Details Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Complete Contact Card</span>
                  <Sparkles className="w-3.5 h-3.5 text-violet-200" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
