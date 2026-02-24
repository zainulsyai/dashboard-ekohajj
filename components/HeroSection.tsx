
import React from 'react';
import { Calendar, Clock, Shield } from 'lucide-react';

interface HeroSectionProps {
  title: React.ReactNode;
  subtitle: string;
  currentDate: string;
  children?: React.ReactNode;
  className?: string;
  startContent?: React.ReactNode;
  role?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ title, subtitle, currentDate, children, className = '', startContent, role }) => {
  return (
    <div className={`bg-[#064E3B] rounded-2xl md:rounded-[2.5rem] px-5 py-5 md:px-12 md:py-8 text-white relative shadow-2xl shadow-[#064E3B]/30 min-h-[140px] md:min-h-[180px] flex flex-col justify-center border border-white/10 ${className}`}>
        {/* Ambient Background Effects */}
        <div className="absolute inset-0 rounded-2xl md:rounded-[2.5rem] overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-b from-[#10B981] to-[#064E3B] rounded-full blur-[120px] opacity-30 translate-x-1/4 -translate-y-1/4 mix-blend-screen"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#D4AF37] rounded-full blur-[100px] opacity-15 -translate-x-1/4 translate-y-1/4 mix-blend-screen"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05] mix-blend-overlay"></div>
        </div>
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 md:gap-8">
            <div className="flex-1 w-full lg:w-auto">
                <div className="flex flex-wrap items-center gap-2 mb-3 md:mb-4">
                    <div className="inline-flex items-center gap-2 md:gap-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-full pl-1.5 pr-4 md:pr-5 py-1 md:py-1.5 shadow-lg shadow-black/5 group hover:bg-white/15 transition-all duration-300 cursor-default max-w-full">
                        <div className="p-1 md:p-1.5 bg-gradient-to-br from-[#D4AF37] to-[#B45309] rounded-full shadow-inner flex-shrink-0">
                            <Calendar size={12} className="text-white drop-shadow-sm md:w-3.5 md:h-3.5" />
                        </div>
                        <div className="flex items-center gap-2 md:gap-3 overflow-hidden text-[10px] md:text-xs">
                            <span className="text-white font-semibold tracking-wide truncate">{currentDate}</span>
                            <span className="w-1 h-1 rounded-full bg-white/40 flex-shrink-0"></span>
                            <span className="text-[#D4AF37] font-bold text-[9px] md:text-[10px] tracking-wider uppercase font-mono flex-shrink-0">1447 H</span>
                        </div>
                    </div>

                    {role && (
                        <div className="inline-flex items-center gap-2 md:gap-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-full pl-1.5 pr-4 md:pr-5 py-1 md:py-1.5 shadow-lg shadow-black/5 cursor-default max-w-full">
                            <div className="p-1 md:p-1.5 bg-gradient-to-br from-[#D4AF37] to-[#B45309] rounded-full shadow-inner flex-shrink-0">
                                <Shield size={12} className="text-white drop-shadow-sm md:w-3.5 md:h-3.5" />
                            </div>
                            <span className="text-[#D4AF37] font-bold text-[10px] md:text-xs tracking-wide uppercase">{role}</span>
                        </div>
                    )}
                </div>

                <div className="flex flex-row items-center gap-4 md:gap-6">
                    {startContent && (
                        <div className="flex-shrink-0">
                            {startContent}
                        </div>
                    )}
                    <div className="flex-1">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-playfair mb-2 md:mb-3 leading-tight tracking-tight drop-shadow-sm">
                            {title}
                        </h1>
                        <div className="text-emerald-50/80 text-sm md:text-base max-w-2xl leading-relaxed font-light tracking-wide line-clamp-2 md:line-clamp-none">
                            {subtitle}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4 w-full lg:w-auto mt-1 lg:mt-0">
                {children}
            </div>
        </div>
    </div>
  );
};
