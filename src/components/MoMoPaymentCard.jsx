import { useState, useEffect } from 'react';
import { 
  QrCode, 
  Copy, 
  Check, 
  Smartphone, 
  Clock, 
  ShieldCheck, 
  ExternalLink, 
  RefreshCw, 
  Info 
} from 'lucide-react';

function MoMoPaymentCard({ order, onPaySuccess, loadingPay }) {
  const [copiedField, setCopiedField] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes countdown

  // MoMo merchant details for P2P
  const momoPhone = '077 6872 085';
  const cleanPhone = momoPhone.replace(/\s/g, '');
  const momoAccountName = 'Pham Minh Duy';
  const memoCode = `ORGANIMOMO ${order?._id ? order._id.slice(-8).toUpperCase() : 'PAYMENT'}`;
  
  // Approximate VND equivalent (1 USD ~ 25,400 VND)
  const amountVND = Math.max(1000, Math.round((Number(order?.totalPrice) || 0) * 25400));

  // Official VietQR (NAPAS 24/7) for MoMo (BIN: 971025)
  // Scannable by MoMo app and all Vietnam banking apps natively
  const p2pQrImageUrl = `https://img.vietqr.io/image/971025-${cleanPhone}-compact2.png?amount=${amountVND}&addInfo=${encodeURIComponent(memoCode)}&accountName=${encodeURIComponent(momoAccountName)}`;

  // 15-minute countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = typeof window !== 'undefined' ? window.setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000) : null;
    return () => {
      if (timer && typeof window !== 'undefined') window.clearInterval(timer);
    };
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopy = (text, fieldName) => {
    if (typeof window !== 'undefined' && window.navigator?.clipboard) {
      window.navigator.clipboard.writeText(text);
    }
    setCopiedField(fieldName);
    if (typeof window !== 'undefined') {
      window.setTimeout(() => {
        setCopiedField(null);
      }, 2000);
    }
  };

  const handleConfirmP2PPayment = () => {
    if (loadingPay) return;
    onPaySuccess({
      id: `MOMO_P2P_${Date.now()}`,
      status: 'SUCCESS',
      update_time: new Date().toISOString(),
      payer: {
        email_address: order?.user?.email || 'customer@organi.com',
      },
    });
  };

  return (
    <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-sm border border-stone-200/80 dark:border-stone-800 overflow-hidden">
      {/* MoMo Branded Header */}
      <div className="bg-linear-to-r from-[#A50064] via-[#C41C77] to-[#D82D8B] p-5 sm:p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white text-[#A50064] flex items-center justify-center font-black text-sm shadow-md tracking-tighter shrink-0">
              momo
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight leading-none">
                  MoMo E-Wallet / VietQR Payment
                </h3>
                <span className="text-[10px] bg-white/20 text-white font-bold px-2 py-0.5 rounded-full uppercase">
                  P2P Instant
                </span>
              </div>
              <p className="text-xs text-pink-100 mt-1">
                Scan QR code to transfer directly via MoMo App or any Banking App 24/7
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 bg-black/20 backdrop-blur-xs px-3 py-1.5 rounded-full text-xs font-mono text-pink-100">
            <Clock className="w-3.5 h-3.5 text-pink-300" />
            <span>Expires in: <strong>{formatTime(timeLeft)}</strong></span>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-7 space-y-6">
        {/* Mobile countdown notice */}
        <div className="sm:hidden flex items-center justify-between bg-pink-50 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-900/50 text-[#A50064] dark:text-pink-300 px-4 py-2 rounded-xl text-xs">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" /> Order reservation time:
          </span>
          <strong className="font-mono text-sm">{formatTime(timeLeft)}</strong>
        </div>

        {/* QR Code & Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* QR Code Column */}
          <div className="md:col-span-5 flex flex-col items-center justify-center">
            <div className="p-2 bg-white rounded-3xl border-2 border-pink-100 dark:border-pink-900/50 shadow-sm overflow-hidden flex items-center justify-center">
              <img
                src={p2pQrImageUrl}
                alt="VietQR MoMo Payment"
                className="w-64 max-w-full h-auto object-contain rounded-2xl"
              />
            </div>

            <div className="mt-3 flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-400 font-semibold text-center">
              <QrCode className="w-4 h-4 text-[#A50064] dark:text-pink-400" />
              <span>Scan using MoMo App or any Banking App</span>
            </div>
          </div>

          {/* Transfer Details Column */}
          <div className="md:col-span-7 space-y-3.5">
            <div className="bg-stone-50 dark:bg-stone-800/80 rounded-2xl p-4 border border-stone-200/70 dark:border-stone-700 space-y-3 text-xs">
              
              {/* Account Receiver */}
              <div className="flex items-center justify-between pb-2 border-b border-stone-200/60 dark:border-stone-700/60">
                <span className="text-stone-500 dark:text-stone-400">Account Holder:</span>
                <span className="font-bold text-stone-900 dark:text-stone-100 text-right">{momoAccountName}</span>
              </div>

              {/* Phone number with copy */}
              <div className="flex items-center justify-between pb-2 border-b border-stone-200/60 dark:border-stone-700/60">
                <span className="text-stone-500 dark:text-stone-400">MoMo Phone Number:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-stone-900 dark:text-stone-100 text-sm">{momoPhone}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(cleanPhone, 'phone')}
                    className="text-[#A50064] dark:text-pink-400 hover:bg-pink-100 dark:hover:bg-pink-950/60 p-1 rounded-md transition cursor-pointer"
                    title="Copy phone number"
                  >
                    {copiedField === 'phone' ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Amount with copy */}
              <div className="flex items-center justify-between pb-2 border-b border-stone-200/60 dark:border-stone-700/60">
                <span className="text-stone-500 dark:text-stone-400">Amount to Pay:</span>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="font-black text-[#A50064] dark:text-pink-400 text-base block">
                      {amountVND.toLocaleString('en-US')} VND
                    </span>
                    <span className="text-[10px] text-stone-400">
                      (~ ${(Number(order?.totalPrice) || 0).toFixed(2)})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(amountVND.toString(), 'amount')}
                    className="text-[#A50064] dark:text-pink-400 hover:bg-pink-100 dark:hover:bg-pink-950/60 p-1 rounded-md transition cursor-pointer"
                    title="Copy amount"
                  >
                    {copiedField === 'amount' ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Transfer Memo with copy */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-stone-500 dark:text-stone-400 block">Transfer Note / Memo:</span>
                  <span className="text-[10px] text-red-500 dark:text-red-400 italic">* Include order memo with transfer</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-2 py-1 rounded-lg border border-amber-200 dark:border-amber-800 text-xs">
                    {memoCode}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(memoCode, 'memo')}
                    className="text-[#A50064] dark:text-pink-400 hover:bg-pink-100 dark:hover:bg-pink-950/60 p-1 rounded-md transition cursor-pointer"
                    title="Copy memo"
                  >
                    {copiedField === 'memo' ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

            </div>

            {/* Quick Step by Step Instructions */}
            <div className="bg-pink-50/50 dark:bg-pink-950/30 border border-pink-100 dark:border-pink-900/40 p-3 rounded-2xl text-[11px] text-stone-600 dark:text-stone-300 space-y-1">
              <div className="font-bold text-[#A50064] dark:text-pink-400 flex items-center gap-1">
                <Info className="w-3.5 h-3.5" /> 2 Ways to Pay:
              </div>
              <p>1. <strong>Scan QR:</strong> Open MoMo App (or any Banking App) &rarr; select <em>Scan QR</em> &rarr; scan the VietQR code above.</p>
              <p>2. <strong>Direct Transfer:</strong> Open MoMo App &rarr; select <em>Transfer Money</em> &rarr; enter phone <strong>{momoPhone}</strong> &rarr; paste the exact order memo.</p>
            </div>

            {/* Copy Feedback notification */}
            {copiedField && (
              <div className="text-[11px] font-bold text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950/60 border border-green-200 dark:border-green-800 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>Copied to clipboard successfully!</span>
              </div>
            )}
          </div>

        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row items-center gap-3">
          <a
            href="momo://app"
            className="w-full sm:w-auto flex-1 bg-pink-100 hover:bg-pink-200 text-[#A50064] font-bold py-3.5 px-5 rounded-2xl text-xs transition flex items-center justify-center gap-2"
          >
            <Smartphone className="w-4 h-4" />
            <span>Open MoMo App</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>

          <button
            type="button"
            onClick={handleConfirmP2PPayment}
            disabled={loadingPay}
            className="w-full sm:w-auto flex-1 bg-linear-to-r from-[#A50064] to-[#D82D8B] hover:brightness-110 text-white font-bold py-3.5 px-6 rounded-2xl text-xs transition shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loadingPay ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Updating Status...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>I Have Completed MoMo Transfer</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}

export default MoMoPaymentCard;
