
import React, { useState } from 'react';
import { ArrowRight, User, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Logo } from '../components/Logo';
import { useUser } from '../contexts/UserContext';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { login } = useUser();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (username && password) {
      setLoading(true);
      
      // Simulate network delay for better UX
      setTimeout(() => {
        const success = login(username, password);
        setLoading(false);
        
        if (success) {
          onLogin();
        } else {
          setError('Username atau password salah. Silakan coba lagi.');
        }
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#064E3B] relative overflow-hidden font-sans">
      
      {/* --- BACKGROUND ASSETS (Matching Dashboard Hero/Sidebar) --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Noise Texture */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
          
          {/* Gradient Orbs */}
          <div className="absolute top-[-10%] left-[-10%] w-[80vw] md:w-[50vw] h-[80vw] md:h-[50vw] bg-[#10B981] rounded-full blur-[80px] md:blur-[120px] opacity-20 animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[80vw] md:w-[50vw] h-[80vw] md:h-[50vw] bg-[#D4AF37] rounded-full blur-[80px] md:blur-[100px] opacity-20 animate-pulse delay-1000"></div>
          
          {/* Islamic Geometric Pattern Overlay (Subtle) */}
          <div className="absolute inset-0 opacity-5" style={{ 
              backgroundImage: 'radial-gradient(circle, #D4AF37 1px, transparent 1px)', 
              backgroundSize: '30px 30px' 
          }}></div>
      </div>

      {/* --- LOGIN CARD (Matching Dashboard GlassCard Style) --- */}
      <div className="w-full max-w-sm md:max-w-4xl px-4 relative z-10 animate-fade-in-up">
        
        {/* Card Container - White Glass to match Dashboard Cards */}
        <div className="bg-white/90 backdrop-blur-2xl rounded-2xl md:rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white/50 overflow-hidden relative flex flex-col md:flex-row">
            
            {/* Top Decoration (Mobile Only) */}
            <div className="md:hidden h-1.5 w-full bg-gradient-to-r from-[#064E3B] via-[#10B981] to-[#D4AF37]"></div>

            {/* Left Side (Desktop Only - Branding) */}
            <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#F0FDF4] to-[#FFFBEB] relative items-center justify-center p-8 lg:p-12 border-r border-white/50">
                 {/* Decorative elements for left side */}
                 <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 mix-blend-multiply"></div>
                 <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#064E3B] via-[#10B981] to-[#D4AF37]"></div>
                 
                 <div className="relative z-10 text-center">
                    <div className="mb-6 transform hover:scale-105 transition-transform duration-500 flex justify-center">
                        <Logo size="xl" />
                    </div>
                    <h1 className="text-[#064E3B] tracking-wide leading-relaxed mb-8 max-w-md mx-auto">
                        <span className="block font-bold text-lg md:text-xl mb-1">Akses Terbatas</span>
                        <span className="block text-sm md:text-base font-light opacity-90">Khusus pengguna terotorisasi</span>
                    </h1>
                    <div className="w-16 h-1 bg-[#D4AF37] mx-auto rounded-full mb-8 opacity-80"></div>
                    <p className="text-gray-600 italic max-w-xs mx-auto leading-relaxed font-serif text-base lg:text-lg mb-10">
                        "Mewujudkan ekosistem haji dan umrah yang terintegrasi, transparan, dan melayani."
                    </p>
                    
                    {/* System & Database Status */}
                    <div className="flex flex-col xl:flex-row gap-3 items-center justify-center mt-2">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#064E3B]/5 border border-[#064E3B]/10 text-[#064E3B] text-xs font-bold tracking-wide shadow-sm hover:bg-[#064E3B]/10 transition-colors cursor-default">
                            <span className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </span>
                            System: Online
                        </div>
                        
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#064E3B]/5 border border-[#064E3B]/10 text-[#064E3B] text-xs font-bold tracking-wide shadow-sm hover:bg-[#064E3B]/10 transition-colors cursor-default">
                             <span className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </span>
                            DB: Connected
                        </div>
                    </div>
                 </div>
            </div>

            {/* Right Side (Form) */}
            <div className="w-full md:w-1/2 p-6 md:p-10 lg:p-12 bg-white/60 flex flex-col justify-center">
                
                {/* Mobile Header (Visible only on mobile) */}
                <div className="md:hidden flex flex-col items-center justify-center mb-6 text-center">
                    <div className="mb-4">
                        <Logo size="lg" />
                    </div>
                    <h1 className="text-xl font-bold text-[#064E3B] font-playfair leading-none mb-1">
                        Dirjen <span className="text-[#D4AF37]">PEE</span>
                    </h1>
                    <p className="text-[10px] font-bold text-gray-400 tracking-[0.1em] uppercase">
                        Kementerian Haji dan Umrah RI
                    </p>
                </div>

                {/* Desktop Header (Simple Welcome) */}
                <div className="hidden md:block mb-8">
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">Selamat Datang</h2>
                    <p className="text-gray-500 text-sm lg:text-base">Silahkan masuk untuk mengakses dashboard.</p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-fade-in">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600 font-medium">{error}</p>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">Username / ID Panitia</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#064E3B] transition-colors">
                                <User size={18} className="md:w-[18px] md:h-[18px]" />
                            </div>
                            <input 
                                type="text" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Masukkan Username atau ID"
                                className="w-full bg-white border border-gray-200 rounded-lg py-3 pl-11 pr-4 text-sm font-medium text-gray-800 placeholder-gray-400 focus:border-[#064E3B] focus:ring-4 focus:ring-[#064E3B]/10 outline-none transition-all shadow-sm group-hover:border-gray-300"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                         <label className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">Password</label>
                         <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#064E3B] transition-colors">
                                <Lock size={18} className="md:w-[18px] md:h-[18px]" />
                            </div>
                            <input 
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Masukkan Password"
                                className="w-full bg-white border border-gray-200 rounded-lg py-3 pl-11 pr-10 text-sm font-medium text-gray-800 placeholder-gray-400 focus:border-[#064E3B] focus:ring-4 focus:ring-[#064E3B]/10 outline-none transition-all shadow-sm group-hover:border-gray-300"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#064E3B] focus:ring-[#064E3B] transition-colors cursor-pointer" />
                            <span className="text-xs md:text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors">Ingat Saya</span>
                        </label>
                        <a href="#" className="text-xs md:text-sm font-bold text-[#D4AF37] hover:text-[#b08d24] transition-colors">Lupa Password?</a>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 mt-6 bg-[#064E3B] hover:bg-[#053d2e] text-white rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-[#064E3B]/20 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                    >
                        {loading ? (
                             <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>MEMUAT...</span>
                             </>
                        ) : (
                             <>
                                <span>MASUK DASHBOARD</span>
                             </>
                        )}
                    </button>

                    <div className="mt-6 text-center">
                        <p className="text-xs md:text-sm text-gray-500 font-medium">
                            Belum punya akun?{' '}
                            <a href="#" className="text-[#064E3B] font-bold hover:text-[#053d2e] hover:underline transition-all ml-1">
                                Hubungi Admin
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </div>

      </div>
      
      {/* Copyright Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center z-10">
          <p className="text-white/60 text-[10px] md:text-xs font-medium tracking-wide">
              &copy; 2026 Kementerian Haji dan Umrah RI. Hak Cipta Dilindungi.
          </p>
      </div>
    </div>
  );
};
