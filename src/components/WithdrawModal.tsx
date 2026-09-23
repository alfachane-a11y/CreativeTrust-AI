import React, { useState } from 'react';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
  onWithdrawSuccess: (amount: number, bank: string) => void;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  availableBalance,
  onWithdrawSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'bca' | 'qris'>('bca');
  const [withdrawAmount, setWithdrawAmount] = useState<number>(availableBalance);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleQuickAmount = (amt: number) => {
    setWithdrawAmount(Math.min(amt, availableBalance));
  };

  const handleProceed = () => {
    if (withdrawAmount <= 0 || withdrawAmount > availableBalance) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      onWithdrawSuccess(
        withdrawAmount,
        selectedMethod === 'bca' ? 'BCA •••• 8821' : 'QRIS Dompet Digital'
      );
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    }, 1500);
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-surface-container-lowest max-w-sm w-full rounded-2xl p-5 shadow-2xl border border-surface-container flex flex-col gap-4 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-1 rounded-full transition-colors"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        {/* Title */}
        <div className="flex flex-col pr-6">
          <div className="flex items-center gap-1.5 text-secondary">
            <span className="material-symbols-outlined text-lg">payments</span>
            <span className="font-label-sm font-bold uppercase tracking-wider">
              Pencairan Dana Royalti
            </span>
          </div>
          <h3 className="font-headline-sm text-on-surface font-extrabold mt-0.5">
            Tarik Saldo ke Rekening
          </h3>
        </div>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-6 gap-3 text-center">
            <div className="w-16 h-16 rounded-full bg-secondary-container/50 text-secondary flex items-center justify-center animate-bounce">
              <span className="material-symbols-outlined text-3xl">check_circle</span>
            </div>
            <div className="flex flex-col">
              <h4 className="font-headline-sm text-on-surface font-bold">
                Pencairan Berhasil!
              </h4>
              <p className="font-body-sm text-on-surface-variant mt-1">
                Rp {formatRupiah(withdrawAmount)} telah dikirimkan ke{' '}
                {selectedMethod === 'bca' ? 'BCA •••• 8821' : 'QRIS'}.
              </p>
              <span className="text-[10px] font-mono text-primary mt-2 bg-primary-fixed/40 px-2 py-0.5 rounded-full inline-block">
                TX: #DISBURSE-88492-IDN
              </span>
            </div>
          </div>
        ) : (
          <>
            {/* Balance Badge */}
            <div className="bg-surface-container-low p-3 rounded-xl flex items-center justify-between">
              <span className="font-label-sm text-on-surface-variant">
                Saldo Tersedia
              </span>
              <span className="font-headline-sm text-primary font-black">
                Rp {formatRupiah(availableBalance)}
              </span>
            </div>

            {/* Rekening Tujuan */}
            <div className="flex flex-col gap-2">
              <span className="font-label-sm text-on-surface font-bold">
                Pilih Rekening Tujuan
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('bca')}
                  className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                    selectedMethod === 'bca'
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                      : 'border-surface-container bg-surface-container-lowest'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm font-bold text-on-surface">
                      BCA Virtual
                    </span>
                    <span
                      className={`material-symbols-outlined text-sm ${
                        selectedMethod === 'bca' ? 'text-primary' : 'text-outline-variant'
                      }`}
                    >
                      {selectedMethod === 'bca' ? 'radio_button_checked' : 'radio_button_unchecked'}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-on-surface-variant">
                    •••• 8821
                  </span>
                  <span className="font-body-sm text-[10px] text-secondary font-medium">
                    Instan (0 Detik)
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('qris')}
                  className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                    selectedMethod === 'qris'
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                      : 'border-surface-container bg-surface-container-lowest'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm font-bold text-on-surface">
                      QRIS / E-Wallet
                    </span>
                    <span
                      className={`material-symbols-outlined text-sm ${
                        selectedMethod === 'qris' ? 'text-primary' : 'text-outline-variant'
                      }`}
                    >
                      {selectedMethod === 'qris' ? 'radio_button_checked' : 'radio_button_unchecked'}
                    </span>
                  </div>
                  <span className="font-body-sm text-[11px] text-on-surface-variant">
                    GoPay / OVO / Dana
                  </span>
                  <span className="font-body-sm text-[10px] text-secondary font-medium">
                    Bebas Admin
                  </span>
                </button>
              </div>
            </div>

            {/* Input Nominal */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-sm text-on-surface font-bold">
                Jumlah Penarikan (Rp)
              </label>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-container-low border border-surface-container">
                <span className="font-label-md text-on-surface font-bold">Rp</span>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  max={availableBalance}
                  min={10000}
                  step={10000}
                  className="w-full bg-transparent font-headline-sm text-on-surface font-bold focus:outline-none"
                />
              </div>

              {/* Quick Select Buttons */}
              <div className="flex gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => handleQuickAmount(100000)}
                  className="flex-1 py-1 rounded-lg bg-surface-container text-on-surface-variant hover:bg-surface-container-highest text-[11px] font-semibold transition-colors"
                >
                  100rb
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAmount(500000)}
                  className="flex-1 py-1 rounded-lg bg-surface-container text-on-surface-variant hover:bg-surface-container-highest text-[11px] font-semibold transition-colors"
                >
                  500rb
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAmount(availableBalance)}
                  className="flex-1 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-[11px] font-bold transition-colors"
                >
                  Tarik Semua
                </button>
              </div>
            </div>

            {/* Fee Note */}
            <div className="flex items-center justify-between text-on-surface-variant text-[11px] pt-1 border-t border-surface-container">
              <span>Biaya Penarikan (Gas Smart Contract)</span>
              <span className="text-secondary font-bold">Gratis (Rp 0)</span>
            </div>

            {/* Action Submit */}
            <button
              type="button"
              disabled={isProcessing || withdrawAmount <= 0 || withdrawAmount > availableBalance}
              onClick={handleProceed}
              className="w-full h-12 bg-secondary text-on-secondary font-label-lg font-bold rounded-xl flex items-center justify-center gap-2 shadow-md hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <span className="material-symbols-outlined text-xl animate-spin">
                    progress_activity
                  </span>
                  <span>Memproses Smart Contract...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-xl">payments</span>
                  <span>Cairkan Sekarang</span>
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
