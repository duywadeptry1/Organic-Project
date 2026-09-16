import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '../slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';
import { CreditCard, Truck } from 'lucide-react';

function PaymentPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress, paymentMethod: savedMethod } = cart;

  const [paymentMethod, setPaymentMethod] = useState(savedMethod || 'MoMo');

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <div className="bg-[#FDFBF7] dark:bg-stone-950 min-h-screen py-10 text-stone-800 dark:text-stone-100 transition-colors duration-200">
      <div className="container mx-auto px-4 sm:px-6 max-w-xl">
        <CheckoutSteps step1 step2 step3 />

        <div className="bg-white dark:bg-stone-900 p-6 sm:p-10 rounded-3xl shadow-xs border border-stone-200/80 dark:border-stone-800 transition-colors duration-200">
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-50 tracking-tight">
              Payment Method
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Choose the safest and most convenient payment method for you.
            </p>
          </div>

          <form onSubmit={submitHandler} className="space-y-4">
            
            {/* MoMo E-Wallet Option */}
            <label
              className={`flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                paymentMethod === 'MoMo'
                  ? 'border-[#D82D8B] bg-pink-50/50 dark:bg-pink-950/20 shadow-sm'
                  : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 bg-white dark:bg-stone-800/40'
              }`}
            >
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                <input
                  type="radio"
                  id="MoMo"
                  name="paymentMethod"
                  value="MoMo"
                  checked={paymentMethod === 'MoMo'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-[#A50064] focus:ring-[#A50064] border-stone-300 dark:border-stone-600 shrink-0"
                />
                <div className="w-10 h-10 rounded-xl bg-[#A50064] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                  <span className="tracking-tighter">momo</span>
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-sm text-stone-900 dark:text-stone-100 block">
                      MoMo e-wallet / MoMo QR Code
                    </span>
                    <span className="text-[10px] font-extrabold bg-[#A50064] text-white px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                      Hot
                    </span>
                  </div>
                  <span className="text-xs text-stone-500 dark:text-stone-400 block mt-0.5">
                    Suitable for postpaid and prepaid MoMo users. Scan the QR code to pay directly from your MoMo app.
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-bold bg-pink-100 dark:bg-pink-950/60 text-[#A50064] dark:text-pink-300 px-2.5 py-1 rounded-full whitespace-nowrap self-start sm:self-center ml-7 sm:ml-0">
                Popular in Vietnam
              </span>
            </label>

            {/* PayPal / Credit Card Option */}
            <label
              className={`flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                paymentMethod === 'PayPal'
                  ? 'border-green-600 dark:border-green-500 bg-green-50/50 dark:bg-green-950/20 shadow-sm'
                  : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 bg-white dark:bg-stone-800/40'
              }`}
            >
              <input
                type="radio"
                id="PayPal"
                name="paymentMethod"
                value="PayPal"
                checked={paymentMethod === 'PayPal'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4 text-green-600 focus:ring-green-500 border-stone-300 dark:border-stone-600"
              />
              <div className="ml-3.5 flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-sm text-stone-900 dark:text-stone-100 block">
                    PayPal & International Cards (Visa / Mastercard)
                  </span>
                  <span className="text-xs text-stone-500 dark:text-stone-400 block">
                    International encrypted payment via PayPal gateway.
                  </span>
                </div>
              </div>
            </label>

            {/* Cash on Delivery / Local Pickup Option */}
            <label
              className={`flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                paymentMethod === 'COD'
                  ? 'border-green-600 dark:border-green-500 bg-green-50/50 dark:bg-green-950/20 shadow-sm'
                  : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 bg-white dark:bg-stone-800/40'
              }`}
            >
              <input
                type="radio"
                id="COD"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === 'COD'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4 text-green-600 focus:ring-green-500 border-stone-300 dark:border-stone-600"
              />
              <div className="ml-3.5 flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-sm text-stone-900 dark:text-stone-100 block">
                    Pay on Delivery (COD)
                  </span>
                  <span className="text-xs text-stone-500 dark:text-stone-400 block">
                    Pay in cash to the delivery staff when receiving your order.
                  </span>
                </div>
              </div>
            </label>

            <button
              type="submit"
              className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 px-6 rounded-2xl transition duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              Review & Place Order &rarr;
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;