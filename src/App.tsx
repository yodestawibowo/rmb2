import React, { useState, useEffect, useMemo } from 'react';
import { 
  Publication, 
  PublicationCategory, 
  FilterState, 
  GalleryPhoto,
  DashboardViewMode,
  JournalComment
} from './types/publication';
import { INITIAL_PUBLICATIONS } from './data/initialPublications';
import { Printer } from 'lucide-react';
import { BottomNavBar } from './components/BottomNavBar';
import {
  fetchPublicationsApi,
  savePublicationApi,
  deletePublicationApi,
  fetchProgramsApi,
  saveProgramApi,
  deleteProgramApi,
  fetchCategoriesApi,
  saveCategoriesApi,
  fetchInstagramPhotosApi,
  saveInstagramPhotoApi,
  deleteInstagramPhotoApi,
  resetSystemDataApi,
} from './lib/api';
import { StatOverview } from './components/StatOverview';
import { InteractiveHero } from './components/InteractiveHero';
import { FilterBar } from './components/FilterBar';
import { PublicationCard } from './components/PublicationCard';
import { TimelineView } from './components/TimelineView';
import { LocationHubView } from './components/LocationHubView';
import { GallerySection } from './components/GallerySection';
import { FlagshipProgramsSection } from './components/FlagshipProgramsSection';
import { JournalListSection } from './components/JournalListSection';
import { ManageArchiveSection } from './components/ManageArchiveSection';
import { LoginSection } from './components/LoginSection';
import { AdminWorkspaceBanner } from './components/AdminWorkspaceBanner';
import { JournalReaderModal } from './components/JournalReaderModal';
import { PhotoLightboxModal } from './components/PhotoLightboxModal';
import { PublicationFormModal } from './components/PublicationFormModal';
import { PrintableReportModal } from './components/PrintableReportModal';
import { FLAGSHIP_PROGRAMS } from './data/flagshipPrograms';
import { FlagshipProgram } from './types/program';
import { AdminDashboardLayout } from './components/AdminDashboardLayout';
import { ProgramFormModal } from './components/ProgramFormModal';
import { ProgramCategoryModal } from './components/ProgramCategoryModal';
import { InstagramPhotoFeed } from './components/InstagramPhotoFeed';
import { InstagramPhotoFormModal } from './components/InstagramPhotoFormModal';
import { INITIAL_INSTAGRAM_PHOTOS, InstagramPhotoItem } from './data/initialInstagramPhotos';

const STORAGE_KEY = 'wartakarsa_publications_v2';
const PROGRAMS_STORAGE_KEY = 'wartakarsa_flagship_programs_v1';
const PROGRAM_CATEGORIES_STORAGE_KEY = 'wartakarsa_program_categories_v1';
const INSTAGRAM_PHOTOS_STORAGE_KEY = 'wartakarsa_instagram_photos_v1';
const AUTH_KEY = 'wartakarsa_is_logged_in';
const USER_KEY = 'wartakarsa_current_user';

const CATEGORIES: PublicationCategory[] = [
  'Pendidikan & Pelatihan',
  'Bakti Sosial & Lingkungan',
  'Seminar & Riset',
  'Ekspedisi & Lapangan',
  'Seni & Kebudayaan',
  'Organisasi & Tata Kelola',
];

export default function App() {
  // Publications state (loads from API, falls back to cache/initial)
  const [publications, setPublications] = useState<Publication[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return INITIAL_PUBLICATIONS;
  });

  // Flagship Programs state
  const [programs, setPrograms] = useState<FlagshipProgram[]>(() => {
    try {
      const stored = localStorage.getItem(PROGRAMS_STORAGE_KEY);
      if (stored !== null) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return FLAGSHIP_PROGRAMS;
  });

  // Program Categories state
  const [programCategories, setProgramCategories] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(PROGRAM_CATEGORIES_STORAGE_KEY);
      if (stored !== null) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return [
      'Pendidikan & Pelatihan',
      'Bakti Sosial & Lingkungan',
      'Seminar & Riset',
      'Ekspedisi & Lapangan',
      'Organisasi & Tata Kelola'
    ];
  });

  // Instagram Photos state
  const [instagramPhotos, setInstagramPhotos] = useState<InstagramPhotoItem[]>(() => {
    try {
      const stored = localStorage.getItem(INSTAGRAM_PHOTOS_STORAGE_KEY);
      if (stored !== null) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return INITIAL_INSTAGRAM_PHOTOS;
  });

  // Fetch from PostgreSQL / backend database on initial mount
  useEffect(() => {
    let isMounted = true;
    fetchPublicationsApi().then((data) => {
      if (isMounted && data !== null) {
        setPublications(data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
    });
    fetchProgramsApi().then((data) => {
      if (isMounted && data !== null) {
        setPrograms(data);
        localStorage.setItem(PROGRAMS_STORAGE_KEY, JSON.stringify(data));
      }
    });
    fetchCategoriesApi().then((data) => {
      if (isMounted && data !== null) {
        setProgramCategories(data);
        localStorage.setItem(PROGRAM_CATEGORIES_STORAGE_KEY, JSON.stringify(data));
      }
    });
    fetchInstagramPhotosApi().then((data) => {
      if (isMounted && data !== null) {
        setInstagramPhotos(data);
        localStorage.setItem(INSTAGRAM_PHOTOS_STORAGE_KEY, JSON.stringify(data));
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Save to localStorage mirror on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(publications));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [publications]);

  useEffect(() => {
    try {
      localStorage.setItem(PROGRAMS_STORAGE_KEY, JSON.stringify(programs));
    } catch (e) {
      console.error('Failed to save programs to localStorage:', e);
    }
  }, [programs]);

  useEffect(() => {
    try {
      localStorage.setItem(PROGRAM_CATEGORIES_STORAGE_KEY, JSON.stringify(programCategories));
    } catch (e) {
      console.error('Failed to save program categories to localStorage:', e);
    }
  }, [programCategories]);

  useEffect(() => {
    try {
      localStorage.setItem(INSTAGRAM_PHOTOS_STORAGE_KEY, JSON.stringify(instagramPhotos));
    } catch (e) {
      console.error('Failed to save instagram photos to localStorage:', e);
    }
  }, [instagramPhotos]);

  const [isInstagramModalOpen, setIsInstagramModalOpen] = useState(false);
  const [editingInstagramPhoto, setEditingInstagramPhoto] = useState<InstagramPhotoItem | null>(null);

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem(AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [currentUser, setCurrentUser] = useState<{ name: string; role: string; email: string } | null>(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return null;
  });

  const [loginRedirectReason, setLoginRedirectReason] = useState<string | null>(null);

  const handleLoginSuccess = (user: { name: string; role: string; email: string }) => {
    setIsLoggedIn(true);
    setAdminViewMode('dashboard');
    setCurrentUser(user);
    try {
      localStorage.setItem(AUTH_KEY, 'true');
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch {
      // ignore
    }
    setToastMessage(`Selamat datang, ${user.name}!`);
    setTimeout(() => setToastMessage(null), 3000);
    setLoginRedirectReason(null);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAdminViewMode('dashboard');
    setCurrentUser(null);
    try {
      localStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {
      // ignore
    }
    setToastMessage('Sesi administrator telah keluar.');
    setTimeout(() => setToastMessage(null), 3000);
    if (currentTab === 'manage') {
      setCurrentTab('overview');
    }
  };

  const handleRequireLogin = (reason?: string) => {
    setLoginRedirectReason(reason || 'Silakan masuk untuk mengakses fitur ini.');
    setCurrentTab('login');
  };

  const handleProtectedCreateModal = () => {
    if (isLoggedIn) {
      setEditingPublication(null);
      setIsCreateModalOpen(true);
    } else {
      handleRequireLogin('Silakan masuk terlebih dahulu untuk mempublikasikan kegiatan baru.');
    }
  };

  const handleSaveProgram = (newOrUpdatedProg: FlagshipProgram) => {
    saveProgramApi(newOrUpdatedProg);
    setPrograms((prev) => {
      const exists = prev.some((p) => p.id === newOrUpdatedProg.id);
      if (exists) {
        setToastMessage(`Program "${newOrUpdatedProg.title.slice(0, 30)}..." berhasil diperbarui!`);
        setTimeout(() => setToastMessage(null), 3000);
        return prev.map((p) => (p.id === newOrUpdatedProg.id ? newOrUpdatedProg : p));
      }
      setToastMessage(`Program "${newOrUpdatedProg.title.slice(0, 30)}..." berhasil ditambahkan!`);
      setTimeout(() => setToastMessage(null), 3000);
      return [newOrUpdatedProg, ...prev];
    });
  };

  const handleDeleteProgram = (id: string) => {
    deleteProgramApi(id);
    setPrograms((prev) => prev.filter((p) => p.id !== id));
    setToastMessage('Program unggulan berhasil dihapus.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddCategory = (newCat: string) => {
    const trimmed = newCat.trim();
    if (!trimmed) return;
    if (programCategories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      showToast(`Kategori "${trimmed}" sudah ada.`);
      return;
    }
    const updated = [...programCategories, trimmed];
    setProgramCategories(updated);
    saveCategoriesApi(updated);
    showToast(`Kategori "${trimmed}" berhasil ditambahkan.`);
  };

  const handleEditCategory = (oldName: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed || trimmed.toLowerCase() === oldName.toLowerCase()) return;
    const updated = programCategories.map((c) => (c === oldName ? trimmed : c));
    setProgramCategories(updated);
    saveCategoriesApi(updated);
    // Automatically reassign all programs that had the old category name
    setPrograms((prev) =>
      prev.map((p) => {
        if (p.category === oldName) {
          const mod = { ...p, category: trimmed };
          saveProgramApi(mod);
          return mod;
        }
        return p;
      })
    );
    showToast(`Kategori "${oldName}" berhasil diubah menjadi "${trimmed}".`);
  };

  const handleDeleteCategory = (catToDelete: string, replacementCategory?: string) => {
    if (programCategories.length <= 1) {
      showToast('Minimal harus ada 1 kategori program.');
      return;
    }
    const remaining = programCategories.filter((c) => c !== catToDelete);
    const targetReplacement = replacementCategory || remaining[0] || 'Umum';
    setProgramCategories(remaining);
    saveCategoriesApi(remaining);
    // Reassign programs to the replacement category
    setPrograms((prev) =>
      prev.map((p) => {
        if (p.category === catToDelete) {
          const mod = { ...p, category: targetReplacement };
          saveProgramApi(mod);
          return mod;
        }
        return p;
      })
    );
    showToast(`Kategori "${catToDelete}" berhasil dihapus.`);
  };

  // Draft count for quick admin notification
  const draftCount = useMemo(() => {
    return publications.filter((p) => p.status === 'draft').length;
  }, [publications]);

  // UI Navigation & View State
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [viewMode, setViewMode] = useState<DashboardViewMode>('grid');

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'all',
    type: 'all',
    status: 'all',
    onlyBookmarked: false,
    sortBy: 'date-desc',
  });

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Modal States
  const [readingPublication, setReadingPublication] = useState<Publication | null>(null);
  const [activePhoto, setActivePhoto] = useState<{
    photo: GalleryPhoto;
    publication: Publication;
  } | null>(null);
  const [editingPublication, setEditingPublication] = useState<Publication | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [printablePublication, setPrintablePublication] = useState<Publication | null>(null);
  
  // Dedicated Admin Dashboard View Mode (Requested by user matching Jagowebdev screenshot)
  const [adminViewMode, setAdminViewMode] = useState<'dashboard' | 'public_preview'>('dashboard');
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<FlagshipProgram | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Filtered and sorted publications
  const filteredPublications = useMemo(() => {
    return publications
      .filter((pub) => {
        // Bookmarked only filter
        if (filters.onlyBookmarked && !pub.isBookmarked) {
          return false;
        }

        // Search
        if (filters.search) {
          const query = filters.search.toLowerCase();
          const matchTitle = pub.title.toLowerCase().includes(query);
          const matchLocation = pub.location.toLowerCase().includes(query);
          const matchSummary = pub.summary.toLowerCase().includes(query);
          const matchAuthor = pub.author.name.toLowerCase().includes(query);
          const matchTags = pub.tags.some((t) => t.toLowerCase().includes(query));
          if (!matchTitle && !matchLocation && !matchSummary && !matchAuthor && !matchTags) {
            return false;
          }
        }

        // Category
        if (filters.category !== 'all' && pub.category !== filters.category) {
          return false;
        }

        // Type
        if (filters.type !== 'all' && pub.type !== filters.type) {
          return false;
        }

        // Status
        if (filters.status !== 'all' && pub.status !== filters.status) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'date-desc') {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        if (filters.sortBy === 'date-asc') {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        if (filters.sortBy === 'likes-desc') {
          return (b.likesCount || 0) - (a.likesCount || 0);
        }
        if (filters.sortBy === 'views-desc') {
          return b.viewsCount - a.viewsCount;
        }
        if (filters.sortBy === 'title-asc') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [publications, filters]);

  // Featured publications for the Interactive Hero slider
  const featuredPublications = useMemo(() => {
    const list = publications.filter((p) => p.featured);
    return list.length > 0 ? list : publications.slice(0, 3);
  }, [publications]);

  // Flat list of all photos across all publications for seamless lightbox scrubbing
  const allPhotosList = useMemo(() => {
    return publications.flatMap((pub) =>
      (pub.gallery || []).map((photo) => ({
        photo,
        publication: pub,
      }))
    );
  }, [publications]);

  const savedCount = useMemo(() => {
    return publications.filter((p) => p.isBookmarked).length;
  }, [publications]);

  // Interactive Handlers
  const handleOpenJournal = (pub: Publication) => {
    setPublications((prev) =>
      prev.map((item) =>
        item.id === pub.id ? { ...item, viewsCount: item.viewsCount + 1 } : item
      )
    );
    setReadingPublication(pub);
  };

  const handleOpenPhotoLightbox = (photo: GalleryPhoto, relatedPublication: Publication) => {
    setActivePhoto({ photo, publication: relatedPublication });
  };

  const handleToggleLike = (id: string) => {
    setPublications((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newLikes = (p.likesCount || 0) + 1;
          showToast(`Apresiasi ditambahkan untuk: "${p.title.slice(0, 30)}..."`);
          return { ...p, likesCount: newLikes };
        }
        return p;
      })
    );

    // Keep active modal in sync
    if (readingPublication && readingPublication.id === id) {
      setReadingPublication((prev) => prev ? { ...prev, likesCount: prev.likesCount + 1 } : null);
    }
  };

  const handleToggleBookmark = (id: string) => {
    setPublications((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextState = !p.isBookmarked;
          showToast(nextState ? 'Kegiatan berhasil disimpan ke daftar favorit' : 'Kegiatan dihapus dari daftar simpanan');
          return { ...p, isBookmarked: nextState };
        }
        return p;
      })
    );

    // Keep active modal in sync
    if (readingPublication && readingPublication.id === id) {
      setReadingPublication((prev) => prev ? { ...prev, isBookmarked: !prev.isBookmarked } : null);
    }
  };

  const handleAddComment = (pubId: string, commentData: Omit<JournalComment, 'id' | 'date'>) => {
    const newComment: JournalComment = {
      id: `c-${Date.now()}`,
      author: commentData.author,
      text: commentData.text,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
    };

    setPublications((prev) =>
      prev.map((p) => {
        if (p.id === pubId) {
          const updatedComments = [...(p.comments || []), newComment];
          return { ...p, comments: updatedComments };
        }
        return p;
      })
    );

    if (readingPublication && readingPublication.id === pubId) {
      setReadingPublication((prev) => prev ? {
        ...prev,
        comments: [...(prev.comments || []), newComment]
      } : null);
    }

    showToast('Catatan refleksi Anda berhasil dipublikasikan!');
  };

  const handleSavePublication = (newOrUpdated: Publication) => {
    savePublicationApi(newOrUpdated);
    setPublications((prev) => {
      const exists = prev.some((p) => p.id === newOrUpdated.id);
      if (exists) {
        showToast('Publikasi berhasil diperbarui');
        return prev.map((p) => (p.id === newOrUpdated.id ? newOrUpdated : p));
      }
      showToast('Kegiatan baru berhasil dipublikasikan');
      return [newOrUpdated, ...prev];
    });
    setEditingPublication(null);
  };

  const handleDeletePublication = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus publikasi kegiatan ini?')) {
      deletePublicationApi(id);
      setPublications((prev) => prev.filter((p) => p.id !== id));
      showToast('Publikasi kegiatan telah dihapus');
    }
  };

  const handleToggleStatus = (id: string) => {
    setPublications((prev) => {
      const updated: Publication[] = prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: (p.status === 'published' ? 'draft' : 'published') as Publication['status'],
            }
          : p
      );
      const target = updated.find((p) => p.id === id);
      if (target) savePublicationApi(target);
      return updated;
    });
  };

  const handleResetData = async () => {
    if (window.confirm('Kembalikan semua data ke contoh data awal? Perubahan kustom akan terganti.')) {
      await resetSystemDataApi();
      setPublications(INITIAL_PUBLICATIONS);
      setPrograms(FLAGSHIP_PROGRAMS);
      setInstagramPhotos(INITIAL_INSTAGRAM_PHOTOS);
      showToast('Data dikembalikan ke pengaturan awal');
    }
  };

  const handleQuickPrintAll = () => {
    if (featuredPublications[0]) {
      setPrintablePublication(featuredPublications[0]);
    }
  };

  // Instagram Photo Handlers
  const handleTogglePhotoLike = (photoId: string) => {
    setInstagramPhotos((prev) =>
      prev.map((photo) => {
        if (photo.id === photoId) {
          const wasLiked = photo.isLiked;
          const nextCount = wasLiked ? photo.likesCount - 1 : photo.likesCount + 1;
          showToast(wasLiked ? 'Batal menyukai foto' : 'Menyukai foto kegiatan ❤️');
          return {
            ...photo,
            likesCount: Math.max(0, nextCount),
            isLiked: !wasLiked,
          };
        }
        return photo;
      })
    );
  };

  const handleTogglePhotoBookmark = (photoId: string) => {
    setInstagramPhotos((prev) =>
      prev.map((photo) => {
        if (photo.id === photoId) {
          const nextState = !photo.isBookmarked;
          showToast(nextState ? 'Foto disimpan ke arsip tersimpan' : 'Foto dihapus dari arsip tersimpan');
          return {
            ...photo,
            isBookmarked: nextState,
          };
        }
        return photo;
      })
    );
  };

  const handleAddPhotoComment = (photoId: string, text: string) => {
    const authorUsername = currentUser?.name ? currentUser.name.toLowerCase().replace(/\s+/g, '_') : 'khalayak_karsa';
    const newComment = {
      id: `c-${Date.now()}`,
      username: authorUsername,
      text,
      timeAgo: 'Baru saja',
    };

    setInstagramPhotos((prev) =>
      prev.map((photo) => {
        if (photo.id === photoId) {
          return {
            ...photo,
            comments: [...(photo.comments || []), newComment],
          };
        }
        return photo;
      })
    );
    showToast('Komentar Anda berhasil dipublikasikan!');
  };

  const handleSaveInstagramPhoto = (photoItem: InstagramPhotoItem) => {
    saveInstagramPhotoApi(photoItem);
    setInstagramPhotos((prev) => {
      const exists = prev.some((p) => p.id === photoItem.id);
      if (exists) {
        showToast(`Foto "${photoItem.title}" berhasil diperbarui`);
        return prev.map((p) => (p.id === photoItem.id ? photoItem : p));
      } else {
        showToast('Foto kegiatan baru berhasil dipublikasikan ke feed!');
        return [photoItem, ...prev];
      }
    });
  };

  const handleDeleteInstagramPhoto = (photoId: string) => {
    deleteInstagramPhotoApi(photoId);
    setInstagramPhotos((prev) => prev.filter((p) => p.id !== photoId));
    showToast('Publikasi foto kegiatan telah dihapus');
  };

  // If user is logged in and in Admin Dashboard mode (matching Jagowebdev screenshot layout)
  if (isLoggedIn && adminViewMode === 'dashboard') {
    return (
      <div className="min-h-screen bg-[#f3f4f6]">
        {/* Interactive Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-60 bg-neutral-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-lg border border-neutral-700 animate-in fade-in slide-in-from-bottom-2 duration-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        <AdminDashboardLayout
          currentUser={currentUser}
          onLogout={handleLogout}
          onViewPublicSite={() => setAdminViewMode('public_preview')}
          publications={publications}
          programs={programs}
          categories={programCategories}
          onAddProgram={handleSaveProgram}
          onEditProgram={(prog) => {
            setEditingProgram(prog);
            setIsProgramModalOpen(true);
          }}
          onDeleteProgram={handleDeleteProgram}
          onAddCategory={handleAddCategory}
          onEditCategory={handleEditCategory}
          onDeleteCategory={handleDeleteCategory}
          onOpenCreatePublication={() => {
            setEditingPublication(null);
            setIsCreateModalOpen(true);
          }}
          onEditPublication={(pub) => {
            setEditingPublication(pub);
            setIsCreateModalOpen(true);
          }}
          onDeletePublication={handleDeletePublication}
          onTogglePublicationStatus={handleToggleStatus}
          onOpenJournalReader={handleOpenJournal}
          onPrintPublication={(pub) => setPrintablePublication(pub)}
          onPrintAll={handleQuickPrintAll}
          onResetData={handleResetData}
          onOpenProgramModal={() => {
            setEditingProgram(null);
            setIsProgramModalOpen(true);
          }}
          instagramPhotos={instagramPhotos}
          onOpenCreateInstagramPhoto={() => {
            setEditingInstagramPhoto(null);
            setIsInstagramModalOpen(true);
          }}
          onEditInstagramPhoto={(photo) => {
            setEditingInstagramPhoto(photo);
            setIsInstagramModalOpen(true);
          }}
          onDeleteInstagramPhoto={handleDeleteInstagramPhoto}
        />

        {/* Global Modals for Admin Dashboard */}
        {isCreateModalOpen && (
          <PublicationFormModal
            isOpen={isCreateModalOpen}
            onClose={() => {
              setIsCreateModalOpen(false);
              setEditingPublication(null);
            }}
            onSave={handleSavePublication}
            initialData={editingPublication}
            categories={CATEGORIES}
          />
        )}

        {isProgramModalOpen && (
          <ProgramFormModal
            isOpen={isProgramModalOpen}
            initialData={editingProgram}
            onClose={() => {
              setIsProgramModalOpen(false);
              setEditingProgram(null);
            }}
            onSave={(prog) => {
              handleSaveProgram(prog);
              setIsProgramModalOpen(false);
              setEditingProgram(null);
            }}
            onOpenCategoryManager={() => setIsCategoryModalOpen(true)}
            categories={programCategories}
          />
        )}

        {isCategoryModalOpen && (
          <ProgramCategoryModal
            isOpen={isCategoryModalOpen}
            onClose={() => setIsCategoryModalOpen(false)}
            categories={programCategories}
            programs={programs}
            onAddCategory={handleAddCategory}
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        )}

        {isInstagramModalOpen && (
          <InstagramPhotoFormModal
            isOpen={isInstagramModalOpen}
            onClose={() => {
              setIsInstagramModalOpen(false);
              setEditingInstagramPhoto(null);
            }}
            onSave={(photo) => {
              handleSaveInstagramPhoto(photo);
              setIsInstagramModalOpen(false);
              setEditingInstagramPhoto(null);
            }}
            initialData={editingInstagramPhoto}
            categories={programCategories}
          />
        )}

        {readingPublication && (
          <JournalReaderModal
            publication={readingPublication}
            onClose={() => setReadingPublication(null)}
            onOpenPhotoLightbox={handleOpenPhotoLightbox}
            onPrintReport={(pub) => setPrintablePublication(pub)}
            onToggleLike={handleToggleLike}
            onToggleBookmark={handleToggleBookmark}
            onAddComment={handleAddComment}
          />
        )}

        {printablePublication && (
          <PrintableReportModal
            publication={printablePublication}
            onClose={() => setPrintablePublication(null)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans">
      {/* Admin Quick Return Bar when in Public Preview Mode */}
      {isLoggedIn && adminViewMode === 'public_preview' && (
        <div className="bg-[#563d7c] text-white px-4 py-2.5 text-xs flex items-center justify-between z-50 sticky top-0 shadow-md border-b border-white/20">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold">Mode Pratinjau Tampilan Publik</span>
            <span className="text-white/70 hidden sm:inline">&bull; Masuk sebagai {currentUser?.name}</span>
          </div>
          <button
            onClick={() => setAdminViewMode('dashboard')}
            className="px-3.5 py-1.5 bg-white text-[#563d7c] rounded-lg font-bold text-xs hover:bg-neutral-100 transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <span>← Kembali ke Panel Admin</span>
          </button>
        </div>
      )}

      {/* Interactive Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-60 bg-neutral-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-lg border border-neutral-700 animate-in fade-in slide-in-from-bottom-2 duration-200 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area with Bottom Padding for Instagram Navigation Bar */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-28 sm:pb-32">
        {/* Clean Instagram-Style Brand Header Strip */}
        <div className="flex items-center justify-between pb-3 pt-1 mb-6 border-b border-neutral-200/80">
          <div className="flex items-center gap-3">
            <h1 
              onClick={() => setCurrentTab('overview')}
              className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 font-serif cursor-pointer hover:opacity-80 transition-opacity select-none"
            >
              WartaKarsa
            </h1>
            <span className="hidden sm:inline-block text-2xs text-neutral-400 font-sans tracking-wide border-l border-neutral-200 pl-3">
              Publikasi Kegiatan &amp; Jurnal Ilmiah
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleQuickPrintAll}
              title="Cetak Rekapitulasi Dokumen"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:text-neutral-900 bg-white hover:bg-neutral-100 border border-neutral-200/80 rounded-xl transition-colors shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cetak Rekap</span>
            </button>
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                title="Keluar dari sesi Administrator"
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-neutral-500 hover:text-red-600 hover:bg-red-50 border border-neutral-200/80 rounded-xl transition-colors"
              >
                <span>Keluar</span>
              </button>
            )}
          </div>
        </div>
        {/* Administrator Workplace Banner (Exclusive when logged in) */}
        {isLoggedIn && (
          <AdminWorkspaceBanner
            currentUser={currentUser}
            onOpenCreatePublication={() => {
              setEditingPublication(null);
              setIsCreateModalOpen(true);
            }}
            onOpenCreateJournal={() => {
              setEditingPublication(null);
              setIsCreateModalOpen(true);
            }}
            onOpenCreateProgram={() => {
              setCurrentTab('programs');
            }}
            onNavigateToManage={() => setAdminViewMode('dashboard')}
            onLogout={handleLogout}
            totalPublications={publications.length}
            draftCount={draftCount}
          />
        )}

        {/* TAB 1: OVERVIEW & INTERACTIVE DASHBOARD */}
        {currentTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Metric Overview */}
            <StatOverview publications={publications} />

            {/* Interactive Spotlight Hero Slider */}
            <InteractiveHero
              featuredPublications={featuredPublications}
              onOpenJournal={handleOpenJournal}
              onOpenGallery={handleOpenPhotoLightbox}
              onToggleLike={handleToggleLike}
              onToggleBookmark={handleToggleBookmark}
            />

            {/* Filter and View Mode Switcher */}
            <FilterBar
              filters={filters}
              onFilterChange={setFilters}
              categories={CATEGORIES}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              savedCount={savedCount}
            />

            {/* VIEW MODE 1: GRID VIEW */}
            {viewMode === 'grid' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-neutral-900">
                    Katalog Dokumentasi & Jurnal ({filteredPublications.length})
                  </h3>
                  <span className="text-xs text-neutral-500 font-mono tabular-nums">
                    {filteredPublications.length} publikasi ditemukan
                  </span>
                </div>

                {filteredPublications.length === 0 ? (
                  <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center">
                    <p className="text-sm font-semibold text-neutral-800">
                      Tidak ada kegiatan yang sesuai kriteria pencarian
                    </p>
                    <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1 mb-4">
                      {filters.onlyBookmarked
                        ? 'Anda belum menyimpan kegiatan favorit. Klik ikon bookmark pada kartu kegiatan untuk menyimpannya.'
                        : 'Coba sesuaikan kata kunci atau bersihkan filter yang aktif.'}
                    </p>
                    <button
                      onClick={() =>
                        setFilters({
                          search: '',
                          category: 'all',
                          type: 'all',
                          status: 'all',
                          onlyBookmarked: false,
                          sortBy: 'date-desc',
                        })
                      }
                      className="px-3.5 py-1.5 text-xs font-medium bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
                    >
                      Atur Ulang Filter
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {filteredPublications.map((pub) => (
                      <PublicationCard
                        key={pub.id}
                        publication={pub}
                        onOpenJournal={handleOpenJournal}
                        onOpenGallery={(p) => {
                          if (p.gallery && p.gallery[0]) {
                            handleOpenPhotoLightbox(p.gallery[0], p);
                          } else {
                            handleOpenJournal(p);
                          }
                        }}
                        onToggleLike={handleToggleLike}
                        onToggleBookmark={handleToggleBookmark}
                        isLoggedIn={isLoggedIn}
                        onEdit={(p) => {
                          setEditingPublication(p);
                          setIsCreateModalOpen(true);
                        }}
                        onDelete={handleDeletePublication}
                        onToggleStatus={handleToggleStatus}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* VIEW MODE 2: TIMELINE VIEW */}
            {viewMode === 'timeline' && (
              <TimelineView
                publications={filteredPublications}
                onOpenJournal={handleOpenJournal}
                onOpenPhotoLightbox={handleOpenPhotoLightbox}
                onToggleLike={handleToggleLike}
                onToggleBookmark={handleToggleBookmark}
                isLoggedIn={isLoggedIn}
                onEdit={(p) => {
                  setEditingPublication(p);
                  setIsCreateModalOpen(true);
                }}
                onDelete={handleDeletePublication}
                onToggleStatus={handleToggleStatus}
              />
            )}

            {/* VIEW MODE 3: LOCATION HUB VIEW */}
            {viewMode === 'location' && (
              <LocationHubView
                publications={filteredPublications}
                onOpenJournal={handleOpenJournal}
              />
            )}
          </div>
        )}

        {/* TAB 2: FLAGSHIP PROGRAMS (PROGRAM UNGGULAN 2025-2029) */}
        {(currentTab === 'programs' || currentTab === 'gallery') && (
          <FlagshipProgramsSection
            programs={programs}
            categories={programCategories}
            onAddProgram={handleSaveProgram}
            onDeleteProgram={handleDeleteProgram}
            onAddCategory={handleAddCategory}
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategory}
            isLoggedIn={isLoggedIn}
            onRequireLogin={handleRequireLogin}
            onNavigateToCategoryJournal={(category) => {
              setFilters((prev) => ({ ...prev, category }));
              setCurrentTab('overview');
            }}
          />
        )}

        {/* TAB 2.5: PUBLIKASI FOTO KEGIATAN (Hanya Tersedia Setelah Login) */}
        {currentTab === 'photo-feed' && (
          isLoggedIn ? (
            <InstagramPhotoFeed
              photos={instagramPhotos}
              categories={programCategories}
              onToggleLike={handleTogglePhotoLike}
              onToggleBookmark={handleTogglePhotoBookmark}
              onAddComment={handleAddPhotoComment}
              isLoggedIn={isLoggedIn}
              onOpenUploadModal={() => {
                setEditingInstagramPhoto(null);
                setIsInstagramModalOpen(true);
              }}
            />
          ) : (
            <LoginSection
              redirectReason={loginRedirectReason || 'Silakan masuk untuk mengakses menu publikasi foto kegiatan.'}
              onLoginSuccess={handleLoginSuccess}
            />
          )
        )}

        {/* TAB 3: DEDICATED JOURNALS VIEW */}
        {currentTab === 'journals' && (
          <JournalListSection
            publications={publications}
            onOpenJournal={handleOpenJournal}
            onPrintReport={(pub) => setPrintablePublication(pub)}
            isLoggedIn={isLoggedIn}
            onOpenCreateJournal={() => {
              if (isLoggedIn) {
                setEditingPublication(null);
                setIsCreateModalOpen(true);
              } else {
                handleRequireLogin('Silakan masuk terlebih dahulu untuk menulis naskah jurnal baru.');
              }
            }}
            onEditJournal={(pub) => {
              setEditingPublication(pub);
              setIsCreateModalOpen(true);
            }}
            onDeleteJournal={handleDeletePublication}
            onToggleStatus={handleToggleStatus}
          />
        )}

        {/* TAB 4: ARCHIVE & MANAGEMENT (Hanya Tampil / Dapat Diakses Setelah Login) */}
        {currentTab === 'manage' && (
          isLoggedIn ? (
            <ManageArchiveSection
              publications={publications}
              onEdit={(pub) => {
                setEditingPublication(pub);
                setIsCreateModalOpen(true);
              }}
              onDelete={handleDeletePublication}
              onToggleStatus={handleToggleStatus}
              onOpenCreateModal={() => {
                setEditingPublication(null);
                setIsCreateModalOpen(true);
              }}
              onResetData={handleResetData}
              onOpenJournal={handleOpenJournal}
              onLogout={handleLogout}
              currentUser={currentUser}
            />
          ) : (
            <LoginSection
              redirectReason={loginRedirectReason || 'Silakan masuk untuk mengakses menu arsip dan kelola publikasi.'}
              onLoginSuccess={handleLoginSuccess}
            />
          )
        )}

        {/* TAB 5: LOGIN (Menggantikan Arsip Sebelum Login) */}
        {currentTab === 'login' && (
          isLoggedIn ? (
            <div className="max-w-md mx-auto my-12 bg-white border border-neutral-200 rounded-3xl p-8 text-center shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                ✓
              </div>
              <h3 className="text-base font-bold text-neutral-900">Anda Sedang Masuk</h3>
              <p className="text-xs text-neutral-500 mt-1 mb-6">
                Tersambung sebagai <span className="font-semibold text-neutral-800">{currentUser?.name}</span> ({currentUser?.role})
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setCurrentTab('manage')}
                  className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-xs"
                >
                  Buka Pusat Arsip
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border border-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold hover:bg-neutral-50 transition-colors"
                >
                  Keluar Sesi
                </button>
              </div>
            </div>
          ) : (
            <LoginSection
              redirectReason={loginRedirectReason}
              onLoginSuccess={handleLoginSuccess}
            />
          )
        )}
      </main>

      {/* Footer (with bottom margin for the fixed Instagram navbar) */}
      <footer className="no-print mt-auto border-t border-neutral-200 bg-white py-6 mb-20 sm:mb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            <span className="font-semibold text-neutral-900">WartaKarsa</span> — Dashboard Publikasi Dokumentasi Kegiatan & Jurnal Ilmiah
          </div>
          <div className="flex items-center gap-4">
            <span>Sistem Dokumentasi Terstruktur</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">Versi Stabil 2026</span>
          </div>
        </div>
      </footer>

      {/* Instagram-Style Bottom Navigation Bar */}
      <BottomNavBar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenCreateModal={handleProtectedCreateModal}
        isLoggedIn={isLoggedIn}
        onRequireLogin={handleRequireLogin}
        onOpenAdminDashboard={() => setAdminViewMode('dashboard')}
        currentUser={currentUser}
        savedCount={savedCount}
      />

      {/* Modals & Overlays */}
      <JournalReaderModal
        publication={readingPublication}
        onClose={() => setReadingPublication(null)}
        onOpenPhotoLightbox={handleOpenPhotoLightbox}
        onPrintReport={(pub) => setPrintablePublication(pub)}
        onToggleLike={handleToggleLike}
        onToggleBookmark={handleToggleBookmark}
        onAddComment={handleAddComment}
      />

      <PhotoLightboxModal
        photo={activePhoto?.photo || null}
        publication={activePhoto?.publication || null}
        allPhotos={allPhotosList}
        onClose={() => setActivePhoto(null)}
        onOpenJournal={(pub) => {
          setActivePhoto(null);
          handleOpenJournal(pub);
        }}
        onSelectPhoto={(photo, pub) => {
          setActivePhoto({ photo, publication: pub });
        }}
      />

      <PublicationFormModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingPublication(null);
        }}
        onSave={handleSavePublication}
        initialData={editingPublication}
        categories={CATEGORIES}
      />

      <PrintableReportModal
        publication={printablePublication}
        onClose={() => setPrintablePublication(null)}
      />

      {isInstagramModalOpen && (
        <InstagramPhotoFormModal
          isOpen={isInstagramModalOpen}
          onClose={() => {
            setIsInstagramModalOpen(false);
            setEditingInstagramPhoto(null);
          }}
          onSave={(photo) => {
            handleSaveInstagramPhoto(photo);
            setIsInstagramModalOpen(false);
            setEditingInstagramPhoto(null);
          }}
          initialData={editingInstagramPhoto}
          categories={programCategories}
        />
      )}
    </div>
  );
}
