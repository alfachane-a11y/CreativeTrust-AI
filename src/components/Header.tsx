import React from 'react';
import { TabType } from '../types';
import { LOGO_URL } from '../data/mockData';
import { CreatorAccount } from '../services/auth';

interface HeaderProps {
  currentTab: TabType;
  unreadNotifsCount: number;
  creator: CreatorAccount;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
}

const TAB_SUBTITLES: Record<TabType, string> = {
  'beranda': 'Beranda',
  'unggah': 'Unggah',
  'lacak-dan-saldo': 'Lacak Dan Saldo',
  'sertifikat': 'Sertifikat',
  'tentang': 'Tentang',
};

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  unreadNotifsCount,
  creator,
  onOpenNotifications,
  onOpenProfile,
}) => {
  return (
    <header className="fixed top-0 inset-x-0 max-w-md mx-auto w-full z-40 pt-safe bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-container-high/40">
      <div className="h-16 px-4 flex items-center justify-between gap-2">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-2">
          <img
            src={LOGO_URL}
            alt="CreativeTrust AI Logo"
            className="h-8 w-auto object-contain"
          />
          <div className="flex flex-col">
            <span className="font-headline-sm text-[16px] font-bold text-on-surface leading-tight tracking-tight">
              CreativeTrust
            </span>
            <span className="font-label-sm text-[10px] text-on-surface-variant font-medium">
              {TAB_SUBTITLES[currentTab]}
            </span>
          </div>
        </div>

        {/* Right Status Actions */}
        <div className="flex items-center gap-1.5">
          {/* AI Guardian / Google Active Badge */}
          <div className="flex items-center gap-1 bg-secondary-container/30 border border-secondary-container/50 px-2.5 py-1 rounded-full text-on-secondary-container">
            <span className="material-symbols-outlined text-[14px] text-secondary">
              verified_user
            </span>
            <span className="font-label-sm text-[11px] text-secondary font-bold tracking-wide">
              {creator.isGoogleUser ? 'Google Aktif' : 'AI Aktif'}
            </span>
          </div>

          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            aria-label="Notifikasi"
            className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors relative rounded-full hover:bg-surface-container active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-2xl">
              notifications
            </span>
            {unreadNotifsCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-error animate-pulse" />
            )}
          </button>

          {/* Profile Avatar */}
          <button
            onClick={onOpenProfile}
            aria-label={`Profil ${creator.displayName}`}
            className="relative flex items-center rounded-full active:scale-95 transition-transform cursor-pointer"
            title={`${creator.displayName} (${creator.email})`}
          >
            <img
              src={creator.photoURL}
              alt={creator.displayName}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-container/30 hover:ring-primary transition-all shadow-sm"
            />
            <span
              className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-surface ${
                creator.isGoogleUser ? 'bg-primary' : 'bg-secondary'
              }`}
            />
          </button>
        </div>
      </div>
    </header>
  );
};
