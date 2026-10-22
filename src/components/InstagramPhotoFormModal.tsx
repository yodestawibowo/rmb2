import React, { useState } from 'react';
import { X, Upload, Camera, MapPin, Sparkles, Image as ImageIcon, Check } from 'lucide-react';
import { InstagramPhotoItem } from '../data/initialInstagramPhotos';
import workshopImg from '../assets/images/kegiatan_workshop_pelatihan_1792596996674.jpg';
import baktiSosialImg from '../assets/images/kegiatan_bakti_sosial_1792596997632.jpg';
import seminarImg from '../assets/images/kegiatan_seminar_nasional_1792596997928.jpg';
import ekspedisiImg from '../assets/images/kegiatan_ekspedisi_lapangan_1792596998900.jpg';

interface InstagramPhotoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (photo: InstagramPhotoItem) => void;
  initialData?: InstagramPhotoItem | null;
  categories: string[];
}

export const InstagramPhotoFormModal: React.FC<InstagramPhotoFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  categories,
}) => {
  if (!isOpen) return null;

  const isEditing = !!initialData;

  const [title, setTitle] = useState(initialData?.title || '');
  const [photoUrl, setPhotoUrl] = useState(initialData?.photoUrl || workshopImg);
  const [caption, setCaption] = useState(initialData?.caption || '');
  const [category, setCategory] = useState(initialData?.category || categories[0] || 'Pendidikan & Pelatihan');
  const [location, setLocation] = useState(initialData?.location || 'Jakarta Pusat');
  const [photographer, setPhotographer] = useState(initialData?.photographer || 'Tim Dokumentasi');
  const [tagsInput, setTagsInput] = useState(initialData?.tags.join(' ') || '#WartaKarsa #DokumentasiLapangan');

  const presetImages = [
    { label: 'Workshop & Pelatihan', url: workshopImg },
    { label: 'Bakti Sosial & Air', url: baktiSosialImg },
    { label: 'Seminar & Riset', url: seminarImg },
    { label: 'Ekspedisi Lapangan', url: ekspedisiImg },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !photoUrl.trim() || !caption.trim()) return;

    const parsedTags = tagsInput
      .split(/[\s,]+/)
      .map((t) => (t.startsWith('#') ? t : `#${t}`))
      .filter((t) => t.length > 1);

    const photoItem: InstagramPhotoItem = {
      id: initialData?.id || `ig-${Date.now()}`,
      title: title.trim(),
      photoUrl: photoUrl.trim(),
      carouselPhotos: initialData?.carouselPhotos || [photoUrl.trim()],
      caption: caption.trim(),
      category,
      location: location.trim(),
      photographer: photographer.trim(),
      authorName: initialData?.authorName || 'wartakarsa.official',
      date: initialData?.date || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      likesCount: initialData?.likesCount ?? Math.floor(Math.random() * 200 + 50),
      isLiked: initialData?.isLiked ?? false,
      isBookmarked: initialData?.isBookmarked ?? false,
      tags: parsedTags.length > 0 ? parsedTags : ['#WartaKarsa', '#DokumentasiKegiatan'],
      comments: initialData?.comments || [],
    };

    onSave(photoItem);
    onClose();
  };

  const handleInsertTag = (tag: string) => {
    if (!tagsInput.includes(tag)) {
      setTagsInput((prev) => `${prev} ${tag}`.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative bg-white border border-neutral-200 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-xs">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-neutral-900">
                {isEditing ? 'Sunting Foto Feed Instagram' : 'Upload Foto Kegiatan Baru (Instagram Feed)'}
              </h3>
              <p className="text-2xs text-neutral-500">
                Publikasikan dokumentasi visual kegiatan ke feed Instagram dengan teks dan tagar
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-800 rounded-xl hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          {/* Preset Photo Selector */}
          <div>
            <label className="block font-semibold text-neutral-700 mb-1.5">
              Pilih / Upload Gambar Foto Kegiatan
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
              {presetImages.map((img) => (
                <button
                  key={img.label}
                  type="button"
                  onClick={() => setPhotoUrl(img.url)}
                  className={`p-1.5 rounded-xl border text-left transition-all group overflow-hidden ${
                    photoUrl === img.url
                      ? 'border-neutral-900 ring-2 ring-neutral-900/10 bg-neutral-50'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.label}
                    referrerPolicy="no-referrer"
                    className="w-full h-16 object-cover rounded-lg mb-1"
                  />
                  <span className="text-3xs font-semibold text-neutral-800 block truncate">
                    {img.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Custom URL Input */}
            <input
              type="text"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="Atau tempel URL gambar (https://...)"
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono focus:ring-1 focus:ring-neutral-900 focus:bg-white"
            />
          </div>

          {/* Judul Kegiatan */}
          <div>
            <label className="block font-semibold text-neutral-700 mb-1">
              Judul Foto / Kegiatan
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Lokakarya Akselerasi Digital & Kolaborasi Lapangan"
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-1 focus:ring-neutral-900 focus:bg-white text-neutral-900"
            />
          </div>

          {/* Kategori & Lokasi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Kategori Kegiatan</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:ring-1 focus:ring-neutral-900 focus:bg-white"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Lokasi Geotag</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Contoh: Semaka, Tanggamus, Lampung"
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:ring-1 focus:ring-neutral-900 focus:bg-white"
              />
            </div>
          </div>

          {/* Fotografer */}
          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Nama Fotografer</label>
            <input
              type="text"
              value={photographer}
              onChange={(e) => setPhotographer(e.target.value)}
              placeholder="Contoh: Ahmad Faisal"
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:ring-1 focus:ring-neutral-900 focus:bg-white"
            />
          </div>

          {/* Caption Instagram */}
          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Caption Kiriman Instagram</label>
            <textarea
              rows={3}
              required
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Tuliskan cerita menarik di balik momen kegiatan ini..."
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:ring-1 focus:ring-neutral-900 focus:bg-white"
            />
          </div>

          {/* Hashtags */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-semibold text-neutral-700">Tagar / Hashtag</label>
              <span className="text-3xs text-neutral-400">Klik rekomendasi tagar untuk menambahkan</span>
            </div>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="#WartaKarsa #DokumentasiLapangan #AksiNyata"
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono text-blue-600 focus:ring-1 focus:ring-neutral-900 focus:bg-white mb-1.5"
            />
            <div className="flex flex-wrap gap-1 text-3xs">
              {['#WartaKarsa', '#DokumentasiKegiatan', '#BaktiSosial', '#TransformasiDigital', '#SemakaPeduli', '#KonservasiAlam'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleInsertTag(t)}
                  className="px-2 py-0.5 rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-mono transition-colors"
                >
                  +{t}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-end gap-2 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-neutral-600 hover:text-neutral-900 rounded-xl font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Foto Feed</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
