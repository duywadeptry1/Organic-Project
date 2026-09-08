import { Link } from 'react-router-dom';
import { useGetOrdersQuery } from '../slices/ordersApiSlice';

function OrderListPage() {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <div className="bg-[#FDFBF7] dark:bg-stone-950 min-h-screen py-10 text-stone-800 dark:text-stone-100 transition-colors duration-200">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        
        <div className="mb-8">
          <span className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-widest bg-green-50 dark:bg-green-950/50 px-3 py-1 rounded-full border border-green-200/30 dark:border-green-800/40">
            Admin Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-50 tracking-tight mt-2">
            Store Orders Management
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
            Review customer payments, fulfillment progress, and shipping addresses.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs p-6 rounded-3xl border border-red-200 dark:border-red-900/60 text-center">
            {error?.data?.message || error.error || 'Failed to fetch customer orders'}
          </div>
        ) : !orders || orders.length === 0 ? (
          <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-xs border border-stone-200/80 dark:border-stone-800 p-12 text-center transition-colors duration-200">
            <p className="text-stone-500 dark:text-stone-400 text-sm">No orders recorded in the system yet.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-xs border border-stone-200/80 dark:border-stone-800 p-6 sm:p-7 overflow-x-auto transition-colors duration-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-100 dark:border-stone-800 text-stone-400 dark:text-stone-500 font-bold uppercase tracking-wider">
                  <th className="pb-3 pr-3">Order ID</th>
                  <th className="pb-3 px-3">Customer</th>
                  <th className="pb-3 px-3">Date</th>
                  <th className="pb-3 px-3">Total</th>
                  <th className="pb-3 px-3">Payment</th>
                  <th className="pb-3 px-3">Fulfillment</th>
                  <th className="pb-3 pl-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40 transition">
                    <td className="py-4 pr-3 font-mono font-bold text-stone-900 dark:text-stone-100">
                      #{order._id.substring(0, 8)}...
                    </td>
                    <td className="py-4 px-3 font-medium text-stone-800 dark:text-stone-200">
                      {order.user?.name || 'Customer'}
                    </td>
                    <td className="py-4 px-3 text-stone-500 dark:text-stone-400">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-4 px-3 font-black text-stone-900 dark:text-stone-100">
                      ${(order.totalPrice || 0).toFixed(2)}
                    </td>
                    <td className="py-4 px-3">
                      {order.isPaid ? (
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-400 font-bold text-[10px] border border-green-200/30 dark:border-green-800/40">
                          Paid {new Date(order.paidAt).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 font-bold text-[10px] border border-red-200/30 dark:border-red-800/40">
                          Unpaid
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-3">
                      {order.isDelivered ? (
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-400 font-bold text-[10px] border border-green-200/30 dark:border-green-800/40">
                          Delivered
                        </span>
                      ) : (
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 font-bold text-[10px] border border-amber-200/30 dark:border-amber-800/40">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="py-4 pl-3 text-right whitespace-nowrap">
                      <Link 
                        to={`/order/${order._id}`}
                        className="inline-block bg-stone-900 hover:bg-stone-800 dark:bg-stone-800 dark:hover:bg-stone-700 text-white font-bold py-1.5 px-3 rounded-lg text-xs transition border border-transparent dark:border-stone-700 cursor-pointer"
                      >
                        Inspect &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderListPage;
