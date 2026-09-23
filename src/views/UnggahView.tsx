import React, { useState } from 'react';
import { RegisteredWork, TabType } from '../types';
import { UPLOAD_PREVIEW_IMAGE } from '../data/mockData';
import { CreatorAccount } from '../services/auth';
import { GoogleDrivePickerModal } from '../components/GoogleDrivePickerModal';

interface UnggahViewProps {
  creator: CreatorAccount;
  accessToken: string | null;
  onSignInGoogle: () => Promise<void>;
  onAddWork: (work: RegisteredWork) => void;
  onNavigate: (tab: TabType) => void;
}

export const UnggahView: React.FC<UnggahViewProps> = ({
  creator,
  accessToken,
  onSignInGoogle,
  onAddWork,
  onNavigate,
}) => {
  const [title, setTitle] = useState('Ksatria Candi: Pelindung Nusantara Vol. 1');
  const [category, setCategory] = useState<'image' | 'audio' | 'text' | 'video3d'>('image');
  const [description, setDescription] = useState(
    'Eksplorasi visual perpaduan arsitektur relief Candi Borobudur dengan estetika mecha fiksi ilmiah tahun 2025. Dilukis orisinal untuk proyek Intellectual Property personal.'
  );
  const [licenseType, setLicenseType] = useState<'free' | 'commercial' | 'exclusive'>('commercial');
  const [tariff, setTariff] = useState('50.000');
  const [hasFile, setHasFile] = useState(true);
  const [fileName, setFileName] = useState('Ksatria_Candi_Final.png');
  const [fileSize, setFileSize] = useState('4.8 MB • Dimensi 3840 × 2160');
  const [previewUrl, setPreviewUrl] = useState(UPLOAD_PREVIEW_IMAGE);
  const [fileSource, setFileSource] = useState<'device' | 'gdrive'>('device');
  const [isDrivePickerOpen, setIsDrivePickerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleDeviceFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const mbSize = (file.size / (1024 * 1024)).toFixed(2);
      setFileSize(`${mbSize} MB • Berkas Perangkat HP`);
      setHasFile(true);
      setFileSource('device');

      // Detect category from file type
      if (file.type.startsWith('image/')) {
        setCategory('image');
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else if (file.type.startsWith('audio/')) {
        setCategory('audio');
      } else if (file.type.startsWith('video/')) {
        setCategory('video3d');
      } else {
        setCategory('text');
      }

      // Auto populate title if default
      if (title.includes('Ksatria Candi')) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    }
  };

  const handleSelectFromDrive = (fileData: {
    id: string;
    name: string;
    sizeFormatted: string;
    category: 'image' | 'audio' | 'text' | 'video3d';
    categoryLabel: string;
    previewUrl?: string;
  }) => {
    setFileName(fileData.name);
    setFileSize(fileData.sizeFormatted);
    setCategory(fileData.category);
    setHasFile(true);
    setFileSource('gdrive');

    if (fileData.previewUrl) {
      setPreviewUrl(fileData.previewUrl);
    }

    const cleanName = fileData.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
  };

  const generateRandomHash = () => {
    const chars = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < 64; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  };

  const handleSubmit = () => {
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);

      const cleanTariff = parseInt(tariff.replace(/\D/g, ''), 10) || 50000;
      const newHash = generateRandomHash();
      const randomSuffix = Math.floor(100 + Math.random() * 900);

      const categoryLabels: Record<string, string> = {
        image: 'Gambar / Desain',
        audio: 'Musik & Audio',
        text: 'Tulisan / Naskah',
        video3d: 'Video / 3D Asset',
      };

      const techLabels: Record<string, string> = {
        image: 'Steganografi Pixel & SHA-256',
        audio: 'Akustik Watermark & SHA-256',
        text: 'Leksikal Fingerprint & SHA-256',
        video3d: 'Frame Hashing & SHA-256',
      };

      const newWork: RegisteredWork = {
        id: `work-${Date.now()}`,
        assetId: `CT-AI-${newHash.substring(0, 4).toUpperCase()}-IDN-2024-X${randomSuffix}`,
        title: title,
        category: category,
        categoryLabel: categoryLabels[category],
        technology: techLabels[category],
        date: new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' WIB',
        sha256: newHash,
        usageCount: 0,
        imageUrl: previewUrl,
        description: description,
        licenseType: licenseType,
        tariff: cleanTariff,
        status: 'active',
      };

      onAddWork(newWork);

      setTimeout(() => {
        setSubmitSuccess(false);
        onNavigate('sertifikat');
      }, 1200);
    }, 1400);
  };

  return (
    <div className="flex flex-col w-full px-margin pb-space-xl gap-space-lg">
      {/* Header Section */}
      <section className="flex flex-col gap-1 pt-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary">
            <span className="material-symbols-outlined text-[16px]">verified</span>
          </span>
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
            CreativeTrust AI Guardian
          </span>
        </div>
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-extrabold tracking-tight">
          Unggah &amp; Lindungi Karya Baru
        </h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
          Unggah langsung dari berkas ponsel atau ambil dari Google Drive untuk ditanamkan steganografi dan SHA-256.
        </p>

        {/* Creator Identity Info Badge */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-surface-container mt-1">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={creator.photoURL}
              alt={creator.displayName}
              className="w-7 h-7 rounded-full object-cover shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <span className="font-label-sm text-[11px] font-bold text-on-surface truncate">
                Pencipta: {creator.displayName}
              </span>
              <span className="text-[10px] text-on-surface-variant truncate">
                {creator.email}
              </span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-secondary bg-secondary-container/40 px-2 py-0.5 rounded-full shrink-0">
            {creator.isGoogleUser ? 'Google ID' : 'Kreator Terverifikasi'}
          </span>
        </div>
      </section>

      {/* Form */}
      <form
        className="flex flex-col gap-space-lg"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {/* Upload Source Chooser Buttons */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="font-label-md text-label-md text-on-surface font-bold">
              Pilih Sumber Berkas Karya
            </label>
            <span className="font-label-sm text-label-sm text-primary font-medium">
              Multi-Sumber
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Device / HP File Upload */}
            <label className="relative flex flex-col items-center justify-center p-3 rounded-xl border border-dashed border-primary/40 bg-surface-container-lowest hover:bg-surface-container-low transition-all cursor-pointer text-center group">
              <input
                type="file"
                onChange={handleDeviceFileUpload}
                accept="image/*,audio/*,video/*,application/pdf"
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                aria-label="Pilih dari File HP / Perangkat"
              />
              <span className="material-symbols-outlined text-2xl text-primary mb-1 group-hover:scale-110 transition-transform">
                phone_android
              </span>
              <span className="font-label-md text-xs font-bold text-on-surface">
                Dari File HP / Galeri
              </span>
              <span className="text-[10px] text-on-surface-variant">
                Penyimpanan Lokal / Kamera
              </span>
            </label>

            {/* Google Drive Option */}
            <button
              type="button"
              onClick={() => setIsDrivePickerOpen(true)}
              className="flex flex-col items-center justify-center p-3 rounded-xl border border-surface-container bg-surface-container-lowest hover:bg-surface-container-low transition-all cursor-pointer text-center group active:scale-95"
            >
              <div className="w-7 h-7 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" viewBox="0 0 87.3 78" fill="none">
                  <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.45z" fill="#0066da" />
                  <path d="M43.65 25 29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44A8.9 8.9 0 0 0 0 53h27.5z" fill="#00ac47" />
                  <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.8l5.85 10.15z" fill="#ea4335" />
                  <path d="M43.65 25 57.4 1.2C56.05.4 54.5 0 52.9 0H34.4c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d" />
                  <path d="M59.8 53H87.3c0-1.55-.4-3.1-1.2-4.5l-26.3-45.5c-.8-1.4-1.95-2.5-3.3-3.3z" fill="#ffba00" />
                  <path d="m27.5 53 13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h18.5c1.6 0 3.15-.4 4.5-1.2L54.4 53z" fill="#2684fc" />
                </svg>
              </div>
              <span className="font-label-md text-xs font-bold text-on-surface">
                Dari Google Drive
              </span>
              <span className="text-[10px] text-primary font-semibold">
                {creator.isGoogleUser ? 'Akses Instan Cloud' : 'Sambungkan Drive'}
              </span>
            </button>
          </div>

          {/* Staged File Card */}
          {hasFile && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-lowest border border-surface-container shadow-xs mt-1">
              <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-surface-container shrink-0 shadow-xs flex items-center justify-center">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Berkas Terpilih"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="material-symbols-outlined text-2xl text-primary">
                    draft
                  </span>
                )}
                <div className="absolute bottom-0 inset-x-0 bg-on-surface/80 py-0.5 text-center">
                  <span className="font-label-sm text-on-primary text-[8px] uppercase tracking-tighter">
                    {fileSource === 'gdrive' ? 'G-DRIVE' : 'HP FILE'}
                  </span>
                </div>
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <p className="font-label-md text-xs font-bold text-on-surface truncate">
                    {fileName}
                  </p>
                  <button
                    type="button"
                    onClick={() => setHasFile(false)}
                    aria-label="Hapus Berkas"
                    className="text-on-surface-variant hover:text-error p-0.5 rounded-full cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
                <p className="text-[11px] text-on-surface-variant">
                  {fileSize}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-pulse" />
                  <span className="font-label-sm text-[10px] text-secondary font-bold">
                    {fileSource === 'gdrive'
                      ? 'Tersinkron Google Drive • Siap Diberi Hash'
                      : 'File HP Terpilih • Siap Diproteksi SHA-256'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input 1: Judul Karya */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="workTitle"
            className="font-label-md text-label-md text-on-surface flex items-center justify-between"
          >
            <span className="font-bold">Judul Karya</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-normal">
              Wajib diisi
            </span>
          </label>
          <div className="relative flex items-center">
            <input
              id="workTitle"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="contoh: Ilustrasi 'Ksatria Candi' Vol. 1"
              className="w-full h-12 px-4 pr-10 rounded-xl bg-surface-container-lowest text-on-surface font-body-md text-body-md border border-surface-container shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-outline text-sm"
            />
            {title.trim().length > 3 && (
              <span
                className="material-symbols-outlined absolute right-3 text-secondary text-[20px]"
                title="Valid"
              >
                check_circle
              </span>
            )}
          </div>
        </div>

        {/* Input 2: Jenis Karya (Chips Selector) */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="font-label-md text-label-md text-on-surface font-bold">
              Jenis Karya &amp; Metode Kriptografi
            </label>
            <span className="font-label-sm text-label-sm text-primary font-medium">
              Model Disesuaikan
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {/* Gambar */}
            <button
              type="button"
              onClick={() => setCategory('image')}
              className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all active:scale-[0.98] cursor-pointer ${
                category === 'image'
                  ? 'bg-primary text-on-primary border-primary shadow-sm'
                  : 'bg-surface-container-low text-on-surface border-transparent hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                palette
              </span>
              <div className="flex flex-col min-w-0">
                <span className="font-label-md text-xs truncate font-bold">Gambar / Desain</span>
                <span
                  className={`text-[10px] truncate ${
                    category === 'image' ? 'text-on-primary-container opacity-90' : 'text-on-surface-variant'
                  }`}
                >
                  Steganografi Pixel
                </span>
              </div>
            </button>

            {/* Musik */}
            <button
              type="button"
              onClick={() => setCategory('audio')}
              className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all active:scale-[0.98] cursor-pointer ${
                category === 'audio'
                  ? 'bg-primary text-on-primary border-primary shadow-sm'
                  : 'bg-surface-container-low text-on-surface border-transparent hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                graphic_eq
              </span>
              <div className="flex flex-col min-w-0">
                <span className="font-label-md text-xs truncate font-bold">Musik &amp; Audio</span>
                <span
                  className={`text-[10px] truncate ${
                    category === 'audio' ? 'text-on-primary-container opacity-90' : 'text-on-surface-variant'
                  }`}
                >
                  Akustik Watermark
                </span>
              </div>
            </button>

            {/* Tulisan */}
            <button
              type="button"
              onClick={() => setCategory('text')}
              className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all active:scale-[0.98] cursor-pointer ${
                category === 'text'
                  ? 'bg-primary text-on-primary border-primary shadow-sm'
                  : 'bg-surface-container-low text-on-surface border-transparent hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                edit_note
              </span>
              <div className="flex flex-col min-w-0">
                <span className="font-label-md text-xs truncate font-bold">Tulisan / Naskah</span>
                <span
                  className={`text-[10px] truncate ${
                    category === 'text' ? 'text-on-primary-container opacity-90' : 'text-on-surface-variant'
                  }`}
                >
                  Leksikal Fingerprint
                </span>
              </div>
            </button>

            {/* Video / 3D */}
            <button
              type="button"
              onClick={() => setCategory('video3d')}
              className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all active:scale-[0.98] cursor-pointer ${
                category === 'video3d'
                  ? 'bg-primary text-on-primary border-primary shadow-sm'
                  : 'bg-surface-container-low text-on-surface border-transparent hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                view_in_ar
              </span>
              <div className="flex flex-col min-w-0">
                <span className="font-label-md text-xs truncate font-bold">Video / 3D Asset</span>
                <span
                  className={`text-[10px] truncate ${
                    category === 'video3d' ? 'text-on-primary-container opacity-90' : 'text-on-surface-variant'
                  }`}
                >
                  Frame Hashing
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Input 3: Deskripsi Karya */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="workDescription" className="font-label-md text-label-md text-on-surface font-bold">
            Deskripsi Karya &amp; Pernyataan Orisinalitas
          </label>
          <textarea
            id="workDescription"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Jelaskan konteks karya, tahun pembuatan, dan pesan orisinalitas..."
            className="w-full p-3.5 rounded-xl bg-surface-container-lowest text-on-surface font-body-md text-body-md border border-surface-container shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-outline resize-none text-xs"
          />
        </div>

        {/* Model Lisensi & Monetisasi */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="font-label-md text-label-md text-on-surface font-bold">
              Model Lisensi &amp; Monetisasi Otomatis
            </label>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Pilih Hak Guna
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {/* Opsi 1: Gratis */}
            <label
              onClick={() => setLicenseType('free')}
              className={`flex items-start gap-3 p-3.5 rounded-2xl border shadow-xs cursor-pointer transition-all ${
                licenseType === 'free'
                  ? 'bg-primary/5 border-primary ring-2 ring-primary/20'
                  : 'bg-surface-container-lowest border-surface-container hover:bg-surface-container-low'
              }`}
            >
              <input
                type="radio"
                name="license_type"
                checked={licenseType === 'free'}
                onChange={() => setLicenseType('free')}
                className="mt-1 text-primary focus:ring-primary h-4 w-4"
              />
              <div className="flex flex-col gap-0.5">
                <span className="font-label-md text-xs font-bold text-on-surface">
                  Gratis dengan Atribusi (CC-BY)
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant text-[11px]">
                  Boleh disebarluaskan untuk non-komersial asalkan mencantumkan nama pencipta asli secara sah.
                </p>
              </div>
            </label>

            {/* Opsi 2: Komersial (Default) */}
            <div
              className={`flex flex-col p-3.5 rounded-2xl border transition-all ${
                licenseType === 'commercial'
                  ? 'bg-surface-container-lowest border-primary ring-2 ring-primary/20 shadow-md'
                  : 'bg-surface-container-lowest border-surface-container hover:bg-surface-container-low'
              }`}
            >
              <div
                className="flex items-start gap-3 cursor-pointer"
                onClick={() => setLicenseType('commercial')}
              >
                <input
                  type="radio"
                  name="license_type"
                  checked={licenseType === 'commercial'}
                  onChange={() => setLicenseType('commercial')}
                  className="mt-1 text-primary focus:ring-primary h-4 w-4"
                />
                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-xs font-bold text-primary">
                      Komersial Berbayar (Mikro-Lisensi)
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-secondary-container/40 text-on-secondary-container font-label-sm text-[10px] font-bold">
                      Rekomendasi
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant text-[11px]">
                    Monetisasi otomatis saat karya dipakai untuk komersil, promosi, atau materi training AI berizin.
                  </p>

                  {/* Dynamic Nominal Input */}
                  <div className="mt-3 flex items-center gap-2 p-2 rounded-xl bg-surface-container-low">
                    <span className="text-xs text-on-surface-variant pl-1 font-semibold">
                      Tarif Lisensi:
                    </span>
                    <div className="flex items-center gap-1 bg-surface-container-lowest px-2.5 py-1 rounded-lg border border-surface-container shadow-inner flex-1">
                      <span className="text-xs text-on-surface font-semibold">
                        Rp
                      </span>
                      <input
                        type="text"
                        value={tariff}
                        onChange={(e) => setTariff(e.target.value)}
                        aria-label="Nominal tarif pemakaian"
                        className="w-full bg-transparent text-xs text-secondary font-bold focus:outline-none"
                      />
                    </div>
                    <span className="text-[11px] text-on-surface-variant whitespace-nowrap pr-1">
                      / pemakaian
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Opsi 3: Negosiasi */}
            <label
              onClick={() => setLicenseType('exclusive')}
              className={`flex items-start gap-3 p-3.5 rounded-2xl border shadow-xs cursor-pointer transition-all ${
                licenseType === 'exclusive'
                  ? 'bg-primary/5 border-primary ring-2 ring-primary/20'
                  : 'bg-surface-container-lowest border-surface-container hover:bg-surface-container-low'
              }`}
            >
              <input
                type="radio"
                name="license_type"
                checked={licenseType === 'exclusive'}
                onChange={() => setLicenseType('exclusive')}
                className="mt-1 text-primary focus:ring-primary h-4 w-4"
              />
              <div className="flex flex-col gap-0.5">
                <span className="font-label-md text-xs font-bold text-on-surface">
                  Khusus — Negosiasi Langsung
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant text-[11px]">
                  Izin pemakaian skala besar wajib melalui konfirmasi langsung via email pencipta ({creator.email}).
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Security Notice Card */}
        <section className="flex items-start gap-3 p-3.5 rounded-2xl bg-surface-container border border-surface-container-high shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[20px]">shield_lock</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5">
              <span className="font-label-md text-xs text-on-surface font-bold">
                Proteksi Steganografi Kriptografis Aktif
              </span>
              <span className="material-symbols-outlined text-secondary text-[16px]">
                verified
              </span>
            </div>
            <p className="font-body-sm text-[11px] text-on-surface-variant leading-tight">
              Karya akan ditanamkan sidik jari SHA-256 dan steganografi tak kasat mata. Sertifikat kepemilikan PDF dapat diunduh ke HP Anda atau disimpan ke Google Drive.
            </p>
          </div>
        </section>

        {/* Action Button */}
        <section className="flex flex-col gap-2 pt-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full h-12 rounded-xl text-on-primary flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all cursor-pointer ${
              submitSuccess
                ? 'bg-secondary'
                : 'bg-primary hover:bg-primary-container'
            }`}
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined text-[20px] animate-spin">
                  progress_activity
                </span>
                <span className="font-label-lg text-label-lg font-bold">
                  Menerbitkan Sertifikat Digital...
                </span>
              </>
            ) : submitSuccess ? (
              <>
                <span className="material-symbols-outlined text-[22px]">check_circle</span>
                <span className="font-label-lg text-label-lg font-bold">
                  Berhasil Dilindungi &amp; Tercatat!
                </span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[22px]">bolt</span>
                <span className="font-label-lg text-label-lg font-bold">
                  Lindungi &amp; Terbitkan Sertifikat
                </span>
              </>
            )}
          </button>
          <p className="text-center font-label-sm text-[11px] text-on-surface-variant">
            Pencatatan berlaku seketika di bawah perlindungan UU Hak Cipta &amp; UU ITE.
          </p>
        </section>
      </form>

      {/* Google Drive Picker Modal */}
      <GoogleDrivePickerModal
        isOpen={isDrivePickerOpen}
        onClose={() => setIsDrivePickerOpen(false)}
        creator={creator}
        accessToken={accessToken}
        onSignInGoogle={onSignInGoogle}
        onSelectFile={handleSelectFromDrive}
      />
    </div>
  );
};
