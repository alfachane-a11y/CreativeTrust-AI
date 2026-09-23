import React from 'react';

interface PolicyBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PolicyBriefModal: React.FC<PolicyBriefModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-surface-container-lowest max-w-lg w-full rounded-2xl p-5 shadow-2xl border border-surface-container flex flex-col gap-4 relative max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-surface-container pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">
              description
            </span>
            <div>
              <h3 className="font-headline-sm text-on-surface font-extrabold leading-tight">
                Policy Brief & Esai Ilmiah
              </h3>
              <span className="text-[11px] text-on-surface-variant">
                Usulan Tata Kelola AI Berkeadilan untuk Kreator Indonesia
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Content reader */}
        <div className="flex flex-col gap-3 overflow-y-auto pr-1 text-on-surface font-body-sm leading-relaxed text-[13px]">
          <div className="bg-primary/5 p-3 rounded-xl border border-primary/15 flex flex-col gap-1">
            <span className="font-label-sm uppercase tracking-wider text-primary font-bold">
              Ringkasan Eksekutif (Executive Summary)
            </span>
            <p className="text-on-surface text-xs leading-relaxed">
              Ledakan adopsi Generative AI dan web scraping skala masif mengancam kelangsungan hidup kreator digital lokal.
              Karya intelektual dipanen tanpa atribusi maupun kompensasi ekonomi yang adil. <strong>CreativeTrust AI</strong> hadir
              sebagai kerangka teknologi kedaulatan hak cipta independen berlandaskan kriptografi SHA-256 dan smart contract micro-split.
            </p>
          </div>

          <h4 className="font-headline-sm text-sm text-on-surface font-bold pt-1">
            1. Latar Belakang Masalah
          </h4>
          <p className="text-on-surface-variant">
            Pencipta seni visual, musik, dan literatur di Indonesia menghadapi asimetri kekuatan terhadap korporasi teknologi global.
            Birokrasi pendaftaran HKI tradisional membutuhkan waktu berminggu-minggu dan biaya yang tidak terjangkau bagi seniman muda,
            sedangkan AI model melatih miliaran parameter dalam hitungan jam.
          </p>

          <h4 className="font-headline-sm text-sm text-on-surface font-bold pt-1">
            2. Tiga Pilar Solusi Kriptografis
          </h4>
          <ul className="list-disc pl-4 space-y-1 text-on-surface-variant">
            <li>
              <strong className="text-on-surface">Steganografi Pixel Tahan Kompresi:</strong> Menanamkan sidik jari biner
              tak kasat mata pada frekuensi spektral gambar yang tidak hilang saat dikompresi di media sosial.
            </li>
            <li>
              <strong className="text-on-surface">Smart Contract Royalti Mikro Otonom:</strong> Mengatur tarif per-scrape atau per-token
              yang secara instan mentransfer royalti tanpa potongan pihak ketiga langsung ke rekening lokal (BCA/QRIS).
            </li>
            <li>
              <strong className="text-on-surface">Sentinels Crawler Web 24/7:</strong> Audit bot AI legalitas komersil
              dan verifikasi sertifikat kepemilikan berlandaskan UU ITE No. 1/2024.
            </li>
          </ul>

          <h4 className="font-headline-sm text-sm text-on-surface font-bold pt-1">
            3. Rekomendasi Kebijakan (Policy Recommendations)
          </h4>
          <div className="bg-surface-container-low p-3 rounded-xl flex flex-col gap-2">
            <p className="text-xs text-on-surface">
              • <strong>Kemenparekraf:</strong> Adopsi sandbox registry royalti mikro digital untuk kreator lokal.
            </p>
            <p className="text-xs text-on-surface">
              • <strong>DJKI Kemenkumham:</strong> Pengakuan hash bukti forensik digital sebagai preseden sah pembuktian sengketa IP AI.
            </p>
            <p className="text-xs text-on-surface">
              • <strong>Kementerian Kominfo:</strong> Kewajiban transparansi dataset bagi penyedia LLM komersial yang beroperasi di wilayah hukum RI.
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex gap-2 pt-2 border-t border-surface-container">
          <button
            onClick={() => {
              window.print();
            }}
            className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary font-label-md font-bold hover:bg-primary-container transition-colors flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-lg">download</span>
            <span>Simpan Naskah PDF</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-surface-container text-on-surface font-label-md font-semibold hover:bg-surface-container-highest transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export const ApiDocsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-surface-container-lowest max-w-lg w-full rounded-2xl p-5 shadow-2xl border border-surface-container flex flex-col gap-4 relative max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-surface-container pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">
              terminal
            </span>
            <div>
              <h3 className="font-headline-sm text-on-surface font-extrabold leading-tight">
                Dokumentasi API Tata Kelola AI
              </h3>
              <span className="text-[11px] text-on-surface-variant">
                Sandbox Protocol Integration v2.4
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-3 overflow-y-auto pr-1 text-xs font-mono">
          <div>
            <span className="text-secondary font-bold">GET</span>{' '}
            <span className="text-on-surface">/api/v2/guardian/verify/:assetId</span>
            <div className="bg-surface-container-high/80 p-3 rounded-lg mt-1 text-on-surface">
              {`{
  "status": "VERIFIED_AUTHENTIC",
  "asset_id": "CT-AI-8942-IDN-2024-X992",
  "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "creator": "Maya Ardiansyah",
  "smart_contract": "0x7a82...9B3F",
  "license": "COMMERCIAL_MICRO",
  "tariff_idr": 50000,
  "djki_sandbox_verified": true
}`}
            </div>
          </div>

          <div>
            <span className="text-primary font-bold">POST</span>{' '}
            <span className="text-on-surface">/api/v2/guardian/micro-split/settle</span>
            <div className="bg-surface-container-high/80 p-3 rounded-lg mt-1 text-on-surface">
              {`{
  "consumer": "AI Nusantara Platform",
  "asset_id": "CT-AI-8942-IDN-2024-X992",
  "token_count": 1420,
  "payout_idr": 150000,
  "destination": "BCA_INSTANT_SETTLEMENT",
  "hash_signature": "0x4b8a...710e"
}`}
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-label-md font-bold hover:bg-primary-container transition-colors"
        >
          Selesai Membaca
        </button>
      </div>
    </div>
  );
};
