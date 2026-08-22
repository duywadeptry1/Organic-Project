import { Outlet, Link, useLocation } from 'react-router-dom';
import Header from '../components/Header';

function AdminLayout() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-stone-800">
      <Header />

      {/* Admin Subheader Bar */}
      <div className="bg-stone-900 text-white border-b border-stone-800 shadow-xs">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="bg-amber-400 text-stone-900 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
              Admin Portal
            </span>
            <span className="text-xs font-bold text-stone-300">
              Produce & Store Management
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold">
            <Link
              to="/admin/productlist"
              className={`px-3 py-1.5 rounded-lg transition ${
                isActive('/admin/productlist') || isActive('/admin')
                  ? 'bg-green-600 text-white font-bold'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              Catalog Products
            </Link>
            <Link
              to="/admin/orderlist"
              className={`px-3 py-1.5 rounded-lg transition ${
                isActive('/admin/orderlist')
                  ? 'bg-green-600 text-white font-bold'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              Customer Orders
            </Link>
            <Link
              to="/shop"
              className="px-3 py-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition"
            >
              Live Store &rarr;
            </Link>
          </div>
        </div>
      </div>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-stone-900 text-stone-400 py-6 border-t border-stone-800 text-center text-xs">
        <p>Organi Farm Admin Console • Real-time inventory & fulfillment</p>
      </footer>
    </div>
  );
}

export default AdminLayout;
