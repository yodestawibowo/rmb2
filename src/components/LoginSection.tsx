import React, { useState } from 'react';
import { 
  LogIn, 
  Lock, 
  Mail, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Sparkles,
  UserCheck,
  KeyRound
} from 'lucide-react';

interface LoginSectionProps {
  onLoginSuccess: (user: { name: string; role: string; email: string }) => void;
  redirectReason?: string | null;
}

export const LoginSection: React.FC<LoginSectionProps> = ({
  onLoginSuccess,
  redirectReason,
}) => {
  const [email, setEmail] = useState('admin@wartakarsa.id');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Quick 1-click admin login
  const handleQuickAdminLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      onLoginSuccess({
        name: 'Rian Prasetyo, M.Kom.',
        role: 'Administrator & Kurator Publikasi',
        email: 'admin@wartakarsa.id',
      });
      setIsLoading(false);
    }, 250);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      if (email.trim() && password.length >= 4) {
        onLoginSuccess({
          name: email.includes('admin') ? 'Rian Prasetyo, M.Kom.' : 'Pengelola Portal',
          role: 'Administrator & Kurator Publikasi',
          email: email.trim(),
        });
      } else {
        setError('Harap masukkan alamat email yang valid dan kata sandi minimal 4 karakter.');
      }
      setIsLoading(false);
    }, 350);
  };

  return (
    <div className="max-w-md mx-auto my-6 sm:my-10 px-4 animate-in fade-in duration-300">
      <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
        {/* Friendly Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-neutral-900 text-white flex items-center justify-center shadow-xs shrink-0">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-3xs font-bold uppercase tracking-wider mb-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Ruang Pengelola WartaKarsa</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900">
              Selamat Datang, Rekan Admin
            </h2>
          </div>
        </div>

        <p className="text-xs text-neutral-500 leading-relaxed mb-5">
          Akses cepat untuk mempublikasikan kegiatan, memantau kurva target program unggulan, dan mengelola naskah jurnal lapangan.
        </p>

        {/* Redirect notice if triggered by protected action */}
        {redirectReason && (
          <div className="mb-5 p-3 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2.5">
            <KeyRound className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
            <div className="leading-relaxed">
              <span className="font-semibold block mb-0.5">Akses Memerlukan Izin</span>
              <span>{redirectReason}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-5 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs">
            {error}
          </div>
        )}

        {/* 1-CLICK INSTANT ADMIN LOGIN (Friendly & Effortless) */}
        <div className="p-4 bg-gradient-to-b from-neutral-50 to-neutral-100/70 rounded-2xl border border-neutral-200/90 space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-bold">
                RP
              </div>
              <div>
                <span className="text-xs font-bold text-neutral-900 block leading-tight">
                  Rian Prasetyo, M.Kom.
                </span>
                <span className="text-2xs text-neutral-500 font-mono">
                  admin@wartakarsa.id
                </span>
              </div>
            </div>
            <span className="text-3xs font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
              Akun Utama
            </span>
          </div>

          <button
            type="button"
            onClick={handleQuickAdminLogin}
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-xs group"
          >
            {isLoading ? (
              <span className="animate-pulse">Menyiapkan Workspace...</span>
            ) : (
              <>
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>Masuk Cepat sebagai Admin</span>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </div>

        {/* Toggle to custom form if needed */}
        <div className="text-center mb-3">
          <button
            type="button"
            onClick={() => setShowManualForm(!showManualForm)}
            className="text-2xs text-neutral-500 hover:text-neutral-900 font-medium underline transition-colors"
          >
            {showManualForm ? 'Tutup Formulir Manual' : 'Atau Masuk Menggunakan Email & Sandi Lain'}
          </button>
        </div>

        {/* Manual Login Form */}
        {showManualForm && (
          <form onSubmit={handleManualSubmit} className="space-y-3.5 pt-2 border-t border-neutral-100 animate-in fade-in duration-200">
            <div>
              <label className="block text-2xs font-semibold text-neutral-700 mb-1">
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@wartakarsa.id"
                  className="w-full text-xs pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white text-neutral-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-2xs font-semibold text-neutral-700 mb-1">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs pl-9 pr-9 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white text-neutral-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-0.5"
                  title={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-70 mt-1"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Verifikasi & Masuk</span>
            </button>
          </form>
        )}

        {/* Friendly Privileges List */}
        <div className="mt-5 pt-4 border-t border-neutral-100">
          <span className="text-3xs uppercase tracking-wider font-semibold text-neutral-400 block mb-2">
            Fasilitas Akses Pengelola:
          </span>
          <div className="grid grid-cols-1 gap-1.5 text-2xs text-neutral-600">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Tambah &amp; publikasikan kegiatan baru beserta galeri foto</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Rencanakan target tahunan &amp; kurva grafik program unggulan</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Kelola, edit, dan hapus kategori program dengan mudah</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
