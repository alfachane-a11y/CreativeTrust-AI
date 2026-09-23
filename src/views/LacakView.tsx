import React, { useState } from 'react';
import { Transaction } from '../types';

interface LacakViewProps {
  balance: number;
  transactions: Transaction[];
  onOpenWithdraw: () => void;
}

export const LacakView: React.FC<LacakViewProps> = ({
  balance,
  transactions,
  onOpenWithdraw,
}) => {
  const [filter, setFilter] = useState<'all' | 'komersial' | 'model_ai'>('all');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncToast, setSyncToast] = useState(false);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID').format(val);
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncToast(true);
      setTimeout(() => setSyncToast(false), 2500);
    }, 1200);
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (filter === 'all') return true;
    return tx.type === filter;
  });

  return (
    <div className="flex flex-col w-full px-margin pt-space-md pb-space-xl gap-space-md">
      {/* Title & Sync Button */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
            CreativeTrust Guardian
          </span>
          <h1 className="font-headline-md text-headline-md text-on-surface font-extrabold">
            Pemantauan Karya &amp; Royalti Otomatis
          </h1>
        </div>
        <button
          onClick={handleSync}
          aria-label="Sinkronisasi Data"
          className="w-10 h-10 rounded-full bg-secondary-container/40 border border-secondary-container/60 flex items-center justify-center text-on-secondary-container shadow-xs active:scale-95 transition-transform cursor-pointer"
        >
          <span
            className={`material-symbols-outlined text-xl ${isSyncing ? 'animate-spin' : ''}`}
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            sync
          </span>
        </button>
      </div>

      {/* Sync Toast Feedback */}
      {syncToast && (
        <div className="bg-secondary-container/40 border border-secondary/30 text-on-secondary-container px-3 py-2 rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
          <span className="material-symbols-outlined text-base text-secondary">
            check_circle
          </span>
          <span>Buku besar terdistribusi dan AI crawler tersinkronisasi 100%.</span>
        </div>
      )}

      {/* Big Gradient Balance Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary-container to-tertiary p-space-md text-on-primary shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute top-0 right-0 p-space-md opacity-15 pointer-events-none">
          <span className="material-symbols-outlined text-8xl">verified_user</span>
        </div>

        <div className="relative z-10 flex flex-col gap-space-md">
          {/* Top Pill / Smart contract indicator */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs bg-white/15 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
              <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-pulse" />
              <span className="font-label-sm text-label-sm text-on-primary font-bold">
                Auto-Split On-Chain Aktif
              </span>
            </div>
            <div className="flex items-center gap-1 text-on-primary/80">
              <span className="material-symbols-outlined text-sm">lock</span>
              <span className="font-label-sm text-label-sm">Smart Contract</span>
            </div>
          </div>

          {/* Amount Display */}
          <div className="flex flex-col gap-1">
            <span className="font-label-md text-label-md text-on-primary/80">
              Total Saldo Pendapatan Tersedia
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-display-hero-mobile text-display-hero-mobile font-black tracking-tight">
                Rp {formatRupiah(balance)}
              </span>
            </div>
          </div>

          {/* Actions & Bank Account Info */}
          <div className="flex flex-col gap-space-sm pt-space-xs">
            <button
              onClick={onOpenWithdraw}
              className="w-full h-12 bg-secondary-container text-on-secondary-container font-label-lg text-label-lg rounded-xl flex items-center justify-center gap-2 shadow-md hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer font-bold"
            >
              <span className="material-symbols-outlined text-xl">payments</span>
              <span>Tarik Dana Langsung</span>
            </button>

            <div className="bg-black/20 backdrop-blur-md rounded-xl p-2.5 flex items-center justify-between gap-2 text-on-primary/95 border border-white/10">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-surface-container-lowest/20 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-base">account_balance</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-label-sm text-label-sm truncate font-semibold">
                    BCA •••• 8821 &amp; QRIS Siap Cair
                  </span>
                  <span className="font-body-sm text-body-sm text-on-primary/75 text-[11px] leading-tight">
                    Langsung ke rekening tanpa potongan perantara
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-secondary-fixed text-lg shrink-0">
                check_circle
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tren Pemakaian Karya Card */}
      <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-xs border border-surface-container flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-label-md text-label-md text-on-surface font-bold">
              Tren Pemakaian Karya
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              7 hari terakhir terdeteksi AI crawler
            </span>
          </div>
          <div className="flex items-center gap-1 text-secondary font-label-sm text-label-sm font-bold bg-secondary-container/30 border border-secondary-container/50 px-2 py-0.5 rounded-full">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span>+28.4%</span>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="w-full flex flex-col gap-1">
          <div className="h-28 w-full flex items-end justify-between gap-2 pt-2 px-1">
            {/* Sen */}
            <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
              <span className="font-label-sm text-[10px] text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">
                4
              </span>
              <div className="w-full rounded-t-md bg-surface-container-high h-[25%] transition-all group-hover:bg-primary-container" />
              <span className="font-label-sm text-[10px] text-on-surface-variant">Sen</span>
            </div>
            {/* Sel */}
            <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
              <span className="font-label-sm text-[10px] text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">
                7
              </span>
              <div className="w-full rounded-t-md bg-surface-container-high h-[40%] transition-all group-hover:bg-primary-container" />
              <span className="font-label-sm text-[10px] text-on-surface-variant">Sel</span>
            </div>
            {/* Rab */}
            <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
              <span className="font-label-sm text-[10px] text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">
                5
              </span>
              <div className="w-full rounded-t-md bg-surface-container-high h-[30%] transition-all group-hover:bg-primary-container" />
              <span className="font-label-sm text-[10px] text-on-surface-variant">Rab</span>
            </div>
            {/* Kam */}
            <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
              <span className="font-label-sm text-[10px] text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">
                11
              </span>
              <div className="w-full rounded-t-md bg-surface-container-high h-[58%] transition-all group-hover:bg-primary-container" />
              <span className="font-label-sm text-[10px] text-on-surface-variant">Kam</span>
            </div>
            {/* Jum */}
            <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
              <span className="font-label-sm text-[10px] text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">
                9
              </span>
              <div className="w-full rounded-t-md bg-surface-container-high h-[50%] transition-all group-hover:bg-primary-container" />
              <span className="font-label-sm text-[10px] text-on-surface-variant">Jum</span>
            </div>
            {/* Sab */}
            <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
              <span className="font-label-sm text-[10px] text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">
                16
              </span>
              <div className="w-full rounded-t-md bg-primary/70 h-[80%] transition-all group-hover:bg-primary" />
              <span className="font-label-sm text-[10px] text-on-surface-variant font-bold">Sab</span>
            </div>
            {/* Min */}
            <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
              <span className="font-label-sm text-[10px] text-secondary font-bold">20</span>
              <div className="w-full rounded-t-md bg-primary h-[100%] shadow-[0_2px_8px_rgba(0,74,198,0.3)]" />
              <span className="font-label-sm text-[10px] text-primary font-bold">Min</span>
            </div>
          </div>
        </div>

        {/* 3 Metric Grid */}
        <div className="grid grid-cols-3 gap-2 pt-space-xs">
          <div className="bg-surface-container-low rounded-xl p-2.5 flex flex-col border border-surface-container">
            <div className="flex items-center gap-1 text-on-surface-variant">
              <span className="material-symbols-outlined text-[15px]">visibility</span>
              <span className="font-label-sm text-[10px]">Dilihat</span>
            </div>
            <span className="font-headline-sm text-headline-sm text-on-surface mt-1 font-bold">
              14.820
            </span>
            <span className="font-body-sm text-[10px] text-secondary font-medium">
              Impression
            </span>
          </div>

          <div className="bg-surface-container-low rounded-xl p-2.5 flex flex-col border border-surface-container">
            <div className="flex items-center gap-1 text-primary">
              <span className="material-symbols-outlined text-[15px]">token</span>
              <span className="font-label-sm text-[10px]">Dipakai</span>
            </div>
            <span className="font-headline-sm text-headline-sm text-primary mt-1 font-bold">
              42<span className="font-label-sm text-xs font-normal text-on-surface-variant"> kali</span>
            </span>
            <span className="font-body-sm text-[10px] text-on-surface-variant">
              Komersil &amp; Model
            </span>
          </div>

          <div className="bg-surface-container-low rounded-xl p-2.5 flex flex-col border border-surface-container">
            <div className="flex items-center gap-1 text-secondary">
              <span className="material-symbols-outlined text-[15px]">price_check</span>
              <span className="font-label-sm text-[10px]">Royalti</span>
            </div>
            <span className="font-headline-sm text-[13px] leading-6 font-bold text-secondary mt-1">
              Rp 1,45 Jt
            </span>
            <span className="font-body-sm text-[10px] text-secondary font-medium">
              100% diterima
            </span>
          </div>
        </div>
      </div>

      {/* Riwayat Transaksi Royalti */}
      <div className="flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
            Riwayat Transaksi Royalti
          </span>
          <span className="font-label-sm text-label-sm text-primary font-semibold">
            Real-Time Ledger
          </span>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-full font-label-md text-label-md transition-all whitespace-nowrap cursor-pointer ${
              filter === 'all'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
            }`}
          >
            Semua Riwayat
          </button>
          <button
            onClick={() => setFilter('komersial')}
            className={`px-3.5 py-1.5 rounded-full font-label-md text-label-md transition-all whitespace-nowrap cursor-pointer ${
              filter === 'komersial'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
            }`}
          >
            Komersial
          </button>
          <button
            onClick={() => setFilter('model_ai')}
            className={`px-3.5 py-1.5 rounded-full font-label-md text-label-md transition-all whitespace-nowrap cursor-pointer ${
              filter === 'model_ai'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
            }`}
          >
            Model AI
          </button>
        </div>

        {/* Transactions List */}
        <div className="flex flex-col gap-space-xs">
          {filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-surface-container flex items-center justify-between gap-space-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-space-sm min-w-0">
                <div
                  className={`w-11 h-11 rounded-xl ${tx.iconBg} ${tx.iconColor} flex items-center justify-center shrink-0`}
                >
                  <span className="material-symbols-outlined text-2xl">{tx.icon}</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-label-lg text-label-lg text-on-surface font-bold truncate">
                    {tx.buyerName}
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    {tx.typeLabel}
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-[13px] text-secondary">
                      check_circle
                    </span>
                    <span className="font-label-sm text-[11px] text-secondary font-bold">
                      Berhasil Cair
                    </span>
                    <span className="text-[10px] text-on-surface-variant font-mono">
                      {tx.hashTag}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0">
                <span className="font-headline-sm text-headline-sm text-secondary font-bold">
                  +Rp {formatRupiah(tx.amount)}
                </span>
                <span className="font-label-sm text-[10px] text-on-surface-variant">
                  {tx.badgeLabel}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Jaminan Transparansi Kriptografi */}
      <div className="bg-surface-container-low rounded-2xl p-space-md border border-surface-container flex flex-col gap-space-xs text-on-surface-variant">
        <div className="flex items-center gap-2 text-on-surface">
          <span className="material-symbols-outlined text-primary text-xl">shield_locked</span>
          <span className="font-label-lg text-label-lg font-bold">
            Jaminan Transparansi Kriptografi
          </span>
        </div>
        <p className="font-body-sm text-body-sm leading-relaxed">
          Setiap desimal royalti terenkripsi secara otomatis pada buku besar terdistribusi CreativeTrust AI. Pembayaran disalurkan secara simultan tanpa perantara pemotong royalti, mengamankan hak cipta dan jerih payah kreator Indonesia secara legal dan mutlak.
        </p>
        <div className="flex items-center gap-2 pt-1 font-mono text-[11px] text-primary">
          <span className="material-symbols-outlined text-sm">enhanced_encryption</span>
          <span>SHA-256 Provenance Ledger ID: CT-AI-ID-2024-88492</span>
        </div>
      </div>
    </div>
  );
};
