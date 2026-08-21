import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '../slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';

function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

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
    <div className="bg-[#FDFBF7] min-h-screen py-10">
      <div className="container mx-auto px-4 sm:px-6 max-w-xl">
        <CheckoutSteps step1 step2 step3 />

        <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-xs border border-stone-200/80">
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Payment Method
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Select your preferred secure payment gateway.
            </p>
          </div>

          <form onSubmit={submitHandler} className="space-y-4">
            
            {/* PayPal / Credit Card Option */}
            <label
              className={`flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                paymentMethod === 'PayPal'
                  ? 'border-green-600 bg-green-50/50'
                  : 'border-stone-200 hover:border-stone-300 bg-white'
              }`}
            >
              <input
                type="radio"
                id="PayPal"
                name="paymentMethod"
                value="PayPal"
                checked={paymentMethod === 'PayPal'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4 text-green-600 focus:ring-green-500 border-stone-300"
              />
              <div className="ml-3.5 flex-1">
                <span className="font-bold text-sm text-stone-900 block">
                  PayPal & Debit / Credit Card
                </span>
                <span className="text-xs text-stone-500">
                  Instant, encrypted checkout with buyer protection.
                </span>
              </div>
              <span className="text-xs font-bold bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                Recommended
              </span>
            </label>

            {/* Cash on Delivery / Local Pickup Option */}
            <label
              className={`flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                paymentMethod === 'COD'
                  ? 'border-green-600 bg-green-50/50'
                  : 'border-stone-200 hover:border-stone-300 bg-white'
              }`}
            >
              <input
                type="radio"
                id="COD"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === 'COD'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4 text-green-600 focus:ring-green-500 border-stone-300"
              />
              <div className="ml-3.5 flex-1">
                <span className="font-bold text-sm text-stone-900 block">
                  Cash on Harvest Delivery (COD)
                </span>
                <span className="text-xs text-stone-500">
                  Pay with cash or mobile bank transfer upon courier arrival.
                </span>
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