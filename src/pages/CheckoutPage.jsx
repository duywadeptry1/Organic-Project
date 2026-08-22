import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function CheckoutPage() {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    if (!cart.cartItems || cart.cartItems.length === 0) {
      navigate('/cart');
    } else if (!cart.shippingAddress?.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    } else {
      navigate('/placeorder');
    }
  }, [cart, navigate]);

  return (
    <div className="bg-[#FDFBF7] min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-600"></div>
        <p className="text-xs font-bold text-stone-600">Routing to Checkout Step...</p>
      </div>
    </div>
  );
}

export default CheckoutPage;
