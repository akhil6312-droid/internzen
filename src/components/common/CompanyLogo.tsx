import React from 'react';
import { 
  Sparkles, 
  Zap, 
  Cpu, 
  BookOpen, 
  Building, 
  TrendingUp, 
  Compass,
  Boxes
} from 'lucide-react';

interface CompanyLogoProps {
  logoType: string;
  brandColor?: string;
  companyName: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({
  logoType,
  brandColor,
  companyName,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  }[size];

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }[size];

  switch (logoType?.toLowerCase()) {
    case 'technova':
      return (
        <div
          className={`${sizeClasses} rounded-xl bg-gradient-to-tr from-violet-600 via-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-violet-500/20 border border-violet-400/30 shrink-0`}
        >
          <Sparkles className={iconSizes} />
        </div>
      );

    case 'razorpay':
      return (
        <div
          className={`${sizeClasses} rounded-xl bg-gradient-to-tr from-blue-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 border border-blue-400/30 shrink-0`}
        >
          <Zap className={iconSizes} />
        </div>
      );

    case 'tatamotors':
      return (
        <div
          className={`${sizeClasses} rounded-xl bg-gradient-to-tr from-sky-700 to-indigo-800 flex items-center justify-center text-white shadow-md shadow-sky-600/20 border border-sky-400/30 shrink-0`}
        >
          <Boxes className={iconSizes} />
        </div>
      );

    case 'teachforindia':
      return (
        <div
          className={`${sizeClasses} rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 border border-orange-400/30 shrink-0`}
        >
          <BookOpen className={iconSizes} />
        </div>
      );

    case 'ti':
    case 'texas instruments':
      return (
        <div
          className={`${sizeClasses} rounded-xl bg-gradient-to-tr from-red-600 to-rose-700 flex items-center justify-center text-white shadow-md shadow-red-500/20 border border-red-400/30 shrink-0`}
        >
          <Cpu className={iconSizes} />
        </div>
      );

    case 'goldmansachs':
    case 'goldman sachs':
      return (
        <div
          className={`${sizeClasses} rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-700 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 border border-cyan-400/30 shrink-0`}
        >
          <TrendingUp className={iconSizes} />
        </div>
      );

    case 'microsoft':
      return (
        <div
          className={`${sizeClasses} rounded-xl bg-slate-900 border border-slate-700 grid grid-cols-2 p-1 gap-0.5 shadow-md shrink-0`}
        >
          <div className="bg-red-500 rounded-[2px]" />
          <div className="bg-emerald-500 rounded-[2px]" />
          <div className="bg-blue-500 rounded-[2px]" />
          <div className="bg-amber-400 rounded-[2px]" />
        </div>
      );

    case 'swiggy':
      return (
        <div
          className={`${sizeClasses} rounded-xl bg-gradient-to-tr from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 border border-orange-400/30 shrink-0`}
        >
          <Compass className={iconSizes} />
        </div>
      );

    default:
      return (
        <div
          className={`${sizeClasses} rounded-xl flex items-center justify-center font-bold text-white shadow-md shrink-0 border`}
          style={{
            backgroundColor: brandColor || '#4f46e5',
            borderColor: `${brandColor || '#4f46e5'}60`,
          }}
        >
          {companyName ? companyName.slice(0, 2).toUpperCase() : <Building className={iconSizes} />}
        </div>
      );
  }
};
