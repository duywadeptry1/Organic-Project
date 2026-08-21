import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart } from '../slices/cartSlice';

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);

  const stock = product.countInStock !== undefined ? product.countInStock : (product.stock ?? 10);
  const isOutOfStock = stock <= 0;

  const addToCartHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    dispatch(addToCart({ ...product, qty: 1 }));
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group bg-white rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
      
      {/* Category / Organic Badge */}
      <div className="absolute top-3 left-3 z-10 flex gap-1">
        <span className="bg-white/90 backdrop-blur-xs text-green-800 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-2xs border border-green-200/60 uppercase tracking-wide">
          {product.category || 'Organic'}
        </span>
      </div>

      {/* Out of Stock Ribbon */}
      {isOutOfStock && (
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs uppercase">
            Sold Out
          </span>
        </div>
      )}

      {/* Image with zoom effect */}
      <Link to={`/product/${product._id}`} className="block h-52 sm:h-56 overflow-hidden bg-stone-50 relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          loading="lazy"
        />
      </Link>

      {/* Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1 mb-1.5 text-xs text-amber-500">
            <span>{'★'.repeat(Math.round(product.rating || 5))}</span>
            <span className="text-stone-400 font-medium ml-1">
              ({product.numReviews || (product.rating ? '12' : '0')})
            </span>
          </div>

          {/* Title */}
          <Link to={`/product/${product._id}`}>
            <h3 className="text-base font-bold text-stone-900 line-clamp-1 group-hover:text-green-700 transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Description snippet if available */}
          {product.brand && (
            <p className="text-xs text-stone-400 mt-0.5">By {product.brand}</p>
          )}

          {/* Price & Stock info */}
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-lg font-black text-green-700">
              ${(product.price || 0).toFixed(2)}
            </span>
            <span className="text-xs text-stone-400 font-medium">/ unit</span>
          </div>
        </div>

        {/* Add to cart CTA */}
        <button
          onClick={addToCartHandler}
          disabled={isOutOfStock}
          className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
            isOutOfStock
              ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
              : added
              ? 'bg-green-700 text-white shadow-xs'
              : 'bg-stone-900 hover:bg-green-600 text-white shadow-2xs hover:shadow-md'
          }`}
        >
          {isOutOfStock ? (
            'Out of Stock'
          ) : added ? (
            <>
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Added to Bag!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add to Bag
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;