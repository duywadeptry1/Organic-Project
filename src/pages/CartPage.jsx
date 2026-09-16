import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../slices/cartSlice';

function CartPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const cartItemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const freeShippingThreshold = 50.0;
  const freeShippingDiff = freeShippingThreshold - cartSubtotal;

  const updateQuantity = (item, qty) => {
    if (qty < 1) return;
    const stock = item.countInStock !== undefined ? item.countInStock : (item.stock ?? 20);
    if (qty > stock) return;

    dispatch(addToCart({ ...item, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  return (
    <div className="bg-[#FDFBF7] dark:bg-stone-950 min-h-screen py-10 text-stone-800 dark:text-stone-100 transition-colors duration-200">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        
        {/* Page Title */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-50 tracking-tight">
              Shopping Cart
            </h1>
            <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
              Review your fresh harvest selection before safe & secure checkout.
            </p>
          </div>
          <Link
            to="/shop"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
          >
            &larr; Continue Shopping
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-12 text-center border border-stone-200/80 dark:border-stone-800 shadow-xs max-w-lg mx-auto transition-colors duration-200">
            <div className="w-16 h-16 bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-200/30 dark:border-green-800/40">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-2">Your Shopping Bag is Empty</h2>
            <p className="text-stone-500 dark:text-stone-400 text-sm mb-6">
              Looks like you haven't added any delicious organic produce or groceries yet!
            </p>
            <Link
              to="/shop"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full transition-all shadow-md"
            >
              Start Shopping Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

            {/* Left Column: Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              
              {/* Free Shipping Progress Bar */}
              <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-xs transition-colors duration-200">
                <div className="flex items-center justify-between text-xs font-bold mb-2">
                  <span className="text-stone-700 dark:text-stone-300">
                    {freeShippingDiff > 0
                      ? `Add $${freeShippingDiff.toFixed(2)} more for FREE Express Shipping!`
                      : '🎉 You qualified for FREE Express Shipping!'}
                  </span>
                  <span className="text-green-700 dark:text-green-400">
                    {Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100))}%
                  </span>
                </div>
                <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-green-600 dark:bg-green-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (cartSubtotal / freeShippingThreshold) * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Items Card List */}
              <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-xs border border-stone-200/80 dark:border-stone-800 divide-y divide-stone-100 dark:divide-stone-800 overflow-hidden transition-colors duration-200">
                {cartItems.map((item) => {
                  const stock = item.countInStock !== undefined ? item.countInStock : (item.stock ?? 20);
                  return (
                    <div key={item._id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      
                      {/* Top / Left: Thumbnail & Info */}
                      <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto flex-1 min-w-0">
                        <Link to={`/product/${item._id}`} className="shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700"
                          />
                        </Link>

                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] sm:text-[11px] font-bold text-green-700 dark:text-green-400 uppercase tracking-wider">
                            {item.category || 'Organic'}
                          </span>
                          <Link
                            to={`/product/${item._id}`}
                            className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 hover:text-green-700 dark:hover:text-green-400 transition block truncate mt-0.5"
                          >
                            {item.name}
                          </Link>
                          <p className="text-stone-500 dark:text-stone-400 text-xs mt-0.5">
                            ${item.price.toFixed(2)} / unit
                          </p>
                        </div>
                      </div>

                      {/* Bottom (Mobile) / Right (Desktop): Stepper + Price + Remove */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100 dark:border-stone-800">
                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-stone-200 dark:border-stone-700 rounded-xl bg-stone-50 dark:bg-stone-800 p-1">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item, item.qty - 1)}
                            disabled={item.qty <= 1}
                            className="w-7 h-7 rounded-lg bg-white dark:bg-stone-700 shadow-2xs text-stone-700 dark:text-stone-200 font-bold hover:bg-stone-100 dark:hover:bg-stone-600 disabled:opacity-30 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-bold text-stone-900 dark:text-stone-100 text-xs sm:text-sm">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item, item.qty + 1)}
                            disabled={item.qty >= stock}
                            className="w-7 h-7 rounded-lg bg-white dark:bg-stone-700 shadow-2xs text-stone-700 dark:text-stone-200 font-bold hover:bg-stone-100 dark:hover:bg-stone-600 disabled:opacity-30 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        {/* Total Item Price */}
                        <div className="text-right min-w-16 sm:min-w-20">
                          <span className="text-sm sm:text-base font-black text-stone-900 dark:text-stone-100 block">
                            ${(item.qty * item.price).toFixed(2)}
                          </span>
                        </div>

                        {/* Delete Action */}
                        <button
                          onClick={() => removeFromCartHandler(item._id)}
                          className="p-1.5 sm:p-2 text-stone-400 dark:text-stone-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition cursor-pointer"
                          title="Remove item"
                        >
                          <svg className="h-4 sm:h-5 w-4 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-xs border border-stone-200/80 dark:border-stone-800 p-6 sticky top-24 space-y-6 transition-colors duration-200">
                <h2 className="text-xl font-black text-stone-900 dark:text-stone-100 pb-3 border-b border-stone-100 dark:border-stone-800">
                  Order Summary
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-stone-600 dark:text-stone-400">
                    <span>Items Subtotal ({cartItemCount} items)</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-200">${cartSubtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-stone-600 dark:text-stone-400">
                    <span>Estimated Shipping</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-200">
                      {cartSubtotal >= freeShippingThreshold || cartSubtotal === 0 ? (
                        <span className="text-green-600 dark:text-green-400 font-bold">FREE</span>
                      ) : (
                        '$10.00'
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-stone-600 dark:text-stone-400">
                    <span>Estimated Tax (15%)</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-200">
                      ${(cartSubtotal * 0.15).toFixed(2)}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex justify-between items-baseline">
                    <span className="font-black text-stone-900 dark:text-stone-100 text-base">Estimated Total</span>
                    <span className="font-black text-green-700 dark:text-green-400 text-2xl">
                      ${(
                        cartSubtotal +
                        (cartSubtotal >= freeShippingThreshold ? 0 : 10) +
                        cartSubtotal * 0.15
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={checkoutHandler}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  Proceed to Checkout &rarr;
                </button>

                {/* Trust Badges */}
                <div className="pt-2 border-t border-stone-100 dark:border-stone-800 text-center space-y-2">
                  <p className="text-xs text-stone-400 dark:text-stone-500 font-medium">
                    🔒 256-Bit SSL Encrypted & Secure Checkout
                  </p>
                  <p className="text-xs text-stone-400 dark:text-stone-500 font-medium">
                    🌿 100% Organi Freshness Guaranteed
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default CartPage;