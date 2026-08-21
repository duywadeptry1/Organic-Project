import { Link } from 'react-router-dom';

function CheckoutSteps({ step1, step2, step3, step4 }) {
  const steps = [
    { num: 1, name: 'Sign In', link: '/login', active: step1 },
    { num: 2, name: 'Shipping', link: '/shipping', active: step2 },
    { num: 3, name: 'Payment', link: '/payment', active: step3 },
    { num: 4, name: 'Place Order', link: '/placeorder', active: step4 },
  ];

  return (
    <nav aria-label="Checkout progress" className="mb-8 max-w-2xl mx-auto px-4">
      <ol className="flex items-center justify-between">
        {steps.map((s, idx) => (
          <li key={s.num} className="flex-1 flex items-center relative">
            <div className="flex flex-col items-center flex-1">
              {s.active ? (
                <Link
                  to={s.link}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-green-600 text-white font-bold text-xs shadow-xs hover:bg-green-700 transition"
                >
                  {s.num}
                </Link>
              ) : (
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-stone-200 text-stone-500 font-bold text-xs">
                  {s.num}
                </div>
              )}
              <span
                className={`mt-1.5 text-xs font-semibold text-center ${
                  s.active ? 'text-green-800 font-bold' : 'text-stone-400'
                }`}
              >
                {s.name}
              </span>
            </div>

            {idx < steps.length - 1 && (
              <div
                className={`hidden sm:block absolute top-4 left-1/2 w-full h-0.5 -z-10 ${
                  steps[idx + 1].active ? 'bg-green-600' : 'bg-stone-200'
                }`}
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default CheckoutSteps;
