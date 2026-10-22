import React from 'react';
import { Printer, LogIn, LogOut, ShieldCheck, Camera, LayoutGrid, Target } from 'lucide-react';

interface HeaderTopProps {
  currentTab?: string;
  onTabChange?: (tab: string) => void;
  onQuickPrintAll: () => void;
  onBrandClick?: () => void;
  isLoggedIn?: boolean;
  onLogout?: () => void;
  onOpenLogin?: () => void;
  onOpenAdminDashboard?: () => void;
}

export const HeaderTop: React.FC<HeaderTopProps> = ({
  currentTab = 'overview',
  onTabChange,
  onQuickPrintAll,
  onBrandClick,
  isLoggedIn = false,
  onLogout,
  onOpenLogin,
  onOpenAdminDashboard,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Brand Application Title */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <button
                onClick={onBrandClick}
                className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 hover:text-neutral-700 transition-colors text-left font-serif select-none"
              >
                WartaKarsa
              </button>
              <span className="hidden lg:inline-block text-2xs text-neutral-400 font-sans tracking-wide border-l border-neutral-200 pl-2 ml-1">
                Publikasi Kegiatan & Jurnal
              </span>
            </div>

            {/* Desktop Navbar Menu Links */}
            {onTabChange && (
              <nav className="hidden md:flex items-center gap-1">
                <button
                  onClick={() => onTabChange('overview')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    currentTab === 'overview'
                      ? 'bg-neutral-900 text-white shadow-2xs'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Ikhtisar</span>
                </button>

                <button
                  onClick={() => onTabChange('programs')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    currentTab === 'programs'
                      ? 'bg-neutral-900 text-white shadow-2xs'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Program Unggulan</span>
                </button>

                {isLoggedIn && (
                  <button
                    onClick={() => onTabChange('photo-feed')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                      currentTab === 'photo-feed'
                        ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 text-white shadow-2xs'
                        : 'text-neutral-700 hover:text-pink-600 hover:bg-pink-50/60'
                    }`}
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Publikasi Foto Kegiatan</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      currentTab === 'photo-feed'
                        ? 'bg-white/20 text-white'
                        : 'bg-gradient-to-r from-amber-500 to-rose-500 text-white'
                    }`}>
                      Baru
                    </span>
                  </button>
                )}
              </nav>
            )}
          </div>

          {/* Quick Actions & Auth status */}
          <div className="flex items-center gap-2">
            <button
              onClick={onQuickPrintAll}
              title="Cetak Rekapitulasi Dokumen"
              className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <Printer className="w-4 h-4" />
            </button>

            {isLoggedIn ? (
              <div className="flex items-center gap-2 pl-2 border-l border-neutral-200">
                <button
                  onClick={onOpenAdminDashboard}
                  title="Buka Panel Admin"
                  className="inline-flex items-center gap-1.5 text-2xs font-semibold px-2.5 py-1 bg-[#563d7c] hover:bg-[#483368] text-white rounded-lg transition-colors shadow-2xs"
                >
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Panel Admin</span>
                </button>
                <button
                  onClick={onLogout}
                  title="Keluar dari sesi Administrator"
                  className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 text-2xs font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Keluar</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-2xs font-semibold text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200/80 rounded-xl transition-colors ml-1"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Masuk</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
