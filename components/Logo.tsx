import React from 'react';
import { useData } from '../contexts/DataContext';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const { logoUrl } = useData();

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12 md:w-14 md:h-14',
    lg: 'w-16 h-16 md:w-20 md:h-20',
    xl: 'w-24 h-24 md:w-32 md:h-32',
  };

  return (
    <div className={`relative ${sizeClasses[size]} flex-shrink-0 flex items-center justify-center group cursor-default ${className}`}>
        <div className="absolute inset-0 bg-[#D4AF37] rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
        <div className="relative w-full h-full bg-gradient-to-br from-[#D4AF37] to-[#B4941F] rounded-xl flex items-center justify-center text-[#064E3B] shadow-xl border border-white/20 transform group-hover:scale-105 transition-transform duration-500 overflow-hidden p-1.5">
            <img 
                src={logoUrl} 
                alt="Logo" 
                className="w-full h-full object-contain drop-shadow-sm"
            />
        </div>
    </div>
  );
};
