import React, { useState } from 'react';
import { Publication } from '../types/publication';
import { 
  Edit3, 
  Trash2, 
  Download, 
  RefreshCw, 
  Plus, 
  Eye, 
  BookOpen, 
  Image as ImageIcon,
  CheckCircle,
  FileText
} from 'lucide-react';

interface ManageArchiveSectionProps {
  publications: Publication[];
  onEdit: (pub: Publication) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onOpenCreateModal: () => void;
  onResetData: () => void;
  onOpenJournal: (pub: Publication) => void;
  onLogout?: () => void;
  currentUser?: { name: string; role: string; email: string } | null;
}

export const ManageArchiveSection: React.FC<ManageArchiveSectionProps> = ({
  publications,
  onEdit,
  onDelete,
  onToggleStatus,
  onOpenCreateModal,
  onResetData,
  onOpenJournal,
  onLogout,
  currentUser,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = publications.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.author.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(publications, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `rekap_publikasi_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header with Quick Actions */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-neutral-900">
            Pusat Pengelolaan & Arsip Publikasi
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Kelola status terbit, sunting naskah jurnal, perbarui lampiran foto, dan unduh salinan data.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {currentUser && (
            <span className="hidden lg:inline-flex text-2xs text-neutral-500 font-medium px-2 py-1 bg-neutral-100 rounded-lg">
              {currentUser.name}
            </span>
          )}

          <button
            onClick={handleExportJSON}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor JSON</span>
          </button>

          <button
            onClick={onResetData}
            title="Pulihkan data sampel awal"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors border border-neutral-200"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Data</span>
          </button>

          <button
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Kegiatan</span>
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
            >
              <span>Keluar (Logout)</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter / Search within table */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Saring berdasarkan judul, kategori, atau nama penyusun..."
            className="text-xs w-full max-w-sm px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />

          <span className="text-xs text-neutral-500 font-mono tabular-nums whitespace-nowrap">
            Menampilkan {filtered.length} dari {publications.length} Arsip
          </span>
        </div>

        {/* Dense Data Grid Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-neutral-600 font-medium">
                <th className="py-3 px-4">Judul Kegiatan & Kategori</th>
                <th className="py-3 px-3">Tanggal</th>
                <th className="py-3 px-3">Format</th>
                <th className="py-3 px-3">Penyusun</th>
                <th className="py-3 px-3 text-center">Partisipan</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map((pub) => {
                const formattedDate = new Date(pub.date).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                });

                return (
                  <tr key={pub.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-semibold text-neutral-900 line-clamp-1">{pub.title}</div>
                      <div className="text-2xs text-neutral-500 mt-0.5">{pub.category} · {pub.location}</div>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap font-mono tabular-nums text-neutral-600">
                      {formattedDate}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      {pub.type === 'hybrid' && (
                        <span className="text-neutral-700 flex items-center gap-1 text-2xs font-medium">
                          <FileText className="w-3 h-3 text-neutral-400" />
                          Foto & Jurnal
                        </span>
                      )}
                      {pub.type === 'journal' && (
                        <span className="text-neutral-700 flex items-center gap-1 text-2xs font-medium">
                          <BookOpen className="w-3 h-3 text-neutral-400" />
                          Jurnal
                        </span>
                      )}
                      {pub.type === 'gallery' && (
                        <span className="text-neutral-700 flex items-center gap-1 text-2xs font-medium">
                          <ImageIcon className="w-3 h-3 text-neutral-400" />
                          Foto
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap text-neutral-700">
                      {pub.author.name}
                    </td>

                    <td className="py-3 px-3 text-center font-mono tabular-nums text-neutral-700">
                      {pub.journal.participantsCount}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <button
                        onClick={() => onToggleStatus(pub.id)}
                        className={`text-2xs px-2 py-0.5 rounded font-medium transition-colors ${
                          pub.status === 'published'
                            ? 'bg-neutral-900 text-white'
                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        }`}
                      >
                        {pub.status === 'published' ? 'Diterbitkan' : 'Draf'}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onOpenJournal(pub)}
                          className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded"
                          title="Lihat Pratinjau Jurnal"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEdit(pub)}
                          className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded"
                          title="Sunting Publikasi"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(pub.id)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                          title="Hapus Publikasi"
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
  );
};
