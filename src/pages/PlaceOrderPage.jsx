import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';

function PlaceOrderPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    if (!cart.shippingAddress?.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.shippingAddress, cart.paymentMethod, navigate]);

  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  const itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  const shippingPrice = addDecimals(Number(itemsPrice) >= 50 ? 0 : 10);
  const taxPrice = addDecimals(Number((0.15 * Number(itemsPrice)).toFixed(2)));
  const totalPrice = (
    Number(itemsPrice) +
    Number(shippingPrice) +
    Number(taxPrice)
  ).toFixed(2);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      }).unwrap();

      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      console.error('Failed to place order:', err);
    }
  };

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-10">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <CheckoutSteps step1 step2 step3 step4 />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Review Order Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Delivery Address Review */}
            <div className="bg-white p-6 rounded-3xl shadow-xs border border-stone-200/80">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  <span>📍</span> Delivery Address
                </h2>
                <Link to="/shipping" className="text-xs font-bold text-green-700 hover:text-green-800">
                  Edit
                </Link>
              </div>
              <p className="text-stone-600 text-sm">
                {cart.shippingAddress.address}, {cart.shippingAddress.city},{' '}
                {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
              </p>
            </div>

            {/* Payment Method Review */}
            <div className="bg-white p-6 rounded-3xl shadow-xs border border-stone-200/80">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  <span>💳</span> Payment Gateway
                </h2>
                <Link to="/payment" className="text-xs font-bold text-green-700 hover:text-green-800">
                  Edit
                </Link>
              </div>
              <p className="text-stone-600 text-sm">
                <strong className="text-stone-900 font-semibold">{cart.paymentMethod}</strong>
              </p>
            </div>

            {/* Order Items Review */}
            <div className="bg-white p-6 rounded-3xl shadow-xs border border-stone-200/80">
              <h2 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
                <span>📦</span> Cart Harvest Items ({cart.cartItems.length})
              </h2>

              {cart.cartItems.length === 0 ? (
                <p className="text-stone-500 text-sm">Your cart is empty.</p>
              ) : (
                <div className="divide-y divide-stone-100">
                  {cart.cartItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 py-3.5">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-xl bg-stone-50 border border-stone-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${item._id}`}
                          className="font-bold text-stone-900 hover:text-green-700 text-sm block truncate"
                        >
                          {item.name}
                        </Link>
                        <span className="text-xs text-stone-500">
                          {item.qty} × ${Number(item.price).toFixed(2)}
                        </span>
                      </div>
                      <div className="font-bold text-stone-900 text-sm">
                        ${(item.qty * item.price).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xs border border-stone-200/80 p-6 sticky top-24 space-y-6">
              <h2 className="text-xl font-black text-stone-900 pb-3 border-b border-stone-100">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-stone-600">
                  <span>Items</span>
                  <span className="font-semibold text-stone-900">${itemsPrice}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-stone-900">
                    {Number(shippingPrice) === 0 ? (
                      <span className="text-green-600 font-bold">FREE</span>
                    ) : (
                      `$${shippingPrice}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Estimated Tax (15%)</span>
                  <span className="font-semibold text-stone-900">${taxPrice}</span>
                </div>
                <div className="pt-3 border-t border-stone-100 flex justify-between items-baseline">
                  <span className="font-black text-stone-900 text-base">Total</span>
                  <span className="font-black text-green-700 text-2xl">${totalPrice}</span>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-xs">
                  {error?.data?.message || error.error || 'Failed to place order'}
                </div>
              )}

              <button
                type="button"
                disabled={cart.cartItems.length === 0 || isLoading}
                onClick={placeOrderHandler}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl transition duration-200 shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? 'Processing Order...' : 'Confirm & Place Order →'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default PlaceOrderPage;