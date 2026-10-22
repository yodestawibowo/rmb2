import React, { useState, useEffect } from 'react';
import { GalleryPhoto, Publication } from '../types/publication';
import { 
  X, 
  Download, 
  Camera, 
  Calendar, 
  MapPin, 
  BookOpen, 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause,
  Info
} from 'lucide-react';

interface PhotoLightboxModalProps {
  photo: GalleryPhoto | null;
  publication: Publication | null;
  allPhotos?: Array<{ photo: GalleryPhoto; publication: Publication }>;
  onClose: () => void;
  onOpenJournal: (publication: Publication) => void;
  onSelectPhoto?: (photo: GalleryPhoto, publication: Publication) => void;
}

export const PhotoLightboxModal: React.FC<PhotoLightboxModalProps> = ({
  photo,
  publication,
  allPhotos = [],
  onClose,
  onOpenJournal,
  onSelectPhoto,
}) => {
  const [zoomed, setZoomed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showInfo, setShowInfo] = useState(true);

  // Find index of current photo in allPhotos
  const currentIndex = allPhotos.findIndex((item) => item.photo.id === photo?.id);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onSelectPhoto && currentIndex < allPhotos.length - 1) {
        onSelectPhoto(allPhotos[currentIndex + 1].photo, allPhotos[currentIndex + 1].publication);
      }
      if (e.key === 'ArrowLeft' && onSelectPhoto && currentIndex > 0) {
        onSelectPhoto(allPhotos[currentIndex - 1].photo, allPhotos[currentIndex - 1].publication);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onSelectPhoto, currentIndex, allPhotos]);

  // Slideshow interval
  useEffect(() => {
    if (!isPlaying || allPhotos.length <= 1 || !onSelectPhoto) return;
    const interval = setInterval(() => {
      const nextIdx = (currentIndex + 1) % allPhotos.length;
      onSelectPhoto(allPhotos[nextIdx].photo, allPhotos[nextIdx].publication);
    }, 3500);
    return () => clearInterval(interval);
  }, [isPlaying, currentIndex, allPhotos, onSelectPhoto]);

  if (!photo || !publication) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = photo.url;
    link.download = `dokumentasi_${publication.slug}_${photo.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelectPhoto && currentIndex > 0) {
      onSelectPhoto(allPhotos[currentIndex - 1].photo, allPhotos[currentIndex - 1].publication);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelectPhoto && currentIndex < allPhotos.length - 1) {
      onSelectPhoto(allPhotos[currentIndex + 1].photo, allPhotos[currentIndex + 1].publication);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between animate-in fade-in duration-200">
      {/* Lightbox Top Control Bar */}
      <div className="px-6 py-3.5 flex items-center justify-between text-neutral-300 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <span className="text-2xs uppercase tracking-wider text-neutral-400 font-semibold">
            Dokumentasi Foto Resolusi Tinggi
          </span>
          <span className="text-neutral-700">|</span>
          <span className="text-xs text-neutral-200 truncate max-w-sm hidden sm:inline">
            {publication.title}
          </span>
          {allPhotos.length > 0 && (
            <span className="text-2xs font-mono text-neutral-400">
              ({currentIndex + 1} / {allPhotos.length})
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Slideshow button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
              isPlaying ? 'bg-white text-neutral-900 font-bold' : 'text-neutral-300 hover:bg-neutral-800'
            }`}
            title={isPlaying ? 'Jeda Slideshow' : 'Mulai Putar Slideshow Otomatis'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span className="text-2xs hidden sm:inline">{isPlaying ? 'Jeda' : 'Slideshow'}</span>
          </button>

          <button
            onClick={() => setShowInfo(!showInfo)}
            className={`p-2 rounded-lg transition-colors ${showInfo ? 'text-white bg-neutral-800' : 'text-neutral-400 hover:text-white'}`}
            title="Tampilkan / Sembunyikan Keterangan"
          >
            <Info className="w-4 h-4" />
          </button>

          <button
            onClick={() => setZoomed(!zoomed)}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
            title={zoomed ? 'Perkecil' : 'Perbesar'}
          >
            {zoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
          </button>

          <button
            onClick={handleDownload}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
            title="Unduh Berkas Gambar"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors ml-2"
            title="Tutup (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Stage with Next/Prev Arrows */}
      <div 
        className="relative flex-1 flex items-center justify-center p-4 sm:p-8 overflow-auto cursor-zoom-in select-none"
        onClick={() => setZoomed(!zoomed)}
      >
        {/* Prev Arrow */}
        {currentIndex > 0 && (
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-sm z-10 transition-colors"
            title="Foto Sebelumnya (Panah Kiri)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* The Photo */}
        <img
          src={photo.url}
          alt={photo.caption}
          referrerPolicy="no-referrer"
          className={`transition-all duration-300 object-contain max-h-[70vh] rounded-lg shadow-2xl ${
            zoomed ? 'scale-130 cursor-zoom-out' : 'max-w-full'
          }`}
        />

        {/* Next Arrow */}
        {currentIndex < allPhotos.length - 1 && (
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-sm z-10 transition-colors"
            title="Foto Berikutnya (Panah Kanan)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Filmstrip Scrubber Reel */}
      {allPhotos.length > 1 && (
        <div className="bg-neutral-950/80 px-6 py-2.5 border-t border-neutral-900 flex items-center justify-center gap-2 overflow-x-auto">
          {allPhotos.map((item, idx) => (
            <button
              key={item.photo.id}
              onClick={() => onSelectPhoto && onSelectPhoto(item.photo, item.publication)}
              className={`h-12 w-20 rounded overflow-hidden shrink-0 transition-all border-2 ${
                item.photo.id === photo.id
                  ? 'border-white opacity-100 scale-105 shadow-md'
                  : 'border-transparent opacity-40 hover:opacity-80'
              }`}
            >
              <img
                src={item.photo.url}
                alt={item.photo.caption}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Bottom Info Bar */}
      {showInfo && (
        <div className="bg-neutral-900/95 border-t border-neutral-800 px-6 py-4 text-neutral-300">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm text-white font-medium">
                {photo.caption}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400">
                {photo.photographer && (
                  <span className="flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Fotografer: {photo.photographer}</span>
                  </span>
                )}
                {photo.timestamp && (
                  <span className="flex items-center gap-1 font-mono tabular-nums">
                    <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{photo.timestamp}</span>
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{publication.location}</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => {
                  onClose();
                  onOpenJournal(publication);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-neutral-900 bg-white rounded-lg hover:bg-neutral-100 transition-colors shadow-xs"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Buka Naskah Jurnal Kegiatan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
