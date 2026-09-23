import React from 'react';
import { TabType } from '../types';

interface NavbarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onTabChange }) => {
  return (
    <nav className="fixed bottom-0 inset-x-0 max-w-md mx-auto w-full z-40 pb-safe bg-surface/92 backdrop-blur-xl border-t border-surface-container-high/60 shadow-[0_-4px_20px_rgba(15,23,42,0.06)]">
      <div className="flex justify-between items-center h-18 px-1">
        {/* Beranda */}
        <button
          onClick={() => onTabChange('beranda')}
          className={`flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 gap-0.5 transition-all ${
            currentTab === 'beranda'
              ? 'text-primary font-bold'
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={{
              fontVariationSettings: currentTab === 'beranda' ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            home
          </span>
          <span className="font-label-sm text-[10px] tracking-tight">Beranda</span>
        </button>

        {/* Unggah (Elevated Center Button) */}
        <button
          onClick={() => onTabChange('unggah')}
          className={`flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 gap-0.5 transition-all group ${
            currentTab === 'unggah' ? 'text-primary font-bold' : 'text-on-surface-variant'
          }`}
        >
          <div
            className={`w-11 h-11 rounded-full text-on-primary flex items-center justify-center shadow-[0_4px_14px_rgba(37,99,235,0.35)] -mt-4 transition-transform active:scale-95 ${
              currentTab === 'unggah'
                ? 'bg-primary ring-4 ring-primary-fixed/50 scale-105'
                : 'bg-primary-container group-hover:scale-105'
            }`}
          >
            <span className="material-symbols-outlined text-[26px]">add</span>
          </div>
          <span className="font-label-sm text-[10px] tracking-tight mt-0.5">Unggah</span>
        </button>

        {/* Lacak & Saldo */}
        <button
          onClick={() => onTabChange('lacak-dan-saldo')}
          className={`flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 gap-0.5 transition-all ${
            currentTab === 'lacak-dan-saldo'
              ? 'text-primary font-bold'
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={{
              fontVariationSettings:
                currentTab === 'lacak-dan-saldo' ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            account_balance_wallet
          </span>
          <span className="font-label-sm text-[10px] tracking-tight">Lacak</span>
        </button>

        {/* Sertifikat */}
        <button
          onClick={() => onTabChange('sertifikat')}
          className={`flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 gap-0.5 transition-all ${
            currentTab === 'sertifikat'
              ? 'text-primary font-bold'
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={{
              fontVariationSettings: currentTab === 'sertifikat' ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            verified
          </span>
          <span className="font-label-sm text-[10px] tracking-tight">Sertifikat</span>
        </button>

        {/* Tentang */}
        <button
          onClick={() => onTabChange('tentang')}
          className={`flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 gap-0.5 transition-all ${
            currentTab === 'tentang'
              ? 'text-primary font-bold'
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={{
              fontVariationSettings: currentTab === 'tentang' ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            auto_awesome
          </span>
          <span className="font-label-sm text-[10px] tracking-tight">Tentang</span>
        </button>
      </div>
    </nav>
  );
};
