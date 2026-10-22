import React from 'react';
import { 
  Home, 
  Compass, 
  Plus, 
  Camera, 
  User,
  SlidersHorizontal
} from 'lucide-react';

interface BottomNavBarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenCreateModal: () => void;
  isLoggedIn: boolean;
  onRequireLogin: (reason?: string) => void;
  onOpenAdminDashboard?: () => void;
  currentUser?: { name: string; role: string; email: string } | null;
  savedCount?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  onTabChange,
  onOpenCreateModal,
  isLoggedIn,
  onOpenAdminDashboard,
  currentUser,
}) => {
  return (
    <nav 
      aria-label="Navigasi Bawah Instagram"
      className="fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-xl border-t border-neutral-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
    >
      <div className="max-w-md sm:max-w-lg md:max-w-xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Tab 1: Beranda (Home) */}
          <button
            onClick={() => onTabChange('overview')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-transform active:scale-95 group focus:outline-none ${
              currentTab === 'overview' ? 'text-neutral-900' : 'text-neutral-400 hover:text-neutral-700'
            }`}
            title="Beranda / Ikhtisar Kegiatan"
          >
            <div className="relative flex items-center justify-center">
              <Home 
                className={`w-6 h-6 transition-all ${
                  currentTab === 'overview' ? 'stroke-[2.5px] scale-105 fill-neutral-900 text-neutral-900' : 'stroke-[1.8px]'
                }`} 
              />
              {currentTab === 'overview' && (
                <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-neutral-900" />
              )}
            </div>
            <span className={`text-[10px] mt-1 tracking-tight transition-colors ${
              currentTab === 'overview' ? 'font-bold text-neutral-900' : 'font-medium'
            }`}>
              Beranda
            </span>
          </button>

          {/* Tab 2: Explore / Program Unggulan */}
          <button
            onClick={() => onTabChange('programs')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-transform active:scale-95 group focus:outline-none ${
              currentTab === 'programs' ? 'text-neutral-900' : 'text-neutral-400 hover:text-neutral-700'
            }`}
            title="Eksplorasi Program Unggulan"
          >
            <div className="relative flex items-center justify-center">
              <Compass 
                className={`w-6 h-6 transition-all ${
                  currentTab === 'programs' ? 'stroke-[2.5px] scale-105 text-neutral-900' : 'stroke-[1.8px]'
                }`} 
              />
              {currentTab === 'programs' && (
                <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-neutral-900" />
              )}
            </div>
            <span className={`text-[10px] mt-1 tracking-tight transition-colors ${
              currentTab === 'programs' ? 'font-bold text-neutral-900' : 'font-medium'
            }`}>
              Program
            </span>
          </button>

          {/* Tab 3: Center Upload (+) Button (HANYA TAMPIL SETELAH LOGIN) */}
          {isLoggedIn && (
            <div className="flex items-center justify-center flex-1 h-full">
              <button
                onClick={onOpenCreateModal}
                title="Upload & Publikasikan Data Baru"
                className="group flex flex-col items-center justify-center focus:outline-none active:scale-90 transition-transform"
              >
                <div className="p-1 sm:p-1.5 rounded-xl border-2 border-neutral-900 bg-neutral-900 text-white shadow-xs group-hover:bg-neutral-800 transition-colors">
                  <Plus className="w-5 h-5 stroke-[2.8px]" />
                </div>
                <span className="text-[10px] font-bold text-neutral-900 mt-0.5 tracking-tight">
                  Upload
                </span>
              </button>
            </div>
          )}

          {/* Tab 4: Foto Kegiatan (HANYA TAMPIL SETELAH LOGIN) */}
          {isLoggedIn && (
            <button
              onClick={() => onTabChange('photo-feed')}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-transform active:scale-95 group focus:outline-none ${
                currentTab === 'photo-feed' ? 'text-neutral-900' : 'text-neutral-400 hover:text-neutral-700'
              }`}
              title="Feed Foto Kegiatan"
            >
              <div className="relative flex items-center justify-center">
                <Camera 
                  className={`w-6 h-6 transition-all ${
                    currentTab === 'photo-feed' ? 'stroke-[2.5px] scale-105 text-neutral-900' : 'stroke-[1.8px]'
                  }`} 
                />
                {currentTab === 'photo-feed' && (
                  <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-neutral-900" />
                )}
              </div>
              <span className={`text-[10px] mt-1 tracking-tight transition-colors ${
                currentTab === 'photo-feed' ? 'font-bold text-neutral-900' : 'font-medium'
              }`}>
                Foto
              </span>
            </button>
          )}

          {/* Tab 5: Akun / Profil (Instagram Style) */}
          {isLoggedIn ? (
            <button
              onClick={() => {
                if (onOpenAdminDashboard) {
                  onOpenAdminDashboard();
                } else {
                  onTabChange('manage');
                }
              }}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-transform active:scale-95 group focus:outline-none ${
                currentTab === 'manage' ? 'text-neutral-900' : 'text-neutral-400 hover:text-neutral-700'
              }`}
              title="Panel Pengelola & Arsip"
            >
              <div className="relative flex items-center justify-center">
                <div className={`w-7 h-7 rounded-full p-[1.5px] transition-all ${
                  currentTab === 'manage' ? 'ring-2 ring-neutral-900' : 'ring-1 ring-neutral-300'
                }`}>
                  <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {currentUser?.name?.charAt(0).toUpperCase() || 'A'}
                  </div>
                </div>
                {currentTab === 'manage' && (
                  <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-neutral-900" />
                )}
              </div>
              <span className={`text-[10px] mt-1 tracking-tight transition-colors ${
                currentTab === 'manage' ? 'font-bold text-neutral-900' : 'font-medium'
              }`}>
                Admin
              </span>
            </button>
          ) : (
            <button
              onClick={() => onTabChange('login')}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-transform active:scale-95 group focus:outline-none ${
                currentTab === 'login' ? 'text-neutral-900' : 'text-neutral-400 hover:text-neutral-700'
              }`}
              title="Masuk Akun Pengelola"
            >
              <div className="relative flex items-center justify-center">
                <User 
                  className={`w-6 h-6 transition-all ${
                    currentTab === 'login' ? 'stroke-[2.5px] scale-105 fill-neutral-900 text-neutral-900' : 'stroke-[1.8px]'
                  }`} 
                />
                {currentTab === 'login' && (
                  <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-neutral-900" />
                )}
              </div>
              <span className={`text-[10px] mt-1 tracking-tight transition-colors ${
                currentTab === 'login' ? 'font-bold text-neutral-900' : 'font-medium'
              }`}>
                Masuk
              </span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
