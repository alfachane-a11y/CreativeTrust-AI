import React from 'react';
import { TabType, RegisteredWork } from '../types';
import { CreatorAccount } from '../services/auth';

interface BerandaViewProps {
  balance: number;
  registeredWorks: RegisteredWork[];
  creator: CreatorAccount;
  onNavigate: (tab: TabType) => void;
  onOpenWithdraw: () => void;
  onOpenProfile: () => void;
  onSignInGoogle: () => Promise<void>;
}

export const BerandaView: React.FC<BerandaViewProps> = ({
  balance,
  registeredWorks,
  creator,
  onNavigate,
  onOpenWithdraw,
  onOpenProfile,
  onSignInGoogle,
}) => {
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID').format(val);
  };

  return (
    <div className="flex flex-col w-full px-margin pb-space-xl gap-space-lg">
      {/* Section: Creator Greeting & Shield Badge */}
      <div className="flex items-center justify-between pt-space-sm">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={onOpenProfile}
            className="relative shrink-0 active:scale-95 transition-transform cursor-pointer"
            title="Buka Profil Akun"
          >
            <img
              src={creator.photoURL}
              alt={creator.displayName}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-primary/30 shadow-xs"
            />
            {creator.isGoogleUser && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-xs">
                <svg className="w-2.5 h-2.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                </svg>
              </span>
            )}
          </button>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">
                Halo, {creator.displayName.split(' ')[0]}
              </span>
              <span className="text-base select-none">✨</span>
            </div>
            <p className="font-body-sm text-xs text-on-surface-variant truncate">
              {creator.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-secondary-container/40 border border-secondary-container/50 px-2.5 py-1 rounded-full shadow-xs shrink-0">
          <span
            className="material-symbols-outlined text-[15px] text-secondary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            shield_with_heart
          </span>
          <span className="font-label-sm text-[11px] text-on-secondary-container font-bold">
            {registeredWorks.length} Terlindungi
          </span>
        </div>
      </div>

      {/* Google Connect Banner if not signed in */}
      {!creator.isGoogleUser && (
        <div className="p-3.5 rounded-2xl bg-surface-container-lowest border border-primary/25 shadow-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z" />
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
              </svg>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-md text-xs font-bold text-on-surface">
                Sambungkan Akun Google Anda
              </span>
              <span className="text-[11px] text-on-surface-variant truncate">
                Impor foto &amp; karya dari Google Drive secara instan
              </span>
            </div>
          </div>
          <button
            onClick={onSignInGoogle}
            className="px-3 py-1.5 bg-primary text-on-primary rounded-xl text-xs font-bold shrink-0 hover:bg-primary-container transition-all active:scale-95 shadow-xs cursor-pointer"
          >
            Hubungkan
          </button>
        </div>
      )}

      {/* Hero Card: Core Value Proposition & Primary CTA */}
      <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest p-space-lg shadow-[0_8px_24px_rgba(0,74,198,0.06)] border border-surface-container flex flex-col gap-space-md">
        {/* Subtle Ambient Accent */}
        <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-primary-fixed/30 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-secondary-container/20 blur-xl pointer-events-none" />

        <div className="relative flex flex-col gap-1 z-10">
          <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary w-fit px-2.5 py-0.5 rounded-full mb-1">
            <span className="material-symbols-outlined text-[13px]">lock_reset</span>
            <span className="font-label-sm text-label-sm font-semibold tracking-wider">
              CREATIVETRUST GUARDIAN
            </span>
          </div>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-extrabold leading-tight">
            Lindungi Karya,<br />Dapatkan Hasil
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1 leading-relaxed">
            CreativeTrust AI — Karya Aman, Pendapatan Jelas. Sistem kriptografis otomatis melindungi setiap goresan karya digital Anda.
          </p>
        </div>

        {/* Dual Action Buttons */}
        <div className="relative flex flex-col gap-2.5 pt-1 z-10">
          <button
            onClick={() => onNavigate('unggah')}
            className="w-full h-12 bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg rounded-xl shadow-[0_4px_16px_rgba(0,74,198,0.28)] flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">file_upload</span>
            <span>Unggah Karya Saya (HP &amp; Drive)</span>
          </button>
          <button
            onClick={() => onNavigate('lacak-dan-saldo')}
            className="w-full h-11 bg-surface-container-low hover:bg-surface-container text-secondary font-label-lg text-label-lg rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
          >
            <span
              className="material-symbols-outlined text-xl text-secondary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              account_balance_wallet
            </span>
            <span>Lihat Rincian Pendapatan</span>
          </button>
        </div>
      </div>

      {/* Live Micro-Monetization & Quick Stats Matrix */}
      <div className="flex flex-col gap-space-sm">
        <div className="flex items-center justify-between px-0.5">
          <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
            Ringkasan Metrik
          </span>
          <span className="font-label-sm text-label-sm text-secondary flex items-center gap-1 bg-secondary-container/30 px-2.5 py-0.5 rounded-full font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
            Sinkronisasi Real-Time
          </span>
        </div>

        {/* Highlighted Wallet Balance Card */}
        <div className="rounded-2xl bg-surface-container-lowest p-space-md shadow-[0_4px_16px_rgba(15,23,42,0.04)] border border-surface-container flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-secondary-container/40 text-on-secondary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-lg text-secondary">
                  payments
                </span>
              </div>
              <span className="font-label-md text-label-md text-on-surface-variant font-medium">
                Saldo Siap Tarik
              </span>
            </div>
            <span className="font-label-sm text-label-sm text-secondary bg-secondary-container/30 px-2 py-0.5 rounded-full font-bold">
              +Rp 85.000 hari ini
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div className="flex items-baseline gap-1">
              <span className="font-label-lg text-label-lg text-on-surface-variant font-semibold">
                Rp
              </span>
              <span className="font-display-hero-mobile text-display-hero-mobile text-on-surface font-extrabold tracking-tight">
                {formatRupiah(balance)}
              </span>
            </div>
            <button
              onClick={onOpenWithdraw}
              className="px-3.5 py-1.5 bg-secondary text-on-secondary font-label-sm text-label-sm rounded-lg shadow-sm hover:brightness-105 transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
            >
              <span>Tarik Dana</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>

          {/* Micro Visual Indicator: Monthly Progress Bar */}
          <div className="flex flex-col gap-1 pt-1">
            <div className="flex justify-between items-center text-on-surface-variant">
              <span className="font-label-sm text-label-sm">Target Bulanan (82%)</span>
              <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                Rp 1.750.000
              </span>
            </div>
            <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
              <div
                className="h-full bg-secondary rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (balance / 1750000) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* 2-Grid Secondary Metrics */}
        <div className="grid grid-cols-2 gap-space-sm">
          {/* Metric 1: IP Registered */}
          <div className="rounded-2xl bg-surface-container-lowest p-space-md shadow-[0_2px_10px_rgba(15,23,42,0.03)] border border-surface-container flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px]">verified</span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant line-clamp-1">
                Hak Cipta Aktif
              </span>
            </div>
            <div>
              <div className="font-headline-md text-headline-md text-on-surface font-extrabold leading-none">
                {registeredWorks.length}
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Karya terenkripsi
              </p>
            </div>
          </div>

          {/* Metric 2: Detection Frequency */}
          <div className="rounded-2xl bg-surface-container-lowest p-space-md shadow-[0_2px_10px_rgba(15,23,42,0.03)] border border-surface-container flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-tertiary-container/20 text-tertiary flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px]">radar</span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant line-clamp-1">
                Pemakaian Lacak
              </span>
            </div>
            <div>
              <div className="font-headline-md text-headline-md text-on-surface font-extrabold leading-none">
                328
              </div>
              <p className="font-body-sm text-body-sm text-secondary font-semibold mt-1">
                Kali terdeteksi
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Activity Feed / Provenance Notification */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-0.5">
          <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
            Aktivitas Terkini
          </span>
          <button
            onClick={() => onNavigate('lacak-dan-saldo')}
            className="font-label-sm text-label-sm text-primary font-semibold flex items-center gap-0.5 cursor-pointer hover:underline"
          >
            Lihat Semua <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          </button>
        </div>

        <div className="rounded-2xl bg-surface-container-lowest p-3.5 shadow-[0_2px_12px_rgba(15,23,42,0.03)] border border-surface-container flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-surface-container shadow-inner">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHv488oDRXEr6_eNU30YCXiR4ohPOXncnOCXqJZNo84vtvyVROq9CgxWZS7q2MtbWvOaZmlgWmdMN-Enz_q4YFfUX0CK8sqFYMRVG2slDKu1cd-zFQ74QQMSdzxUWONmLMgYF-5_NCyiz9R-vnxJCPHZsF4nOWyyM9BVWqJlKkdJEO2uXyCTvVnXpGFGBPwXBtxFrDORhwWwTPwOQBT_28uTlwoQGrlOzX7k-rO50_diGn9jFVz9gR"
              alt="Nusantara Futuristik"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                Royalti Masuk Otomatis
              </span>
              <span className="font-label-sm text-label-sm text-outline shrink-0">
                10 mnt lalu
              </span>
            </div>
            <p className="font-label-md text-label-md text-on-surface font-bold truncate mt-0.5">
              Ilustrasi “Nusantara Futuristik”
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1">
              Digunakan oleh Agensi Media Kreatif (Lisensi Mikro)
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="font-label-sm text-label-sm bg-secondary-container/40 text-on-secondary-container font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px] text-secondary">
                  add_circle
                </span>
                +Rp 45.000
              </span>
              <span className="font-label-sm text-label-sm text-outline-variant">•</span>
              <span className="font-label-sm text-label-sm text-outline font-mono">
                TX#98f2..c3
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Pillars of Technology Section */}
      <div className="flex flex-col gap-space-sm pt-1">
        <div className="flex flex-col px-0.5">
          <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
            3 Pilar Perlindungan AI
          </span>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Inovasi perlindungan otonom CreativeTrust untuk kreator independen
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          {/* Pillar 1 */}
          <div className="rounded-2xl bg-surface-container-lowest p-space-md shadow-[0_2px_8px_rgba(15,23,42,0.03)] border border-surface-container flex gap-3.5 items-start">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">fingerprint</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-label-lg text-label-lg text-on-surface font-bold">
                  Pelacakan Kriptografis
                </span>
                <span className="font-label-sm text-label-sm bg-primary/10 text-primary px-1.5 py-0.2 rounded font-semibold">
                  Pilar 1
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                Watermark mikroskopis tak kasat mata di tingkat piksel &amp; metadata anti-scraping AI liar yang tak terhapus kompresi.
              </p>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="rounded-2xl bg-surface-container-lowest p-space-md shadow-[0_2px_8px_rgba(15,23,42,0.03)] border border-surface-container flex gap-3.5 items-start">
            <div className="w-10 h-10 rounded-xl bg-tertiary-container/15 text-tertiary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">contract</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-label-lg text-label-lg text-on-surface font-bold">
                  Lisensi Mikro Cerdas
                </span>
                <span className="font-label-sm text-label-sm bg-tertiary-container/15 text-tertiary px-1.5 py-0.2 rounded font-semibold">
                  Pilar 2
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                Aturan izin fleksibel dan otomatis saat karya diakses atau dilatih oleh model kecerdasan buatan komersial.
              </p>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="rounded-2xl bg-surface-container-lowest p-space-md shadow-[0_2px_8px_rgba(15,23,42,0.03)] border border-surface-container flex gap-3.5 items-start">
            <div className="w-10 h-10 rounded-xl bg-secondary-container/40 text-on-secondary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl text-secondary">autorenew</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-label-lg text-label-lg text-on-surface font-bold">
                  Pembayaran Otomatis
                </span>
                <span className="font-label-sm text-label-sm bg-secondary-container/40 text-secondary px-1.5 py-0.2 rounded font-semibold">
                  Pilar 3
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                Smart contract langsung mencairkan royalti mikro seketika ke dompet setiap kali ada pemakaian resmi yang terdeteksi.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Showcase IP Card Carousel Preview */}
      <div className="flex flex-col gap-space-sm pt-1">
        <div className="flex items-center justify-between px-0.5">
          <span className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">
            Koleksi Terproteksi ({creator.displayName.split(' ')[0]})
          </span>
          <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
            {registeredWorks.length} Terdaftar
          </span>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 -mx-margin px-margin no-scrollbar">
          {/* Registered works preview */}
          {registeredWorks.map((work) => (
            <div
              key={work.id}
              onClick={() => onNavigate('sertifikat')}
              className="w-48 shrink-0 rounded-2xl bg-surface-container-lowest p-3 shadow-[0_2px_10px_rgba(15,23,42,0.04)] border border-surface-container flex flex-col gap-2 cursor-pointer hover:shadow-md transition-all active:scale-98"
            >
              <div className="w-full h-28 rounded-xl overflow-hidden relative bg-surface-container">
                <img
                  src={work.imageUrl}
                  alt={work.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 bg-on-surface/80 backdrop-blur-sm text-white px-1.5 py-0.5 rounded text-[10px] font-mono">
                  SHA-256 #{work.sha256.substring(0, 4)}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface font-bold truncate">
                  {work.title}
                </span>
                <span className="font-body-sm text-body-sm text-secondary font-semibold">
                  {work.usageCount}x Digunakan
                </span>
              </div>
            </div>
          ))}

          {/* Add placeholder button */}
          <div
            onClick={() => onNavigate('unggah')}
            className="w-48 shrink-0 rounded-2xl bg-surface-container-low border border-dashed border-primary/40 p-3 flex flex-col items-center justify-center gap-2 cursor-pointer active:scale-95 hover:bg-surface-container transition-all text-center min-h-[160px]"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">add_photo_alternate</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-on-surface font-bold">
                Daftarkan Karya Baru
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Dari HP &amp; Google Drive
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
