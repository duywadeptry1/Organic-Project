import { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  XCircle,
  Building,
  DollarSign,
  AlertCircle,
  Copy,
  Check,
  Search,
  RefreshCw,
  Send,
  ExternalLink,
} from 'lucide-react';
import {
  useGetAllWithdrawalsQuery,
  useApproveWithdrawalMutation,
  useRejectWithdrawalMutation,
} from '../slices/farmApiSlice';

function AdminWithdrawalsPage() {
  const { data: withdrawals, isLoading, error, refetch, isFetching } = useGetAllWithdrawalsQuery();
  const [approveWithdrawal, { isLoading: isApproving }] = useApproveWithdrawalMutation();
  const [rejectWithdrawal, { isLoading: isRejecting }] = useRejectWithdrawalMutation();

  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'
  const [copiedId, setCopiedId] = useState(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');
  const [actionErrorMsg, setActionErrorMsg] = useState('');

  const handleCopy = (text, id) => {
    if (typeof window !== 'undefined' && window.navigator?.clipboard) {
      window.navigator.clipboard.writeText(text);
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleApprove = async (id, brand, amount) => {
    setActionSuccessMsg('');
    setActionErrorMsg('');
    const confirmed = window.confirm(
      `Confirm that you have transferred $${Number(amount).toFixed(2)} to ${brand}'s bank account?`
    );
    if (!confirmed) return;

    try {
      const res = await approveWithdrawal({
        id,
        adminNotes: 'Confirmed money sent via Bank Transfer by Admin',
      }).unwrap();
      setActionSuccessMsg(
        res?.message || `Payout of $${Number(amount).toFixed(2)} for ${brand} marked as approved & paid!`
      );
      refetch();
      setTimeout(() => setActionSuccessMsg(''), 4000);
    } catch (err) {
      setActionErrorMsg(err?.data?.message || err?.error || 'Failed to approve payout request.');
    }
  };

  const handleReject = async (id, brand, amount) => {
    setActionSuccessMsg('');
    setActionErrorMsg('');
    const reason = window.prompt(
      `Enter reason for rejecting ${brand}'s withdrawal request of $${Number(amount).toFixed(2)} (money will be refunded to farm balance):`,
      'Incorrect bank details or pending invoice verification'
    );
    if (!reason) return;

    try {
      const res = await rejectWithdrawal({
        id,
        adminNotes: reason,
      }).unwrap();
      setActionSuccessMsg(
        res?.message || `Payout request rejected and $${Number(amount).toFixed(2)} returned to ${brand} balance.`
      );
      refetch();
      setTimeout(() => setActionSuccessMsg(''), 4000);
    } catch (err) {
      setActionErrorMsg(err?.data?.message || err?.error || 'Failed to reject payout request.');
    }
  };

  const allItems = withdrawals || [];
  const pendingCount = allItems.filter((w) => w.status === 'PENDING').length;
  const pendingTotal = allItems
    .filter((w) => w.status === 'PENDING')
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const filteredItems = allItems.filter((w) => {
    if (filterStatus === 'ALL') return true;
    return w.status === filterStatus;
  });

  return (
    <div className="bg-[#FDFBF7] dark:bg-stone-950 min-h-screen py-8 sm:py-10 text-stone-800 dark:text-stone-100 transition-colors duration-200">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-widest bg-green-50 dark:bg-green-950/50 px-3 py-1 rounded-full border border-green-200/30 dark:border-green-800/40">
              Admin Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-50 tracking-tight mt-2">
              Farm Payout & Withdrawal Requests
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
              Review requests from farm partners, copy bank transfer information, and confirm payouts.
            </p>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="btn btn-sm btn-outline border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Notifications */}
        {actionSuccessMsg && (
          <div className="bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 p-4 rounded-2xl mb-6 text-xs font-bold flex items-center gap-2.5 shadow-xs animate-in fade-in duration-200">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {actionErrorMsg && (
          <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-800 dark:text-red-200 p-4 rounded-2xl mb-6 text-xs font-bold flex items-center gap-2.5 shadow-xs animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{actionErrorMsg}</span>
          </div>
        )}

        {/* Overview Metric Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200/80 dark:border-stone-800 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Pending Admin Payouts
            </span>
            <div className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-50 mt-2">
              ${pendingTotal.toFixed(2)}
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {pendingCount} requests awaiting wire transfer
            </p>
          </div>

          <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200/80 dark:border-stone-800 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Notification Recipient
            </span>
            <div className="text-sm font-bold text-stone-900 dark:text-stone-100 mt-2 flex items-center gap-1.5 truncate">
              <Send className="w-4 h-4 text-green-600 shrink-0" />
              1904duy@gmail.com
            </div>
            <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-0.5">
              Alerts dispatched automatically upon submission
            </p>
          </div>

          <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200/80 dark:border-stone-800 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Total Processed
            </span>
            <div className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-50 mt-2">
              {allItems.length}
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              All-time farm withdrawal transactions
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <button
            type="button"
            onClick={() => setFilterStatus('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              filterStatus === 'ALL'
                ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:border-stone-400'
            }`}
          >
            All Requests ({allItems.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('PENDING')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              filterStatus === 'PENDING'
                ? 'bg-amber-600 text-white'
                : 'bg-white dark:bg-stone-900 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60 hover:bg-amber-50 dark:hover:bg-stone-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Pending Payout ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('APPROVED')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              filterStatus === 'APPROVED'
                ? 'bg-green-600 text-white'
                : 'bg-white dark:bg-stone-900 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/60 hover:bg-green-50 dark:hover:bg-stone-800'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Approved / Paid ({allItems.filter((w) => w.status === 'APPROVED').length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('REJECTED')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              filterStatus === 'REJECTED'
                ? 'bg-red-600 text-white'
                : 'bg-white dark:bg-stone-900 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60 hover:bg-red-50 dark:hover:bg-stone-800'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            Rejected ({allItems.filter((w) => w.status === 'REJECTED').length})
          </button>
        </div>

        {/* Requests Table */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-7 border border-stone-200/80 dark:border-stone-800 shadow-xs transition-colors">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs p-6 rounded-2xl border border-red-200 dark:border-red-900/60 text-center">
              {error?.data?.message || error.error || 'Failed to load withdrawal requests'}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-16 text-stone-400 dark:text-stone-500">
              <p className="text-sm font-bold text-stone-700 dark:text-stone-300">
                No payout requests in this filter
              </p>
              <p className="text-xs text-stone-400 dark:text-stone-500 mt-1">
                Withdrawal requests submitted by farm partners will be listed here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-stone-100 dark:border-stone-800 text-stone-400 dark:text-stone-500 font-bold uppercase tracking-wider">
                    <th className="pb-3 pr-3">Farm / Brand</th>
                    <th className="pb-3 px-3">Amount</th>
                    <th className="pb-3 px-3">Bank Transfer Details</th>
                    <th className="pb-3 px-3">Date</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 pl-3 text-right">Admin Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {filteredItems.map((w) => {
                    const isPending = w.status === 'PENDING';
                    const accNum = w.bankInfo?.accountNumber || '';

                    return (
                      <tr key={w._id} className="hover:bg-stone-50/70 dark:hover:bg-stone-800/40 transition">
                        {/* Brand & User */}
                        <td className="py-4 pr-3">
                          <div className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                            {w.brand}
                          </div>
                          <div className="text-[11px] text-stone-500 dark:text-stone-400">
                            {w.farmUser?.email || 'Farm Account'}
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="py-4 px-3 font-black text-stone-900 dark:text-stone-100 text-base">
                          ${Number(w.amount).toFixed(2)}
                        </td>

                        {/* Bank Details */}
                        <td className="py-4 px-3 max-w-xs">
                          <div className="font-bold text-stone-800 dark:text-stone-200">
                            {w.bankInfo?.bankName}
                          </div>
                          <div className="flex items-center gap-1.5 font-mono text-[11px] text-stone-600 dark:text-stone-300 mt-0.5">
                            <span>Acc: {accNum}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(accNum, w._id)}
                              className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition"
                              title="Copy account number"
                            >
                              {copiedId === w._id ? (
                                <Check className="w-3.5 h-3.5 text-green-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                          <div className="text-[11px] text-stone-500 dark:text-stone-400">
                            Holder: {w.bankInfo?.accountName}
                          </div>
                          {w.bankInfo?.note && (
                            <div className="text-[10px] text-amber-700 dark:text-amber-400 italic mt-0.5">
                              &ldquo;{w.bankInfo.note}&rdquo;
                            </div>
                          )}
                        </td>

                        {/* Date */}
                        <td className="py-4 px-3 text-stone-500 dark:text-stone-400">
                          {new Date(w.createdAt || w.requestedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>

                        {/* Status */}
                        <td className="py-4 px-3">
                          {isPending ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold text-[10px] border border-amber-200/50 dark:border-amber-800/50">
                              <Clock className="w-3 h-3" />
                              Pending Transfer
                            </span>
                          ) : w.status === 'APPROVED' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 dark:bg-green-950/60 text-green-700 dark:text-green-400 font-bold text-[10px] border border-green-200/50 dark:border-green-800/50">
                              <CheckCircle2 className="w-3 h-3" />
                              Paid / Transferred
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 font-bold text-[10px] border border-red-200/50 dark:border-red-800/50">
                              <XCircle className="w-3 h-3" />
                              Rejected
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 pl-3 text-right">
                          {isPending ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleApprove(w._id, w.brand, w.amount)}
                                disabled={isApproving || isRejecting}
                                className="btn btn-xs bg-green-600 hover:bg-green-700 text-white border-none rounded-lg font-bold shadow-xs cursor-pointer flex items-center gap-1"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Confirm Money Sent
                              </button>
                              <button
                                type="button"
                                onClick={() => handleReject(w._id, w.brand, w.amount)}
                                disabled={isApproving || isRejecting}
                                className="btn btn-xs btn-outline border-red-300 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg font-semibold cursor-pointer"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-stone-400 italic">
                              {w.adminNotes || 'Completed'}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default AdminWithdrawalsPage;
