import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  Settings, 
  LogOut, 
  ExternalLink, 
  Globe, 
  Users, 
  Layers, 
  Shield, 
  FileText, 
  Sliders, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  Upload, 
  FolderTree, 
  Target, 
  BookOpen, 
  Printer, 
  Eye, 
  X,
  ChevronDown,
  ChevronRight,
  Sparkles,
  HelpCircle,
  Save,
  CheckCircle2,
  Calendar,
  MapPin,
  Camera,
  Heart,
  MessageCircle
} from 'lucide-react';
import { Publication } from '../types/publication';
import { FlagshipProgram } from '../types/program';
import { ProgramCategoryModal } from './ProgramCategoryModal';
import { InstagramPhotoItem } from '../data/initialInstagramPhotos';

export interface SiteSettings {
  webTitle: string;
  webDescription: string;
  logoText: string;
  favIconText: string;
  favIconColor: string;
  footerText: string;
}

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  webTitle: 'WartaKarsa - Dashboard Publikasi Kegiatan & Jurnal',
  webDescription: 'Platform terpadu publikasi kegiatan, galeri dokumentasi foto, dan jurnal aktivitas terstruktur dengan fitur kurasi dan manajemen laporan.',
  logoText: 'WartaKarsa',
  favIconText: 'W',
  favIconColor: '#dc2626',
  footerText: '©{{YEAR}} <a href="#">WartaKarsa</a> — Dashboard Publikasi Dokumentasi Kegiatan & Jurnal Ilmiah',
};

const SITE_SETTINGS_KEY = 'wartakarsa_site_settings_v1';

interface AdminDashboardLayoutProps {
  currentUser: { name: string; role: string; email: string } | null;
  onLogout: () => void;
  onViewPublicSite: () => void;
  publications: Publication[];
  programs: FlagshipProgram[];
  categories: string[];
  onAddProgram: (program: FlagshipProgram) => void;
  onEditProgram: (program: FlagshipProgram) => void;
  onDeleteProgram: (id: string) => void;
  onAddCategory: (category: string) => void;
  onEditCategory: (oldName: string, newName: string) => void;
  onDeleteCategory: (category: string, replacement?: string) => void;
  onOpenCreatePublication: () => void;
  onEditPublication: (pub: Publication) => void;
  onDeletePublication: (id: string) => void;
  onTogglePublicationStatus: (id: string) => void;
  onOpenJournalReader: (pub: Publication) => void;
  onPrintPublication: (pub: Publication) => void;
  onPrintAll: () => void;
  onResetData: () => void;
  onOpenProgramModal: () => void;
  instagramPhotos?: InstagramPhotoItem[];
  onOpenCreateInstagramPhoto?: () => void;
  onEditInstagramPhoto?: (photo: InstagramPhotoItem) => void;
  onDeleteInstagramPhoto?: (id: string) => void;
}

export const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = ({
  currentUser,
  onLogout,
  onViewPublicSite,
  publications,
  programs,
  categories,
  onAddProgram,
  onEditProgram,
  onDeleteProgram,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onOpenCreatePublication,
  onEditPublication,
  onDeletePublication,
  onTogglePublicationStatus,
  onOpenJournalReader,
  onPrintPublication,
  onPrintAll,
  onResetData,
  onOpenProgramModal,
  instagramPhotos = [],
  onOpenCreateInstagramPhoto,
  onEditInstagramPhoto,
  onDeleteInstagramPhoto,
}) => {
  // Active Sidebar Menu
  // Options: 'website-setting' | 'kategori-program' | 'program-unggulan' | 'publikasi' | 'foto-instagram' | 'jurnal' | 'arsip' | 'user'
  const [activeMenu, setActiveMenu] = useState<string>('website-setting');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isWebsiteSubmenuOpen, setIsWebsiteSubmenuOpen] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Site Settings state
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const stored = localStorage.getItem(SITE_SETTINGS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return DEFAULT_SITE_SETTINGS;
  });

  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(SITE_SETTINGS_KEY, JSON.stringify(siteSettings));
      setSettingsSavedToast(true);
      setTimeout(() => setSettingsSavedToast(false), 3000);
    } catch {
      // ignore
    }
  };

  // Category in-line creation on category page
  const [newCatInput, setNewCatInput] = useState('');
  const [editingCatOldName, setEditingCatOldName] = useState<string | null>(null);
  const [editingCatNewName, setEditingCatNewName] = useState('');

  const handleAddNewCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatInput.trim()) return;
    onAddCategory(newCatInput.trim());
    setNewCatInput('');
  };

  const handleSaveEditedCategory = (oldName: string) => {
    if (!editingCatNewName.trim()) return;
    onEditCategory(oldName, editingCatNewName.trim());
    setEditingCatOldName(null);
    setEditingCatNewName('');
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-neutral-800 flex flex-col font-sans">
      {/* 1. TOP NAVBAR (Purple Theme matching Jagowebdev screenshot) */}
      <header className="h-14 bg-[#563d7c] text-white flex items-center justify-between px-0 shrink-0 z-30 shadow-md">
        {/* Brand Section with Darker Background */}
        <div className="w-64 bg-[#363847] h-full flex items-center justify-between px-4 shrink-0 transition-all">
          <span className="font-serif italic font-bold text-2xl tracking-wide text-white select-none">
            {siteSettings.logoText || 'WartaKarsa'}
          </span>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 text-neutral-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Sembunyikan / Tampilkan Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Right Top Header Controls */}
        <div className="flex-1 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/80 hidden md:inline">
              Panel Administrasi &amp; Tata Kelola Kegiatan
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Upload Action (Only in logged in admin) */}
            <button
              onClick={onOpenCreatePublication}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-semibold rounded-lg transition-all shadow-xs"
              title="Upload / Publikasikan Kegiatan Baru"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload Kegiatan</span>
            </button>

            {/* View Public Website */}
            <button
              onClick={onViewPublicSite}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-medium rounded-lg transition-colors border border-white/20"
              title="Buka Pratinjau Tampilan Web Publik"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lihat Web Publik</span>
            </button>

            {/* Quick Settings Icon */}
            <button
              onClick={() => setActiveMenu('website-setting')}
              className={`p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors ${
                activeMenu === 'website-setting' ? 'bg-white/20 text-white' : ''
              }`}
              title="Pengaturan Website"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* User Avatar & Logout Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-white text-[#563d7c] font-bold text-xs flex items-center justify-center border-2 border-white/80 shadow-2xs">
                  {currentUser?.name ? currentUser.name.charAt(0) : 'A'}
                </div>
                <span className="text-xs font-semibold text-white hidden md:inline max-w-[120px] truncate">
                  {currentUser?.name?.split(' ')[0] || 'Admin'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-white/70" />
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-neutral-200 py-1 z-50 text-neutral-800 animate-in fade-in duration-150">
                  <div className="px-4 py-2.5 border-b border-neutral-100">
                    <p className="text-xs font-bold text-neutral-900 truncate">
                      {currentUser?.name || 'Administrator'}
                    </p>
                    <p className="text-2xs text-neutral-500 font-mono truncate">
                      {currentUser?.email || 'admin@wartakarsa.id'}
                    </p>
                    <span className="inline-block mt-1 text-3xs font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md">
                      {currentUser?.role || 'Administrator'}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setActiveMenu('website-setting');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-neutral-50 flex items-center gap-2 text-neutral-700"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Setting Website</span>
                  </button>

                  <button
                    onClick={() => {
                      onViewPublicSite();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-neutral-50 flex items-center gap-2 text-neutral-700"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Halaman Depan Publik</span>
                  </button>

                  <div className="border-t border-neutral-100 my-1" />

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-red-50 text-red-600 flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar (Logout)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE: SIDEBAR + CONTENT AREA */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDEBAR (Dark Charcoal Theme matching screenshot: #363847) */}
        {isSidebarOpen && (
          <aside className="w-64 bg-[#363847] text-neutral-300 shrink-0 flex flex-col justify-between overflow-y-auto select-none border-r border-[#2d2f3d]">
            <div className="py-2">
              {/* Quick Upload Menu Button */}
              <div className="px-3 pb-2 pt-1">
                <button
                  onClick={onOpenCreatePublication}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-98"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload Kegiatan Baru</span>
                </button>
              </div>

              {/* Menu Group 1: Website & Content */}
              <div>
                <button
                  onClick={() => setIsWebsiteSubmenuOpen(!isWebsiteSubmenuOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 text-xs font-semibold text-neutral-200 hover:bg-[#2e303e] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-neutral-400" />
                    <span>Website</span>
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${
                      isWebsiteSubmenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isWebsiteSubmenuOpen && (
                  <div className="bg-[#2e303e]/60 py-1 space-y-0.5 text-xs">
                    {/* Setting Website (Active item in user screenshot) */}
                    <button
                      onClick={() => setActiveMenu('website-setting')}
                      className={`w-full flex items-center gap-3 px-5 py-2.5 transition-colors text-left ${
                        activeMenu === 'website-setting'
                          ? 'bg-[#23242e] text-white font-bold border-l-4 border-indigo-500'
                          : 'text-neutral-300 hover:text-white hover:bg-[#292b37]'
                      }`}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Setting Website</span>
                    </button>

                    {/* Kategori Program (Directly responsive to user's feature request) */}
                    <button
                      onClick={() => setActiveMenu('kategori-program')}
                      className={`w-full flex items-center gap-3 px-5 py-2.5 transition-colors text-left ${
                        activeMenu === 'kategori-program'
                          ? 'bg-[#23242e] text-white font-bold border-l-4 border-indigo-500'
                          : 'text-neutral-300 hover:text-white hover:bg-[#292b37]'
                      }`}
                    >
                      <FolderTree className="w-4 h-4" />
                      <span>Kategori Program</span>
                    </button>

                    {/* Program Unggulan */}
                    <button
                      onClick={() => setActiveMenu('program-unggulan')}
                      className={`w-full flex items-center gap-3 px-5 py-2.5 transition-colors text-left ${
                        activeMenu === 'program-unggulan'
                          ? 'bg-[#23242e] text-white font-bold border-l-4 border-indigo-500'
                          : 'text-neutral-300 hover:text-white hover:bg-[#292b37]'
                      }`}
                    >
                      <Target className="w-4 h-4" />
                      <span>Program Unggulan</span>
                    </button>

                    {/* Publikasi Kegiatan */}
                    <button
                      onClick={() => setActiveMenu('publikasi')}
                      className={`w-full flex items-center gap-3 px-5 py-2.5 transition-colors text-left ${
                        activeMenu === 'publikasi'
                          ? 'bg-[#23242e] text-white font-bold border-l-4 border-indigo-500'
                          : 'text-neutral-300 hover:text-white hover:bg-[#292b37]'
                      }`}
                    >
                      <Layers className="w-4 h-4" />
                      <span>Publikasi Kegiatan</span>
                    </button>

                    {/* Foto Kegiatan (Instagram Feed) */}
                    <button
                      onClick={() => setActiveMenu('foto-instagram')}
                      className={`w-full flex items-center justify-between px-5 py-2.5 transition-colors text-left ${
                        activeMenu === 'foto-instagram'
                          ? 'bg-[#23242e] text-white font-bold border-l-4 border-indigo-500'
                          : 'text-neutral-300 hover:text-white hover:bg-[#292b37]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Camera className="w-4 h-4 text-pink-400" />
                        <span>Foto Kegiatan (Instagram)</span>
                      </div>
                      <span className="text-[10px] bg-pink-500/20 text-pink-300 font-mono px-1.5 py-0.2 rounded-full">
                        {instagramPhotos.length}
                      </span>
                    </button>

                    {/* Naskah Jurnal */}
                    <button
                      onClick={() => setActiveMenu('jurnal')}
                      className={`w-full flex items-center gap-3 px-5 py-2.5 transition-colors text-left ${
                        activeMenu === 'jurnal'
                          ? 'bg-[#23242e] text-white font-bold border-l-4 border-indigo-500'
                          : 'text-neutral-300 hover:text-white hover:bg-[#292b37]'
                      }`}
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Naskah Jurnal</span>
                    </button>

                    {/* Cetak & Arsip Laporan */}
                    <button
                      onClick={() => setActiveMenu('arsip')}
                      className={`w-full flex items-center gap-3 px-5 py-2.5 transition-colors text-left ${
                        activeMenu === 'arsip'
                          ? 'bg-[#23242e] text-white font-bold border-l-4 border-indigo-500'
                          : 'text-neutral-300 hover:text-white hover:bg-[#292b37]'
                      }`}
                    >
                      <Printer className="w-4 h-4" />
                      <span>Cetak &amp; Arsip Laporan</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Menu Group 2: User / Admin */}
              <div className="pt-2 border-t border-[#2d2f3d] mt-2">
                <button
                  onClick={() => setActiveMenu('user')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs transition-colors text-left ${
                    activeMenu === 'user'
                      ? 'bg-[#23242e] text-white font-bold border-l-4 border-indigo-500'
                      : 'text-neutral-300 hover:text-white hover:bg-[#2e303e]'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Profil Pengelola</span>
                </button>
              </div>
            </div>

            {/* Sidebar Bottom Footer Info */}
            <div className="p-4 border-t border-[#2d2f3d] bg-[#2e303e]/40 text-2xs text-neutral-400">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-semibold text-neutral-300">Admin Mode Aktif</span>
              </div>
              <p className="font-mono text-3xs text-neutral-400 truncate">
                {currentUser?.email || 'admin@wartakarsa.id'}
              </p>
            </div>
          </aside>
        )}

        {/* RIGHT MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-5xl mx-auto">
            {/* TOAST FEEDBACK */}
            {settingsSavedToast && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 shadow-sm animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">Pengaturan website berhasil disimpan!</span>
              </div>
            )}

            {/* VIEW 1: SETTING WEBSITE (Exact representation of user screenshot) */}
            {activeMenu === 'website-setting' && (
              <div className="bg-white rounded-xl shadow-xs border border-neutral-200 overflow-hidden">
                {/* Header Title */}
                <div className="px-6 py-4 border-b border-neutral-200">
                  <h1 className="text-xl font-bold text-neutral-800">
                    Website
                  </h1>
                </div>

                {/* Form fields in two-column format matching screenshot */}
                <form onSubmit={handleSaveSettings} className="p-6 sm:p-8 space-y-6">
                  {/* Judul Web */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-start">
                    <label className="sm:col-span-1 text-sm font-bold text-neutral-800 pt-2">
                      Judul Web
                    </label>
                    <div className="sm:col-span-3">
                      <textarea
                        rows={2}
                        value={siteSettings.webTitle}
                        onChange={(e) =>
                          setSiteSettings({ ...siteSettings, webTitle: e.target.value })
                        }
                        placeholder="Admin Template Jagowebdev"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 text-neutral-800 shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Deskripsi Web */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-start">
                    <label className="sm:col-span-1 text-sm font-bold text-neutral-800 pt-2">
                      Deskripsi Web
                    </label>
                    <div className="sm:col-span-3">
                      <textarea
                        rows={3}
                        value={siteSettings.webDescription}
                        onChange={(e) =>
                          setSiteSettings({ ...siteSettings, webDescription: e.target.value })
                        }
                        placeholder="Template administrasi lengkap dengan fitur penting dalam..."
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 text-neutral-800 shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Fav Icon */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-start">
                    <label className="sm:col-span-1 text-sm font-bold text-neutral-800 pt-2">
                      Fav Icon
                    </label>
                    <div className="sm:col-span-3 space-y-2">
                      {/* Icon preview matching screenshot red shield */}
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-sm"
                          style={{ backgroundColor: siteSettings.favIconColor }}
                        >
                          {siteSettings.favIconText || 'W'}
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            maxLength={2}
                            value={siteSettings.favIconText}
                            onChange={(e) =>
                              setSiteSettings({ ...siteSettings, favIconText: e.target.value.toUpperCase() })
                            }
                            className="w-14 px-2 py-1 text-center font-bold text-xs bg-white border border-neutral-300 rounded-lg"
                            title="Huruf Ikon"
                          />
                          <input
                            type="color"
                            value={siteSettings.favIconColor}
                            onChange={(e) =>
                              setSiteSettings({ ...siteSettings, favIconColor: e.target.value })
                            }
                            className="w-8 h-8 rounded-lg cursor-pointer border border-neutral-300 p-0.5"
                            title="Warna Ikon"
                          />
                        </div>
                      </div>

                      {/* Browse mock matching screenshot */}
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <button
                          type="button"
                          onClick={() => alert('Ikon siap digunakan dan disimpan dalam pengaturan aplikasi.')}
                          className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded text-neutral-800 font-medium"
                        >
                          Browse...
                        </button>
                        <span>favicon_wartakarsa.png</span>
                      </div>

                      <p className="text-2xs text-neutral-500 leading-normal">
                        Gunakan file PNG transparan, width dan height sama, misal: 64px x 64px
                      </p>
                    </div>
                  </div>

                  {/* Logo Aplikasi */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-start">
                    <label className="sm:col-span-1 text-sm font-bold text-neutral-800 pt-2">
                      Logo Aplikasi
                    </label>
                    <div className="sm:col-span-3 space-y-2">
                      {/* Logo preview in script font matching screenshot */}
                      <div className="p-2 bg-neutral-50 border border-neutral-200 rounded-lg inline-block">
                        <span className="font-serif italic font-bold text-2xl text-neutral-800 tracking-wide">
                          {siteSettings.logoText || 'WartaKarsa'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={siteSettings.logoText}
                          onChange={(e) =>
                            setSiteSettings({ ...siteSettings, logoText: e.target.value })
                          }
                          placeholder="WartaKarsa"
                          className="max-w-xs px-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg"
                        />
                      </div>

                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <button
                          type="button"
                          onClick={() => alert('Logo terpasang otomatis dari nama brand di atas.')}
                          className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded text-neutral-800 font-medium"
                        >
                          Browse...
                        </button>
                        <span>No file selected.</span>
                      </div>

                      <p className="text-2xs text-neutral-500 leading-normal">
                        Gunakan file PNG transparan, lebar maksimal 150px. Maksimal 300Kb, Minimal 50px x 50px, Tipe file: JPG, JPEG, PNG
                      </p>
                    </div>
                  </div>

                  {/* Background Logo */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-start">
                    <label className="sm:col-span-1 text-sm font-bold text-neutral-800 pt-1">
                      Background Logo
                    </label>
                    <div className="sm:col-span-3 text-xs text-neutral-600 pt-1">
                      <span>Ubah di menu setting tampilan</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-start">
                    <label className="sm:col-span-1 text-sm font-bold text-neutral-800 pt-2">
                      Footer
                    </label>
                    <div className="sm:col-span-3">
                      <textarea
                        rows={3}
                        value={siteSettings.footerText}
                        onChange={(e) =>
                          setSiteSettings({ ...siteSettings, footerText: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 font-mono text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 text-neutral-800 shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 border-t border-neutral-200 flex items-center justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>Simpan Pengaturan</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* VIEW 2: KATEGORI PROGRAM */}
            {activeMenu === 'kategori-program' && (
              <div className="bg-white rounded-xl shadow-xs border border-neutral-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-bold text-neutral-800">
                      Kelola Kategori Program
                    </h1>
                    <p className="text-xs text-neutral-500">
                      Tambah, sunting nama, atau hapus kategori untuk target program kerja institusi
                    </p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 bg-neutral-100 rounded-lg text-neutral-700">
                    Total: {categories.length} Kategori
                  </span>
                </div>

                <div className="p-6 sm:p-8 space-y-6">
                  {/* Form Tambah Kategori */}
                  <form onSubmit={handleAddNewCategory} className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                    <label className="block text-xs font-bold text-neutral-800">
                      Tambah Kategori Baru
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newCatInput}
                        onChange={(e) => setNewCatInput(e.target.value)}
                        placeholder="Contoh: Pemberdayaan UMKM &amp; Ekonomi Kreatif"
                        className="flex-1 px-3.5 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Tambah</span>
                      </button>
                    </div>
                  </form>

                  {/* Tabel Daftar Kategori */}
                  <div className="border border-neutral-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-neutral-100/80 text-neutral-700 font-semibold border-b border-neutral-200">
                        <tr>
                          <th className="py-3 px-4">No.</th>
                          <th className="py-3 px-4">Nama Kategori</th>
                          <th className="py-3 px-4">Jumlah Program Terhubung</th>
                          <th className="py-3 px-4 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200">
                        {categories.map((cat, idx) => {
                          const count = programs.filter((p) => p.category === cat).length;
                          const isEditing = editingCatOldName === cat;

                          return (
                            <tr key={cat} className="hover:bg-neutral-50/80">
                              <td className="py-3 px-4 font-mono text-neutral-400">{idx + 1}</td>
                              <td className="py-3 px-4 font-semibold text-neutral-900">
                                {isEditing ? (
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      value={editingCatNewName}
                                      onChange={(e) => setEditingCatNewName(e.target.value)}
                                      className="px-2 py-1 text-xs border border-neutral-300 rounded bg-white"
                                      autoFocus
                                    />
                                    <button
                                      onClick={() => handleSaveEditedCategory(cat)}
                                      className="p-1 text-emerald-700 hover:bg-emerald-50 rounded"
                                      title="Simpan"
                                    >
                                      <Check className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => setEditingCatOldName(null)}
                                      className="p-1 text-neutral-500 hover:bg-neutral-100 rounded"
                                      title="Batal"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <span>{cat}</span>
                                )}
                              </td>
                              <td className="py-3 px-4 font-mono text-neutral-600">
                                {count} program aktif
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="inline-flex items-center gap-1">
                                  <button
                                    onClick={() => {
                                      setEditingCatOldName(cat);
                                      setEditingCatNewName(cat);
                                    }}
                                    className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md"
                                    title="Sunting Nama"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (categories.length <= 1) {
                                        alert('Minimal harus ada 1 kategori program.');
                                        return;
                                      }
                                      if (window.confirm(`Hapus kategori "${cat}"? Program yang ada akan dialihkan ke kategori lain.`)) {
                                        onDeleteCategory(cat);
                                      }
                                    }}
                                    className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                                    title="Hapus Kategori"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 3: PROGRAM UNGGULAN */}
            {activeMenu === 'program-unggulan' && (
              <div className="bg-white rounded-xl shadow-xs border border-neutral-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-bold text-neutral-800">
                      Kelola Program Unggulan
                    </h1>
                    <p className="text-xs text-neutral-500">
                      Daftar peta jalan program strategis institusi 2025–2029
                    </p>
                  </div>
                  <button
                    onClick={onOpenProgramModal}
                    className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Program</span>
                  </button>
                </div>

                <div className="p-6 sm:p-8">
                  <div className="border border-neutral-200 rounded-xl overflow-x-auto">
                    <table className="w-full text-left text-xs whitespace-nowrap">
                      <thead className="bg-neutral-100/80 text-neutral-700 font-semibold border-b border-neutral-200">
                        <tr>
                          <th className="py-3 px-4">Kode</th>
                          <th className="py-3 px-4">Judul Program</th>
                          <th className="py-3 px-4">Kategori</th>
                          <th className="py-3 px-4">Unit / Sasaran 5 Thn</th>
                          <th className="py-3 px-4">Warna Aksen</th>
                          <th className="py-3 px-4 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200">
                        {programs.map((prog) => (
                          <tr key={prog.id} className="hover:bg-neutral-50">
                            <td className="py-3 px-4 font-mono font-bold text-neutral-900">{prog.code}</td>
                            <td className="py-3 px-4 font-semibold text-neutral-900 max-w-xs truncate">{prog.title}</td>
                            <td className="py-3 px-4 text-neutral-600">{prog.category}</td>
                            <td className="py-3 px-4 font-mono font-bold text-neutral-900">
                              {prog.totalFiveYearTarget.toLocaleString('id-ID')} {prog.unit}
                            </td>
                            <td className="py-3 px-4 capitalize">
                              <span className="inline-flex items-center gap-1.5 text-2xs font-semibold px-2 py-0.5 rounded bg-neutral-100">
                                <span
                                  className="w-2 h-2 rounded-full"
                                  style={{
                                    backgroundColor:
                                      prog.accentColor === 'emerald' ? '#059669' :
                                      prog.accentColor === 'amber' ? '#d97706' :
                                      prog.accentColor === 'rose' ? '#e11d48' :
                                      prog.accentColor === 'violet' ? '#7c3aed' : '#4f46e5'
                                  }}
                                />
                                {prog.accentColor}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="inline-flex items-center gap-1">
                                <button
                                  onClick={() => onEditProgram(prog)}
                                  className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md"
                                  title="Edit Program &amp; Grafik"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm(`Hapus program "${prog.title}"?`)) {
                                      onDeleteProgram(prog.id);
                                    }
                                  }}
                                  className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                                  title="Hapus Program"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 4: PUBLIKASI KEGIATAN */}
            {activeMenu === 'publikasi' && (
              <div className="bg-white rounded-xl shadow-xs border border-neutral-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-bold text-neutral-800">
                      Manajemen Publikasi Kegiatan
                    </h1>
                    <p className="text-xs text-neutral-500">
                      Total {publications.length} kegiatan tersimpan di sistem
                    </p>
                  </div>
                  <button
                    onClick={onOpenCreatePublication}
                    className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Publikasikan Baru</span>
                  </button>
                </div>

                <div className="p-6 sm:p-8">
                  <div className="border border-neutral-200 rounded-xl overflow-x-auto">
                    <table className="w-full text-left text-xs whitespace-nowrap">
                      <thead className="bg-neutral-100/80 text-neutral-700 font-semibold border-b border-neutral-200">
                        <tr>
                          <th className="py-3 px-4">Judul Kegiatan</th>
                          <th className="py-3 px-4">Kategori</th>
                          <th className="py-3 px-4">Tanggal</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200">
                        {publications.map((pub) => (
                          <tr key={pub.id} className="hover:bg-neutral-50">
                            <td className="py-3 px-4 font-semibold text-neutral-900 max-w-sm truncate">
                              {pub.title}
                            </td>
                            <td className="py-3 px-4 text-neutral-600">{pub.category}</td>
                            <td className="py-3 px-4 font-mono text-neutral-500">{pub.date}</td>
                            <td className="py-3 px-4">
                              <button
                                onClick={() => onTogglePublicationStatus(pub.id)}
                                className={`px-2 py-0.5 rounded text-3xs font-bold uppercase ${
                                  pub.status === 'published'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                                title="Klik untuk ubah status"
                              >
                                {pub.status === 'published' ? 'Diterbitkan' : 'Draf'}
                              </button>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="inline-flex items-center gap-1">
                                <button
                                  onClick={() => onOpenJournalReader(pub)}
                                  className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md"
                                  title="Lihat Jurnal"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => onEditPublication(pub)}
                                  className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md"
                                  title="Sunting"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm(`Hapus publikasi "${pub.title}"?`)) {
                                      onDeletePublication(pub.id);
                                    }
                                  }}
                                  className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                                  title="Hapus"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 5: NASKAH JURNAL */}
            {activeMenu === 'jurnal' && (
              <div className="bg-white rounded-xl shadow-xs border border-neutral-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-bold text-neutral-800">
                      Naskah Catatan Lapangan &amp; Jurnal
                    </h1>
                    <p className="text-xs text-neutral-500">
                      Kelola laporan evaluasi dan naskah riset kegiatan
                    </p>
                  </div>
                  <button
                    onClick={onPrintAll}
                    className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-neutral-300"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Cetak Rekapitulasi</span>
                  </button>
                </div>

                <div className="p-6 sm:p-8 space-y-4">
                  {publications
                    .filter((p) => p.journal)
                    .map((pub) => (
                      <div
                        key={pub.id}
                        className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="min-w-0">
                          <span className="text-2xs font-semibold text-neutral-500 uppercase tracking-wide">
                            {pub.category} &bull; {pub.date}
                          </span>
                          <h3 className="text-sm font-bold text-neutral-900 truncate mt-0.5">
                            {pub.title}
                          </h3>
                          <p className="text-xs text-neutral-600 line-clamp-1 mt-1">
                            {pub.journal?.abstract}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => onOpenJournalReader(pub)}
                            className="px-3 py-1.5 bg-neutral-900 text-white rounded-lg text-xs font-medium hover:bg-neutral-800"
                          >
                            Buka Naskah
                          </button>
                          <button
                            onClick={() => onPrintPublication(pub)}
                            className="p-1.5 bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-100 rounded-lg"
                            title="Cetak Jurnal"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onEditPublication(pub)}
                            className="p-1.5 bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-100 rounded-lg"
                            title="Sunting Jurnal"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* VIEW 5.5: PUBLIKASI FOTO KEGIATAN (INSTAGRAM FEED) */}
            {activeMenu === 'foto-instagram' && (
              <div className="bg-white rounded-xl shadow-xs border border-neutral-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white">
                        <Camera className="w-4 h-4" />
                      </div>
                      <h1 className="text-xl font-bold text-neutral-800">
                        Publikasi Foto Kegiatan (Feed Instagram)
                      </h1>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">
                      Unggah, sunting takarir, kelola tagar, fotografer, dan pantau apresiasi dari publik.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={onViewPublicSite}
                      className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-neutral-200 transition-colors"
                      title="Lihat Tampilan Feed Publik"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Lihat di Web Publik</span>
                    </button>
                    {onOpenCreateInstagramPhoto && (
                      <button
                        onClick={onOpenCreateInstagramPhoto}
                        className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Upload Foto Baru</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-6">
                  {/* KPI metric summary cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3.5">
                      <span className="text-2xs font-semibold text-neutral-500 uppercase tracking-wider block">Total Foto Publikasi</span>
                      <span className="text-xl font-bold text-neutral-900 mt-1 font-mono block">{instagramPhotos.length}</span>
                    </div>
                    <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3.5">
                      <span className="text-2xs font-semibold text-neutral-500 uppercase tracking-wider block">Total Apresiasi (Likes)</span>
                      <span className="text-xl font-bold text-pink-600 mt-1 font-mono block">
                        {instagramPhotos.reduce((acc, p) => acc + (p.likesCount || 0), 0).toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3.5">
                      <span className="text-2xs font-semibold text-neutral-500 uppercase tracking-wider block">Total Komentar</span>
                      <span className="text-xl font-bold text-indigo-600 mt-1 font-mono block">
                        {instagramPhotos.reduce((acc, p) => acc + (p.comments?.length || 0), 0)}
                      </span>
                    </div>
                    <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3.5">
                      <span className="text-2xs font-semibold text-neutral-500 uppercase tracking-wider block">Tampilan di Publik</span>
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-1.5">
                        Aktif Bergaya IG
                      </span>
                    </div>
                  </div>

                  {instagramPhotos.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-neutral-200 rounded-2xl p-6">
                      <div className="w-12 h-12 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center mx-auto mb-3">
                        <Camera className="w-6 h-6" />
                      </div>
                      <h3 className="text-sm font-bold text-neutral-900">Belum ada foto kegiatan yang dipublikasikan</h3>
                      <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1 mb-4">
                        Mulai bagikan dokumentasi visual kegiatan lapangan Anda dengan format feed bergaya Instagram.
                      </p>
                      {onOpenCreateInstagramPhoto && (
                        <button
                          onClick={onOpenCreateInstagramPhoto}
                          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Upload Foto Pertama</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="border border-neutral-200 rounded-xl overflow-x-auto">
                      <table className="w-full text-left text-xs whitespace-nowrap">
                        <thead className="bg-neutral-100/80 text-neutral-700 font-semibold border-b border-neutral-200">
                          <tr>
                            <th className="py-3 px-4">Foto / Thumbnail</th>
                            <th className="py-3 px-4">Judul &amp; Takarir</th>
                            <th className="py-3 px-4">Kategori &amp; Lokasi</th>
                            <th className="py-3 px-4">Fotografer / Tanggal</th>
                            <th className="py-3 px-4">Interaksi</th>
                            <th className="py-3 px-4 text-right">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200">
                          {instagramPhotos.map((photo) => (
                            <tr key={photo.id} className="hover:bg-neutral-50">
                              {/* Thumbnail */}
                              <td className="py-3 px-4">
                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0 relative">
                                  <img
                                    src={photo.photoUrl}
                                    alt={photo.title}
                                    className="w-full h-full object-cover"
                                  />
                                  {photo.carouselPhotos && photo.carouselPhotos.length > 1 && (
                                    <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] font-bold px-1 rounded">
                                      +{photo.carouselPhotos.length - 1}
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* Title & Caption */}
                              <td className="py-3 px-4 max-w-xs">
                                <p className="font-semibold text-neutral-900 truncate" title={photo.title}>
                                  {photo.title}
                                </p>
                                <p className="text-neutral-500 line-clamp-1 mt-0.5 text-2xs" title={photo.caption}>
                                  {photo.caption}
                                </p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {photo.tags.slice(0, 2).map((tag, idx) => (
                                    <span key={idx} className="text-[10px] text-pink-600 font-medium">
                                      {tag}
                                    </span>
                                  ))}
                                  {photo.tags.length > 2 && (
                                    <span className="text-[10px] text-neutral-400">+{photo.tags.length - 2}</span>
                                  )}
                                </div>
                              </td>

                              {/* Category & Location */}
                              <td className="py-3 px-4">
                                <span className="inline-block px-2 py-0.5 rounded text-2xs font-semibold bg-neutral-100 text-neutral-800">
                                  {photo.category}
                                </span>
                                <div className="flex items-center gap-1 text-2xs text-neutral-500 mt-1 max-w-[140px] truncate">
                                  <MapPin className="w-3 h-3 shrink-0 text-neutral-400" />
                                  <span className="truncate">{photo.location}</span>
                                </div>
                              </td>

                              {/* Photographer & Date */}
                              <td className="py-3 px-4">
                                <p className="font-medium text-neutral-800">{photo.photographer}</p>
                                <p className="text-2xs text-neutral-500 font-mono mt-0.5">{photo.date}</p>
                              </td>

                              {/* Interactions */}
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <span className="inline-flex items-center gap-1 text-2xs font-semibold text-pink-600">
                                    <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
                                    <span>{photo.likesCount}</span>
                                  </span>
                                  <span className="inline-flex items-center gap-1 text-2xs font-semibold text-neutral-600">
                                    <MessageCircle className="w-3.5 h-3.5" />
                                    <span>{photo.comments?.length || 0}</span>
                                  </span>
                                </div>
                              </td>

                              {/* Actions */}
                              <td className="py-3 px-4 text-right">
                                <div className="inline-flex items-center gap-1">
                                  {onEditInstagramPhoto && (
                                    <button
                                      onClick={() => onEditInstagramPhoto(photo)}
                                      className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
                                      title="Sunting Foto &amp; Takarir"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                  {onDeleteInstagramPhoto && (
                                    <button
                                      onClick={() => {
                                        if (window.confirm(`Hapus publikasi foto "${photo.title}"?`)) {
                                          onDeleteInstagramPhoto(photo.id);
                                        }
                                      }}
                                      className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                      title="Hapus Foto"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* VIEW 6: ARSIP & CETAK */}
            {activeMenu === 'arsip' && (
              <div className="bg-white rounded-xl shadow-xs border border-neutral-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-neutral-200">
                  <h1 className="text-xl font-bold text-neutral-800">
                    Pusat Arsip &amp; Rekapitulasi Laporan
                  </h1>
                </div>

                <div className="p-6 sm:p-8 space-y-6">
                  <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900">
                        Cetak Seluruh Berkas Publikasi
                      </h3>
                      <p className="text-xs text-neutral-500 mt-1">
                        Cetak dokumen ringkasan seluruh kegiatan, naskah jurnal lapangan, dan pencapaian target program.
                      </p>
                    </div>
                    <button
                      onClick={onPrintAll}
                      className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-xs shrink-0"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Cetak Rekapitulasi Lengkap</span>
                    </button>
                  </div>

                  <div className="p-5 bg-red-50 rounded-2xl border border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-red-900">
                        Atur Ulang Data ke Bawaan Sistem
                      </h3>
                      <p className="text-xs text-red-700 mt-1">
                        Kembalikan seluruh data program, kegiatan, dan kategori ke data asli bawaan.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        if (window.confirm('Apakah Anda yakin ingin mengatur ulang semua data ke bawaan?')) {
                          onResetData();
                        }
                      }}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl shrink-0"
                    >
                      Atur Ulang Data
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 7: USER / PROFIL PENGELOLA */}
            {activeMenu === 'user' && (
              <div className="bg-white rounded-xl shadow-xs border border-neutral-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-neutral-200">
                  <h1 className="text-xl font-bold text-neutral-800">
                    Profil Pengelola
                  </h1>
                </div>

                <div className="p-6 sm:p-8 space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
                    <div className="w-16 h-16 rounded-2xl bg-[#563d7c] text-white flex items-center justify-center font-bold text-2xl shadow-sm">
                      {currentUser?.name ? currentUser.name.charAt(0) : 'A'}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-neutral-900">
                        {currentUser?.name || 'Administrator'}
                      </h3>
                      <p className="text-xs text-neutral-500 font-mono">
                        {currentUser?.email || 'admin@wartakarsa.id'}
                      </p>
                      <span className="inline-block mt-1 text-2xs font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">
                        {currentUser?.role || 'Administrator & Kurator Publikasi'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wide">
                      Aksi Sesi
                    </h4>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={onViewPublicSite}
                        className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800"
                      >
                        Lihat Web Publik
                      </button>
                      <button
                        onClick={onLogout}
                        className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-semibold"
                      >
                        Keluar dari Akun (Logout)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
