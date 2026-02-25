import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/GlassCard';
import { User as UserIcon, Bell, Moon, Shield, Database, LogOut, ChevronRight, Save, RefreshCw, Download, HelpCircle, Mail, Settings as SettingsIconLucide, X, Globe, Check, AlertTriangle, Camera, Eye, EyeOff } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useUser } from '../contexts/UserContext';
import { Page } from '../types';
import { HeroSection } from '../components/HeroSection';

interface SettingsProps {
    onNavigate: (page: Page) => void;
    onLogout: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onNavigate, onLogout }) => {
    const { 
        setBumbuMakkah, setBumbuMadinah, setRteData, setTenantData, 
        setExpeditionData, setTelecomData, setRiceData 
    } = useData();
    
    const { user, updateUser, users, updateUserById } = useUser();

    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [isEnglish, setIsEnglish] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isUserCardOpen, setIsUserCardOpen] = useState(false); // New User Card Modal
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);
    
    // Edit Profile State
    const [editName, setEditName] = useState(user.name);
    const [editRole, setEditRole] = useState(user.role);
    const [editEmail, setEditEmail] = useState(user.email);
    const [editId, setEditId] = useState(user.id);
    const [editUsername, setEditUsername] = useState(user.username || ''); 
    const [editPassword, setEditPassword] = useState(''); 
    const [editAvatar, setEditAvatar] = useState(user.avatar); // Add avatar state
    const [showPassword, setShowPassword] = useState(false);
    const [editingUserId, setEditingUserId] = useState<string | null>(null); // Track which user is being edited

    useEffect(() => {
        if (isProfileModalOpen) {
            // If editingUserId is set, find that user, otherwise use current user
            const targetUser = editingUserId ? users.find(u => u.id === editingUserId) : user;
            
            if (targetUser) {
                setEditName(targetUser.name);
                setEditRole(targetUser.role);
                setEditEmail(targetUser.email);
                setEditId(targetUser.id);
                setEditUsername(targetUser.username || ''); 
                setEditPassword(targetUser.password || ''); // Pre-fill password
                setEditAvatar(targetUser.avatar); // Set avatar
                setShowPassword(false); // Reset password visibility
            }
        }
    }, [isProfileModalOpen, user, users, editingUserId]);
    
    const currentDate = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    // Auto-dismiss toast
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
        setToast({ message, type });
    };

    const handleResetConfirm = () => {
        setIsResetModalOpen(false);
        setIsResetting(true);
        showToast("Mereset data aplikasi...", 'info');
        
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    };

    const handleExportData = () => {
        showToast("Export data sedang diproses...", 'info');
        setTimeout(() => {
            showToast("Data berhasil diexport ke CSV", 'success');
        }, 1500);
    };

    const handleEditProfile = (userId?: string) => {
        setEditingUserId(userId || user.id);
        setIsProfileModalOpen(true);
        setIsUserCardOpen(false); // Close card if open
    };

    const handleSaveProfile = () => {
        // Validation Logic
        const isAdmin = user.role === 'Administrator EkoHajj';
        const targetUser = editingUserId ? users.find(u => u.id === editingUserId) : user;
        const isEditingSelf = targetUser?.id === user.id;

        // 1. ID Panitia Validation (All Roles)
        if (!/^\d+$/.test(editId) || editId.length < 7) {
            showToast("ID Panitia harus berupa angka dan minimal 7 digit", 'warning');
            return;
        }

        // 2. Email Validation
        if (!editEmail.includes('@')) {
             showToast("Format email tidak valid", 'warning');
             return;
        }

        const updates: any = {
            name: editName,
            role: editRole,
            email: editEmail,
            id: editId,
            username: editUsername,
            avatar: editAvatar // Include avatar update
        };

        if (editPassword) {
            updates.password = editPassword;
        }

        if (editingUserId) {
            updateUserById(editingUserId, updates);
        } else {
            updateUser(updates);
        }
        
        setIsProfileModalOpen(false);
        setEditingUserId(null);
        showToast("Profil berhasil diperbarui", 'success');
    };

    const handleSettingChange = (setting: string, value: boolean) => {
        showToast(`Pengaturan ${setting} ${value ? 'diaktifkan' : 'dinonaktifkan'}`, 'success');
    };

    return (
        <>
            
            {/* Toast Notification */}
            {toast && (
                <div className="fixed top-24 right-4 md:right-8 z-50 animate-fade-in-up">
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-md ${
                        toast.type === 'success' ? 'bg-emerald-50/90 border-emerald-200 text-emerald-800' :
                        toast.type === 'warning' ? 'bg-amber-50/90 border-amber-200 text-amber-800' :
                        'bg-blue-50/90 border-blue-200 text-blue-800'
                    }`}>
                        {toast.type === 'success' && <Check size={18} />}
                        {toast.type === 'warning' && <AlertTriangle size={18} />}
                        {toast.type === 'info' && <RefreshCw size={18} />}
                        <span className="text-sm font-medium">{toast.message}</span>
                        <button onClick={() => setToast(null)} className="ml-2 opacity-60 hover:opacity-100">
                            <X size={14} />
                        </button>
                    </div>
                </div>
            )}

            {/* Reset Confirmation Modal */}
            {isResetModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="absolute inset-0" onClick={() => setIsResetModalOpen(false)}></div>
                    <div className="relative bg-white p-6 rounded-2xl shadow-2xl animate-zoom-in max-w-sm w-full mx-auto border border-red-100">
                        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4 mx-auto text-red-500">
                            <AlertTriangle size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Reset Aplikasi?</h3>
                        <p className="text-sm text-gray-500 text-center mb-6">
                            Apakah Anda yakin ingin mereset semua data? Tindakan ini tidak dapat dibatalkan dan akan memuat ulang halaman.
                        </p>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setIsResetModalOpen(false)}
                                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors text-sm"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={handleResetConfirm}
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors text-sm shadow-md shadow-red-200"
                            >
                                Ya, Reset
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* User Card Modal */}
            {isUserCardOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
                    <div 
                        className="absolute inset-0" 
                        onClick={() => setIsUserCardOpen(false)}
                    ></div>
                    
                    {/* Landscape Card */}
                    <div className="relative bg-white rounded-3xl shadow-2xl animate-zoom-in max-w-3xl w-full mx-auto overflow-hidden flex flex-col md:flex-row min-h-[400px]">
                        
                        {/* Left Side: Visual Identity */}
                        <div className="w-full md:w-5/12 bg-gradient-to-br from-[#064E3B] to-[#047857] relative flex flex-col items-center justify-center p-8 text-white text-center z-10">
                            {/* Decorative Patterns */}
                            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                            <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#D4AF37]/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
                            
                            {/* Profile Image */}
                            <div className="relative z-10 mb-5 group">
                                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover:blur-2xl transition-all opacity-50"></div>
                                <div className="w-40 h-40 rounded-full p-1.5 bg-white/20 backdrop-blur-md shadow-2xl relative">
                                    <div className="w-full h-full rounded-full overflow-hidden border-[4px] border-white bg-white">
                                        <img 
                                            src={user.avatar} 
                                            alt="Profile" 
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Identity Info */}
                            <div className="relative z-10 space-y-2 w-full">
                                <h2 className="text-2xl font-bold leading-tight text-white drop-shadow-md">{user.name}</h2>
                                
                                <div className="flex flex-col items-center gap-2">
                                    <div className="inline-block px-4 py-1.5 bg-white/15 backdrop-blur-md rounded-full border border-white/20 shadow-lg">
                                        <p className="text-xs font-bold tracking-widest uppercase text-white/95">{user.role}</p>
                                    </div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/20 rounded-full border border-[#D4AF37]/30">
                                        <span className="text-[10px] uppercase tracking-wider font-bold text-[#D4AF37]">ID Panitia</span>
                                        <span className="text-xs font-mono font-bold text-white">{user.id}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Account Details */}
                        <div className="w-full md:w-7/12 bg-white p-8 relative flex flex-col justify-center">
                            {/* Close Button */}
                            <button 
                                onClick={() => setIsUserCardOpen(false)}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all z-20"
                            >
                                <X size={20} />
                            </button>

                            {/* Header */}
                            <div className="mb-6 border-b border-gray-100 pb-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
                                        <Shield size={18} />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800">Detail Akun</h3>
                                </div>
                                <p className="text-gray-500 text-xs">Informasi kredensial dan status akun Anda.</p>
                            </div>

                            {/* Details Grid */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-emerald-200 transition-colors group">
                                        <div className="flex items-center gap-1.5 mb-1 text-gray-400 group-hover:text-emerald-600 transition-colors">
                                            <UserIcon size={14} />
                                            <p className="text-[10px] font-bold uppercase tracking-wider">Username</p>
                                        </div>
                                        <p className="text-sm font-bold text-gray-800 truncate">{user.username || '-'}</p>
                                    </div>

                                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-emerald-200 transition-colors group">
                                        <div className="flex items-center gap-1.5 mb-1 text-gray-400 group-hover:text-emerald-600 transition-colors">
                                            <Shield size={14} />
                                            <p className="text-[10px] font-bold uppercase tracking-wider">Password</p>
                                        </div>
                                        <p className="text-sm font-bold text-gray-800 font-mono tracking-wider truncate">{user.password || '******'}</p>
                                    </div>
                                </div>

                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-emerald-200 transition-colors group">
                                    <div className="flex items-center gap-1.5 mb-1 text-gray-400 group-hover:text-emerald-600 transition-colors">
                                        <Mail size={14} />
                                        <p className="text-[10px] font-bold uppercase tracking-wider">Email Resmi</p>
                                    </div>
                                    <p className="text-sm font-medium text-gray-800 truncate">{user.email}</p>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                            <Check size={16} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-800">Status Akun</p>
                                            <p className="text-[10px] text-emerald-600 font-medium">Terverifikasi & Aktif</p>
                                        </div>
                                    </div>
                                    <div className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                                        Active
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Profile Modal */}
            {isProfileModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div 
                        className="absolute inset-0" 
                        onClick={() => setIsProfileModalOpen(false)}
                    ></div>
                    <div className="relative bg-white rounded-3xl shadow-2xl animate-zoom-in max-w-4xl w-full mx-auto overflow-hidden flex flex-col md:flex-row min-h-[500px]">
                        
                        {/* Left Side: Visual Identity (Editable) */}
                        <div className="w-full md:w-5/12 bg-gradient-to-br from-[#064E3B] to-[#047857] relative flex flex-col items-center justify-center p-8 text-white text-center z-10">
                            {/* Decorative Patterns */}
                            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                            <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#D4AF37]/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
                            
                            {/* Profile Image Edit */}
                            <div className="relative z-10 mb-5 group">
                                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover:blur-2xl transition-all opacity-50"></div>
                                <div className="w-40 h-40 rounded-full p-1.5 bg-white/20 backdrop-blur-md shadow-2xl relative group cursor-pointer">
                                    <div className="w-full h-full rounded-full overflow-hidden border-[4px] border-white bg-white relative">
                                        <img 
                                            src={editAvatar} 
                                            alt="Profile" 
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center flex-col gap-2">
                                            <Camera size={24} className="text-white" />
                                            <span className="text-[10px] font-bold text-white uppercase tracking-wider">Ubah Foto</span>
                                        </div>
                                    </div>
                                    
                                    {/* Hidden file input */}
                                    <input 
                                        type="file" 
                                        id="avatar-upload" 
                                        accept="image/png, image/jpeg" 
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                const file = e.target.files[0];
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setEditAvatar(reader.result as string);
                                                    showToast("Foto profil berhasil dipilih", 'success');
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                </div>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(editName)}&background=random&color=fff`;
                                        setEditAvatar(defaultAvatar);
                                        showToast("Foto profil direset", 'info');
                                    }}
                                    className="absolute -bottom-2 -right-2 p-2 bg-red-500 hover:bg-red-600 rounded-full text-white shadow-lg transition-transform hover:scale-110 z-30" 
                                    title="Hapus Foto"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                            
                            {/* Identity Info Preview */}
                            <div className="relative z-10 space-y-2 w-full">
                                <h2 className="text-2xl font-bold leading-tight text-white drop-shadow-md">{editName || user.name}</h2>
                                <p className="text-xs text-emerald-100 font-medium">Klik foto untuk mengubah</p>
                            </div>
                        </div>

                        {/* Right Side: Edit Form */}
                        <div className="w-full md:w-7/12 bg-white p-8 relative flex flex-col h-full overflow-y-auto max-h-[90vh] md:max-h-none">
                            {/* Close Button */}
                            <button 
                                onClick={() => setIsProfileModalOpen(false)}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all z-20"
                            >
                                <X size={20} />
                            </button>

                            {/* Header */}
                            <div className="mb-6 border-b border-gray-100 pb-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
                                        <SettingsIconLucide size={18} />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800">Edit Profil</h3>
                                </div>
                                <p className="text-gray-500 text-xs">Perbarui informasi akun Anda.</p>
                            </div>

                            {/* Form Grid */}
                            <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nama Lengkap</label>
                                    <input 
                                        type="text" 
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all text-gray-800"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Username</label>
                                        <input 
                                            type="text" 
                                            value={editUsername}
                                            onChange={(e) => setEditUsername(e.target.value)}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all text-gray-800"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">ID Panitia</label>
                                        <input 
                                            type="text" 
                                            value={editId}
                                            onChange={(e) => {
                                                if (/^\d*$/.test(e.target.value)) setEditId(e.target.value);
                                            }}
                                            minLength={7}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono font-medium focus:outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all text-gray-800"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Role / Jabatan</label>
                                    {user.role === 'Administrator EkoHajj' ? (
                                        <div className="relative">
                                            <select
                                                value={editRole}
                                                onChange={(e) => setEditRole(e.target.value)}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all text-gray-800 appearance-none"
                                            >
                                                <option value="Administrator EkoHajj">Administrator EkoHajj</option>
                                                <option value="Eksekutif EkoHajj">Eksekutif EkoHajj</option>
                                                <option value="Surveyor EkoHajj">Surveyor EkoHajj</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                                <ChevronRight size={16} className="rotate-90" />
                                            </div>
                                        </div>
                                    ) : (
                                        <input 
                                            type="text" 
                                            value={editRole}
                                            readOnly
                                            className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm font-medium text-gray-500 cursor-not-allowed"
                                        />
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
                                    <input 
                                        type="email" 
                                        value={editEmail}
                                        onChange={(e) => setEditEmail(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all text-gray-800"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
                                    <div className="relative">
                                        <input 
                                            type={showPassword ? "text" : "password"}
                                            value={editPassword}
                                            onChange={(e) => setEditPassword(e.target.value)}
                                            placeholder="Ubah Password (Opsional)"
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all text-gray-800 pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex gap-3 pt-4 border-t border-gray-100">
                                <button 
                                    onClick={() => setIsProfileModalOpen(false)}
                                    className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors text-sm"
                                >
                                    Batal
                                </button>
                                <button 
                                    onClick={handleSaveProfile}
                                    className="flex-1 px-4 py-2.5 bg-[#064E3B] hover:bg-[#053d2e] text-white rounded-xl font-bold transition-colors text-sm shadow-lg shadow-[#064E3B]/20 flex items-center justify-center gap-2"
                                >
                                    <Save size={18} />
                                    Simpan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Hero Section - User Profile */}
            <div className="space-y-6 pb-10 animate-fade-in-up font-sans relative">
            <HeroSection 
                title={
                    <div className="flex items-center gap-3 flex-wrap">
                        <span>{user.name}</span>
                        <div className="hidden sm:block h-8 w-px bg-white/20 mx-1"></div>
                        <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-lg border border-white/10 backdrop-blur-sm shadow-inner">
                            <span className="text-[10px] uppercase tracking-wider text-emerald-200 font-bold">ID</span>
                            <span className="font-mono text-lg md:text-xl tracking-widest text-white/90 font-bold">{user.id}</span>
                        </div>
                    </div>
                }
                subtitle="Pengembangan Ekosistem Ekonomi Haji dan Umrah Kementerian Haji dan Umrah Republik Indonesia"
                currentDate={currentDate}
                role={user.role}
                startContent={
                    <div className="relative group cursor-pointer" onClick={() => setIsUserCardOpen(true)}>
                        <div className="absolute inset-0 bg-white/20 rounded-full blur-md group-hover:blur-lg transition-all opacity-40"></div>
                        <div className="w-16 h-16 md:w-22 md:h-22 rounded-full border-[3px] border-white/30 bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center backdrop-blur-md shadow-2xl relative z-10 group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                            <img 
                                src={user.avatar} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute bottom-0 right-0 bg-white/20 backdrop-blur-md p-1 rounded-full border border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                }
            >
                <button 
                    onClick={() => handleEditProfile()}
                    className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs md:text-sm font-bold transition-all text-white hover:text-[#D4AF37] whitespace-nowrap shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2 group"
                >
                    <span>Edit Profil</span>
                    <SettingsIconLucide size={16} className="group-hover:rotate-90 transition-transform duration-500" />
                </button>
            </HeroSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-6">
                    {/* App Preferences */}
                    <GlassCard 
                        title="Preferensi Aplikasi" 
                        subtitle="Pengaturan Tampilan & Notifikasi"
                        action={<div className="p-2 bg-indigo-50 rounded-lg text-indigo-700 shadow-sm"><SettingsIconLucide size={18}/></div>}
                        className="!bg-white/80"
                    >
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white transition-all border border-transparent hover:border-gray-100 hover:shadow-sm group">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                        <Bell size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-800 group-hover:text-indigo-700 transition-colors">Notifikasi</h4>
                                        <p className="text-[11px] text-gray-500">Terima update real-time</p>
                                    </div>
                                </div>
                                <Toggle checked={notifications} onChange={(val) => { setNotifications(val); handleSettingChange('Notifikasi', val); }} />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white transition-all border border-transparent hover:border-gray-100 hover:shadow-sm group">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-slate-50 text-slate-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                        <Moon size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-800 group-hover:text-slate-700 transition-colors">Mode Gelap</h4>
                                        <p className="text-[11px] text-gray-500">Tampilan ramah mata</p>
                                    </div>
                                </div>
                                <Toggle checked={darkMode} onChange={(val) => { setDarkMode(val); handleSettingChange('Mode Gelap', val); }} />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white transition-all border border-transparent hover:border-gray-100 hover:shadow-sm group">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                        <Globe size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-800 group-hover:text-emerald-700 transition-colors">Bahasa / Language</h4>
                                        <p className="text-[11px] text-gray-500">Pilih bahasa aplikasi</p>
                                    </div>
                                </div>
                                <LanguageToggle 
                                    isEnglish={isEnglish} 
                                    onChange={(val) => { 
                                        setIsEnglish(val); 
                                        showToast(`Bahasa diubah ke ${val ? 'English' : 'Indonesia'}`, 'success'); 
                                    }} 
                                />
                            </div>
                        </div>
                    </GlassCard>

                    {/* Access Rights Card */}
                    <GlassCard 
                        title="Hak Akses" 
                        subtitle="Izin & Otoritas Pengguna"
                        action={<div className="p-2 bg-purple-50 rounded-lg text-purple-700 shadow-sm"><Shield size={18}/></div>}
                        className="!bg-white/80"
                    >
                        <div className="space-y-3">
                            <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                                        <Shield size={18} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-800">{user.role}</h4>
                                        <p className="text-[10px] text-gray-500">Level Akses Saat Ini</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    {user.role === 'Administrator EkoHajj' && (
                                        <>
                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <Check size={14} className="text-emerald-500" />
                                                <span>Akses Penuh Sistem</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <Check size={14} className="text-emerald-500" />
                                                <span>Manajemen Pengguna (Edit/Hapus)</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <Check size={14} className="text-emerald-500" />
                                                <span>Konfigurasi Global</span>
                                            </div>
                                        </>
                                    )}
                                    {user.role === 'Eksekutif EkoHajj' && (
                                        <>
                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <Check size={14} className="text-emerald-500" />
                                                <span>Dashboard Eksekutif</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <Check size={14} className="text-emerald-500" />
                                                <span>Laporan & Analitik Lengkap</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                                <X size={14} className="text-red-400" />
                                                <span>Manajemen Pengguna</span>
                                            </div>
                                        </>
                                    )}
                                    {user.role === 'Surveyor EkoHajj' && (
                                        <>
                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <Check size={14} className="text-emerald-500" />
                                                <span>Input Data Lapangan</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <Check size={14} className="text-emerald-500" />
                                                <span>Upload Bukti Foto</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                                <X size={14} className="text-red-400" />
                                                <span>Akses Laporan Eksekutif</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* Data Management */}
                <GlassCard 
                    title="Manajemen Data" 
                    subtitle="Export & Reset Data"
                    action={<div className="p-2 bg-blue-50 rounded-lg text-blue-700 shadow-sm"><Database size={18}/></div>}
                    className="h-full !bg-white/80"
                >
                    <div className="space-y-3">
                        <button 
                            onClick={handleExportData}
                            className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-white/50 hover:bg-white hover:border-blue-200 hover:shadow-md group transition-all duration-300"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-100 transition-colors">
                                    <Download size={20} />
                                </div>
                                <div className="text-left">
                                    <h4 className="text-sm font-bold text-gray-800 group-hover:text-blue-700 transition-colors">Export Laporan</h4>
                                    <p className="text-[11px] text-gray-500">Unduh data dalam format CSV/PDF</p>
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                                <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                            </div>
                        </button>

                        <button 
                            onClick={() => setIsResetModalOpen(true)}
                            disabled={isResetting}
                            className="w-full flex items-center justify-between p-4 rounded-xl border border-red-100 bg-red-50/30 hover:bg-red-50 hover:border-red-200 hover:shadow-md group transition-all duration-300"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-red-50 text-red-600 rounded-xl group-hover:bg-red-100 transition-colors">
                                    {isResetting ? <RefreshCw size={20} className="animate-spin" /> : <RefreshCw size={20} />}
                                </div>
                                <div className="text-left">
                                    <h4 className="text-sm font-bold text-red-700 group-hover:text-red-800 transition-colors">Reset Aplikasi</h4>
                                    <p className="text-[11px] text-red-500/80">Kembalikan ke pengaturan awal</p>
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-red-50/50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                                <ChevronRight size={16} className="text-red-300 group-hover:text-red-600 transition-colors" />
                            </div>
                        </button>
                    </div>
                </GlassCard>

                {/* Manajemen Akun */}
                <GlassCard 
                    title="Manajemen Akun" 
                    subtitle="Daftar Pengguna Terdaftar"
                    action={<div className="p-2 bg-emerald-50 rounded-lg text-emerald-700 shadow-sm"><UserIcon size={18}/></div>}
                    className="h-full md:col-span-2 !bg-white/80"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Pengguna</th>
                                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {users.map((u) => (
                                    <tr key={u.id} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full shadow-sm" />
                                                <div>
                                                    <p className="text-sm font-bold text-gray-800">{u.name}</p>
                                                    <p className="text-[10px] text-gray-500">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${
                                                u.role === 'Administrator EkoHajj' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                                u.role === 'Eksekutif EkoHajj' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                u.role === 'Surveyor EkoHajj' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                'bg-gray-100 text-gray-600 border-gray-200'
                                            }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                                                u.status === 'Active' 
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                                    : 'bg-gray-50 text-gray-500 border-gray-200'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}></span>
                                                {u.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <button 
                                                onClick={() => {
                                                    if (user.role === 'Administrator EkoHajj') {
                                                        handleEditProfile(u.id);
                                                    } else {
                                                        showToast("Hanya Administrator yang dapat mengedit pengguna lain", 'warning');
                                                    }
                                                }}
                                                className={`p-1.5 rounded-lg transition-all ${
                                                    user.role === 'Administrator EkoHajj' 
                                                        ? 'text-gray-400 hover:text-blue-600 hover:bg-blue-50 cursor-pointer' 
                                                        : 'text-gray-300 cursor-not-allowed'
                                                }`}
                                                title={user.role === 'Administrator EkoHajj' ? "Edit User" : "Akses Dibatasi"}
                                            >
                                                <SettingsIconLucide size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-center">
                        <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline transition-all flex items-center gap-1">
                            Lihat Semua Pengguna <ChevronRight size={12} />
                        </button>
                    </div>
                </GlassCard>
            </div>

            <div className="flex justify-center pt-8">
                <button 
                    onClick={onLogout}
                    className="flex items-center gap-2 px-8 py-3.5 bg-white border border-red-100 text-red-600 rounded-2xl font-bold text-sm hover:bg-red-50 hover:border-red-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm transition-all duration-300 group"
                >
                    <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Keluar dari Aplikasi
                </button>
            </div>

            <div className="text-center pt-6 pb-2">
                <p className="text-[10px] text-gray-400 font-mono tracking-wider opacity-60 hover:opacity-100 transition-opacity cursor-default">Version 1.0.2 (Build 2026.02.21)</p>
            </div>
            </div>
        </>
    );
};

// Simple Toggle Component
const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (val: boolean) => void }) => (
    <button 
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-7 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#064E3B]/20 ${checked ? 'bg-[#064E3B] shadow-inner' : 'bg-gray-200 shadow-inner'}`}
    >
        <span 
            className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow-md transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform ${checked ? 'translate-x-5' : 'translate-x-0'}`}
        />
    </button>
);

const LanguageToggle = ({ isEnglish, onChange }: { isEnglish: boolean; onChange: (val: boolean) => void }) => (
    <button 
        onClick={() => onChange(!isEnglish)}
        className="relative w-20 h-9 bg-gray-100/80 backdrop-blur-sm rounded-lg p-1 flex items-center shadow-inner border border-gray-200 hover:border-gray-300 transition-all cursor-pointer group"
    >
        <div 
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-md shadow-sm border border-gray-100 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isEnglish ? 'left-[calc(50%+2px)]' : 'left-1'}`}
        ></div>
        
        <div className={`flex-1 flex items-center justify-center z-10 transition-all duration-300 ${!isEnglish ? 'opacity-100 scale-105' : 'opacity-50 scale-95'}`}>
            <span className={`text-xs font-bold ${!isEnglish ? 'text-[#064E3B]' : 'text-gray-400'}`}>ID</span>
        </div>
        
        <div className={`flex-1 flex items-center justify-center z-10 transition-all duration-300 ${isEnglish ? 'opacity-100 scale-105' : 'opacity-50 scale-95'}`}>
            <span className={`text-xs font-bold ${isEnglish ? 'text-[#064E3B]' : 'text-gray-400'}`}>EN</span>
        </div>
    </button>
);
