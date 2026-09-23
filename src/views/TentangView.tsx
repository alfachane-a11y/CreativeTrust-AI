import React, { useState } from 'react';
import { FOUNDER_IMAGE } from '../data/mockData';

interface TentangViewProps {
  onOpenPolicyBrief: () => void;
  onOpenApiDocs: () => void;
}

export const TentangView: React.FC<TentangViewProps> = ({
  onOpenPolicyBrief,
  onOpenApiDocs,
}) => {
  const [creatorName, setCreatorName] = useState('Maya Ardiansyah & Tim');
  const [isEditingName, setIsEditingName] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (text: string) => {
    setToastMsg(text);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="flex flex-col w-full px-margin pt-space-md pb-space-xl space-y-space-lg">
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 px-4 py-2.5 bg-inverse-surface text-inverse-on-surface rounded-xl shadow-xl font-label-sm text-label-sm flex items-center gap-2 z-50 animate-fadeIn">
          <span className="material-symbols-outlined text-secondary-fixed text-lg">
            check_circle
          </span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Hero Identity & Mission Statement */}
      <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-xs border border-surface-container space-y-space-md">
        <div className="inline-flex items-center gap-1.5 bg-secondary-container/20 border border-secondary-container/40 px-3 py-1 rounded-full text-on-secondary-container">
          <span className="material-symbols-outlined text-[16px] text-secondary">
            verified
          </span>
          <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-bold">
            Inovasi Nasional 2024
          </span>
        </div>

        <div className="space-y-space-xs">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-extrabold tracking-tight">
            Tentang Inovasi CreativeTrust AI
          </h1>
          <p className="font-body-md text-body-md text-primary font-bold">
            Menegakkan Kedaulatan Kreator di Era Kecerdasan Artifisial
          </p>
        </div>

        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
          CreativeTrust AI menyatukan{' '}
          <strong className="text-on-surface font-semibold">
            pelacakan kriptografis &amp; kontrak cerdas
          </strong>{' '}
          untuk menciptakan sistem pertahanan karya otomatis dan monetisasi mikro tanpa birokrasi rumit. Dirancang sebagai benteng digital independen bagi insan kreatif tanah air.
        </p>

        {/* Vision & Purpose Accent Card */}
        <div className="bg-secondary-container/25 border border-secondary-container/40 rounded-xl p-space-md space-y-space-xs">
          <div className="flex items-center gap-2 text-secondary">
            <span className="material-symbols-outlined text-xl">emoji_objects</span>
            <span className="font-label-lg text-label-lg font-bold text-on-secondary-container">
              Visi Kedaulatan
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-secondary-container leading-relaxed">
            “Kreator muda berdaulat atas karyanya, bukan jadi penyedia data gratis bagi korporasi AI tanpa kompensasi yang adil.”
          </p>
        </div>
      </div>

      {/* Core Architecture / Pillar Visual */}
      <div className="space-y-space-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
            Fondasi Sistem Pertahanan
          </h2>
          <span className="font-label-sm text-label-sm text-outline font-mono">
            v2.4 Sovereign IP
          </span>
        </div>

        <div className="grid grid-cols-1 gap-space-sm">
          {/* Pillar 1 */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-surface-container flex items-start gap-space-md">
            <div className="w-10 h-10 rounded-lg bg-primary-fixed/50 flex items-center justify-center shrink-0 text-primary">
              <span className="material-symbols-outlined text-2xl">fingerprint</span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-label-lg text-label-lg text-on-surface font-bold">
                Hashing Kriptografi SHA-256
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-relaxed">
                Pemberian stempel waktu permanen dan sidik jari biner tak tergantikan begitu karya digital terbit.
              </p>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-surface-container flex items-start gap-space-md">
            <div className="w-10 h-10 rounded-lg bg-secondary-container/40 flex items-center justify-center shrink-0 text-secondary">
              <span className="material-symbols-outlined text-2xl">receipt_long</span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-label-lg text-label-lg text-on-surface font-bold">
                Smart Contract Royalti Mikro
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-relaxed">
                Distribusi imbal hasil seketika (real-time micro-split) saat karya diserap mesin LLM atau agregator komersial.
              </p>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-surface-container flex items-start gap-space-md">
            <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center shrink-0 text-tertiary">
              <span className="material-symbols-outlined text-2xl">radar</span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-label-lg text-label-lg text-on-surface font-bold">
                Web-Scraper Crawl Sentinel
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-relaxed">
                Pemantauan web otonom 24/7 mendeteksi scraping liar dan pelatihan model tanpa lisensi atribusi.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Policy Advocacy & Stakeholders */}
      <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs border border-surface-container space-y-space-md">
        <div className="space-y-space-xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">account_balance</span>
            <span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">
              Advokasi Tata Kelola
            </span>
          </div>
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
            Usulan Strategis Kebijakan AI Nasional
          </h2>
        </div>

        <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
          Dipersembahkan untuk{' '}
          <strong className="text-on-surface">
            Kemenparekraf, DJKI (Direktorat Jenderal Kekayaan Intelektual), dan Kominfo
          </strong>{' '}
          sebagai usulan masukan kebijakan tata kelola AI nasional yang berpihak pada ekonomi kreatif lokal.
        </p>

        {/* 3 Government / Ministry Pillars */}
        <div className="space-y-space-sm pt-space-xs">
          <span className="font-label-sm text-label-sm text-outline block uppercase tracking-wider font-semibold">
            3 Pilar Mitra Kebijakan
          </span>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1.5 bg-surface-container border border-surface-container-high px-3 py-1.5 rounded-full">
              <span className="material-symbols-outlined text-[16px] text-primary">palette</span>
              <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                Kemenparekraf RI
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-surface-container border border-surface-container-high px-3 py-1.5 rounded-full">
              <span className="material-symbols-outlined text-[16px] text-secondary">gavel</span>
              <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                DJKI Kemenkumham
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-surface-container border border-surface-container-high px-3 py-1.5 rounded-full">
              <span className="material-symbols-outlined text-[16px] text-tertiary">hub</span>
              <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                Kementerian Kominfo
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Innovator & Developer Profile Card */}
      <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs border border-surface-container space-y-space-md">
        <div className="flex items-start gap-space-md">
          <div className="relative shrink-0">
            <img
              src={FOUNDER_IMAGE}
              alt="Profil Penggagas"
              className="w-16 h-16 rounded-xl object-cover shadow-sm border border-surface-container"
            />
            <div className="absolute -bottom-1.5 -right-1.5 bg-secondary text-on-secondary rounded-full w-6 h-6 flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[14px]">school</span>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">
                Profil Penggagas
              </span>
              <button
                type="button"
                onClick={() => setIsEditingName(!isEditingName)}
                className="text-primary hover:text-primary-container text-xs font-semibold"
              >
                {isEditingName ? 'Simpan' : 'Ubah Nama'}
              </button>
            </div>

            {isEditingName ? (
              <input
                type="text"
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                placeholder="Tulis Nama Anda"
                className="mt-1 w-full px-2 py-1 text-sm font-bold border border-primary rounded-md focus:outline-none"
              />
            ) : (
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold leading-snug">
                Pembuat: {creatorName}
              </h3>
            )}

            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Kreator &amp; Peneliti Muda Indonesia
            </p>
            <div className="mt-1 inline-block bg-primary-fixed/40 border border-primary-fixed px-2 py-0.5 rounded text-on-primary-fixed-variant font-label-sm text-label-sm font-semibold">
              Inovasi Esai Karya Tulis Ilmiah 2024
            </div>
          </div>
        </div>

        {/* Core Philosophy Matrix (4 Values) */}
        <div className="grid grid-cols-2 gap-space-sm pt-space-xs">
          <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-1 border border-surface-container">
            <div className="flex items-center gap-1 text-primary">
              <span className="material-symbols-outlined text-[16px]">touch_app</span>
              <span className="font-label-sm text-label-sm font-bold">Sederhana</span>
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Tanpa friksi birokrasi &amp; legal rumit
            </span>
          </div>

          <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-1 border border-surface-container">
            <div className="flex items-center gap-1 text-secondary">
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              <span className="font-label-sm text-label-sm font-bold">Transparan</span>
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Audit royalti mikro terbuka on-chain
            </span>
          </div>

          <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-1 border border-surface-container">
            <div className="flex items-center gap-1 text-tertiary">
              <span className="material-symbols-outlined text-[16px]">device_hub</span>
              <span className="font-label-sm text-label-sm font-bold">Desentralisasi</span>
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Hak cipta di tangan pemilik karya
            </span>
          </div>

          <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-1 border border-surface-container">
            <div className="flex items-center gap-1 text-secondary">
              <span className="material-symbols-outlined text-[16px]">favorite</span>
              <span className="font-label-sm text-label-sm font-bold">Pro-Generasi</span>
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Memampukan kreator independen muda
            </span>
          </div>
        </div>
      </div>

      {/* Action & Academic Download Section */}
      <div className="space-y-space-sm pt-space-xs">
        <button
          type="button"
          onClick={() => {
            onOpenPolicyBrief();
            showToast('Naskah Policy Brief & Esai Ilmiah siap ditinjau!');
          }}
          className="w-full h-12 bg-primary hover:bg-primary-container text-on-primary rounded-xl font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-transform cursor-pointer font-bold"
        >
          <span className="material-symbols-outlined text-xl">download</span>
          <span>Unduh Naskah Policy Brief / Esai</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onOpenApiDocs();
            showToast('Dokumentasi Sandbox API AI Governance dibuka.');
          }}
          className="w-full h-12 bg-surface-container hover:bg-surface-container-high text-primary rounded-xl font-label-lg text-label-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-transform cursor-pointer font-bold"
        >
          <span className="material-symbols-outlined text-xl">terminal</span>
          <span>Buka Dokumentasi API Tata Kelola AI</span>
        </button>
      </div>

      {/* Legal Citation Footnote */}
      <div className="text-center pt-space-xs">
        <p className="font-label-sm text-label-sm text-outline leading-relaxed">
          Dokumen prototipe resmi lampiran visual kompetisi esai ilmiah nasional. Dilindungi di bawah inisiatif Creative Commons CC-BY 4.0.
        </p>
      </div>
    </div>
  );
};
