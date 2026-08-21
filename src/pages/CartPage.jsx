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
    <div className="bg-[#FDFBF7] min-h-screen py-10">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        
        {/* Page Title */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
              Shopping Cart
            </h1>
            <p className="text-stone-500 text-sm mt-1">
              Review your fresh harvest selection before safe & secure checkout.
            </p>
          </div>
          <Link
            to="/shop"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-green-700 hover:text-green-800"
          >
            &larr; Continue Shopping
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/80 shadow-xs max-w-lg mx-auto">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-stone-900 mb-2">Your Shopping Bag is Empty</h2>
            <p className="text-stone-500 text-sm mb-6">
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
              <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold mb-2">
                  <span className="text-stone-700">
                    {freeShippingDiff > 0
                      ? `Add $${freeShippingDiff.toFixed(2)} more for FREE Express Shipping!`
                      : '🎉 You qualified for FREE Express Shipping!'}
                  </span>
                  <span className="text-green-700">
                    {Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100))}%
                  </span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-green-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (cartSubtotal / freeShippingThreshold) * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Items Card List */}
              <div className="bg-white rounded-3xl shadow-xs border border-stone-200/80 divide-y divide-stone-100 overflow-hidden">
                {cartItems.map((item) => {
                  const stock = item.countInStock !== undefined ? item.countInStock : (item.stock ?? 20);
                  return (
                    <div key={item._id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                      
                      {/* Product Thumbnail */}
                      <Link to={`/product/${item._id}`} className="shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-2xl bg-stone-50 border border-stone-100"
                        />
                      </Link>

                      {/* Info */}
                      <div className="flex-1 min-w-0 text-center sm:text-left">
                        <span className="text-[11px] font-bold text-green-700 uppercase tracking-wider">
                          {item.category || 'Organic'}
                        </span>
                        <Link
                          to={`/product/${item._id}`}
                          className="text-base sm:text-lg font-bold text-stone-900 hover:text-green-700 transition block truncate mt-0.5"
                        >
                          {item.name}
                        </Link>
                        <p className="text-stone-500 text-xs mt-0.5">
                          Unit Price: <span className="font-semibold text-stone-800">${item.price.toFixed(2)}</span>
                        </p>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50 p-1">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item, item.qty - 1)}
                            disabled={item.qty <= 1}
                            className="w-7 h-7 rounded-lg bg-white shadow-2xs text-stone-700 font-bold hover:bg-stone-100 disabled:opacity-30 flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="w-9 text-center font-bold text-stone-900 text-sm">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item, item.qty + 1)}
                            disabled={item.qty >= stock}
                            className="w-7 h-7 rounded-lg bg-white shadow-2xs text-stone-700 font-bold hover:bg-stone-100 disabled:opacity-30 flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Total Item Price */}
                      <div className="text-right min-w-20">
                        <span className="text-base sm:text-lg font-black text-stone-900 block">
                          ${(item.qty * item.price).toFixed(2)}
                        </span>
                      </div>

                      {/* Delete Action */}
                      <button
                        onClick={() => removeFromCartHandler(item._id)}
                        className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                        title="Remove item"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>

                    </div>
                  );
                })}
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
                    <span>Items Subtotal ({cartItemCount} items)</span>
                    <span className="font-semibold text-stone-900">${cartSubtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-stone-600">
                    <span>Estimated Shipping</span>
                    <span className="font-semibold text-stone-900">
                      {cartSubtotal >= freeShippingThreshold || cartSubtotal === 0 ? (
                        <span className="text-green-600 font-bold">FREE</span>
                      ) : (
                        '$10.00'
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-stone-600">
                    <span>Estimated Tax (15%)</span>
                    <span className="font-semibold text-stone-900">
                      ${(cartSubtotal * 0.15).toFixed(2)}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex justify-between items-baseline">
                    <span className="font-black text-stone-900 text-base">Estimated Total</span>
                    <span className="font-black text-green-700 text-2xl">
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
                <div className="pt-2 border-t border-stone-100 text-center space-y-2">
                  <p className="text-xs text-stone-400 font-medium">
                    🔒 256-Bit SSL Encrypted & Secure Checkout
                  </p>
                  <p className="text-xs text-stone-400 font-medium">
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