import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGetProductDetailsQuery } from '../slices/productsApiSlice';
import { addToCart } from '../slices/cartSlice';

function ProductDetailPage() {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [addedNotice, setAddedNotice] = useState(false);

  const { data: product, isLoading, error } = useGetProductDetailsQuery(productId);

  const stock = product
    ? (product.countInStock !== undefined ? product.countInStock : (product.stock ?? 10))
    : 0;
  const isOutOfStock = stock <= 0;

  const addToCartHandler = (goToCheckout = false) => {
    if (!product || isOutOfStock) return;
    dispatch(addToCart({ ...product, qty }));
    if (goToCheckout) {
      navigate('/cart');
    } else {
      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 2500);
    }
  };

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-stone-500 mb-6">
          <Link to="/" className="hover:text-green-700">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-green-700">Shop</Link>
          {product && (
            <>
              <span>/</span>
              <Link to={`/shop?category=${product.category}`} className="hover:text-green-700">
                {product.category}
              </Link>
              <span>/</span>
              <span className="text-stone-800 truncate max-w-xs">{product.name}</span>
            </>
          )}
        </nav>

        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-8 rounded-2xl text-center max-w-lg mx-auto">
            <h3 className="font-bold text-lg">Product Not Found</h3>
            <p className="text-sm mt-1 text-red-600">{error?.data?.message || error.error || 'Unable to load product.'}</p>
            <Link to="/shop" className="mt-4 inline-block px-5 py-2 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700">
              Return to Marketplace
            </Link>
          </div>
        ) : product ? (
          <div className="space-y-8">
            
            {/* Main Product Panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 bg-white p-6 sm:p-10 rounded-3xl shadow-xs border border-stone-200/80">
              
              {/* Product Image */}
              <div className="relative rounded-2xl overflow-hidden bg-stone-50 border border-stone-100 flex items-center justify-center p-4">
                <span className="absolute top-4 left-4 z-10 bg-green-700 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                  {product.category || 'Organic'}
                </span>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-auto max-h-[420px] object-contain rounded-xl hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Product Info & Purchase Controls */}
              <div className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-green-700 uppercase tracking-widest bg-green-50 px-2.5 py-0.5 rounded-md">
                      {product.brand || 'Organi Certified'}
                    </span>
                    <span className="text-xs text-stone-400">• Non-GMO</span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 tracking-tight mb-3">
                    {product.name}
                  </h1>

                  {/* Rating display */}
                  <div className="flex items-center gap-2 mb-4 text-sm">
                    <div className="flex text-amber-400">
                      {'★'.repeat(Math.round(product.rating || 5))}
                    </div>
                    <span className="font-bold text-stone-700 text-xs">
                      {product.rating || '4.9'} / 5.0
                    </span>
                    <span className="text-stone-400 text-xs">
                      ({product.numReviews || 18} customer reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-6 pb-6 border-b border-stone-100">
                    <span className="text-3xl sm:text-4xl font-black text-green-700">
                      ${(product.price || 0).toFixed(2)}
                    </span>
                    <span className="text-stone-400 text-sm font-medium">tax included</span>
                  </div>

                  <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-6">
                    {product.description}
                  </p>
                </div>

                {/* Purchase Actions */}
                <div className="pt-4 border-t border-stone-100 space-y-5">
                  
                  {/* Stock Status & Quantity */}
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-semibold text-stone-500 block mb-1">Availability:</span>
                      {!isOutOfStock ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-lg">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          In Stock ({stock} available)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg">
                          <span className="w-2 h-2 rounded-full bg-red-500"></span>
                          Currently Sold Out
                        </span>
                      )}
                    </div>

                    {!isOutOfStock && (
                      <div>
                        <span className="text-xs font-semibold text-stone-500 block mb-1">Quantity:</span>
                        <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50 p-1">
                          <button
                            type="button"
                            onClick={() => setQty(Math.max(1, qty - 1))}
                            disabled={qty <= 1}
                            className="w-8 h-8 rounded-lg bg-white shadow-2xs text-stone-700 font-bold hover:bg-stone-100 disabled:opacity-40 flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="w-10 text-center font-bold text-stone-900 text-sm">{qty}</span>
                          <button
                            type="button"
                            onClick={() => setQty(Math.min(stock, qty + 1))}
                            disabled={qty >= stock}
                            className="w-8 h-8 rounded-lg bg-white shadow-2xs text-stone-700 font-bold hover:bg-stone-100 disabled:opacity-40 flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Toast Feedback */}
                  {addedNotice && (
                    <div className="bg-green-50 border border-green-300 text-green-800 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center justify-between animate-fade-in">
                      <span>✓ Added {qty} × {product.name} to your shopping bag!</span>
                      <Link to="/cart" className="underline hover:text-green-900">View Bag</Link>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => addToCartHandler(false)}
                      disabled={isOutOfStock}
                      className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-xs disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add to Bag
                    </button>
                    <button
                      onClick={() => addToCartHandler(true)}
                      disabled={isOutOfStock}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      Buy Now &rarr;
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Information Tabs */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xs border border-stone-200/80">
              <div className="flex border-b border-stone-200 gap-6 text-sm font-bold">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`pb-3 transition-colors relative ${
                    activeTab === 'description'
                      ? 'text-green-700 border-b-2 border-green-600'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Product Details & Sourcing
                </button>
                <button
                  onClick={() => setActiveTab('shipping')}
                  className={`pb-3 transition-colors relative ${
                    activeTab === 'shipping'
                      ? 'text-green-700 border-b-2 border-green-600'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Shipping & Freshness Guarantee
                </button>
              </div>

              <div className="py-6 text-sm leading-relaxed text-stone-600">
                {activeTab === 'description' ? (
                  <div className="space-y-4">
                    <p>
                      Our <strong>{product.name}</strong> is cultivated following regenerative farming protocols. Harvested within 24 hours of delivery, it preserves delicate nutrients, enzymes, and authentic natural flavor.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-100">
                        <span className="font-bold text-stone-800 block mb-1">🌱 100% Non-GMO</span>
                        <span className="text-xs text-stone-500">Free from synthetic fertilizers or artificial ripeners.</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-100">
                        <span className="font-bold text-stone-800 block mb-1">🚜 Direct From Partner</span>
                        <span className="text-xs text-stone-500">Fair-trade certified with verified regenerative soil practices.</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-100">
                        <span className="font-bold text-stone-800 block mb-1">❄️ Cold-Chain Protected</span>
                        <span className="text-xs text-stone-500">Maintained in climate-regulated storage for maximum freshness.</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p>
                      All perishable orders are packaged inside temperature-insulated, 100% biodegradable cornstarch containers.
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-stone-600">
                      <li>Free express courier delivery on all orders over $50.00.</li>
                      <li>Same-day morning delivery for orders placed before 10:00 AM.</li>
                      <li>Full refund or instant replacement if any item arrives damaged or less than peak freshness.</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

          </div>
        ) : null}
      </div>
    </div>
  );
}

export default ProductDetailPage;