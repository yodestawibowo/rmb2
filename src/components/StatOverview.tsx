import React from 'react';
import { Publication } from '../types/publication';
import { BookOpen, Image, Users, CheckCircle2 } from 'lucide-react';

interface StatOverviewProps {
  publications: Publication[];
}

export const StatOverview: React.FC<StatOverviewProps> = ({ publications }) => {
  const totalPublications = publications.length;
  const totalPhotos = publications.reduce((acc, p) => acc + (p.gallery?.length || 0), 0);
  const totalJournals = publications.filter(p => p.type === 'journal' || p.type === 'hybrid').length;
  const totalParticipants = publications.reduce((acc, p) => acc + (p.journal?.participantsCount || 0), 0);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-white border border-neutral-200 rounded-xl p-4 sm:p-5">
        <div className="flex items-center justify-between text-neutral-500 mb-2">
          <span className="text-xs font-medium tracking-wide">Total Kegiatan Diterbitkan</span>
          <CheckCircle2 className="w-4 h-4 text-neutral-400" />
        </div>
        <div className="text-2xl sm:text-3xl font-semibold text-neutral-900 tabular-nums font-mono">
          {totalPublications}
        </div>
        <div className="mt-1 text-xs text-neutral-500">
          Publikasi terverifikasi dalam portal
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl p-4 sm:p-5">
        <div className="flex items-center justify-between text-neutral-500 mb-2">
          <span className="text-xs font-medium tracking-wide">Dokumentasi Foto</span>
          <Image className="w-4 h-4 text-neutral-400" />
        </div>
        <div className="text-2xl sm:text-3xl font-semibold text-neutral-900 tabular-nums font-mono">
          {totalPhotos}
        </div>
        <div className="mt-1 text-xs text-neutral-500">
          Foto arsip resolusi tinggi
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl p-4 sm:p-5">
        <div className="flex items-center justify-between text-neutral-500 mb-2">
          <span className="text-xs font-medium tracking-wide">Naskah Jurnal & Laporan</span>
          <BookOpen className="w-4 h-4 text-neutral-400" />
        </div>
        <div className="text-2xl sm:text-3xl font-semibold text-neutral-900 tabular-nums font-mono">
          {totalJournals}
        </div>
        <div className="mt-1 text-xs text-neutral-500">
          Laporan kegiatan terstruktur
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl p-4 sm:p-5">
        <div className="flex items-center justify-between text-neutral-500 mb-2">
          <span className="text-xs font-medium tracking-wide">Total Partisipan Terlibat</span>
          <Users className="w-4 h-4 text-neutral-400" />
        </div>
        <div className="text-2xl sm:text-3xl font-semibold text-neutral-900 tabular-nums font-mono">
          {totalParticipants.toLocaleString('id-ID')}
        </div>
        <div className="mt-1 text-xs text-neutral-500">
          Peserta, delegasi, & relawan
        </div>
      </div>
    </div>
  );
};
