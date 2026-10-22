import React from 'react';
import { 
  ShieldCheck, 
  Plus, 
  BookOpen, 
  Target, 
  SlidersHorizontal, 
  LogOut, 
  Sparkles,
  FileText,
  AlertCircle
} from 'lucide-react';

interface AdminWorkspaceBannerProps {
  currentUser: { name: string; role: string; email: string } | null;
  onOpenCreatePublication: () => void;
  onOpenCreateJournal: () => void;
  onOpenCreateProgram: () => void;
  onNavigateToManage: () => void;
  onLogout: () => void;
  totalPublications: number;
  draftCount: number;
}

export const AdminWorkspaceBanner: React.FC<AdminWorkspaceBannerProps> = ({
  currentUser,
  onOpenCreatePublication,
  onOpenCreateJournal,
  onOpenCreateProgram,
  onNavigateToManage,
  onLogout,
  totalPublications,
  draftCount,
}) => {
  return (
    <div className="bg-neutral-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-neutral-800 animate-in fade-in slide-in-from-top-2 duration-300 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Admin Status & User Info */}
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-3xs font-bold uppercase tracking-wider border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Mode Pengelola Aktif
              </span>
              <span className="text-2xs text-neutral-400 hidden sm:inline">
                Akses Langsung: Unggah · Sunting · Hapus Data
              </span>
            </div>

            <h3 className="text-sm font-bold text-white mt-0.5">
              Selamat Bekerja, {currentUser?.name || 'Administrator'}
            </h3>
            <p className="text-2xs text-neutral-400">
              {currentUser?.role || 'Kurator & Editor Publikasi'} · <span className="font-mono">{currentUser?.email}</span>
            </p>
          </div>
        </div>

        {/* Right: Quick In-Context Actions */}
        <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-white/10">
          {/* Quick Upload Publication */}
          <button
            onClick={onOpenCreatePublication}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-neutral-900 hover:bg-neutral-100 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
            title="Unggah Foto & Kegiatan Baru"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5px]" />
            <span>Unggah Kegiatan</span>
          </button>

          {/* Quick Create Journal */}
          <button
            onClick={onOpenCreateJournal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/15 rounded-xl text-xs font-semibold transition-all active:scale-95"
            title="Tulis Naskah Jurnal Lapangan"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Tulis Jurnal</span>
          </button>

          {/* Quick Create Program */}
          <button
            onClick={onOpenCreateProgram}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/15 rounded-xl text-xs font-semibold transition-all active:scale-95"
            title="Tambah Target Program 2025-2029"
          >
            <Target className="w-3.5 h-3.5" />
            <span>Target Program</span>
          </button>

          {/* Manage Archive Link */}
          <button
            onClick={onNavigateToManage}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-neutral-200 border border-white/15 rounded-xl text-xs font-semibold transition-all"
            title="Buka Pusat Arsip Lengkap"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Pusat Arsip</span>
            {draftCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-neutral-900 text-3xs font-mono font-bold">
                {draftCount} Draf
              </span>
            )}
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-white/5 rounded-xl transition-colors ml-1"
            title="Keluar dari Sesi Administrator"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
