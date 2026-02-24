import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => (
  <div className={`flex flex-col gap-2 group ${props.type === 'hidden' ? 'hidden' : ''}`}>
    {label && <label className="text-[11px] font-bold text-gray-500 ml-1 uppercase tracking-widest group-focus-within:text-[#064E3B] transition-colors duration-300">{label}</label>}
    <div className="relative group/input">
        <input
        className={`w-full bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl px-3 py-2.5 md:px-4 md:py-3.5 text-gray-800 placeholder-gray-400 text-sm font-medium
            focus:outline-none focus:border-[#064E3B] focus:bg-white focus:ring-4 focus:ring-[#064E3B]/10 transition-all duration-300 shadow-sm 
            hover:border-[#064E3B]/30 hover:bg-white/80 hover:shadow-md
            disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-100
            read-only:bg-gray-50 read-only:border-gray-200
            ${className}`}
        {...props}
        />
        {/* Focus Indicator Line */}
        <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-[#064E3B] scale-x-0 group-focus-within/input:scale-x-100 transition-transform duration-300 origin-center rounded-full"></div>
    </div>
  </div>
);

// Table Input: Minimalist input designed for data grids
export const TableInput: React.FC<InputProps> = ({ className = '', ...props }) => (
    <input
    className={`w-full bg-transparent border-b border-transparent px-2 py-2 text-gray-800 text-sm font-medium
        focus:outline-none focus:bg-white/50 focus:border-[#064E3B] focus:ring-0 transition-all duration-200
        hover:bg-white/30 hover:border-gray-300
        disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:border-transparent disabled:cursor-not-allowed
        placeholder:text-gray-300
        ${className}`}
    {...props}
    />
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, options, className = '', ...props }) => (
  <div className="flex flex-col gap-2 group">
    {label && <label className="text-[11px] font-bold text-gray-500 ml-1 uppercase tracking-widest group-focus-within:text-[#064E3B] transition-colors duration-300">{label}</label>}
    <div className="relative">
        <select
        className={`w-full bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl px-3 py-2.5 md:px-4 md:py-3.5 text-gray-800 text-sm font-medium
            focus:outline-none focus:border-[#064E3B] focus:bg-white focus:ring-4 focus:ring-[#064E3B]/10 transition-all duration-300 appearance-none shadow-sm 
            hover:bg-white/80 hover:border-[#064E3B]/30 hover:shadow-md cursor-pointer
            ${className}`}
        {...props}
        >
        {options.map(opt => (
            <option key={opt.value} value={opt.value}>
            {opt.label}
            </option>
        ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-[#064E3B] transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </div>
    </div>
  </div>
);

interface ToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
}

export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label }) => (
    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onChange(!checked)}>
        <div className={`relative w-12 h-7 rounded-full transition-all duration-300 ease-in-out border-2 ${checked ? 'bg-[#064E3B] border-[#064E3B]' : 'bg-gray-200 border-gray-200 group-hover:border-gray-300'}`}>
            <div className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow-sm transform transition-transform duration-300 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`}></div>
        </div>
        {label && <span className={`text-sm font-medium transition-colors ${checked ? 'text-[#064E3B] font-bold' : 'text-gray-500'}`}>{label}</span>}
    </div>
);

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, className, ...props }) => (
    <label className="flex items-center gap-3 cursor-pointer group select-none">
        <div className="relative flex items-center justify-center">
            <input type="checkbox" className="peer sr-only" {...props} />
            <div className={`w-5 h-5 border-2 border-gray-300 rounded-md bg-white peer-checked:bg-[#064E3B] peer-checked:border-[#064E3B] peer-hover:border-[#D4AF37] transition-all duration-300 shadow-sm ${className}`}></div>
            <svg
                className="absolute w-3 h-3 text-white font-bold opacity-0 peer-checked:opacity-100 transition-all duration-300 transform peer-checked:scale-100 scale-50"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        </div>
        {label && <span className="text-sm font-medium text-gray-600 group-hover:text-[#064E3B] transition-colors duration-300">{label}</span>}
    </label>
);