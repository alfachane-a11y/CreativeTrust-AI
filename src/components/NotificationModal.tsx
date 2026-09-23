import React from 'react';
import { AppNotification } from '../types';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-surface-container-lowest max-w-sm w-full rounded-2xl p-5 shadow-2xl border border-surface-container flex flex-col gap-3 relative max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-surface-container pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">
              notifications
            </span>
            <h3 className="font-headline-sm text-on-surface font-extrabold">
              Notifikasi Sistem
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Quick Action */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-on-surface-variant font-medium">
            {notifications.length} Pembaruan Terkini
          </span>
          <button
            onClick={onMarkAllAsRead}
            className="text-primary font-semibold hover:underline"
          >
            Tandai semua dibaca
          </button>
        </div>

        {/* List */}
        <div className="flex flex-col gap-2 overflow-y-auto no-scrollbar py-1">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3 rounded-xl border flex gap-3 items-start transition-all ${
                n.read
                  ? 'bg-surface-container-low/50 border-surface-container'
                  : 'bg-surface-container-lowest border-primary/20 shadow-xs'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  n.type === 'royalty'
                    ? 'bg-secondary-container/30 text-secondary'
                    : n.type === 'security'
                    ? 'bg-primary/10 text-primary'
                    : 'bg-tertiary-container/20 text-tertiary'
                }`}
              >
                <span className="material-symbols-outlined text-lg">
                  {n.type === 'royalty'
                    ? 'payments'
                    : n.type === 'security'
                    ? 'verified_user'
                    : 'radar'}
                </span>
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-label-md font-bold text-on-surface truncate">
                    {n.title}
                  </span>
                  <span className="text-[10px] text-on-surface-variant shrink-0">
                    {n.time}
                  </span>
                </div>
                <p className="font-body-sm text-[11px] text-on-surface-variant mt-0.5 leading-relaxed">
                  {n.message}
                </p>
                {n.amount && (
                  <span className="inline-block mt-1 font-label-sm font-bold text-secondary text-[11px]">
                    +Rp {new Intl.NumberFormat('id-ID').format(n.amount)} Masuk Otomatis
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-surface-container text-on-surface font-label-md font-bold hover:bg-surface-container-highest transition-colors"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};
