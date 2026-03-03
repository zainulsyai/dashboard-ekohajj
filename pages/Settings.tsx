import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/GlassCard';
import { User as UserIcon, Bell, Moon, Shield, Database, LogOut, ChevronRight, Save, RefreshCw, Download, HelpCircle, Mail, Settings as SettingsIconLucide, X, Globe, Check, AlertTriangle, Camera, Eye, EyeOff, LayoutDashboard, Users, FileText, PieChart, PenTool, Plus, Trash2, Search, UserPlus } from 'lucide-react';
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
    
    const { user, updateUser, users, updateUserById, addUser, deleteUser } = useUser();

    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [isEnglish, setIsEnglish] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isUserCardOpen, setIsUserCardOpen] = useState(false); // New User Card Modal
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [isAllUsersModalOpen, setIsAllUsersModalOpen] = useState(false); // New All Users Modal
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // New Delete Confirmation Modal
    const [userToDelete, setUserToDelete] = useState<string | null>(null); // Track user to delete
    const [isAddingUser, setIsAddingUser] = useState(false); // Track if adding new user
    const [searchQuery, setSearchQuery] = useState(''); // Search query for users
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

    // Access Rights State
    const [rolePermissions, setRolePermissions] = useState<Record<string, Record<string, boolean>>>({
        'Administrator EkoHajj': {
            'menu_dashboard': true,
            'menu_data_entry': true,
            'menu_reports': true,
            'menu_visualization': true,
            'menu_settings': true,
            'user_management': true,
            'data_export': true,
            'system_config': true,
        },
        'Eksekutif EkoHajj': {
            'menu_dashboard': true,
            'menu_data_entry': false,
            'menu_reports': true,
            'menu_visualization': true,
            'menu_settings': true,
            'user_management': false,
            'data_export': true,
            'system_config': false,
        },
        'Surveyor EkoHajj': {
            'menu_dashboard': true,
            'menu_data_entry': true,
            'menu_reports': false,
            'menu_visualization': false,
            'menu_settings': true,
            'user_management': false,
            'data_export': false,
            'system_config': false,
        }
    });
    const [selectedRole, setSelectedRole] = useState<string>('Administrator EkoHajj');

    const handlePermissionToggle = (role: string, permission: string) => {
        setRolePermissions(prev => ({
            ...prev,
            [role]: {
                ...prev[role],
                [permission]: !prev[role][permission]
            }
        }));
        showToast(`Izin ${permission} untuk ${role} diperbarui`, 'success');
    };

    const permissionConfig: Record<string, { label: string; desc: string; icon: any; color: string; bg: string; category: string }> = {
        'menu_dashboard': { label: 'Dashboard', desc: 'Akses halaman utama', icon: LayoutDashboard, color: 'text-blue-600', bg: 'bg-blue-50', category: 'Menu Halaman' },
        'menu_data_entry': { label: 'Input Data', desc: 'Akses portal input data', icon: PenTool, color: 'text-orange-600', bg: 'bg-orange-50', category: 'Menu Halaman' },
        'menu_reports': { label: 'Laporan', desc: 'Akses halaman laporan', icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50', category: 'Menu Halaman' },
        'menu_visualization': { label: 'Visualisasi', desc: 'Akses grafik & analitik', icon: PieChart, color: 'text-purple-600', bg: 'bg-purple-50', category: 'Menu Halaman' },
        'menu_settings': { label: 'Pengaturan', desc: 'Akses konfigurasi akun', icon: SettingsIconLucide, color: 'text-slate-600', bg: 'bg-slate-50', category: 'Menu Halaman' },
        
        'user_management': { label: 'Manajemen User', desc: 'Tambah/Edit/Hapus User', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50', category: 'Fungsionalitas' },
        'data_export': { label: 'Export Data', desc: 'Unduh CSV/PDF', icon: Download, color: 'text-pink-600', bg: 'bg-pink-50', category: 'Fungsionalitas' },
        'system_config': { label: 'Config Sistem', desc: 'Pengaturan Global', icon: Database, color: 'text-cyan-600', bg: 'bg-cyan-50', category: 'Fungsionalitas' },
    };

    useEffect(() => {
        if (isProfileModalOpen) {
            if (isAddingUser) {
                // Reset fields for adding new user
                setEditName('');
                setEditRole('Surveyor EkoHajj'); // Default role
                setEditEmail('');
                setEditId('');
                setEditUsername('');
                setEditPassword('');
                setEditAvatar(`https://ui-avatars.com/api/?name=New+User&background=random&color=fff`);
                setShowPassword(false);
            } else {
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
        }
    }, [isProfileModalOpen, user, users, editingUserId, isAddingUser]);
    
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

    const handleAddUser = () => {
        setIsAddingUser(true);
        setEditingUserId(null);
        setIsProfileModalOpen(true);
    };

    const handleEditProfile = (userId?: string) => {
        setIsAddingUser(false);
        setEditingUserId(userId || user.id);
        setIsProfileModalOpen(true);
        setIsUserCardOpen(false); // Close card if open
    };

    const handleDeleteUser = (userId: string) => {
        setUserToDelete(userId);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteUser = () => {
        if (userToDelete) {
            deleteUser(userToDelete);
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
            showToast("Pengguna berhasil dihapus", 'success');
        }
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

        // 3. Required Fields
        if (!editName || !editUsername || !editRole) {
            showToast("Semua field wajib diisi", 'warning');
            return;
        }

        if (isAddingUser) {
            // Check if ID or Username already exists
            if (users.some(u => u.id === editId)) {
                showToast("ID Panitia sudah digunakan", 'warning');
                return;
            }
            if (users.some(u => u.username?.toLowerCase() === editUsername.toLowerCase())) {
                showToast("Username sudah digunakan", 'warning');
                return;
            }

            const newUser = {
                id: editId,
                name: editName,
                role: editRole,
                email: editEmail,
                username: editUsername,
                password: editPassword || '123456', // Default password if empty
                avatar: editAvatar,
                status: 'Active' as const
            };
            addUser(newUser);
            showToast("Pengguna baru berhasil ditambahkan", 'success');
        } else {
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
            showToast("Profil berhasil diperbarui", 'success');
        }
        
        setIsProfileModalOpen(false);
        setEditingUserId(null);
        setIsAddingUser(false);
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
                    <div className="relative bg-white rounded-3xl shadow-2xl animate-zoom-in max-w-3xl w-full mx-auto overflow-hidden flex flex-col md:flex-row min-h-[400px] max-h-[85vh] overflow-y-auto md:overflow-visible">
                        
                        {/* Left Side: Visual Identity */}
                        <div className="w-full md:w-5/12 bg-gradient-to-br from-[#064E3B] to-[#047857] relative flex flex-col items-center justify-center p-6 md:p-8 text-white text-center z-10">
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
                    <div className="relative bg-white rounded-2xl md:rounded-3xl shadow-2xl animate-zoom-in max-w-4xl w-full mx-auto overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:min-h-[500px]">
                        
                        {/* Left Side: Visual Identity (Hidden on Mobile/Tablet Portrait) */}
                        <div className="hidden md:flex md:w-5/12 bg-gradient-to-br from-[#064E3B] to-[#047857] relative flex-col items-center justify-center p-8 text-white text-center z-10 shrink-0">
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
                                        id="avatar-upload-desktop" 
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
                                <h2 className="text-2xl font-bold leading-tight text-white drop-shadow-md line-clamp-1">{editName || user.name}</h2>
                                <p className="text-xs text-emerald-100 font-medium">Klik foto untuk mengubah</p>
                            </div>
                        </div>

                        {/* Right Side: Edit Form */}
                        <div className="w-full md:w-7/12 bg-white relative flex flex-col h-full overflow-hidden">
                            {/* Close Button */}
                            <button 
                                onClick={() => setIsProfileModalOpen(false)}
                                className="absolute top-3 right-3 md:top-5 md:right-5 p-1.5 md:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all z-20"
                            >
                                <X size={18} className="md:w-5 md:h-5" />
                            </button>

                            {/* Header (Fixed) */}
                            <div className="px-4 pt-4 pb-3 md:px-8 md:pt-8 md:pb-6 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white z-10">
                                <div>
                                    <div className="flex items-center gap-2 mb-0.5 md:mb-1">
                                        <div className={`p-1 md:p-1.5 rounded-lg ${isAddingUser ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                            {isAddingUser ? (
                                                <UserPlus size={14} className="md:w-[18px] md:h-[18px]" />
                                            ) : (
                                                <SettingsIconLucide size={14} className="md:w-[18px] md:h-[18px]" />
                                            )}
                                        </div>
                                        <h3 className="text-sm md:text-lg font-bold text-gray-800">
                                            {isAddingUser ? 'Tambah Pengguna' : 'Edit Profil'}
                                        </h3>
                                    </div>
                                    <p className="text-gray-500 text-[10px] md:text-xs hidden sm:block">
                                        {isAddingUser ? 'Tambahkan pengguna baru ke sistem.' : 'Perbarui informasi akun Anda.'}
                                    </p>
                                </div>
                                
                                {/* Mobile Avatar Edit (Visible only on small screens) */}
                                <div className="md:hidden relative group mr-6">
                                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-100 relative bg-gray-50">
                                        <img src={editAvatar} alt="Avatar" className="w-full h-full object-cover" />
                                        <input 
                                            type="file" 
                                            accept="image/png, image/jpeg" 
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
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
                                    <div className="absolute -bottom-1 -right-1 bg-emerald-600 rounded-full p-0.5 border border-white pointer-events-none">
                                        <Camera size={8} className="text-white" />
                                    </div>
                                </div>
                            </div>

                            {/* Form Grid (Scrollable) */}
                            <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-3 md:gap-5">
                                <div className="col-span-1 sm:col-span-2 md:col-span-1">
                                    <label className="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nama Lengkap</label>
                                    <input 
                                        type="text" 
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="w-full px-3 py-2 sm:py-1.5 md:px-4 md:py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs md:text-sm font-medium focus:outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all text-gray-800"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Username</label>
                                    <input 
                                        type="text" 
                                        value={editUsername}
                                        onChange={(e) => setEditUsername(e.target.value)}
                                        className="w-full px-3 py-2 sm:py-1.5 md:px-4 md:py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs md:text-sm font-medium focus:outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all text-gray-800"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">ID Panitia</label>
                                    <input 
                                        type="text" 
                                        value={editId}
                                        onChange={(e) => {
                                            if (/^\d*$/.test(e.target.value)) setEditId(e.target.value);
                                        }}
                                        minLength={7}
                                        className="w-full px-3 py-2 sm:py-1.5 md:px-4 md:py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs md:text-sm font-mono font-medium focus:outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all text-gray-800"
                                    />
                                </div>

                                <div className="col-span-1 sm:col-span-2 md:col-span-1">
                                    <label className="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Role / Jabatan</label>
                                    {user.role === 'Administrator EkoHajj' ? (
                                        <div className="relative">
                                            <select
                                                value={editRole}
                                                onChange={(e) => setEditRole(e.target.value)}
                                                className="w-full px-3 py-2 sm:py-1.5 md:px-4 md:py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs md:text-sm font-medium focus:outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all text-gray-800 appearance-none"
                                            >
                                                <option value="Administrator EkoHajj">Administrator EkoHajj</option>
                                                <option value="Eksekutif EkoHajj">Eksekutif EkoHajj</option>
                                                <option value="Surveyor EkoHajj">Surveyor EkoHajj</option>
                                            </select>
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                                <ChevronRight size={14} className="md:w-4 md:h-4 rotate-90" />
                                            </div>
                                        </div>
                                    ) : (
                                        <input 
                                            type="text" 
                                            value={editRole}
                                            readOnly
                                            className="w-full px-3 py-2 sm:py-1.5 md:px-4 md:py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-xs md:text-sm font-medium text-gray-500 cursor-not-allowed"
                                        />
                                    )}
                                </div>

                                <div>
                                    <label className="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
                                    <input 
                                        type="email" 
                                        value={editEmail}
                                        onChange={(e) => setEditEmail(e.target.value)}
                                        className="w-full px-3 py-2 sm:py-1.5 md:px-4 md:py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs md:text-sm font-medium focus:outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all text-gray-800"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
                                    <div className="relative">
                                        <input 
                                            type={showPassword ? "text" : "password"}
                                            value={editPassword}
                                            onChange={(e) => setEditPassword(e.target.value)}
                                            placeholder="Ubah Password"
                                            className="w-full px-3 py-2 sm:py-1.5 md:px-4 md:py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs md:text-sm font-medium focus:outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all text-gray-800 pr-8 md:pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={14} className="md:w-[18px] md:h-[18px]" /> : <Eye size={14} className="md:w-[18px] md:h-[18px]" />}
                                        </button>
                                    </div>
                                </div>
                                </div>
                            </div>

                            {/* Footer (Fixed) */}
                            <div className="px-4 py-3 md:px-8 md:py-6 border-t border-gray-100 flex gap-3 shrink-0 bg-white z-10">
                                <button 
                                    onClick={() => setIsProfileModalOpen(false)}
                                    className="flex-1 px-3 py-2 md:px-4 md:py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors text-xs md:text-sm"
                                >
                                    Batal
                                </button>
                                <button 
                                    onClick={handleSaveProfile}
                                    className={`flex-1 px-3 py-2 md:px-4 md:py-2.5 text-white rounded-xl font-bold transition-colors text-xs md:text-sm shadow-lg flex items-center justify-center gap-2 ${
                                        isAddingUser 
                                            ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20' 
                                            : 'bg-[#064E3B] hover:bg-[#053d2e] shadow-[#064E3B]/20'
                                    }`}
                                >
                                    {isAddingUser ? (
                                        <>
                                            <UserPlus size={14} className="md:w-[18px] md:h-[18px]" />
                                            <span>Tambah User</span>
                                        </>
                                    ) : (
                                        <>
                                            <Save size={14} className="md:w-[18px] md:h-[18px]" />
                                            <span>Simpan Perubahan</span>
                                        </>
                                    )}
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
            <div className="flex flex-row items-center gap-2 w-full sm:w-auto">
                <button 
                    onClick={() => handleEditProfile()}
                    className="flex-1 sm:flex-none w-full sm:w-auto px-3 py-2 sm:px-5 sm:py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-[10px] sm:text-xs md:text-sm font-bold transition-all text-white hover:text-[#D4AF37] whitespace-nowrap shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center sm:justify-start gap-2 group"
                >
                    <span>Edit Profil</span>
                    <SettingsIconLucide size={14} className="sm:w-4 sm:h-4 group-hover:rotate-90 transition-transform duration-500" />
                </button>
            </div>
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
                                <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                                        <Bell size={20} />
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-sm font-bold text-gray-800 group-hover:text-indigo-700 transition-colors truncate">Notifikasi</h4>
                                        <p className="text-[11px] text-gray-500 truncate">Terima update real-time</p>
                                    </div>
                                </div>
                                <div className="flex-shrink-0 ml-2">
                                    <Toggle checked={notifications} onChange={(val) => { setNotifications(val); handleSettingChange('Notifikasi', val); }} />
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white transition-all border border-transparent hover:border-gray-100 hover:shadow-sm group">
                                <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                                    <div className="p-2.5 bg-slate-50 text-slate-600 rounded-xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                                        <Moon size={20} />
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-sm font-bold text-gray-800 group-hover:text-slate-700 transition-colors truncate">Mode Gelap</h4>
                                        <p className="text-[11px] text-gray-500 truncate">Tampilan ramah mata</p>
                                    </div>
                                </div>
                                <div className="flex-shrink-0 ml-2">
                                    <Toggle checked={darkMode} onChange={(val) => { setDarkMode(val); handleSettingChange('Mode Gelap', val); }} />
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white transition-all border border-transparent hover:border-gray-100 hover:shadow-sm group">
                                <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                                    <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                                        <Globe size={20} />
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-sm font-bold text-gray-800 group-hover:text-emerald-700 transition-colors truncate">Bahasa / Language</h4>
                                        <p className="text-[11px] text-gray-500 truncate">Pilih bahasa aplikasi</p>
                                    </div>
                                </div>
                                <div className="flex-shrink-0 ml-2">
                                    <LanguageToggle 
                                        isEnglish={isEnglish} 
                                        onChange={(val) => { 
                                            setIsEnglish(val); 
                                            showToast(`Bahasa diubah ke ${val ? 'English' : 'Indonesia'}`, 'success'); 
                                        }} 
                                    />
                                </div>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Access Rights Card - MOVED OUT */}
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
                    action={
                        <div className="flex items-center gap-2">
                            {user.role === 'Administrator EkoHajj' && (
                                <button 
                                    onClick={handleAddUser}
                                    className="px-2 py-1.5 sm:px-3 sm:py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-md transition-all flex items-center gap-1.5 active:scale-95"
                                    title="Tambah Pengguna Baru"
                                >
                                    <UserPlus size={14} className="sm:w-4 sm:h-4" />
                                    <span className="text-[10px] sm:text-xs font-bold">Tambah</span>
                                </button>
                            )}
                            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700 shadow-sm hidden sm:block"><UserIcon size={18}/></div>
                        </div>
                    }
                    className="h-full md:col-span-2 !bg-white/80"
                >
                    {/* Desktop Table View (Visible on Large Screens) */}
                    <div className="hidden lg:block overflow-x-auto">
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
                                {users.slice(0, 5).map((u) => ( // Limit to 5 for preview
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
                                            <div className="flex items-center justify-end gap-2">
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
                                                {user.role === 'Administrator EkoHajj' && u.id !== user.id && (
                                                    <button 
                                                        onClick={() => handleDeleteUser(u.id)}
                                                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                                                        title="Hapus User"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile & Tablet Card View (Visible on Small & Medium Screens) */}
                    <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                        {users.slice(0, 5).map((u) => (
                            <div key={u.id} className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col gap-2 transition-all hover:shadow-md">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full shadow-sm flex-shrink-0 border border-gray-100" />
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-gray-900 truncate">{u.name}</p>
                                            <p className="text-[10px] text-gray-500 truncate">{u.email}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide border ${
                                                    u.role === 'Administrator EkoHajj' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                                    u.role === 'Eksekutif EkoHajj' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                    u.role === 'Surveyor EkoHajj' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                    'bg-gray-100 text-gray-600 border-gray-200'
                                                }`}>
                                                    {u.role.split(' ')[0]}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <button 
                                            onClick={() => {
                                                if (user.role === 'Administrator EkoHajj') {
                                                    handleEditProfile(u.id);
                                                } else {
                                                    showToast("Hanya Administrator yang dapat mengedit pengguna lain", 'warning');
                                                }
                                            }}
                                            className={`p-1.5 rounded-lg transition-all flex-shrink-0 ${
                                                user.role === 'Administrator EkoHajj' 
                                                    ? 'bg-gray-50 border border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 cursor-pointer shadow-sm' 
                                                    : 'text-gray-300 cursor-not-allowed'
                                            }`}
                                            title={user.role === 'Administrator EkoHajj' ? "Edit User" : "Akses Dibatasi"}
                                        >
                                            <SettingsIconLucide size={14} />
                                        </button>
                                        {user.role === 'Administrator EkoHajj' && u.id !== user.id && (
                                            <button 
                                                onClick={() => handleDeleteUser(u.id)}
                                                className="p-1.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 shadow-sm transition-all flex-shrink-0"
                                                title="Hapus User"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                                    <span className="text-[9px] text-gray-400 font-mono">ID: {u.id}</span>
                                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide border ${
                                        u.status === 'Active' 
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                            : 'bg-gray-50 text-gray-500 border-gray-200'
                                    }`}>
                                        <span className={`w-1 h-1 rounded-full ${u.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}></span>
                                        {u.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100">
                        <button 
                            onClick={() => setIsAllUsersModalOpen(true)}
                            className="w-full md:w-auto mx-auto px-4 py-2 md:py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 group"
                        >
                            <span>Lihat Semua Pengguna</span>
                            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </GlassCard>
            </div>

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="absolute inset-0" onClick={() => setIsDeleteModalOpen(false)}></div>
                    <div className="relative bg-white p-6 rounded-2xl shadow-2xl animate-zoom-in max-w-sm w-full mx-auto border border-red-100">
                        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4 mx-auto text-red-500">
                            <Trash2 size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Hapus Pengguna?</h3>
                        <p className="text-sm text-gray-500 text-center mb-6">
                            Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors text-sm"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={confirmDeleteUser}
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors text-sm shadow-md shadow-red-200"
                            >
                                Ya, Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <GlassCard 
                title="Hak Akses & Perizinan" 
                subtitle="Kontrol penuh atas akses menu dan fungsionalitas untuk setiap role pengguna"
                action={<div className="p-2 bg-purple-50 rounded-lg text-purple-700 shadow-sm"><Shield size={18}/></div>}
                className="!bg-white/80 mt-6"
            >
                <div className="space-y-6">
                    {user.role === 'Administrator EkoHajj' ? (
                        <>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                                <div>
                                    <h4 className="text-sm font-bold text-gray-800">Konfigurasi Role</h4>
                                    <p className="text-xs text-gray-500">Pilih role untuk mengatur izin akses</p>
                                </div>
                                <div className="relative w-full md:w-64">
                                    <select
                                        value={selectedRole}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                        className="w-full pl-4 pr-10 py-2.5 bg-white border border-purple-200 rounded-xl text-sm font-bold text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-200 appearance-none cursor-pointer shadow-sm hover:border-purple-300 transition-all"
                                    >
                                        <option value="Administrator EkoHajj">Administrator EkoHajj</option>
                                        <option value="Eksekutif EkoHajj">Eksekutif EkoHajj</option>
                                        <option value="Surveyor EkoHajj">Surveyor EkoHajj</option>
                                    </select>
                                    <ChevronRight size={16} className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-purple-500 pointer-events-none" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {['Menu Halaman', 'Fungsionalitas'].map((category) => (
                                    <div key={category} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                                        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                                            <div className={`p-1.5 rounded-lg ${category === 'Menu Halaman' ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600'}`}>
                                                {category === 'Menu Halaman' ? <LayoutDashboard size={16} /> : <Database size={16} />}
                                            </div>
                                            <h5 className="text-sm font-bold text-gray-700 uppercase tracking-wide">{category}</h5>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {Object.entries(permissionConfig)
                                                .filter(([_, config]) => config.category === category)
                                                .map(([key, config]) => {
                                                    const Icon = config.icon;
                                                    const isEnabled = rolePermissions[selectedRole][key];
                                                    return (
                                                        <div 
                                                            key={key} 
                                                            onClick={() => handlePermissionToggle(selectedRole, key)}
                                                            className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer group ${isEnabled ? 'bg-white border-purple-200 shadow-md shadow-purple-50' : 'bg-gray-50 border-transparent hover:bg-gray-100'}`}
                                                        >
                                                            <div className={`p-2 rounded-lg shrink-0 transition-colors ${isEnabled ? config.bg + ' ' + config.color : 'bg-gray-200 text-gray-400'}`}>
                                                                <Icon size={18} />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center justify-between mb-0.5">
                                                                    <h4 className={`text-xs font-bold truncate ${isEnabled ? 'text-gray-800' : 'text-gray-500'}`}>{config.label}</h4>
                                                                    <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${isEnabled ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                                                                        <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${isEnabled ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                                                    </div>
                                                                </div>
                                                                <p className="text-[10px] text-gray-400 line-clamp-2 leading-tight">{config.desc}</p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 italic bg-gray-50 py-2 rounded-lg">
                                <RefreshCw size={12} className="animate-spin-slow" />
                                <span>Semua perubahan hak akses tersimpan secara otomatis dan berlaku real-time</span>
                            </div>
                        </>
                    ) : (
                        <div className="p-6 rounded-2xl bg-purple-50/30 border border-purple-100">
                            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-purple-100">
                                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center shadow-inner">
                                    <Shield size={24} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-800">{user.role}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="relative flex h-2.5 w-2.5">
                                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                        </span>
                                        <p className="text-xs text-gray-500 font-medium">Status Akun: Aktif & Terverifikasi</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {['Menu Halaman', 'Fungsionalitas'].map((category) => (
                                    <div key={category}>
                                        <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                            {category === 'Menu Halaman' ? <LayoutDashboard size={14} /> : <Database size={14} />}
                                            {category}
                                        </h5>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {Object.entries(permissionConfig)
                                                .filter(([_, config]) => config.category === category)
                                                .map(([key, config]) => {
                                                    const Icon = config.icon;
                                                    const isEnabled = rolePermissions[user.role][key];
                                                    return (
                                                        <div key={key} className={`flex items-center gap-3 p-2.5 rounded-xl border ${isEnabled ? 'bg-white border-purple-100 shadow-sm' : 'bg-gray-50 border-transparent opacity-60'}`}>
                                                            <div className={`p-1.5 rounded-lg ${isEnabled ? 'bg-purple-50 text-purple-600' : 'bg-gray-200 text-gray-400'}`}>
                                                                <Icon size={14} />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <span className={`text-xs font-bold block truncate ${isEnabled ? 'text-gray-700' : 'text-gray-400 line-through'}`}>
                                                                    {config.label}
                                                                </span>
                                                            </div>
                                                            {isEnabled ? (
                                                                <Check size={14} className="text-emerald-500" strokeWidth={3} />
                                                            ) : (
                                                                <X size={14} className="text-gray-400" strokeWidth={3} />
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </GlassCard>

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

            {/* All Users Modal */}
            {isAllUsersModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="absolute inset-0" onClick={() => setIsAllUsersModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl animate-zoom-in flex flex-col overflow-hidden border border-gray-100">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Semua Pengguna</h2>
                                <p className="text-sm text-gray-500">Kelola semua akun pengguna terdaftar</p>
                            </div>
                            <button 
                                onClick={() => setIsAllUsersModalOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        {/* Toolbar */}
                        <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex flex-col sm:flex-row gap-3 justify-between items-center">
                            <div className="relative w-full sm:w-auto sm:flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="Cari pengguna..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                />
                            </div>
                            {user.role === 'Administrator EkoHajj' && (
                                <button 
                                    onClick={() => {
                                        setIsAllUsersModalOpen(false);
                                        handleAddUser();
                                    }}
                                    className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors text-sm flex items-center justify-center gap-2 shadow-sm"
                                >
                                    <UserPlus size={18} />
                                    Tambah Pengguna
                                </button>
                            )}
                        </div>

                        {/* User Grid */}
                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {users.filter(u => 
                                    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    u.role.toLowerCase().includes(searchQuery.toLowerCase())
                                ).map((u) => (
                                    <div key={u.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-gradient-to-l from-white via-white to-transparent pl-8">
                                            {user.role === 'Administrator EkoHajj' && (
                                                <>
                                                    <button 
                                                        onClick={() => {
                                                            setIsAllUsersModalOpen(false);
                                                            handleEditProfile(u.id);
                                                        }}
                                                        className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <SettingsIconLucide size={14} />
                                                    </button>
                                                    {u.id !== user.id && (
                                                        <button 
                                                            onClick={() => handleDeleteUser(u.id)}
                                                            className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                                            title="Hapus"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                        
                                        <div className="flex items-center gap-3 mb-3">
                                            <img src={u.avatar} alt={u.name} className="w-12 h-12 rounded-full shadow-sm border-2 border-white" />
                                            <div className="min-w-0">
                                                <h3 className="font-bold text-gray-900 truncate text-sm">{u.name}</h3>
                                                <p className="text-xs text-gray-500 truncate">{u.email}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-gray-500">Role</span>
                                                <span className={`px-2 py-0.5 rounded-md font-medium ${
                                                    u.role === 'Administrator EkoHajj' ? 'bg-purple-50 text-purple-700' :
                                                    u.role === 'Eksekutif EkoHajj' ? 'bg-amber-50 text-amber-700' :
                                                    u.role === 'Surveyor EkoHajj' ? 'bg-blue-50 text-blue-700' :
                                                    'bg-gray-100 text-gray-600'
                                                }`}>
                                                    {u.role.split(' ')[0]}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-gray-500">Status</span>
                                                <span className={`flex items-center gap-1.5 ${u.status === 'Active' ? 'text-emerald-600' : 'text-gray-400'}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                                                    {u.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-gray-500">ID</span>
                                                <span className="font-mono text-gray-700">{u.id}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {users.filter(u => 
                                u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                u.email.toLowerCase().includes(searchQuery.toLowerCase())
                            ).length === 0 && (
                                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                    <Search size={48} className="mb-4 opacity-20" />
                                    <p>Tidak ada pengguna ditemukan</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
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
