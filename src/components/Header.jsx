import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../slices/authSlice';
function Header() {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const cartItemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-[#FDFBF7]/95 backdrop-blur-md shadow-xs border-b border-stone-200/70 transition-all">
      <div className="backdrop-blur-[1px] bg-white/40 border-b border-stone-200/60">
        <div className="container mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
          
          {/* Left: Brand Logo */}
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="flex items-center text-2xl sm:text-3xl font-black text-green-700 tracking-tight hover:opacity-90 transition-opacity"
            >
              ORGANIc<span className="text-stone-900">.</span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 ml-4 text-sm font-semibold">
              <Link
                to="/"
                className={`px-3 py-1.5 rounded-full transition-colors ${
                  isActive('/')
                    ? 'text-green-800 bg-green-100/80 font-bold shadow-xs'
                    : 'text-stone-700 hover:text-green-700 hover:bg-stone-100/70'
                }`}
              >
                Home
              </Link>
              <Link
                to="/shop"
                className={`px-3 py-1.5 rounded-full transition-colors ${
                  isActive('/shop')
                    ? 'text-green-800 bg-green-100/80 font-bold shadow-xs'
                    : 'text-stone-700 hover:text-green-700 hover:bg-stone-100/70'
                }`}
              >
                Shop All
              </Link>
              <Link
                to="/shop?category=Vegetables"
                className="px-3 py-1.5 rounded-full text-stone-700 hover:text-green-700 hover:bg-stone-100/70 transition-colors"
              >
                Vegetables
              </Link>
              <Link
                to="/shop?category=Fruits"
                className="px-3 py-1.5 rounded-full text-stone-700 hover:text-green-700 hover:bg-stone-100/70 transition-colors"
              >
                Fruits
              </Link>
              {userInfo && userInfo.isAdmin && (
                <Link
                  to="/admin/productlist"
                  className="px-3 py-1.5 rounded-full text-amber-900 bg-amber-100/80 hover:bg-amber-200/80 font-bold text-xs uppercase tracking-wider transition-colors ml-2"
                >
                  Admin Panel
                </Link>
              )}
            </nav>
          </div>

          {/* Right: Actions & Profile */}
          <div className="flex items-center gap-3">
            
            {/* Cart Dropdown */}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle hover:bg-stone-100/80 text-stone-800"
                aria-label="Shopping Cart"
              >
                <div className="indicator">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-stone-800"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  {cartItemCount > 0 && (
                    <span className="badge badge-sm indicator-item bg-green-600 text-white border-none font-bold shadow-xs">
                      {cartItemCount}
                    </span>
                  )}
                </div>
              </div>

              {/* Cart Dropdown Menu */}
              <div
                tabIndex={0}
                className="card card-sm dropdown-content z-50 mt-3 w-84 shadow-xl border border-stone-200 bg-white rounded-2xl"
              >
                <div className="card-body p-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                    <span className="text-base font-bold text-stone-900">
                      Shopping Bag ({cartItemCount})
                    </span>
                    <span className="text-green-700 font-bold text-sm">
                      ${cartSubtotal.toFixed(2)}
                    </span>
                  </div>

                  {cartItems.length === 0 ? (
                    <div className="text-center py-6 text-stone-500 text-sm">
                      <p className="font-medium">Your cart is empty</p>
                      <p className="text-xs text-stone-400 mt-1">Discover our farm fresh organic goods!</p>
                    </div>
                  ) : (
                    <ul className="max-h-60 overflow-y-auto divide-y divide-stone-100 my-2 pr-1">
                      {cartItems.map((item) => (
                        <li key={item._id} className="py-2.5 flex gap-3 items-center">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-lg bg-stone-100"
                          />
                          <div className="flex-1 min-w-0">
                            <Link
                              to={`/product/${item._id}`}
                              className="text-sm font-semibold text-stone-900 hover:text-green-700 truncate block"
                            >
                              {item.name}
                            </Link>
                            <p className="text-xs text-stone-500 mt-0.5">
                              {item.qty} × <span className="font-semibold text-stone-800">${item.price.toFixed(2)}</span>
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="card-actions flex flex-col gap-2 mt-1 pt-2 border-t border-stone-100">
                    <Link
                      to="/cart"
                      className="btn btn-sm btn-outline border-stone-300 text-stone-700 hover:bg-stone-100 hover:text-stone-900 w-full rounded-xl font-medium"
                    >
                      View Cart
                    </Link>
                    <Link
                      to="/checkout"
                      className="btn btn-sm bg-green-600 hover:bg-green-700 text-white border-none w-full rounded-xl font-semibold shadow-xs"
                    >
                      Checkout Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* User Profile / Auth State */}
            {userInfo ? (
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost h-10 min-h-10 px-3 flex items-center gap-2 rounded-full border border-stone-200/80 bg-white/70 hover:bg-white text-stone-800 shadow-2xs"
                >
                  <div className="w-6 h-6 rounded-full bg-green-600 text-white font-bold text-xs flex items-center justify-center">
                    {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="font-semibold text-sm max-w-28 truncate">{userInfo.name}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5 text-stone-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content rounded-2xl z-50 mt-2 w-56 p-2 shadow-xl border border-stone-200 bg-white text-stone-700"
                >
                  <li className="menu-title px-3 py-1.5 text-xs font-semibold text-stone-400">
                    Signed in as <span className="text-stone-700 font-bold block truncate">{userInfo.email}</span>
                  </li>
                  <div className="divider my-1"></div>
                  <li>
                    <Link to="/profile" className="py-2 hover:bg-green-50 hover:text-green-700 rounded-lg">
                      My Profile & Orders
                    </Link>
                  </li>
                  {userInfo.isAdmin && (
                    <>
                      <li>
                        <Link to="/admin/productlist" className="py-2 hover:bg-amber-50 hover:text-amber-800 rounded-lg font-medium text-amber-700">
                          Product Management
                        </Link>
                      </li>
                      <li>
                        <Link to="/admin/orderlist" className="py-2 hover:bg-amber-50 hover:text-amber-800 rounded-lg font-medium text-amber-700">
                          Order Management
                        </Link>
                      </li>
                    </>
                  )}
                  <div className="divider my-1"></div>
                  <li>
                    <button
                      onClick={logoutHandler}
                      className="py-2 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg font-medium"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="btn btn-sm btn-ghost text-stone-700 hover:text-green-700 hover:bg-stone-100/70 font-semibold px-3"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn btn-sm bg-green-600 hover:bg-green-700 text-white border-none rounded-full px-4 font-semibold shadow-xs"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden btn btn-ghost btn-circle btn-sm text-stone-700"
              aria-label="Toggle Navigation Menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-stone-200/80 bg-white px-4 py-3 space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-stone-700 hover:bg-green-50 hover:text-green-700"
            >
              Home
            </Link>
            <Link
              to="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-stone-700 hover:bg-green-50 hover:text-green-700"
            >
              Shop All
            </Link>
            <Link
              to="/shop?category=Vegetables"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-stone-700 hover:bg-green-50 hover:text-green-700"
            >
              Vegetables
            </Link>
            <Link
              to="/shop?category=Fruits"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-stone-700 hover:bg-green-50 hover:text-green-700"
            >
              Fruits
            </Link>
            {userInfo && userInfo.isAdmin && (
              <Link
                to="/admin/productlist"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-bold text-amber-800 bg-amber-50"
              >
                Admin Panel
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
