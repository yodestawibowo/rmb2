import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Printer, 
  ChevronDown, 
  LayoutGrid, 
  Image as ImageIcon, 
  BookOpen, 
  SlidersHorizontal,
  Check,
  Compass,
  X,
  Camera
} from 'lucide-react';

interface TopNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenCreateModal: () => void;
  onQuickPrintAll: () => void;
  totalPublicationsCount?: number;
  totalPhotosCount?: number;
  isLoggedIn?: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentTab,
  onTabChange,
  onOpenCreateModal,
  onQuickPrintAll,
  totalPublicationsCount = 4,
  totalPhotosCount = 8,
  isLoggedIn = false,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  // Unified menu items configuration
  const menuItems = [
    {
      id: 'overview',
      title: 'Ikhtisar Kegiatan',
      description: 'Katalog utama, linimasa & sebaran wilayah',
      icon: LayoutGrid,
    },
    {
      id: 'gallery',
      title: 'Galeri Dokumentasi',
      description: 'Koleksi foto resolusi tinggi & arsip visual',
      icon: ImageIcon,
    },
    ...(isLoggedIn
      ? [
          {
            id: 'photo-feed',
            title: 'Publikasi Foto Kegiatan',
            description: 'Feed dokumentasi visual kegiatan bergaya Instagram',
            icon: Camera,
          },
          {
            id: 'manage',
            title: 'Kelola & Arsip',
            description: 'Pusat administrasi, sunting status & ekspor',
            icon: SlidersHorizontal,
          },
        ]
      : []),
  ];

  const currentItem = menuItems.find((item) => item.id === currentTab) || menuItems[0];
  const CurrentIcon = currentItem.icon;

  const handleSelectTab = (tabId: string) => {
    onTabChange(tabId);
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => handleSelectTab('overview')}
            className="text-lg font-bold tracking-tight text-neutral-900 whitespace-nowrap shrink-0 hover:text-neutral-700 transition-colors text-left"
          >
            WartaKarsa
          </button>

          {/* Zone 2: Single Unified, Responsive & Aesthetic Navigation Menu */}
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-haspopup="true"
              className={`group inline-flex items-center gap-2.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all border ${
                isMenuOpen
                  ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                  : 'bg-neutral-100/80 hover:bg-neutral-100 text-neutral-800 border-neutral-200/80 hover:border-neutral-300'
              }`}
            >
              <div className={`p-1 rounded-md transition-colors ${
                isMenuOpen ? 'bg-neutral-800 text-white' : 'bg-white text-neutral-900 shadow-2xs'
              }`}>
                <CurrentIcon className="w-3.5 h-3.5" />
              </div>

              <span className="font-semibold whitespace-nowrap">
                {currentItem.title}
              </span>

              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                isMenuOpen ? 'rotate-180 text-white' : 'text-neutral-400 group-hover:text-neutral-700'
              }`} />
            </button>

            {/* Aesthetic Floating Menu Popover (Responsive for Desktop & Mobile) */}
            {isMenuOpen && (
              <>
                {/* Mobile backdrop scrim */}
                <div 
                  className="fixed inset-0 bg-neutral-900/30 backdrop-blur-xs z-40 sm:hidden"
                  onClick={() => setIsMenuOpen(false)}
                />

                <div className="absolute left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 top-full mt-2 z-50 w-[92vw] max-w-xs sm:w-80 bg-white/98 backdrop-blur-md border border-neutral-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-2">
                  <div className="px-3 pt-2.5 pb-2 border-b border-neutral-100 flex items-center justify-between">
                    <span className="text-2xs uppercase tracking-wider font-semibold text-neutral-400 flex items-center gap-1.5">
                      <Compass className="w-3 h-3 text-neutral-500" />
                      Navigasi Portal Kegiatan
                    </span>
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="p-1 text-neutral-400 hover:text-neutral-700 rounded-md sm:hidden"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Menu Items List */}
                  <div className="py-1 space-y-1">
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = currentTab === item.id;

                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelectTab(item.id)}
                          className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-3 group/item ${
                            isActive
                              ? 'bg-neutral-900 text-white shadow-2xs'
                              : 'hover:bg-neutral-100/90 text-neutral-800'
                          }`}
                        >
                          <div className={`p-2 rounded-lg shrink-0 transition-colors ${
                            isActive
                              ? 'bg-neutral-800 text-white'
                              : 'bg-neutral-100 group-hover/item:bg-white text-neutral-700 border border-neutral-200/50'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className={`text-xs font-semibold ${
                                isActive ? 'text-white' : 'text-neutral-900'
                              }`}>
                                {item.title}
                              </span>
                              {isActive && (
                                <Check className="w-3.5 h-3.5 text-white shrink-0" />
                              )}
                            </div>
                            <p className={`text-2xs leading-snug mt-0.5 line-clamp-1 ${
                              isActive ? 'text-neutral-300' : 'text-neutral-500'
                            }`}>
                              {item.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Aesthetic Footer Strip within Menu Card */}
                  <div className="mt-1 pt-2 border-t border-neutral-100 px-3 pb-1 flex items-center justify-between text-2xs text-neutral-500">
                    <span className="font-mono tabular-nums">
                      {totalPublicationsCount} Kegiatan Terbit
                    </span>
                    <span>·</span>
                    <span className="font-mono tabular-nums">
                      {totalPhotosCount} Arsip Foto
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={onQuickPrintAll}
              title="Cetak Rekapitulasi Publikasi"
              className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <Printer className="w-4 h-4" />
            </button>
            {isLoggedIn && (
              <button
                onClick={onOpenCreateModal}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-xs font-semibold text-white bg-neutral-900 rounded-xl hover:bg-neutral-800 transition-colors whitespace-nowrap shrink-0 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Publikasikan Kegiatan</span>
                <span className="sm:hidden">Publikasi</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
