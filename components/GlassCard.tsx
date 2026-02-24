import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', contentClassName = '', title, subtitle, action }) => {
  return (
    <div className={`group relative bg-gradient-to-br from-white/90 via-white/70 to-white/50 backdrop-blur-3xl backdrop-saturate-150 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:border-white/80 hover:-translate-y-1 ${className}`}>
      
      {/* Glossy reflection effect */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/90 to-transparent opacity-80"></div>
      <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none"></div>
      
      {/* Inner Glow */}
      <div className="absolute inset-0 rounded-3xl border border-white/20 pointer-events-none"></div>

      {(title || subtitle) && (
        <div className="px-5 py-4 md:px-8 md:py-6 border-b border-gray-100/50 flex items-start justify-between relative z-10 bg-white/40 gap-4">
          <div className="space-y-1 flex-1 min-w-0">
             {title && <h3 className="text-lg md:text-xl font-bold text-[#064E3B] tracking-tight leading-tight font-playfair">{title}</h3>}
             {subtitle && <p className="text-[10px] md:text-xs font-semibold text-gray-500 tracking-wide uppercase leading-relaxed">{subtitle}</p>}
          </div>
          {action && <div className="flex-shrink-0 transform group-hover:scale-110 transition-transform duration-300">{action}</div>}
        </div>
      )}
      
      <div className={`p-5 md:p-8 relative z-10 ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
};
