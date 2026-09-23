import React, { useState, useEffect } from 'react';
import { CreatorAccount } from '../services/auth';
import { listGoogleDriveFiles, fetchDriveFileBlob, DriveFileItem } from '../services/drive';

interface GoogleDrivePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  creator: CreatorAccount;
  accessToken: string | null;
  onSignInGoogle: () => Promise<void>;
  onSelectFile: (fileData: {
    id: string;
    name: string;
    sizeFormatted: string;
    category: 'image' | 'audio' | 'text' | 'video3d';
    categoryLabel: string;
    previewUrl?: string;
  }) => void;
}

export const GoogleDrivePickerModal: React.FC<GoogleDrivePickerModalProps> = ({
  isOpen,
  onClose,
  creator,
  accessToken,
  onSignInGoogle,
  onSelectFile,
}) => {
  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'image' | 'audio' | 'doc'>('all');

  const fetchFiles = async (query = '') => {
    if (!accessToken) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const items = await listGoogleDriveFiles(accessToken, query);
      setFiles(items);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal memuat berkas dari Google Drive.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && accessToken) {
      fetchFiles(searchQuery);
    }
  }, [isOpen, accessToken]);

  if (!isOpen) return null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFiles(searchQuery);
  };

  const determineCategory = (mimeType: string, fileName: string): {
    cat: 'image' | 'audio' | 'text' | 'video3d';
    label: string;
  } => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    if (mimeType.startsWith('image/') || ['png', 'jpg', 'jpeg', 'svg', 'webp', 'psd'].includes(ext)) {
      return { cat: 'image', label: 'Gambar / Desain' };
    }
    if (mimeType.startsWith('audio/') || ['mp3', 'wav', 'aac', 'flac', 'm4a'].includes(ext)) {
      return { cat: 'audio', label: 'Musik & Audio' };
    }
    if (mimeType.startsWith('video/') || ['mp4', 'mov', 'obj', 'fbx', 'gltf'].includes(ext)) {
      return { cat: 'video3d', label: 'Video / 3D Asset' };
    }
    return { cat: 'text', label: 'Tulisan / Naskah' };
  };

  const handlePickFile = async (item: DriveFileItem) => {
    if (!accessToken) return;
    setDownloadingId(item.id);
    try {
      const { cat, label } = determineCategory(item.mimeType, item.name);
      let previewUrl = item.thumbnailLink;

      // Try fetching blob for immediate local preview
      try {
        const blob = await fetchDriveFileBlob(item.id, accessToken);
        previewUrl = URL.createObjectURL(blob);
      } catch (err) {
        console.warn('Could not create direct blob preview, using thumbnail if available:', err);
      }

      const sizeInMb = item.size ? `${(parseInt(item.size, 10) / (1024 * 1024)).toFixed(2)} MB` : 'Cloud Drive';

      onSelectFile({
        id: item.id,
        name: item.name,
        sizeFormatted: `${sizeInMb} • Google Drive Cloud`,
        category: cat,
        categoryLabel: label,
        previewUrl: previewUrl,
      });

      onClose();
    } catch (err) {
      console.error('Pick error:', err);
    } finally {
      setDownloadingId(null);
    }
  };

  const filteredFiles = files.filter((f) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'image') return f.mimeType.includes('image');
    if (selectedFilter === 'audio') return f.mimeType.includes('audio');
    if (selectedFilter === 'doc') return f.mimeType.includes('pdf') || f.mimeType.includes('document');
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-on-surface/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-surface-container-lowest w-full max-w-md h-[85vh] sm:h-auto sm:max-h-[85vh] rounded-t-3xl sm:rounded-2xl shadow-2xl border border-surface-container flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-surface-container flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <svg className="w-5 h-5" viewBox="0 0 87.3 78" fill="none">
                <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.45z" fill="#0066da" />
                <path d="M43.65 25 29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44A8.9 8.9 0 0 0 0 53h27.5z" fill="#00ac47" />
                <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.8l5.85 10.15z" fill="#ea4335" />
                <path d="M43.65 25 57.4 1.2C56.05.4 54.5 0 52.9 0H34.4c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d" />
                <path d="M59.8 53H87.3c0-1.55-.4-3.1-1.2-4.5l-26.3-45.5c-.8-1.4-1.95-2.5-3.3-3.3z" fill="#ffba00" />
                <path d="m27.5 53 13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h18.5c1.6 0 3.15-.4 4.5-1.2L54.4 53z" fill="#2684fc" />
              </svg>
            </div>
            <div>
              <h2 className="font-headline-sm text-[16px] font-bold text-on-surface">
                Pilih dari Google Drive
              </h2>
              <p className="font-label-sm text-[11px] text-on-surface-variant">
                Impor foto, lukisan, audio &amp; karya langsung dari cloud
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Not Connected State */}
        {!accessToken ? (
          <div className="p-6 flex flex-col items-center text-center gap-4 my-auto">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-4xl">cloud_sync</span>
            </div>
            <div className="space-y-1">
              <h3 className="font-headline-sm text-on-surface font-extrabold">
                Hubungkan Akun Google Anda
              </h3>
              <p className="font-body-sm text-on-surface-variant max-w-xs text-xs leading-relaxed">
                Akses karya seni, portofolio, dan aset digital Anda langsung dari Google Drive untuk diproteksi seketika.
              </p>
            </div>

            <button
              onClick={onSignInGoogle}
              className="mt-2 w-full max-w-xs h-12 bg-surface-container-lowest border border-surface-container rounded-xl flex items-center justify-center gap-3 shadow-md hover:bg-surface-container-low transition-all active:scale-95 font-bold text-sm text-on-surface cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Masuk dengan Akun Google</span>
            </button>
          </div>
        ) : (
          <>
            {/* Search & Filters */}
            <div className="p-3 bg-surface-container-lowest flex flex-col gap-2 border-b border-surface-container">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[20px]">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama berkas di Drive..."
                  className="w-full h-10 pl-9 pr-20 rounded-xl bg-surface-container-low text-xs text-on-surface border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-outline"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 px-3 py-1 bg-primary text-on-primary rounded-lg text-xs font-semibold"
                >
                  Cari
                </button>
              </form>

              {/* Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                <button
                  type="button"
                  onClick={() => setSelectedFilter('all')}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${
                    selectedFilter === 'all'
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  Semua Berkas
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFilter('image')}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${
                    selectedFilter === 'image'
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  Gambar / Desain
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFilter('audio')}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${
                    selectedFilter === 'audio'
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  Musik &amp; Audio
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFilter('doc')}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${
                    selectedFilter === 'doc'
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  Naskah &amp; PDF
                </button>
              </div>
            </div>

            {/* Connected User Bar */}
            <div className="px-4 py-1.5 bg-surface-container-low flex items-center justify-between text-[11px] text-on-surface-variant">
              <span className="truncate">
                Google: <strong>{creator.email}</strong>
              </span>
              <button
                type="button"
                onClick={() => fetchFiles(searchQuery)}
                className="flex items-center gap-1 text-primary font-bold hover:underline"
              >
                <span className="material-symbols-outlined text-[14px]">refresh</span>
                Segarkan
              </button>
            </div>

            {/* Files List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 text-on-surface-variant gap-2">
                  <span className="material-symbols-outlined text-3xl animate-spin text-primary">
                    progress_activity
                  </span>
                  <span className="text-xs">Membaca berkas Google Drive...</span>
                </div>
              ) : errorMsg ? (
                <div className="p-4 bg-error/10 text-error rounded-xl text-xs flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">error</span>
                  <span>{errorMsg}</span>
                </div>
              ) : filteredFiles.length === 0 ? (
                <div className="text-center py-12 text-on-surface-variant space-y-1">
                  <span className="material-symbols-outlined text-4xl opacity-40">
                    folder_open
                  </span>
                  <p className="text-xs font-semibold">Tidak ada berkas yang cocok di Drive.</p>
                  <p className="text-[11px] text-outline">
                    Pastikan berkas berada di Drive utama atau unggah karya dari HP Anda.
                  </p>
                </div>
              ) : (
                filteredFiles.map((file) => {
                  const isDownloading = downloadingId === file.id;
                  const isImg = file.mimeType.startsWith('image/');
                  const isAudio = file.mimeType.startsWith('audio/');
                  const isPdf = file.mimeType.includes('pdf');

                  return (
                    <div
                      key={file.id}
                      onClick={() => !isDownloading && handlePickFile(file)}
                      className={`flex items-center gap-3 p-2.5 rounded-xl border border-surface-container bg-surface-container-lowest hover:bg-surface-container-low transition-all cursor-pointer ${
                        isDownloading ? 'opacity-70 pointer-events-none' : ''
                      }`}
                    >
                      {/* Thumbnail / Icon */}
                      <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0 overflow-hidden relative">
                        {file.thumbnailLink ? (
                          <img
                            src={file.thumbnailLink}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="material-symbols-outlined text-2xl text-primary">
                            {isImg ? 'image' : isAudio ? 'audiotrack' : isPdf ? 'picture_as_pdf' : 'description'}
                          </span>
                        )}
                      </div>

                      {/* File Details */}
                      <div className="flex-1 min-w-0">
                        <p className="font-label-md text-xs font-bold text-on-surface truncate">
                          {file.name}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-on-surface-variant mt-0.5">
                          <span className="bg-surface-container px-1.5 py-0.5 rounded font-medium">
                            {isImg ? 'Gambar' : isAudio ? 'Audio' : isPdf ? 'PDF' : 'Dokumen'}
                          </span>
                          {file.size && (
                            <span>
                              {(parseInt(file.size, 10) / (1024 * 1024)).toFixed(1)} MB
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Select Action */}
                      <button
                        type="button"
                        className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold flex items-center gap-1 hover:bg-primary hover:text-on-primary transition-all shrink-0"
                      >
                        {isDownloading ? (
                          <span className="material-symbols-outlined text-sm animate-spin">
                            progress_activity
                          </span>
                        ) : (
                          <>
                            <span>Pilih</span>
                            <span className="material-symbols-outlined text-[14px]">
                              arrow_forward
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
