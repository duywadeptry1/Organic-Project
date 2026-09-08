import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { saveShippingAddress } from '../slices/cartSlice';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps';

function ShippingPage() {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate('/payment');
  };

  return (
    <div className="bg-[#FDFBF7] dark:bg-stone-950 min-h-screen py-10 text-stone-800 dark:text-stone-100 transition-colors duration-200">
      <div className="container mx-auto px-4 sm:px-6 max-w-xl">
        <CheckoutSteps step1 step2 />

        <div className="bg-white dark:bg-stone-900 p-6 sm:p-10 rounded-3xl shadow-xs border border-stone-200/80 dark:border-stone-800 transition-colors duration-200">
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-50 tracking-tight">
              Delivery Address
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Where should we deliver your fresh harvest box?
            </p>
          </div>

          <form onSubmit={submitHandler} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                Street Address
              </label>
              <input
                type="text"
                placeholder="e.g. 124 Farm Road, Apt 4B"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-3 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  placeholder="e.g. San Francisco"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                  Postal / ZIP Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. 94107"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                Country
              </label>
              <input
                type="text"
                placeholder="e.g. United States"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-4 py-3 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 px-6 rounded-2xl transition duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              Continue to Payment &rarr;
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ShippingPage;