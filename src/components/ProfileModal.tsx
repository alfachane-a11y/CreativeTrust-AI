import React, { useState } from 'react';
import { CreatorAccount } from '../services/auth';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  creator: CreatorAccount;
  onSignInGoogle: () => Promise<void>;
  onSignOutGoogle: () => Promise<void>;
  onUpdateCreator: (updated: Partial<CreatorAccount>) => void;
  registeredWorksCount: number;
  totalEarnings: number;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  creator,
  onSignInGoogle,
  onSignOutGoogle,
  onUpdateCreator,
  registeredWorksCount,
  totalEarnings,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(creator.displayName);
  const [bankInput, setBankInput] = useState(creator.bankAccount);
  const [isSigningIn, setIsSigningIn] = useState(false);

  if (!isOpen) return null;

  const handleSaveEdit = () => {
    onUpdateCreator({
      displayName: nameInput.trim() || creator.displayName,
      bankAccount: bankInput.trim() || creator.bankAccount,
    });
    setIsEditing(false);
  };

  const handleGoogleClick = async () => {
    setIsSigningIn(true);
    try {
      await onSignInGoogle();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-surface-container-lowest max-w-sm w-full rounded-2xl p-5 shadow-2xl border border-surface-container flex flex-col gap-4 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-1 rounded-full transition-colors"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        {/* Profile Card Header */}
        <div className="flex items-center gap-3 pt-2">
          <div className="relative shrink-0">
            <img
              src={creator.photoURL}
              alt={creator.displayName}
              className="w-16 h-16 rounded-full object-cover ring-4 ring-primary-fixed shadow-md"
            />
            {creator.isGoogleUser ? (
              <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-white ring-2 ring-surface flex items-center justify-center shadow-xs">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
              </span>
            ) : (
              <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-secondary ring-2 ring-surface flex items-center justify-center text-[10px] text-white">
                ✓
              </span>
            )}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            {isEditing ? (
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="font-headline-sm text-sm font-bold border border-primary px-2 py-1 rounded bg-surface-container-lowest"
              />
            ) : (
              <h3 className="font-headline-sm text-on-surface font-extrabold truncate">
                {creator.displayName}
              </h3>
            )}
            <span className="font-body-sm text-on-surface-variant text-xs truncate">
              {creator.email}
            </span>
            <div className="inline-flex items-center gap-1 mt-1 bg-secondary-container/30 px-2 py-0.5 rounded-full text-secondary font-label-sm text-[10px] font-bold w-fit">
              <span className="material-symbols-outlined text-[12px]">verified</span>
              {creator.isGoogleUser ? 'Akun Google Terverifikasi' : 'Kreator Muda Terverifikasi'}
            </div>
          </div>
        </div>

        {/* Google Connection Card */}
        <div className="p-3 rounded-xl border border-surface-container bg-surface-container-low flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-xs font-bold text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-base">cloud_sync</span>
              Koneksi Google &amp; Drive
            </span>
            {creator.isGoogleUser ? (
              <span className="px-2 py-0.5 rounded-full bg-secondary-container/50 text-secondary font-bold text-[10px]">
                Terhubung Aktif
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-[10px]">
                Belum Terhubung
              </span>
            )}
          </div>

          <p className="text-[11px] text-on-surface-variant leading-relaxed">
            {creator.isGoogleUser
              ? `Tersinkronisasi dengan akun Google (${creator.email}). Anda dapat mengimpor karya dari Drive dan menyimpan sertifikat hak cipta.`
              : 'Hubungkan akun Google Anda untuk membuat identitas pencipta resmi, impor berkas dari Google Drive, dan pencatatan hak cipta cloud.'}
          </p>

          {creator.isGoogleUser ? (
            <button
              onClick={onSignOutGoogle}
              className="w-full py-1.5 px-3 rounded-lg border border-error/30 text-error hover:bg-error/5 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              Putuskan Sambungan / Ganti Akun
            </button>
          ) : (
            <button
              onClick={handleGoogleClick}
              disabled={isSigningIn}
              className="w-full py-2 px-3 rounded-xl bg-surface-container-lowest border border-surface-container text-on-surface hover:bg-surface-container-low text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
            >
              {isSigningIn ? (
                <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                  <span>Hubungkan Akun Google Saya</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-2 bg-surface-container-low p-3 rounded-xl">
          <div className="flex flex-col">
            <span className="font-label-sm text-[10px] text-on-surface-variant">
              Koleksi Terproteksi
            </span>
            <span className="font-headline-sm text-primary font-black text-sm">
              {registeredWorksCount} Karya
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-label-sm text-[10px] text-on-surface-variant">
              Total Royalti On-Chain
            </span>
            <span className="font-headline-sm text-secondary font-black text-sm">
              Rp {new Intl.NumberFormat('id-ID').format(totalEarnings)}
            </span>
          </div>
        </div>

        {/* Identity & Legal Security Box */}
        <div className="flex flex-col gap-2 bg-surface-container-lowest border border-surface-container p-3 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-on-surface font-bold text-xs">
              Identitas Kriptografis Kreator
            </span>
            <button
              onClick={() => (isEditing ? handleSaveEdit() : setIsEditing(true))}
              className="text-xs text-primary font-bold hover:underline"
            >
              {isEditing ? 'Simpan' : 'Ubah Rekening'}
            </button>
          </div>

          <div className="flex items-center justify-between text-xs py-1 border-b border-surface-container-low">
            <span className="text-on-surface-variant">Creator Wallet ID</span>
            <span className="font-mono text-primary font-semibold">{creator.walletAddress}</span>
          </div>

          <div className="flex items-center justify-between text-xs py-1 border-b border-surface-container-low">
            <span className="text-on-surface-variant">Rekening Pencairan</span>
            {isEditing ? (
              <input
                type="text"
                value={bankInput}
                onChange={(e) => setBankInput(e.target.value)}
                placeholder="BCA / Mandiri / GoPay"
                className="text-right text-xs border border-primary px-1.5 py-0.5 rounded font-medium max-w-[150px]"
              />
            ) : (
              <span className="font-medium text-on-surface">{creator.bankAccount}</span>
            )}
          </div>

          <div className="flex items-center justify-between text-xs py-1">
            <span className="text-on-surface-variant">Status Sandbox DJKI</span>
            <span className="text-secondary font-bold flex items-center gap-0.5">
              <span className="material-symbols-outlined text-xs">check_circle</span>
              Terdaftar Resmi
            </span>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-label-md font-bold hover:bg-primary-container transition-colors shadow-sm cursor-pointer"
        >
          Selesai
        </button>
      </div>
    </div>
  );
};
