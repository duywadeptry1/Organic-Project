import { Outlet, Link } from 'react-router-dom';
import Header from '../components/Header';

function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-stone-800 selection:bg-green-100 selection:text-green-900">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      
      <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
            
            {/* Col 1: Brand info */}
            <div className="space-y-4 md:col-span-1">
              <Link to="/" className="text-2xl font-black text-white tracking-tight">
                ORGANI<span className="text-green-500">.</span>
              </Link>
              <p className="text-xs text-stone-400 leading-relaxed">
                Direct farm-to-table organic produce, hand-harvested daily from certified regenerative local growers.
              </p>
              <div className="flex items-center gap-3 text-stone-400 text-sm">
                <span className="p-2 rounded-full bg-stone-800">🌱</span>
                <span className="p-2 rounded-full bg-stone-800">🚜</span>
                <span className="p-2 rounded-full bg-stone-800">☀️</span>
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">
                Shop Organic
              </h4>
              <ul className="space-y-2.5 text-xs text-stone-400">
                <li>
                  <Link to="/shop" className="hover:text-green-400 transition">All Products</Link>
                </li>
                <li>
                  <Link to="/shop?category=Vegetables" className="hover:text-green-400 transition">Fresh Vegetables</Link>
                </li>
                <li>
                  <Link to="/shop?category=Fruits" className="hover:text-green-400 transition">Organic Fruits</Link>
                </li>
                <li>
                  <Link to="/shop?category=Dairy" className="hover:text-green-400 transition">Farm Dairy & Eggs</Link>
                </li>
                <li>
                  <Link to="/shop?category=Bread" className="hover:text-green-400 transition">Artisan Bread</Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Customer Care */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">
                Customer Care
              </h4>
              <ul className="space-y-2.5 text-xs text-stone-400">
                <li>
                  <Link to="/profile" className="hover:text-green-400 transition">My Account & Orders</Link>
                </li>
                <li>
                  <Link to="/cart" className="hover:text-green-400 transition">Shopping Bag</Link>
                </li>
                <li>
                  <Link to="/shipping" className="hover:text-green-400 transition">Delivery Info</Link>
                </li>
                <li>
                  <span className="text-stone-500">100% Satisfaction Guaranteed</span>
                </li>
              </ul>
            </div>

            {/* Col 4: Newsletter / Promise */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">
                Farm Fresh Promise
              </h4>
              <p className="text-xs text-stone-400 leading-relaxed mb-4">
                Pesticide-free, non-GMO, and packed within 24 hours of harvest. Pure nutrition you can trust.
              </p>
              <div className="bg-stone-800/80 p-3 rounded-2xl border border-stone-700/60">
                <span className="text-[11px] font-bold text-green-400 block mb-1">
                  ✓ Free Express Delivery
                </span>
                <span className="text-[10px] text-stone-400 block">
                  On all fresh grocery orders over $50.00
                </span>
              </div>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
            <p>© {new Date().getFullYear()} Organi Harvest Market. All rights reserved.</p>
            <p className="flex items-center gap-4">
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
              <span>•</span>
              <span>Non-GMO Certified</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;
