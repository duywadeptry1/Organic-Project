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
import MoMoPaymentCard from '../components/MoMoPaymentCard';
import { CheckCircle2, AlertCircle, Clock, Truck } from 'lucide-react';

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

  // Load the PayPal Script dynamically once we have the Client ID ONLY if method is PayPal
  useEffect(() => {
    if (order?.paymentMethod === 'PayPal' && !errorPayPal && !loadingPayPal && paypal?.clientId) {
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

      if (!order.isPaid) {
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

  // MoMo Payment Handler (Called by MoMo Payment Card or One-Click Confirmation)
  const momoPayHandler = async (customDetails) => {
    try {
      const details = customDetails || {
        id: `MOMO_TXN_${Date.now()}`,
        status: 'SUCCESS',
        update_time: new Date().toISOString(),
        payer: { email_address: userInfo?.email || order?.user?.email || 'customer@organi.vn' },
      };
      await payOrder({ orderId, details }).unwrap();
      refetch();
    } catch (err) {
      console.error('MoMo Payment error:', err);
    }
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
    <div className="bg-[#FDFBF7] dark:bg-stone-950 min-h-screen py-10 text-stone-800 dark:text-stone-100 transition-colors duration-200">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        {isLoading ? (
          <div className="flex justify-center items-center h-80">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 p-8 rounded-3xl text-center max-w-lg mx-auto">
            <h2 className="text-xl font-bold mb-2">Order Not Found</h2>
            <p className="text-sm text-red-600 dark:text-red-400 mb-4">{error?.data?.message || error.error || 'Failed to load order.'}</p>
            <Link to="/profile" className="inline-block bg-stone-900 dark:bg-stone-800 text-white font-bold py-2.5 px-6 rounded-xl text-xs hover:bg-stone-800 dark:hover:bg-stone-700">
              View Your Orders
            </Link>
          </div>
        ) : order ? (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-widest bg-green-50 dark:bg-green-950/50 px-2.5 py-1 rounded-md border border-green-200/30 dark:border-green-800/40">
                  Receipt & Tracking
                </span>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-stone-900 dark:text-stone-50 tracking-tight mt-1.5 break-all">
                  Order #{order._id}
                </h1>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  Placed on {new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              <Link
                to="/shop"
                className="text-xs font-bold text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 self-start sm:self-auto"
              >
                &larr; Return to Marketplace
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Left Column: Details */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Shipping & Delivery Status */}
                <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl shadow-xs border border-stone-200/80 dark:border-stone-800 space-y-4 transition-colors duration-200">
                  <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <span>📍</span> Shipping Information
                  </h2>

                  <div className="text-sm text-stone-600 dark:text-stone-300 space-y-1">
                    <p><strong className="text-stone-800 dark:text-stone-100">Customer:</strong> {order.user?.name || userInfo?.name || 'Customer'}</p>
                    <p><strong className="text-stone-800 dark:text-stone-100">Email:</strong> {order.user?.email || userInfo?.email}</p>
                    <p>
                      <strong className="text-stone-800 dark:text-stone-100">Address:</strong>{' '}
                      {order.shippingAddress?.address}, {order.shippingAddress?.city},{' '}
                      {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
                    </p>
                  </div>

                  {order.isDelivered ? (
                    <div className="p-3.5 rounded-2xl bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800/60 text-green-800 dark:text-green-300 text-xs font-bold flex items-center gap-2">
                      <span>✓</span> Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center gap-2">
                      <span>⏳</span> Preparing for harvest delivery (Not Delivered Yet)
                    </div>
                  )}
                </div>

                {/* Payment Status */}
                <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl shadow-xs border border-stone-200/80 dark:border-stone-800 space-y-4 transition-colors duration-200">
                  <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <span>💳</span> Payment Status
                  </h2>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-stone-600 dark:text-stone-400">Payment Method:</span>
                    {order.paymentMethod === 'MoMo' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-pink-50 dark:bg-pink-950/50 border border-pink-200 dark:border-pink-800 text-[#A50064] dark:text-pink-300 font-black text-xs">
                        <span className="w-4 h-4 rounded-sm bg-[#A50064] text-white text-[9px] font-black flex items-center justify-center">
                          m
                        </span>
                        MoMo E-Wallet (QR Code)
                      </span>
                    ) : order.paymentMethod === 'PayPal' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-bold text-xs">
                        PayPal / International Credit Card
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 font-bold text-xs">
                        Cash on Delivery (COD)
                      </span>
                    )}
                  </div>

                  {order.isPaid ? (
                    <div className="p-4 rounded-2xl bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800/60 text-green-800 dark:text-green-300 space-y-1">
                      <div className="flex items-center gap-2 font-black text-xs">
                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0" />
                        <span>PAID SUCCESSFULLY</span>
                      </div>
                      <p className="text-[11px] text-green-700 dark:text-green-400 font-medium">
                        Paid at: {new Date(order.paidAt).toLocaleString('en-US')}
                      </p>
                      {order.paymentResult?.id && (
                        <p className="text-[11px] text-green-700 dark:text-green-400 font-mono">
                          Transaction ID: {order.paymentResult.id}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 space-y-1">
                      <div className="flex items-center gap-2 font-black text-xs">
                        <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                        <span>UNPAID (Awaiting Payment)</span>
                      </div>
                      <p className="text-[11px] text-amber-700 dark:text-amber-400">
                        {order.paymentMethod === 'MoMo'
                          ? 'Please scan the QR code below to complete your payment for this order.'
                          : order.paymentMethod === 'COD'
                          ? 'This order will be paid in cash upon delivery to your doorstep.'
                          : 'Please complete your payment via PayPal.'}
                      </p>
                    </div>
                  )}
                </div>

                {/* MoMo QR Payment Gateway Card */}
                {order.paymentMethod === 'MoMo' && !order.isPaid && (
                  <MoMoPaymentCard
                    order={order}
                    onPaySuccess={momoPayHandler}
                    loadingPay={loadingPay}
                  />
                )}

                {/* COD Info Card */}
                {order.paymentMethod === 'COD' && !order.isPaid && (
                  <div className="bg-amber-50/50 dark:bg-amber-950/30 rounded-3xl p-6 border border-amber-200 dark:border-amber-800/60 text-stone-700 dark:text-stone-300 space-y-3 transition-colors duration-200">
                    <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
                      <Truck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      <span>Cash on Delivery (COD) Instructions</span>
                    </div>
                    <p className="text-xs leading-relaxed text-stone-600 dark:text-stone-400">
                      Your order has been recorded. Organi Farm is preparing and packaging your fresh harvest. When the courier arrives, you can inspect your items and pay directly in cash: <strong>${(order.totalPrice || 0).toFixed(2)}</strong> (approx. <strong>{Math.round((order.totalPrice || 0) * 25400).toLocaleString('en-US')} VND</strong>).
                    </p>
                  </div>
                )}

                {/* Order Items */}
                <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl shadow-xs border border-stone-200/80 dark:border-stone-800 transition-colors duration-200">
                  <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-4 flex items-center gap-2">
                    <span>📦</span> Purchased Harvest Items ({order.orderItems?.length || 0})
                  </h2>

                  <div className="divide-y divide-stone-100 dark:divide-stone-800">
                    {order.orderItems?.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 py-3.5">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/product/${item.product || item._id}`}
                            className="font-bold text-stone-900 dark:text-stone-100 hover:text-green-700 dark:hover:text-green-400 text-sm block truncate"
                          >
                            {item.name}
                          </Link>
                          <span className="text-xs text-stone-500 dark:text-stone-400">
                            {item.qty} × ${(item.price || 0).toFixed(2)}
                          </span>
                        </div>
                        <div className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                          ${(item.qty * item.price).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: Order Summary & Actions */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-xs border border-stone-200/80 dark:border-stone-800 p-6 sticky top-24 space-y-6 transition-colors duration-200">
                  <h2 className="text-xl font-black text-stone-900 dark:text-stone-100 pb-3 border-b border-stone-100 dark:border-stone-800">
                    Order Summary
                  </h2>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-stone-600 dark:text-stone-400">
                      <span>Items</span>
                      <span className="font-semibold text-stone-900 dark:text-stone-200">${(order.itemsPrice || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-stone-600 dark:text-stone-400">
                      <span>Shipping</span>
                      <span className="font-semibold text-stone-900 dark:text-stone-200">
                        {(order.shippingPrice || 0) === 0 ? (
                          <span className="text-green-600 dark:text-green-400 font-bold">FREE</span>
                        ) : (
                          `$${(order.shippingPrice || 0).toFixed(2)}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-stone-600 dark:text-stone-400">
                      <span>Estimated Tax</span>
                      <span className="font-semibold text-stone-900 dark:text-stone-200">${(order.taxPrice || 0).toFixed(2)}</span>
                    </div>
                    <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex justify-between items-baseline">
                      <span className="font-black text-stone-900 dark:text-stone-100 text-base">Total</span>
                      <span className="font-black text-green-700 dark:text-green-400 text-2xl">${(order.totalPrice || 0).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Payment Buttons if Not Paid */}
                  {!order.isPaid && (
                    <div className="space-y-3 pt-4 border-t border-stone-100 dark:border-stone-800">
                      {loadingPay && (
                        <div className="text-center text-xs font-bold text-stone-500 dark:text-stone-400 py-1">
                          Processing Payment...
                        </div>
                      )}

                      {/* MoMo Payment Actions */}
                      {order.paymentMethod === 'MoMo' && (
                        <div className="space-y-2">
                          <button
                            type="button"
                            onClick={() => momoPayHandler()}
                            disabled={loadingPay}
                            className="w-full bg-linear-to-r from-[#A50064] to-[#D82D8B] hover:brightness-110 text-white font-bold py-3.5 px-4 rounded-xl text-xs transition shadow-md disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <span>⚡ Confirm MoMo Transfer Completed</span>
                          </button>
                          <p className="text-[10px] text-center text-stone-400 dark:text-stone-500">
                            Or scan the QR code in the information panel next to you
                          </p>
                        </div>
                      )}

                      {/* PayPal Payment Actions */}
                      {order.paymentMethod === 'PayPal' && (
                        <>
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
                            className="w-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 text-xs font-bold py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            ⚡ Simulate Instant PayPal Payment
                          </button>
                        </>
                      )}

                      {/* COD Payment Actions */}
                      {order.paymentMethod === 'COD' && (
                        <div className="space-y-2.5">
                          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-300 rounded-2xl p-3.5 text-xs">
                            <p className="font-bold mb-1">Pay on Delivery (COD)</p>
                            <p className="text-stone-600 dark:text-stone-400 text-[11px] leading-relaxed">
                              Your order has been placed and is now pending delivery. You will pay in cash when the delivery staff brings your agricultural products to your doorstep.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={testPayHandler}
                            disabled={loadingPay}
                            className="w-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 text-xs font-bold py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            ✓ Confirm COD Payment (Demo)
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Admin Fulfillment Action */}
                  {(userInfo?.isAdmin || userInfo?.role === 'admin') && (order.isPaid || order.paymentMethod === 'COD') && !order.isDelivered && (
                    <div className="pt-4 border-t border-stone-100 dark:border-stone-800">
                      <button
                        type="button"
                        onClick={deliverHandler}
                        disabled={loadingDeliver}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition shadow-md disabled:opacity-40 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Truck className="w-4 h-4" />
                        <span>{loadingDeliver ? 'Updating inventory & delivery status...' : 'Confirm Delivery Completed (Deduct Stock)'}</span>
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