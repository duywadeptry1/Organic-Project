import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Wallet,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Building,
  CreditCard,
  Send,
  Sprout,
  ArrowUpRight,
  RefreshCw,
  DollarSign,
  ShieldCheck,
  ChevronRight,
  PackageCheck,
  X,
} from 'lucide-react';
import {
  useGetFarmWalletQuery,
  useRequestWithdrawalMutation,
} from '../slices/farmApiSlice';

function FarmDashboardPage() {
  const { userInfo } = useSelector((state) => state.auth);
  const isAdmin = userInfo?.isAdmin || userInfo?.role === 'admin';

  // Selected brand for inspection (default to user's brand or 'BerryField')
  const [selectedBrand, setSelectedBrand] = useState(
    userInfo?.brand || (isAdmin ? 'BerryField' : 'Organi Farm')
  );

  const {
    data: walletData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetFarmWalletQuery(selectedBrand);

  const [requestWithdrawal, { isLoading: isSubmittingWithdrawal }] = useRequestWithdrawalMutation();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [note, setNote] = useState('');
  const [modalSuccessMsg, setModalSuccessMsg] = useState('');
  const [modalErrorMsg, setModalErrorMsg] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState('ledger'); // 'ledger' | 'withdrawals'

  // Prepopulate bank info from user profile or wallet data
  useEffect(() => {
    const savedBank = userInfo?.bankInfo || walletData?.userBankInfo;
    if (savedBank) {
      if (savedBank.bankName && !bankName) setBankName(savedBank.bankName);
      if (savedBank.accountNumber && !accountNumber) setAccountNumber(savedBank.accountNumber);
      if (savedBank.accountName && !accountName) setAccountName(savedBank.accountName);
      if (savedBank.routingNumber && !routingNumber) setRoutingNumber(savedBank.routingNumber);
    }
  }, [userInfo, walletData, bankName, accountNumber, accountName, routingNumber]);

  const wallet = walletData?.wallet || {};
  const transactions = wallet.transactions || [];
  const withdrawals = walletData?.withdrawals || [];
  const availableBrands = walletData?.availableBrands || [
    'BerryField',
    'Organi Farm',
    'Green Earth',
    'Orchard Gold',
    'SunnyMeadow',
    'Artisan Bakery',
  ];

  const currentBalance = Number(wallet.balance || 0);
  const totalEarned = Number(wallet.totalEarned || 0);
  const pendingWithdrawal = Number(wallet.pendingWithdrawal || 0);
  const totalWithdrawn = Number(wallet.totalWithdrawn || 0);

  // Filter delivered earning items
  const deliveredSales = transactions.filter((t) => t.type === 'DELIVERY_EARNING');

  const openWithdrawModal = () => {
    setModalSuccessMsg('');
    setModalErrorMsg('');
    setWithdrawAmount('');
    setIsModalOpen(true);
  };

  const handleMaxAmount = () => {
    setWithdrawAmount(currentBalance > 0 ? currentBalance.toFixed(2) : '0.00');
  };

  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    setModalErrorMsg('');
    setModalSuccessMsg('');

    const numAmount = Number(withdrawAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setModalErrorMsg('Please enter a valid amount greater than $0.00');
      return;
    }

    if (numAmount > currentBalance) {
      setModalErrorMsg(`Requested amount ($${numAmount.toFixed(2)}) exceeds available balance ($${currentBalance.toFixed(2)}).`);
      return;
    }

    if (!bankName.trim() || !accountNumber.trim() || !accountName.trim()) {
      setModalErrorMsg('Please fill in your Bank Name, Account Number, and Account Holder Name.');
      return;
    }

    try {
      const res = await requestWithdrawal({
        brand: selectedBrand,
        amount: numAmount,
        bankInfo: {
          bankName: bankName.trim(),
          accountNumber: accountNumber.trim(),
          accountName: accountName.trim(),
          routingNumber: routingNumber.trim(),
          note: note.trim(),
        },
      }).unwrap();

      setModalSuccessMsg(
        res?.message ||
          'Withdrawal request dispatched to 1904duy@gmail.com! Admin will wire the funds and confirm.'
      );
      setWithdrawAmount('');
      refetch();

      setTimeout(() => {
        setIsModalOpen(false);
        setModalSuccessMsg('');
      }, 2500);
    } catch (err) {
      setModalErrorMsg(err?.data?.message || err?.error || 'Failed to submit withdrawal request.');
    }
  };

  return (
    <div className="bg-[#FDFBF7] dark:bg-stone-950 min-h-screen py-8 sm:py-12 text-stone-800 dark:text-stone-100 transition-colors duration-200">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        
        {/* Top Farm Brand Hero Banner */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200/80 dark:border-stone-800 shadow-xs mb-8 transition-colors duration-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-green-600 dark:bg-green-700 flex items-center justify-center text-white shrink-0 shadow-md">
                <Sprout className="w-8 h-8" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-[11px] font-black uppercase tracking-wider bg-green-50 dark:bg-green-950/60 text-green-700 dark:text-green-400 border border-green-200/40 dark:border-green-800/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Organic Producer
                  </span>
                  {isAdmin && (
                    <span className="text-[11px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                      Admin Oversight Mode
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-50 tracking-tight flex items-center gap-2">
                  {selectedBrand} Portal
                </h1>
                <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
                  Automated delivery earnings ledger & withdrawal payout management.
                </p>
              </div>
            </div>

            {/* Right Controls: Brand Switcher (for Admins) & Quick Refresh */}
            <div className="flex flex-wrap items-center gap-3">
              {isAdmin && (
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-stone-600 dark:text-stone-400">
                    Inspect Farm:
                  </label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="select select-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-semibold text-stone-800 dark:text-stone-100"
                  >
                    {availableBrands.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                type="button"
                onClick={() => refetch()}
                disabled={isFetching}
                className="btn btn-sm btn-ghost border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 text-stone-700 dark:text-stone-300"
                title="Refresh real-time balance"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
                <span>Sync</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Core Financial KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
          
          {/* 1. Available Balance with Withdraw Button */}
          <div className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-3xl p-5 sm:p-6 shadow-md relative overflow-hidden flex flex-col justify-between">
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-green-100">
                  Available Balance
                </span>
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="text-3xl font-black tracking-tight mt-3">
                ${currentBalance.toFixed(2)}
              </div>
              <p className="text-[11px] text-green-100/80 mt-1">
                Delivered produce ready to payout
              </p>
            </div>

            <button
              type="button"
              onClick={openWithdrawModal}
              disabled={currentBalance <= 0}
              className="mt-4 w-full bg-white hover:bg-green-50 active:bg-green-100 text-green-800 font-black text-xs py-2.5 px-4 rounded-xl shadow-xs transition duration-150 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-3.5 h-3.5" />
              Request Withdrawal
            </button>
          </div>

          {/* 2. Lifetime Total Earned */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200/80 dark:border-stone-800 shadow-xs flex flex-col justify-between transition-colors">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  Total Earned
                </span>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-stone-900 dark:text-stone-50 tracking-tight mt-3">
                ${totalEarned.toFixed(2)}
              </div>
              <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-1">
                Cumulative revenue from delivered orders
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-600 dark:text-stone-400">
              <span>Delivered Units</span>
              <span className="font-bold text-stone-900 dark:text-stone-100">
                {deliveredSales.reduce((acc, curr) => acc + (curr.qty || 1), 0)} items
              </span>
            </div>
          </div>

          {/* 3. Pending Withdrawals */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200/80 dark:border-stone-800 shadow-xs flex flex-col justify-between transition-colors">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  Pending Payout
                </span>
                <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-amber-600 dark:text-amber-400 tracking-tight mt-3">
                ${pendingWithdrawal.toFixed(2)}
              </div>
              <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-1">
                Dispatched to admin (1904duy@gmail.com)
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-600 dark:text-stone-400">
              <span>Pending Requests</span>
              <span className="font-bold text-amber-700 dark:text-amber-400">
                {withdrawals.filter((w) => w.status === 'PENDING').length} active
              </span>
            </div>
          </div>

          {/* 4. Completed Payouts */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200/80 dark:border-stone-800 shadow-xs flex flex-col justify-between transition-colors">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  Total Paid Out
                </span>
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-stone-900 dark:text-stone-50 tracking-tight mt-3">
                ${totalWithdrawn.toFixed(2)}
              </div>
              <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-1">
                Successfully wired to farm bank account
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-600 dark:text-stone-400">
              <span>Completed Payouts</span>
              <span className="font-bold text-blue-700 dark:text-blue-400">
                {withdrawals.filter((w) => w.status === 'APPROVED').length} completed
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-stone-200 dark:border-stone-800 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('ledger')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'ledger'
                ? 'bg-green-600 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <PackageCheck className="w-4 h-4" />
            Delivered Produce Sales ({deliveredSales.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('withdrawals')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'withdrawals'
                ? 'bg-green-600 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Payout & Withdrawal History ({withdrawals.length})
          </button>
        </div>

        {/* Tab 1 Content: Delivered Produce Sales Ledger */}
        {activeTab === 'ledger' && (
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-7 border border-stone-200/80 dark:border-stone-800 shadow-xs transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-black text-stone-900 dark:text-stone-50">
                  Delivered Items Revenue Ledger
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  Money is automatically added to your balance as soon as an order is delivered to the customer.
                </p>
              </div>
              <div className="text-xs font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/60 px-3 py-1.5 rounded-xl border border-green-200/40 dark:border-green-800/40">
                100% Commission Credited to Farm
              </div>
            </div>

            {deliveredSales.length === 0 ? (
              <div className="text-center py-16 text-stone-400 dark:text-stone-500">
                <Sprout className="w-12 h-12 mx-auto mb-3 opacity-40 text-green-600" />
                <p className="text-sm font-bold text-stone-700 dark:text-stone-300">
                  No delivered produce recorded yet
                </p>
                <p className="text-xs max-w-md mx-auto mt-1 text-stone-500 dark:text-stone-400">
                  When customers purchase your {selectedBrand} items and the delivery staff marks the order as delivered, earnings will immediately appear here and increase your available balance.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-stone-100 dark:border-stone-800 text-stone-400 dark:text-stone-500 font-bold uppercase tracking-wider">
                      <th className="pb-3 pr-3">Product</th>
                      <th className="pb-3 px-3">Order Ref</th>
                      <th className="pb-3 px-3">Customer / Destination</th>
                      <th className="pb-3 px-3">Date Delivered</th>
                      <th className="pb-3 px-3 text-center">Qty</th>
                      <th className="pb-3 px-3 text-right">Unit Price</th>
                      <th className="pb-3 pl-3 text-right">Credited Earnings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                    {deliveredSales.map((entry, idx) => (
                      <tr key={entry._id || idx} className="hover:bg-stone-50/70 dark:hover:bg-stone-800/40 transition">
                        <td className="py-3.5 pr-3">
                          <div className="flex items-center gap-3">
                            {entry.productImage && (
                              <img
                                src={entry.productImage}
                                alt={entry.productName}
                                className="w-10 h-10 rounded-xl object-cover bg-stone-100 dark:bg-stone-800 shrink-0"
                              />
                            )}
                            <div>
                              <p className="font-bold text-stone-900 dark:text-stone-100">
                                {entry.productName || 'Organic Produce'}
                              </p>
                              <span className="text-[10px] text-green-700 dark:text-green-400 font-medium">
                                Delivered & Verified
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 font-mono font-bold text-stone-700 dark:text-stone-300">
                          {entry.orderNumber ? `#${entry.orderNumber}` : '—'}
                        </td>
                        <td className="py-3.5 px-3 text-stone-600 dark:text-stone-400 max-w-44 truncate">
                          {entry.customerName || 'Customer'}
                        </td>
                        <td className="py-3.5 px-3 text-stone-500 dark:text-stone-400">
                          {entry.createdAt
                            ? new Date(entry.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })
                            : 'Delivered'}
                        </td>
                        <td className="py-3.5 px-3 text-center font-bold text-stone-800 dark:text-stone-200">
                          ×{entry.qty || 1}
                        </td>
                        <td className="py-3.5 px-3 text-right text-stone-600 dark:text-stone-400">
                          ${Number(entry.price || 0).toFixed(2)}
                        </td>
                        <td className="py-3.5 pl-3 text-right font-black text-green-600 dark:text-green-400 text-sm">
                          +${Number(entry.amount || 0).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2 Content: Withdrawal Requests History */}
        {activeTab === 'withdrawals' && (
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-7 border border-stone-200/80 dark:border-stone-800 shadow-xs transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-black text-stone-900 dark:text-stone-50">
                  Withdrawal Requests & Payout History
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  When you submit a withdrawal, an alert is sent to <strong>1904duy@gmail.com</strong> for bank transfer processing.
                </p>
              </div>
              <button
                type="button"
                onClick={openWithdrawModal}
                disabled={currentBalance <= 0}
                className="btn btn-sm bg-green-600 hover:bg-green-700 text-white border-none rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                New Withdrawal Request
              </button>
            </div>

            {withdrawals.length === 0 ? (
              <div className="text-center py-16 text-stone-400 dark:text-stone-500">
                <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-40 text-stone-500" />
                <p className="text-sm font-bold text-stone-700 dark:text-stone-300">
                  No withdrawal requests yet
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-sm mx-auto">
                  Your current available balance is ${currentBalance.toFixed(2)}. Click &ldquo;Request Withdrawal&rdquo; to transfer money to your bank account.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-stone-100 dark:border-stone-800 text-stone-400 dark:text-stone-500 font-bold uppercase tracking-wider">
                      <th className="pb-3 pr-3">Date Requested</th>
                      <th className="pb-3 px-3">Amount</th>
                      <th className="pb-3 px-3">Destination Bank Account</th>
                      <th className="pb-3 px-3">Email Notification</th>
                      <th className="pb-3 px-3">Status</th>
                      <th className="pb-3 pl-3 text-right">Admin Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                    {withdrawals.map((w) => (
                      <tr key={w._id} className="hover:bg-stone-50/70 dark:hover:bg-stone-800/40 transition">
                        <td className="py-4 pr-3 text-stone-600 dark:text-stone-400">
                          {new Date(w.createdAt || w.requestedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="py-4 px-3 font-black text-stone-900 dark:text-stone-100 text-sm">
                          ${Number(w.amount).toFixed(2)}
                        </td>
                        <td className="py-4 px-3">
                          <div className="text-stone-800 dark:text-stone-200 font-bold">
                            {w.bankInfo?.bankName}
                          </div>
                          <div className="text-[11px] font-mono text-stone-500 dark:text-stone-400">
                            {w.bankInfo?.accountNumber} ({w.bankInfo?.accountName})
                          </div>
                        </td>
                        <td className="py-4 px-3">
                          <span className="inline-flex items-center gap-1 text-[11px] text-stone-600 dark:text-stone-400">
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                            1904duy@gmail.com
                          </span>
                        </td>
                        <td className="py-4 px-3">
                          {w.status === 'PENDING' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold text-[10px] border border-amber-200/50 dark:border-amber-800/50">
                              <Clock className="w-3 h-3" />
                              Pending Admin Transfer
                            </span>
                          ) : w.status === 'APPROVED' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 dark:bg-green-950/60 text-green-700 dark:text-green-400 font-bold text-[10px] border border-green-200/50 dark:border-green-800/50">
                              <CheckCircle2 className="w-3 h-3" />
                              Paid / Approved
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 font-bold text-[10px] border border-red-200/50 dark:border-red-800/50">
                              <XCircle className="w-3 h-3" />
                              Rejected
                            </span>
                          )}
                        </td>
                        <td className="py-4 pl-3 text-right text-stone-500 dark:text-stone-400 italic">
                          {w.adminNotes || (w.status === 'APPROVED' ? 'Wire transferred' : '—')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Interactive Withdrawal Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-2xl relative">
            
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-green-50 dark:bg-green-950/60 text-green-600 dark:text-green-400 flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-stone-900 dark:text-stone-50">
                  Request Farm Withdrawal
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {selectedBrand} Available Balance: <strong>${currentBalance.toFixed(2)}</strong>
                </p>
              </div>
            </div>

            {/* Email Dispatch Notice */}
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-300 p-3.5 rounded-2xl mb-5 text-xs flex items-start gap-2.5">
              <Send className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Automated Admin Alert Target</p>
                <p className="text-[11px] opacity-90 mt-0.5">
                  Submitting this request will instantly notify <strong>1904duy@gmail.com</strong> so the platform admin can wire the funds to your specified bank account.
                </p>
              </div>
            </div>

            {modalSuccessMsg && (
              <div className="bg-green-50 dark:bg-green-950/60 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 p-3.5 rounded-2xl mb-4 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0" />
                <span>{modalSuccessMsg}</span>
              </div>
            )}

            {modalErrorMsg && (
              <div className="bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-red-800 dark:text-red-200 p-3.5 rounded-2xl mb-4 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                <span>{modalErrorMsg}</span>
              </div>
            )}

            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                    Withdrawal Amount ($ USD)
                  </label>
                  <button
                    type="button"
                    onClick={handleMaxAmount}
                    className="text-[11px] font-bold text-green-600 dark:text-green-400 hover:underline"
                  >
                    Max (${currentBalance.toFixed(2)})
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-stone-400 font-bold">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={currentBalance}
                    placeholder="0.00"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    required
                    className="w-full pl-8 pr-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl text-sm font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                  />
                </div>
              </div>

              {/* Bank Details */}
              <div className="space-y-3 pt-2 border-t border-stone-100 dark:border-stone-800">
                <p className="text-xs font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-stone-500" />
                  Farm Payout Bank Details
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                      Bank Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Chase / Vietcombank"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      required
                      className="w-full px-3 py-2.5 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                      Account Number *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1904-8833-2101"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      required
                      className="w-full px-3 py-2.5 text-xs font-mono bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none focus:border-green-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                      Account Holder Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. BERRYFIELD FARMS LLC"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      required
                      className="w-full px-3 py-2.5 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                      Routing / Swift (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 021000021"
                      value={routingNumber}
                      onChange={(e) => setRoutingNumber(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none focus:border-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                    Payout Note (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Regular payout for August harvest"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none focus:border-green-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-outline border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-2xl flex-1 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingWithdrawal}
                  className="btn bg-green-600 hover:bg-green-700 active:bg-green-800 text-white border-none rounded-2xl flex-1 text-xs font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingWithdrawal ? (
                    <>
                      <div className="animate-spin rounded-full h-3.5 w-3.5 border-t-2 border-b-2 border-white"></div>
                      <span>Sending Alert...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Confirm & Send Alert</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default FarmDashboardPage;
