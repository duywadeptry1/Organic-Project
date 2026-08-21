import { Link } from 'react-router-dom';
import { useGetOrdersQuery } from '../slices/ordersApiSlice';

function OrderListPage() {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-10">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        
        <div className="mb-8">
          <span className="text-xs font-bold text-green-700 uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full">
            Admin Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight mt-2">
            Store Orders Management
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Review customer payments, fulfillment progress, and shipping addresses.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 text-xs p-6 rounded-3xl border border-red-200 text-center">
            {error?.data?.message || error.error || 'Failed to fetch customer orders'}
          </div>
        ) : !orders || orders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xs border border-stone-200/80 p-12 text-center">
            <p className="text-stone-500 text-sm">No orders recorded in the system yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xs border border-stone-200/80 p-6 sm:p-7 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-100 text-stone-400 font-bold uppercase tracking-wider">
                  <th className="pb-3 pr-3">Order ID</th>
                  <th className="pb-3 px-3">Customer</th>
                  <th className="pb-3 px-3">Date</th>
                  <th className="pb-3 px-3">Total</th>
                  <th className="pb-3 px-3">Payment</th>
                  <th className="pb-3 px-3">Fulfillment</th>
                  <th className="pb-3 pl-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-stone-50/60 transition">
                    <td className="py-4 pr-3 font-mono font-bold text-stone-900">
                      #{order._id.substring(0, 8)}...
                    </td>
                    <td className="py-4 px-3 font-medium text-stone-800">
                      {order.user?.name || 'Customer'}
                    </td>
                    <td className="py-4 px-3 text-stone-500">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-4 px-3 font-black text-stone-900">
                      ${(order.totalPrice || 0).toFixed(2)}
                    </td>
                    <td className="py-4 px-3">
                      {order.isPaid ? (
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 font-bold text-[10px]">
                          Paid {new Date(order.paidAt).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 font-bold text-[10px]">
                          Unpaid
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-3">
                      {order.isDelivered ? (
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 font-bold text-[10px]">
                          Delivered
                        </span>
                      ) : (
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold text-[10px]">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="py-4 pl-3 text-right whitespace-nowrap">
                      <Link 
                        to={`/order/${order._id}`}
                        className="inline-block bg-stone-900 hover:bg-stone-800 text-white font-bold py-1.5 px-3 rounded-lg text-xs transition"
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
