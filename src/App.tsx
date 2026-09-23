/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { TabType, RegisteredWork, Transaction, AppNotification } from './types';
import {
  INITIAL_WORKS,
  INITIAL_TRANSACTIONS,
  INITIAL_NOTIFICATIONS,
} from './data/mockData';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { BerandaView } from './views/BerandaView';
import { UnggahView } from './views/UnggahView';
import { LacakView } from './views/LacakView';
import { SertifikatView } from './views/SertifikatView';
import { TentangView } from './views/TentangView';
import { WithdrawModal } from './components/WithdrawModal';
import { NotificationModal } from './components/NotificationModal';
import { ProfileModal } from './components/ProfileModal';
import { PolicyBriefModal, ApiDocsModal } from './components/PolicyBriefModal';
import {
  CreatorAccount,
  getDefaultCreator,
  initAuth,
  googleSignIn,
  logoutGoogle,
  getCachedAccessToken,
} from './services/auth';

const STORAGE_KEY_PROFILE = 'creativetrust_user_profile';
const STORAGE_KEY_WORKS = 'creativetrust_registered_works';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('beranda');
  const [balance, setBalance] = useState<number>(1450000);
  
  // Load saved works or fallback
  const [registeredWorks, setRegisteredWorks] = useState<RegisteredWork[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WORKS);
      return saved ? JSON.parse(saved) : INITIAL_WORKS;
    } catch {
      return INITIAL_WORKS;
    }
  });

  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  // User & Google Auth state
  const [creator, setCreator] = useState<CreatorAccount>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      return saved ? JSON.parse(saved) : getDefaultCreator();
    } catch {
      return getDefaultCreator();
    }
  });
  const [accessToken, setAccessToken] = useState<string | null>(getCachedAccessToken());

  // Modals state
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPolicyBriefOpen, setIsPolicyBriefOpen] = useState(false);
  const [isApiDocsOpen, setIsApiDocsOpen] = useState(false);

  // Global Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showGlobalToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Initialize Firebase Auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setCreator((prev) => {
          const updated = {
            ...prev,
            ...user,
            isGoogleUser: true,
          };
          localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(updated));
          return updated;
        });
        if (token) {
          setAccessToken(token);
        }
      },
      () => {
        // Not logged in or signed out
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // Save works on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_WORKS, JSON.stringify(registeredWorks));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [registeredWorks]);

  // Google Sign-In action
  const handleSignInGoogle = async () => {
    try {
      const res = await googleSignIn();
      if (res) {
        setCreator((prev) => {
          const updated = {
            ...prev,
            ...res.creator,
            isGoogleUser: true,
          };
          localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(updated));
          return updated;
        });
        setAccessToken(res.accessToken);
        showGlobalToast(`Berhasil masuk sebagai ${res.creator.displayName}! Google Drive siap diakses.`);
      }
    } catch (err: any) {
      console.error('Google Sign In error:', err);
      showGlobalToast('Gagal masuk dengan akun Google.');
      throw err;
    }
  };

  // Google Sign-Out action
  const handleSignOutGoogle = async () => {
    try {
      await logoutGoogle();
      const defaultUser = getDefaultCreator();
      setCreator(defaultUser);
      setAccessToken(null);
      localStorage.removeItem(STORAGE_KEY_PROFILE);
      showGlobalToast('Berhasil keluar dari akun Google.');
    } catch (err) {
      console.error('Sign Out error:', err);
    }
  };

  const handleUpdateCreator = (updated: Partial<CreatorAccount>) => {
    setCreator((prev) => {
      const next = { ...prev, ...updated };
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(next));
      return next;
    });
    showGlobalToast('Profil identitas pencipta diperbarui.');
  };

  const handleTabChange = (newTab: TabType) => {
    setCurrentTab(newTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddWork = (newWork: RegisteredWork) => {
    setRegisteredWorks((prev) => [newWork, ...prev]);

    // Add notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Karya Berhasil Diproteksi',
      message: `${newWork.title} kini terlindungi dengan SHA-256 #${newWork.sha256.substring(0, 4)} dan steganografi aktif.`,
      time: 'Baru saja',
      read: false,
      type: 'security',
    };
    setNotifications((prev) => [newNotif, ...prev]);
    showGlobalToast(`"${newWork.title}" berhasil didaftarkan ke Ledger Kriptografi!`);
  };

  const handleWithdrawSuccess = (amount: number, destination: string) => {
    setBalance((prev) => Math.max(0, prev - amount));

    // Add withdrawal transaction
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      buyerName: `Pencairan ke ${destination}`,
      type: 'komersial',
      typeLabel: `Penarikan Tunai • ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`,
      date: 'Hari ini',
      amount: -amount,
      hashTag: '#DISBURSE',
      badgeLabel: 'Berhasil Dicairkan',
      icon: 'account_balance_wallet',
      iconBg: 'bg-secondary/20',
      iconColor: 'text-secondary',
    };
    setTransactions((prev) => [newTx, ...prev]);

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Penarikan Dana Berhasil',
      message: `Dana Rp ${new Intl.NumberFormat('id-ID').format(amount)} telah dicairkan ke ${destination}.`,
      time: 'Baru saja',
      read: false,
      type: 'royalty',
    };
    setNotifications((prev) => [newNotif, ...prev]);
    showGlobalToast(`Rp ${new Intl.NumberFormat('id-ID').format(amount)} berhasil ditarik ke ${destination}!`);
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    document.title = 'CreativeTrust Guardian — Platform Kedaulatan Hak Cipta AI';
  }, []);

  return (
    <div className="min-h-screen bg-[#f3f4f9] flex justify-center text-on-surface">
      {/* Mobile Shell Wrapper */}
      <div className="w-full max-w-md min-h-screen bg-surface flex flex-col relative shadow-[0_0_50px_rgba(0,0,0,0.06)] border-x border-surface-container-high/40">
        {/* Fixed Header */}
        <Header
          currentTab={currentTab}
          unreadNotifsCount={unreadNotifsCount}
          creator={creator}
          onOpenNotifications={() => setIsNotifOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex flex-col relative w-full pt-16 pb-24 min-h-screen">
          {currentTab === 'beranda' && (
            <BerandaView
              balance={balance}
              registeredWorks={registeredWorks}
              creator={creator}
              onNavigate={handleTabChange}
              onOpenWithdraw={() => setIsWithdrawOpen(true)}
              onOpenProfile={() => setIsProfileOpen(true)}
              onSignInGoogle={handleSignInGoogle}
            />
          )}

          {currentTab === 'unggah' && (
            <UnggahView
              creator={creator}
              accessToken={accessToken}
              onSignInGoogle={handleSignInGoogle}
              onAddWork={handleAddWork}
              onNavigate={handleTabChange}
            />
          )}

          {currentTab === 'lacak-dan-saldo' && (
            <LacakView
              balance={balance}
              transactions={transactions}
              onOpenWithdraw={() => setIsWithdrawOpen(true)}
            />
          )}

          {currentTab === 'sertifikat' && (
            <SertifikatView
              works={registeredWorks}
              creator={creator}
              accessToken={accessToken}
              onSignInGoogle={handleSignInGoogle}
            />
          )}

          {currentTab === 'tentang' && (
            <TentangView
              onOpenPolicyBrief={() => setIsPolicyBriefOpen(true)}
              onOpenApiDocs={() => setIsApiDocsOpen(true)}
            />
          )}
        </main>

        {/* Global Toast */}
        {toastMessage && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-inverse-surface text-inverse-on-surface rounded-xl p-3.5 shadow-2xl flex items-center gap-3 z-50 animate-fadeIn">
            <span className="material-symbols-outlined text-secondary-fixed text-2xl shrink-0">
              check_circle
            </span>
            <div className="flex flex-col min-w-0">
              <span className="font-label-md text-label-md font-bold truncate">
                CreativeTrust AI Guardian
              </span>
              <span className="font-body-sm text-[11px] leading-tight text-inverse-on-surface/90">
                {toastMessage}
              </span>
            </div>
          </div>
        )}

        {/* Fixed Bottom Navigation */}
        <Navbar currentTab={currentTab} onTabChange={handleTabChange} />

        {/* Interactive Modals */}
        <WithdrawModal
          isOpen={isWithdrawOpen}
          onClose={() => setIsWithdrawOpen(false)}
          availableBalance={balance}
          onWithdrawSuccess={handleWithdrawSuccess}
        />

        <NotificationModal
          isOpen={isNotifOpen}
          onClose={() => setIsNotifOpen(false)}
          notifications={notifications}
          onMarkAllAsRead={handleMarkAllNotificationsAsRead}
        />

        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          creator={creator}
          onSignInGoogle={handleSignInGoogle}
          onSignOutGoogle={handleSignOutGoogle}
          onUpdateCreator={handleUpdateCreator}
          registeredWorksCount={registeredWorks.length}
          totalEarnings={balance + 850000}
        />

        <PolicyBriefModal
          isOpen={isPolicyBriefOpen}
          onClose={() => setIsPolicyBriefOpen(false)}
        />

        <ApiDocsModal
          isOpen={isApiDocsOpen}
          onClose={() => setIsApiDocsOpen(false)}
        />
      </div>
    </div>
  );
}
