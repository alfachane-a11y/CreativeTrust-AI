export type TabType = 'beranda' | 'unggah' | 'lacak-dan-saldo' | 'sertifikat' | 'tentang';

export interface RegisteredWork {
  id: string;
  assetId: string;
  title: string;
  category: 'image' | 'audio' | 'text' | 'video3d';
  categoryLabel: string;
  technology: string;
  date: string;
  sha256: string;
  usageCount: number;
  imageUrl: string;
  description: string;
  licenseType: 'free' | 'commercial' | 'exclusive';
  tariff: number;
  status: 'active' | 'pending';
}

export interface Transaction {
  id: string;
  buyerName: string;
  type: 'komersial' | 'model_ai';
  typeLabel: string;
  date: string;
  amount: number;
  hashTag: string;
  badgeLabel: string;
  icon: string;
  iconBg: string;
  iconColor: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'royalty' | 'security' | 'contract';
  amount?: number;
}
