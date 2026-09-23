import React, { useState } from 'react';
import { RegisteredWork } from '../types';
import { CreatorAccount } from '../services/auth';
import { generateCertificatePdf } from '../services/pdfCertificate';
import { uploadCertificateToDrive } from '../services/drive';

interface SertifikatViewProps {
  works: RegisteredWork[];
  creator: CreatorAccount;
  accessToken: string | null;
  onSignInGoogle: () => Promise<void>;
}

export const SertifikatView: React.FC<SertifikatViewProps> = ({
  works,
  creator,
  accessToken,
  onSignInGoogle,
}) => {
  const [selectedWorkId, setSelectedWorkId] = useState<string>(works[0]?.id || 'work-1');
  const [copiedId, setCopiedId] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isUploadingToDrive, setIsUploadingToDrive] = useState(false);

  const activeWork = works.find((w) => w.id === selectedWorkId) || works[0];

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleCopyId = () => {
    if (!activeWork) return;
    navigator.clipboard.writeText(activeWork.assetId).then(() => {
      setCopiedId(true);
      triggerToast('Kode Identitas Karya berhasil disalin!');
      setTimeout(() => setCopiedId(false), 2000);
    });
  };

  const handleCopyHash = () => {
    if (!activeWork) return;
    navigator.clipboard.writeText(activeWork.sha256).then(() => {
      setCopiedHash(true);
      triggerToast('Fingerprint Hash SHA-256 tersalin!');
      setTimeout(() => setCopiedHash(false), 2000);
    });
  };

  // Unduh PDF langsung ke Berkas / HP Pengguna
  const handleDownloadPdf = async () => {
    if (!activeWork || isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    triggerToast('Membuat & Mengunduh Sertifikat PDF ke Berkas HP...');

    try {
      const { fileName } = await generateCertificatePdf(activeWork, {
        name: creator.displayName,
        email: creator.email,
        walletAddress: creator.walletAddress,
      });

      triggerToast(`Sertifikat "${fileName}" tersimpan di Berkas/Unduhan HP Anda!`);
    } catch (err: any) {
      console.error('Download PDF error:', err);
      triggerToast('Gagal mencetak PDF. Coba kembali.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Simpan Salinan PDF ke Google Drive
  const handleSaveToGoogleDrive = async () => {
    if (!activeWork || isUploadingToDrive) return;

    if (!accessToken) {
      triggerToast('Silakan masuk dengan akun Google terlebih dahulu...');
      try {
        await onSignInGoogle();
      } catch (err) {
        return;
      }
    }

    setIsUploadingToDrive(true);
    triggerToast('Menyimpan sertifikat PDF ke Google Drive Anda...');

    try {
      const { blob, fileName } = await generateCertificatePdf(activeWork, {
        name: creator.displayName,
        email: creator.email,
        walletAddress: creator.walletAddress,
      });

      if (accessToken) {
        await uploadCertificateToDrive(accessToken, fileName, blob);
        triggerToast(`Berhasil disimpan ke Google Drive (${fileName})!`);
      }
    } catch (err: any) {
      console.error('Save to Drive error:', err);
      triggerToast(err.message || 'Gagal menyimpan ke Google Drive.');
    } finally {
      setIsUploadingToDrive(false);
    }
  };

  const handleShare = () => {
    if (!activeWork) return;
    if (navigator.share) {
      navigator
        .share({
          title: `Bukti Kepemilikan Karya - ${activeWork.title}`,
          text: `Verifikasi kepemilikan orisinal karya ${creator.displayName}: ${activeWork.title}. ID: ${activeWork.assetId}`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `https://creativetrust.id/verify/${activeWork.assetId}`
      );
      triggerToast('Tautan verifikasi publik tersalin ke clipboard!');
    }
  };

  return (
    <div className="flex flex-col w-full px-margin pt-space-md pb-space-xl gap-space-md">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 px-4 py-2 bg-inverse-surface text-inverse-on-surface rounded-full shadow-lg font-label-sm text-label-sm flex items-center gap-1.5 z-50 animate-fadeIn max-w-sm text-center">
          <span className="material-symbols-outlined text-[16px] text-secondary-fixed shrink-0">
            check_circle
          </span>
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-space-xs">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-secondary-container/50 text-secondary">
            <span
              className="material-symbols-outlined text-[16px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
          </span>
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
            Paspor Hak Cipta Digital
          </span>
        </div>
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-extrabold">
          Sertifikat Digital &amp; Bukti Kepemilikan
        </h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Dokumen kriptografis terdesentralisasi yang mengikat kepemilikan orisinal karya cipta Anda.
        </p>
      </div>

      {/* Karya Selector if more than 1 work */}
      {works.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <span className="font-label-sm text-[11px] text-on-surface-variant font-semibold shrink-0">
            Pilih Karya:
          </span>
          {works.map((w) => (
            <button
              key={w.id}
              onClick={() => setSelectedWorkId(w.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                w.id === activeWork.id
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {w.title.length > 20 ? w.title.substring(0, 18) + '...' : w.title}
            </button>
          ))}
        </div>
      )}

      {/* The Certificate Card */}
      <div className="relative w-full rounded-2xl bg-surface-container-lowest shadow-[0_12px_28px_-6px_rgba(0,74,198,0.08)] border border-surface-container overflow-hidden">
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-primary-container/5 blur-2xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-44 h-44 rounded-full bg-secondary-container/20 blur-xl pointer-events-none" />

        {/* Certificate Top Banner */}
        <div className="bg-primary-container text-on-primary px-space-md py-space-sm flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <div className="w-7 h-7 rounded-lg bg-surface-container-lowest flex items-center justify-center shadow-xs">
              <span
                className="material-symbols-outlined text-primary text-[18px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                shield_lock
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-on-primary">
                CreativeTrust Ledger
              </span>
              <span className="font-label-sm text-[9px] text-on-primary/80 leading-none">
                Protokol Hak Cipta Kriptografi Republik Indonesia
              </span>
            </div>
          </div>
          <div className="bg-surface-container-lowest/20 backdrop-blur-sm px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-white/20">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed animate-pulse" />
            <span className="font-label-sm text-label-sm font-bold text-on-primary">
              IMMUTABLE
            </span>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-space-md flex flex-col gap-space-md relative">
          {/* Work Info Section */}
          <div className="flex gap-space-md items-start">
            <div className="relative w-24 h-28 rounded-xl overflow-hidden bg-surface-container-high shrink-0 shadow-sm border border-surface-container">
              <img
                src={activeWork.imageUrl}
                alt={activeWork.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-1 right-1 bg-surface-container-lowest/90 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-xs">
                <span className="material-symbols-outlined text-[10px] text-secondary">
                  verified
                </span>
                <span className="font-label-sm text-[8px] font-bold text-on-surface">
                  EDISI 01
                </span>
              </div>
            </div>

            <div className="flex flex-col flex-1 min-w-0">
              <span className="font-label-sm text-label-sm text-primary font-bold tracking-wide">
                KARYA TERDAFTAR
              </span>
              <h2 className="font-headline-md text-headline-md text-on-surface truncate font-extrabold">
                {activeWork.title}
              </h2>

              <div className="mt-2 flex flex-col gap-1 text-xs">
                <div className="flex items-center gap-1 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[15px]">person</span>
                  <span className="truncate font-semibold text-on-surface">
                    {creator.displayName}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-on-surface-variant">
                  <span className="material-symbols-outlined text-[15px]">mail</span>
                  <span className="truncate">{creator.email}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-on-surface-variant">
                  <span className="material-symbols-outlined text-[15px]">category</span>
                  <span>{activeWork.categoryLabel}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cryptographic Identifiers */}
          <div className="flex flex-col gap-2 p-3 rounded-xl bg-surface-container-low border border-surface-container">
            <div className="flex items-center justify-between text-xs">
              <span className="text-on-surface-variant font-medium">Nomor Identitas Aset</span>
              <button
                onClick={handleCopyId}
                className="flex items-center gap-1 font-mono text-primary font-bold hover:underline"
              >
                <span>{activeWork.assetId}</span>
                <span className="material-symbols-outlined text-[14px]">
                  {copiedId ? 'check' : 'content_copy'}
                </span>
              </button>
            </div>

            <div className="flex flex-col gap-0.5 pt-1 border-t border-surface-container">
              <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
                <span>Fingerprint SHA-256</span>
                <button
                  onClick={handleCopyHash}
                  className="text-primary font-bold hover:underline flex items-center gap-0.5 text-[10px]"
                >
                  <span>{copiedHash ? 'Tersalin' : 'Salin Hash'}</span>
                  <span className="material-symbols-outlined text-[12px]">content_copy</span>
                </button>
              </div>
              <div className="bg-surface-container-lowest p-2 rounded-lg font-mono text-[10px] text-on-surface break-all border border-surface-container">
                {activeWork.sha256}
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-on-surface-variant pt-1">
              <span>Waktu Pendaftaran:</span>
              <span className="font-medium text-on-surface">{activeWork.date}</span>
            </div>
          </div>

          {/* Quick QR Code / Instant Verification bar */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest border border-surface-container">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-2xl">qr_code_2</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-xs font-bold text-on-surface">
                  Pencatatan Bersegel DJKI Sandbox
                </span>
                <span className="text-[10px] text-on-surface-variant">
                  Alat bukti sah berdasarkan Pasal 5 ayat (1) UU ITE
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-secondary text-xl">verified</span>
          </div>
        </div>
      </div>

      {/* Dasar Hukum Kekuatan Pembuktian */}
      <div className="rounded-2xl bg-surface-container-low p-space-md flex flex-col gap-space-sm border border-surface-container shadow-xs">
        <div className="flex items-center gap-space-xs">
          <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center shadow-xs">
            <span className="material-symbols-outlined text-[18px]">gavel</span>
          </div>
          <div className="flex flex-col">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Dasar Hukum Kekuatan Pembuktian
            </h3>
            <span className="font-label-sm text-[10px] text-on-surface-variant">
              Yurisdiksi Negara Kesatuan Republik Indonesia
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-space-sm mt-1">
          {/* UU ITE */}
          <div className="flex gap-space-sm p-3 rounded-xl bg-surface-container-lowest border border-surface-container shadow-xs">
            <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">
              policy
            </span>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-on-surface font-bold text-xs">
                UU ITE (UU No. 11/2008 jo UU No. 1/2024)
              </span>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-relaxed text-[11px]">
                Pengakuan informasi elektronik dan sertifikat elektronik sebagai alat bukti hukum yang sah di persidangan.
              </p>
            </div>
          </div>

          {/* UU P2SK & Hak Cipta */}
          <div className="flex gap-space-sm p-3 rounded-xl bg-surface-container-lowest border border-surface-container shadow-xs">
            <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">
              account_balance
            </span>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-on-surface font-bold text-xs">
                UU No. 28/2014 &amp; UU P2SK No. 4/2023
              </span>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-relaxed text-[11px]">
                Prinsip deklaratif hak cipta otomatis dan perlindungan aset digital yang tidak dapat dipalsukan atau diubah.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons: Device Download & Google Drive Save */}
      <div className="flex flex-col gap-2.5 pt-1">
        {/* Download PDF directly to device / phone files */}
        <button
          onClick={handleDownloadPdf}
          disabled={isGeneratingPdf}
          className="w-full h-12 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(0,74,198,0.25)] transition-all active:scale-[0.98] cursor-pointer"
        >
          {isGeneratingPdf ? (
            <>
              <span className="material-symbols-outlined text-[20px] animate-spin">
                progress_activity
              </span>
              <span>Membuat Dokumen PDF...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]">download</span>
              <span>Unduh Sertifikat Kepemilikan (PDF ke HP)</span>
            </>
          )}
        </button>

        {/* Save Copy to Google Drive */}
        <button
          onClick={handleSaveToGoogleDrive}
          disabled={isUploadingToDrive}
          className="w-full h-11 rounded-xl bg-surface-container-lowest hover:bg-surface-container-low text-on-surface border border-surface-container font-label-md text-label-md flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] cursor-pointer font-bold shadow-xs"
        >
          {isUploadingToDrive ? (
            <>
              <span className="material-symbols-outlined text-base animate-spin text-primary">
                progress_activity
              </span>
              <span className="text-xs">Mengunggah ke Google Drive...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 87.3 78" fill="none">
                <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.45z" fill="#0066da" />
                <path d="M43.65 25 29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44A8.9 8.9 0 0 0 0 53h27.5z" fill="#00ac47" />
                <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.8l5.85 10.15z" fill="#ea4335" />
                <path d="M43.65 25 57.4 1.2C56.05.4 54.5 0 52.9 0H34.4c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d" />
                <path d="M59.8 53H87.3c0-1.55-.4-3.1-1.2-4.5l-26.3-45.5c-.8-1.4-1.95-2.5-3.3-3.3z" fill="#ffba00" />
                <path d="m27.5 53 13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h18.5c1.6 0 3.15-.4 4.5-1.2L54.4 53z" fill="#2684fc" />
              </svg>
              <span className="text-xs">
                {accessToken ? 'Simpan Salinan ke Google Drive' : 'Hubungkan Drive & Simpan Salinan'}
              </span>
            </>
          )}
        </button>

        {/* Share Link */}
        <button
          onClick={handleShare}
          className="w-full h-10 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-primary font-label-md text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer font-bold"
        >
          <span className="material-symbols-outlined text-[16px]">share</span>
          <span>Bagikan Tautan Verifikasi Publik</span>
        </button>

        <div className="flex items-center justify-center gap-1.5 py-1 text-on-surface-variant">
          <span className="material-symbols-outlined text-[14px] text-secondary">
            verified
          </span>
          <span className="font-label-sm text-[10px]">
            File PDF disimpan langsung ke folder Unduhan perangkat Anda
          </span>
        </div>
      </div>
    </div>
  );
};
