import React from 'react';
import { 
  Sparkles, 
  Zap, 
  Cpu, 
  BookOpen, 
  Building, 
  TrendingUp, 
  Compass,
  Boxes,
  CreditCard,
  Smartphone,
  Target,
  Laptop,
  Send,
  Terminal,
  BatteryCharging,
  ShoppingBag,
  Coins,
  BarChart3
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
    case 'phonepe':
      return (
        <div
          className={`${sizeClasses} rounded-xl bg-gradient-to-tr from-purple-700 via-indigo-600 to-purple-500 flex items-center justify-center text-white shadow-md shadow-purple-600/25 border border-purple-400/30 shrink-0`}
        >
          <Smartphone className={iconSizes} />
        </div>
      );

    case 'cred':
      return (
        <div
          className={`${sizeClasses} rounded-xl bg-gradient-to-tr from-zinc-900 via-stone-800 to-slate-900 flex items-center justify-center text-amber-300 shadow-md shadow-amber-500/15 border border-stone-600 shrink-0`}
        >
          <CreditCard className={iconSizes} />
        </div>
      );

    case 'zerodha':
      return (
        <div
          className={`${sizeClasses} rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 border border-blue-400/30 shrink-0`}
        >
          <BarChart3 className={iconSizes} />
        </div>
      );

    case 'zomato':
      return (
        <div
          className={`${sizeClasses} rounded-xl bg-gradient-to-tr from-rose-600 via-red-600 to-rose-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20 border border-rose-400/30 shrink-0`}
        >
          <Compass className={iconSizes} />
        </div>
      );

    case 'groww':
      return (
        <div
          className={`${sizeClasses} rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 border border-emerald-400/30 shrink-0`}
        >
          <TrendingUp className={iconSizes} />
        </div>
      );

    case 'inmobi':
      return (
        <div
          className={`${sizeClasses} rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 border border-indigo-400/30 shrink-0`}
        >
          <Target className={iconSizes} />
        </div>
      );

    case 'browserstack':
      return (
        <div
          className={`${sizeClasses} rounded-xl bg-gradient-to-tr from-sky-600 via-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 border border-cyan-400/30 shrink-0`}
        >
          <Laptop className={iconSizes} />
        </div>
      );

    case 'postman':
      return (
        <div
          className={`${sizeClasses} rounded-xl bg-gradient-to-tr from-orange-600 via-amber-600 to-yellow-500 flex items-center justify-center text-white shadow-md shadow-orange-500/25 border border-orange-400/30 shrink-0`}
        >
          <Send className={iconSizes} />
        </div>
      );

    case 'urbancompany':
    case 'urban company':
      return (
        <div
          className={`${sizeClasses} rounded-xl bg-gradient-to-tr from-slate-900 via-violet-900 to-slate-800 flex items-center justify-center text-violet-300 shadow-md shadow-violet-500/20 border border-violet-500/30 shrink-0`}
        >
          <Sparkles className={iconSizes} />
        </div>
      );

    case 'juspay':
      return (
        <div
          className={`${sizeClasses} rounded-xl bg-gradient-to-tr from-violet-700 via-indigo-700 to-blue-700 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 border border-indigo-400/30 shrink-0`}
        >
          <Terminal className={iconSizes} />
        </div>
      );

    case 'ather':
    case 'atherenergy':
    case 'ather energy':
      return (
        <div
          className={`${sizeClasses} rounded-xl bg-gradient-to-tr from-teal-700 via-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 border border-emerald-400/30 shrink-0`}
        >
          <BatteryCharging className={iconSizes} />
        </div>
      );

    case 'meesho':
      return (
        <div
          className={`${sizeClasses} rounded-xl bg-gradient-to-tr from-pink-600 via-rose-600 to-fuchsia-600 flex items-center justify-center text-white shadow-md shadow-pink-500/25 border border-pink-400/30 shrink-0`}
        >
          <ShoppingBag className={iconSizes} />
        </div>
      );

    case 'coindcx':
      return (
        <div
          className={`${sizeClasses} rounded-xl bg-gradient-to-tr from-indigo-700 via-blue-600 to-cyan-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 border border-cyan-400/30 shrink-0`}
        >
          <Coins className={iconSizes} />
        </div>
      );

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
