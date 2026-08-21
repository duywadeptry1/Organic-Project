import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { 
  useGetOrderDetailsQuery, 
  usePayOrderMutation, 
  useGetPayPalClientIdQuery,
  useDeliverOrderMutation,
} from '../slices/ordersApiSlice';

const OrderDetailsPage = () => {
  const { id: orderId } = useParams();
  const { userInfo } = useSelector((state) => state.auth);

  // Fetch Order Data
  const { data: order, isLoading, error, refetch } = useGetOrderDetailsQuery(orderId);

  // Fetch PayPal mutations and queries
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const { data: paypal, isLoading: loadingPayPal, error: errorPayPal } = useGetPayPalClientIdQuery();

  // Load the PayPal Script dynamically once we have the Client ID
  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal?.clientId) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': paypal.clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };

      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPayPalScript();
        }
      }
    }
  }, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal]);

  // PayPal Success Handler
  const onApprove = async (data, actions) => {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch(); 
      } catch (err) {
        console.error('Payment error:', err);
      }
    });
  };

  const onError = (err) => {
    console.error('PayPal Checkout Error:', err);
  };

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: order.totalPrice,
          },
        },
      ],
    });
  };

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId).unwrap();
      refetch();
    } catch (err) {
      console.error('Failed to mark delivered:', err);
    }
  };

  // Quick simulated payment for testing / demo
  const testPayHandler = async () => {
    try {
      await payOrder({
        orderId,
        details: {
          id: `SIM_${Date.now()}`,
          status: 'COMPLETED',
          update_time: new Date().toISOString(),
          payer: { email_address: userInfo?.email || 'buyer@organi.com' },
        },
      });
      refetch();
    } catch (err) {
      console.error('Simulated payment error:', err);
    }
  };

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-10">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        {isLoading ? (
          <div className="flex justify-center items-center h-80">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-8 rounded-3xl text-center max-w-lg mx-auto">
            <h2 className="text-xl font-bold mb-2">Order Not Found</h2>
            <p className="text-sm text-red-600 mb-4">{error?.data?.message || error.error || 'Failed to load order.'}</p>
            <Link to="/profile" className="inline-block bg-stone-900 text-white font-bold py-2.5 px-6 rounded-xl text-xs hover:bg-stone-800">
              View Your Orders
            </Link>
          </div>
        ) : order ? (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-bold text-green-700 uppercase tracking-widest bg-green-50 px-2.5 py-1 rounded-md">
                  Receipt & Tracking
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight mt-1.5">
                  Order #{order._id}
                </h1>
                <p className="text-xs text-stone-500 mt-0.5">
                  Placed on {new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              <Link
                to="/shop"
                className="text-xs font-bold text-green-700 hover:text-green-800 self-start sm:self-auto"
              >
                &larr; Return to Marketplace
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Left Column: Details */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Shipping & Delivery Status */}
                <div className="bg-white p-6 rounded-3xl shadow-xs border border-stone-200/80 space-y-4">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <span>📍</span> Shipping Information
                  </h2>

                  <div className="text-sm text-stone-600 space-y-1">
                    <p><strong className="text-stone-800">Customer:</strong> {order.user?.name || userInfo?.name || 'Customer'}</p>
                    <p><strong className="text-stone-800">Email:</strong> {order.user?.email || userInfo?.email}</p>
                    <p>
                      <strong className="text-stone-800">Address:</strong>{' '}
                      {order.shippingAddress?.address}, {order.shippingAddress?.city},{' '}
                      {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
                    </p>
                  </div>

                  {order.isDelivered ? (
                    <div className="p-3.5 rounded-2xl bg-green-50 border border-green-200 text-green-800 text-xs font-bold flex items-center gap-2">
                      <span>✓</span> Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-2">
                      <span>⏳</span> Preparing for harvest delivery (Not Delivered Yet)
                    </div>
                  )}
                </div>

                {/* Payment Status */}
                <div className="bg-white p-6 rounded-3xl shadow-xs border border-stone-200/80 space-y-4">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <span>💳</span> Payment Status
                  </h2>

                  <p className="text-sm text-stone-600">
                    <strong className="text-stone-800">Method:</strong> {order.paymentMethod}
                  </p>

                  {order.isPaid ? (
                    <div className="p-3.5 rounded-2xl bg-green-50 border border-green-200 text-green-800 text-xs font-bold flex items-center gap-2">
                      <span>✓</span> Paid on {new Date(order.paidAt).toLocaleDateString()}
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                      <span>✕</span> Awaiting Payment
                    </div>
                  )}
                </div>

                {/* Order Items */}
                <div className="bg-white p-6 rounded-3xl shadow-xs border border-stone-200/80">
                  <h2 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
                    <span>📦</span> Purchased Harvest Items ({order.orderItems?.length || 0})
                  </h2>

                  <div className="divide-y divide-stone-100">
                    {order.orderItems?.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 py-3.5">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-xl bg-stone-50 border border-stone-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/product/${item.product || item._id}`}
                            className="font-bold text-stone-900 hover:text-green-700 text-sm block truncate"
                          >
                            {item.name}
                          </Link>
                          <span className="text-xs text-stone-500">
                            {item.qty} × ${(item.price || 0).toFixed(2)}
                          </span>
                        </div>
                        <div className="font-bold text-stone-900 text-sm">
                          ${(item.qty * item.price).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: Order Summary & Actions */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl shadow-xs border border-stone-200/80 p-6 sticky top-24 space-y-6">
                  <h2 className="text-xl font-black text-stone-900 pb-3 border-b border-stone-100">
                    Order Summary
                  </h2>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-stone-600">
                      <span>Items</span>
                      <span className="font-semibold text-stone-900">${(order.itemsPrice || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-stone-600">
                      <span>Shipping</span>
                      <span className="font-semibold text-stone-900">
                        {(order.shippingPrice || 0) === 0 ? (
                          <span className="text-green-600 font-bold">FREE</span>
                        ) : (
                          `$${(order.shippingPrice || 0).toFixed(2)}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-stone-600">
                      <span>Estimated Tax</span>
                      <span className="font-semibold text-stone-900">${(order.taxPrice || 0).toFixed(2)}</span>
                    </div>
                    <div className="pt-3 border-t border-stone-100 flex justify-between items-baseline">
                      <span className="font-black text-stone-900 text-base">Total</span>
                      <span className="font-black text-green-700 text-2xl">${(order.totalPrice || 0).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Payment Buttons if Not Paid */}
                  {!order.isPaid && (
                    <div className="space-y-3 pt-4 border-t border-stone-100">
                      {loadingPay && (
                        <div className="text-center text-xs font-bold text-stone-500">
                          Processing Transaction...
                        </div>
                      )}

                      {isPending ? (
                        <div className="text-center text-xs text-stone-400 py-3">
                          Loading PayPal SDK...
                        </div>
                      ) : (
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        />
                      )}

                      {/* Instant Pay Demo Button */}
                      <button
                        type="button"
                        onClick={testPayHandler}
                        disabled={loadingPay}
                        className="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-1.5"
                      >
                        ⚡ Simulate Instant Test Payment
                      </button>
                    </div>
                  )}

                  {/* Admin Fulfillment Action */}
                  {userInfo?.isAdmin && order.isPaid && !order.isDelivered && (
                    <div className="pt-4 border-t border-stone-100">
                      <button
                        type="button"
                        onClick={deliverHandler}
                        disabled={loadingDeliver}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition shadow-md disabled:opacity-40"
                      >
                        {loadingDeliver ? 'Updating Status...' : 'Mark as Dispatched / Delivered'}
                      </button>
                    </div>
                  )}

                </div>
              </div>

            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default OrderDetailsPage;