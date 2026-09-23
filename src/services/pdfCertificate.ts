import { jsPDF } from 'jspdf';
import { RegisteredWork } from '../types';

export interface CreatorPdfMeta {
  name: string;
  email: string;
  walletAddress?: string;
}

/**
 * Creates and downloads a formal Indonesian digital copyright certificate PDF
 * Directly saves to the user's device/HP download storage.
 * Returns the PDF Blob for optional cloud upload (e.g. Google Drive).
 */
export const generateCertificatePdf = async (
  work: RegisteredWork,
  creator: CreatorPdfMeta
): Promise<{ blob: Blob; fileName: string }> => {
  // A4 dimensions: 210 x 297 mm
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  // 1. Decorative Border
  doc.setDrawColor(0, 74, 198); // #004ac6 primary blue
  doc.setLineWidth(1.2);
  doc.rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2);

  // Inner thin border
  doc.setDrawColor(180, 200, 235);
  doc.setLineWidth(0.4);
  doc.rect(margin + 2.5, margin + 2.5, pageWidth - (margin + 2.5) * 2, pageHeight - (margin + 2.5) * 2);

  // Corner security corner markers
  const cornerSize = 8;
  doc.setFillColor(0, 74, 198);
  // Top-left
  doc.rect(margin, margin, cornerSize, 1.5, 'F');
  doc.rect(margin, margin, 1.5, cornerSize, 'F');
  // Top-right
  doc.rect(pageWidth - margin - cornerSize, margin, cornerSize, 1.5, 'F');
  doc.rect(pageWidth - margin - 1.5, margin, 1.5, cornerSize, 'F');
  // Bottom-left
  doc.rect(margin, pageHeight - margin - 1.5, cornerSize, 1.5, 'F');
  doc.rect(margin, pageHeight - margin - cornerSize, 1.5, cornerSize, 'F');
  // Bottom-right
  doc.rect(pageWidth - margin - cornerSize, pageHeight - margin - 1.5, cornerSize, 1.5, 'F');
  doc.rect(pageWidth - margin - 1.5, pageHeight - margin - cornerSize, 1.5, cornerSize, 'F');

  // 2. Header Banner
  doc.setFillColor(0, 74, 198);
  doc.rect(margin + 3, margin + 3, pageWidth - (margin + 3) * 2, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('REPUBLIK INDONESIA', pageWidth / 2, margin + 10, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(
    'DIREKTORAT JENDERAL KEKAYAAN INTELEKTUAL & CREATIVETRUST AI GUARDIAN',
    pageWidth / 2,
    margin + 16,
    { align: 'center' }
  );
  doc.setFontSize(7.5);
  doc.setTextColor(215, 230, 255);
  doc.text(
    'Sistem Pencatatan Hak Cipta Kriptografis & Perlindungan AI Nasional Terdesentralisasi',
    pageWidth / 2,
    margin + 22,
    { align: 'center' }
  );

  // 3. Title of Certificate
  let y = margin + 35;
  doc.setTextColor(0, 40, 120);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('SERTIFIKAT KEPEMILIKAN HAK CIPTA DIGITAL', pageWidth / 2, y, { align: 'center' });

  y += 5;
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('IMMUTABLE FORENSIC PROVENANCE PASSPORT', pageWidth / 2, y, { align: 'center' });

  // Verification Badge Bar
  y += 6;
  doc.setFillColor(235, 244, 255);
  doc.setDrawColor(180, 215, 255);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin + 12, y, pageWidth - (margin + 12) * 2, 8, 2, 2, 'FD');
  doc.setTextColor(0, 74, 198);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(
    `STATUS: TERVERIFIKASI & TERCATAT ON-CHAIN • ASSET ID: ${work.assetId}`,
    pageWidth / 2,
    y + 5.5,
    { align: 'center' }
  );

  // 4. Detailed Information Section
  y += 14;

  const drawRow = (label: string, value: string, isMono = false) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(70, 80, 95);
    doc.text(label, margin + 12, y);

    doc.setFont(isMono ? 'courier' : 'helvetica', isMono ? 'bold' : 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);

    const maxWidth = pageWidth - margin * 2 - 75;
    const lines = doc.splitTextToSize(value, maxWidth);
    doc.text(lines, margin + 65, y);

    y += Math.max(lines.length * 4.5, 6);
  };

  // Grey separator line
  const drawDivider = () => {
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin + 12, y - 2, pageWidth - margin - 12, y - 2);
    y += 2;
  };

  drawRow('Nama Pencipta / Pemegang Hak', creator.name);
  drawRow('Akun Terverifikasi', creator.email);
  if (creator.walletAddress) {
    drawRow('Creator Wallet Address', creator.walletAddress, true);
  }
  drawDivider();

  drawRow('Judul Ciptaan', work.title);
  drawRow('Jenis / Kategori Ciptaan', work.categoryLabel || work.category);
  drawRow('Waktu Pencatatan Resmi', work.date);
  drawRow('Model Lisensi Terpilih', work.licenseType === 'commercial' ? `Komersial Berbayar (Rp ${new Intl.NumberFormat('id-ID').format(work.tariff)})` : work.licenseType === 'free' ? 'Bebas dengan Atribusi (CC-BY)' : 'Eksklusif / Negosiasi');
  drawRow('Teknologi Proteksi', work.technology);
  drawDivider();

  // Cryptographic Hash Box
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(70, 80, 95);
  doc.text('Sidik Jari SHA-256 (Fingerprint)', margin + 12, y);
  y += 4;

  doc.setFillColor(245, 247, 250);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin + 12, y, pageWidth - (margin + 12) * 2, 9, 1.5, 1.5, 'FD');

  doc.setFont('courier', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(0, 74, 198);
  doc.text(work.sha256, pageWidth / 2, y + 5.8, { align: 'center' });
  y += 14;

  // Description quote box
  if (work.description) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(70, 80, 95);
    doc.text('Deskripsi Orisinalitas Ciptaan:', margin + 12, y);
    y += 4;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(75, 85, 99);
    const descLines = doc.splitTextToSize(work.description, pageWidth - (margin + 12) * 2 - 4);
    doc.text(descLines.slice(0, 3), margin + 14, y);
    y += Math.min(descLines.length, 3) * 3.8 + 4;
  }

  // 5. Legal Ground Section (Dasar Hukum Indonesia)
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin + 12, y, pageWidth - (margin + 12) * 2, 26, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Kekuatan Pembuktian & Landasan Hukum Sah Republik Indonesia:', margin + 15, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(71, 85, 105);
  doc.text(
    '1. UU Hak Cipta (UU No. 28/2014): Perlindungan hak cipta timbul secara otomatis (deklaratif) sejak karya diwujudkan.',
    margin + 15,
    y + 10
  );
  doc.text(
    '2. UU ITE (UU No. 11/2008 jo UU No. 1/2024): Informasi & Sertifikat Elektronik diakui sebagai alat bukti hukum sah di pengadilan.',
    margin + 15,
    y + 15
  );
  doc.text(
    '3. UU P2SK (UU No. 4/2023): Pengakuan integritas aset digital terdesentralisasi dan perlindungan hak ekonomi kreator.',
    margin + 15,
    y + 20
  );

  y += 31;

  // 6. Signature & Verification Stamps Footer
  const footerY = y + 2;

  // Left Stamp: QR Code Placeholder & Verification info
  doc.setDrawColor(0, 74, 198);
  doc.setLineWidth(0.4);
  doc.rect(margin + 14, footerY, 20, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.5);
  doc.setTextColor(0, 74, 198);
  doc.text('VERIFIKASI', margin + 24, footerY + 8, { align: 'center' });
  doc.text('FORENSIK', margin + 24, footerY + 12, { align: 'center' });
  doc.text('CREATIVETRUST', margin + 24, footerY + 16, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Pindai secara daring:', margin + 37, footerY + 7);
  doc.setTextColor(0, 74, 198);
  doc.setFont('helvetica', 'bold');
  doc.text(`https://creativetrust.id/verify/${work.assetId}`, margin + 37, footerY + 12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Pencatatan kriptografis tidak dapat diubah (immutable).', margin + 37, footerY + 17);

  // Right Stamp: Seal of Authenticity
  const rightX = pageWidth - margin - 50;
  doc.setFillColor(0, 74, 198);
  doc.circle(rightX + 18, footerY + 10, 9, 'S');
  doc.circle(rightX + 18, footerY + 10, 8, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.5);
  doc.setTextColor(0, 74, 198);
  doc.text('SEKRETARIAT', rightX + 18, footerY + 8, { align: 'center' });
  doc.text('KEDAULATAN AI', rightX + 18, footerY + 11, { align: 'center' });
  doc.text('INDONESIA', rightX + 18, footerY + 14, { align: 'center' });

  // Bottom Notice
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'Dokumen ini dicetak secara digital dan sah tanpa tanda tangan basah berdasarkan Pasal 5 ayat (1) UU ITE.',
    pageWidth / 2,
    pageHeight - margin - 4,
    { align: 'center' }
  );

  const cleanFileName = `Sertifikat_Hak_Cipta_${work.assetId}.pdf`;

  // Directly trigger download on user's device/HP
  doc.save(cleanFileName);

  // Also return blob for Google Drive upload
  const blob = doc.output('blob');
  return { blob, fileName: cleanFileName };
};
