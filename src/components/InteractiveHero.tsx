import React, { useState, useEffect } from 'react';
import { Publication, GalleryPhoto } from '../types/publication';
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Image as ImageIcon, 
  Heart, 
  Bookmark, 
  Calendar, 
  MapPin, 
  Users 
} from 'lucide-react';

interface InteractiveHeroProps {
  featuredPublications: Publication[];
  onOpenJournal: (pub: Publication) => void;
  onOpenGallery: (photo: GalleryPhoto, pub: Publication) => void;
  onToggleLike: (id: string) => void;
  onToggleBookmark: (id: string) => void;
}

export const InteractiveHero: React.FC<InteractiveHeroProps> = ({
  featuredPublications,
  onOpenJournal,
  onOpenGallery,
  onToggleLike,
  onToggleBookmark,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const activePub = featuredPublications[currentIndex] || featuredPublications[0];

  useEffect(() => {
    if (!isAutoPlaying || featuredPublications.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredPublications.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, featuredPublications.length]);

  if (!activePub) return null;

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + featuredPublications.length) % featuredPublications.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % featuredPublications.length);
  };

  const formattedDate = new Date(activePub.date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div 
      className="relative bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs hover:border-neutral-300 transition-all mb-8"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[440px]">
        {/* Left Visual Area with Photo and Caption */}
        <div className="lg:col-span-7 relative aspect-16/9 lg:aspect-auto overflow-hidden bg-neutral-900 group">
          <img
            src={activePub.coverImage}
            alt={activePub.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Top visual tags */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="text-2xs font-semibold px-2.5 py-1 bg-black/60 text-white backdrop-blur-md rounded-md tracking-wider uppercase">
              Sorotan Kegiatan
            </span>
            <span className="text-2xs font-mono tabular-nums px-2 py-1 bg-white/20 text-white backdrop-blur-md rounded-md">
              0{currentIndex + 1} / 0{featuredPublications.length}
            </span>
          </div>

          {/* Bottom Photo Caption & Controls */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 text-white">
            <div className="max-w-md">
              <p className="text-xs font-medium text-neutral-200 line-clamp-1 drop-shadow-sm">
                {activePub.gallery?.[0]?.caption || activePub.title}
              </p>
              <div className="flex items-center gap-2 text-2xs text-neutral-400 mt-0.5">
                {activePub.gallery?.[0]?.photographer && (
                  <span>Foto: {activePub.gallery[0].photographer}</span>
                )}
                <span>·</span>
                <span>{activePub.location}</span>
              </div>
            </div>

            {/* Slide Arrows */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handlePrev}
                aria-label="Kegiatan Sebelumnya"
                className="p-2 rounded-lg bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Kegiatan Berikutnya"
                className="p-2 rounded-lg bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Editorial Details */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-white">
          <div>
            {/* Zero-Pill Header Metadata */}
            <div className="flex items-center justify-between gap-2 text-xs text-neutral-500 mb-3">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-neutral-900">{activePub.category}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">{formattedDate}</span>
              </div>

              {/* Like & Bookmark Quick Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onToggleBookmark(activePub.id)}
                  title={activePub.isBookmarked ? 'Hapus Simpanan' : 'Simpan Kegiatan Ini'}
                  className={`p-1.5 rounded-md transition-colors ${
                    activePub.isBookmarked
                      ? 'text-amber-600 bg-amber-50'
                      : 'text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${activePub.isBookmarked ? 'fill-amber-600' : ''}`} />
                </button>
                <button
                  onClick={() => onToggleLike(activePub.id)}
                  title="Beri Apresiasi"
                  className="flex items-center gap-1 p-1.5 rounded-md text-neutral-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Heart className={`w-4 h-4 ${activePub.likesCount > 0 ? 'text-red-500 fill-red-500' : ''}`} />
                  <span className="text-2xs font-mono tabular-nums">{activePub.likesCount}</span>
                </button>
              </div>
            </div>

            {/* Title */}
            <h2
              onClick={() => onOpenJournal(activePub)}
              className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 hover:text-neutral-700 cursor-pointer leading-snug mb-3 text-balance"
            >
              {activePub.title}
            </h2>

            {/* Summary */}
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-5 line-clamp-3">
              {activePub.summary}
            </p>

            {/* Meta Strip */}
            <div className="space-y-2 text-xs text-neutral-600 mb-6 py-3 border-y border-neutral-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span className="truncate">{activePub.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span className="font-mono tabular-nums">
                  {activePub.journal.participantsCount} Partisipan · {activePub.journal.impactMetrics}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs & Thumbnail Switcher */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <button
                onClick={() => onOpenJournal(activePub)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors shadow-xs"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Baca Jurnal Lengkap</span>
              </button>

              {activePub.gallery && activePub.gallery[0] && (
                <button
                  onClick={() => onOpenGallery(activePub.gallery[0], activePub)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Lihat Foto ({activePub.gallery.length})</span>
                </button>
              )}
            </div>

            {/* Featured Thumbnail Scrubber */}
            <div className="flex items-center gap-2 pt-2 border-t border-neutral-100">
              <span className="text-2xs text-neutral-400 font-medium whitespace-nowrap">Pilih Sorotan:</span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {featuredPublications.map((pub, idx) => (
                  <button
                    key={pub.id}
                    onClick={() => {
                      setIsAutoPlaying(false);
                      setCurrentIndex(idx);
                    }}
                    className={`h-7 px-2.5 rounded-md text-2xs font-medium transition-all whitespace-nowrap truncate max-w-[130px] border ${
                      idx === currentIndex
                        ? 'bg-neutral-900 text-white border-neutral-900 font-semibold'
                        : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    0{idx + 1}. {pub.category.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
