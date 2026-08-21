import { useState } from 'react';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';
import { categories } from '../data/categories';

function HomePage() {
  const { data: productsData, isLoading, error } = useGetProductsQuery();
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Handle both array format and object format { products: [] }
  const allProducts = Array.isArray(productsData)
    ? productsData
    : (productsData?.products || []);

  const filteredProducts = selectedCategory === 'All'
    ? allProducts
    : allProducts.filter((p) => p.category?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="bg-[#FDFBF7] min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[520px] md:min-h-[580px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1542838132-92c53300491e?w=1920&q=80')",
          }}
        ></div>
        <div className="absolute inset-0 bg-stone-950/45 backdrop-brightness-90"></div>

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto py-16">
          <span className="inline-block bg-green-500/90 text-white font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 shadow-xs">
            100% Certified Organic Harvest
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-4 drop-shadow-md">
            Fresh Organic Food
          </h1>
          <p className="text-lg sm:text-xl text-stone-100 mb-8 max-w-xl mx-auto font-light leading-relaxed drop-shadow-xs">
            Directly from certified local organic farms straight to your family table.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/shop"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 px-8 rounded-full transition-all text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
            >
              Shop All Products
            </Link>
            <a
              href="#featured"
              className="bg-white/90 hover:bg-white text-stone-900 font-bold py-3.5 px-7 rounded-full transition-all text-base shadow-md hover:shadow-lg backdrop-blur-xs"
            >
              Explore Harvest
            </a>
          </div>
        </div>
      </section>

      {/* Value Proposition Strip */}
      <section className="border-b border-stone-200/80 bg-white py-8">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            
            <div className="flex items-center gap-3.5 p-2 justify-center md:justify-start">
              <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-sm">100% Organic</h4>
                <p className="text-xs text-stone-500 mt-0.5">Strict organic certification</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-2 justify-center md:justify-start">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-sm">Express Delivery</h4>
                <p className="text-xs text-stone-500 mt-0.5">Fresh harvest daily</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-2 justify-center md:justify-start">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-sm">Local Farms</h4>
                <p className="text-xs text-stone-500 mt-0.5">Supporting regenerative growers</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-2 justify-center md:justify-start">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-sm">100% Guarantee</h4>
                <p className="text-xs text-stone-500 mt-0.5">Freshness or money back</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="py-12 bg-[#FDFBF7]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-green-700">Categories</span>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">Explore By Category</h2>
            </div>
            <Link to="/shop" className="text-sm font-bold text-green-700 hover:text-green-800 flex items-center gap-1">
              View all <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.name}`}
                className="group relative h-40 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-bold text-base sm:text-lg">{cat.name}</h3>
                  <span className="text-xs text-stone-200 group-hover:text-green-300 transition-colors font-medium">
                    Shop category &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="featured" className="py-16 bg-white border-t border-stone-200/70">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">Featured Products</h2>
            <div className="w-20 h-1 bg-green-500 mx-auto rounded-full mt-2 mb-6"></div>
            
            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {['All', 'Vegetables', 'Fruits', 'Dairy', 'Bread'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? 'bg-green-600 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded-xl text-center max-w-md mx-auto">
              Failed to load products: {error?.data?.message || error.error}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-stone-500">
              No products found in this category.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Farm Banner Callout */}
      <section className="py-16 bg-stone-900 text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-15 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1600&q=80')" }}
        ></div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center max-w-2xl mx-auto">
          <span className="text-green-400 text-xs font-bold uppercase tracking-widest">Our Promise</span>
          <h2 className="text-3xl sm:text-4xl font-black mt-2 mb-4 tracking-tight">Pure, Clean, & Naturally Grown</h2>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed mb-8">
            Every product at Organi is cultivated through ethical farming, non-GMO soil, and harvested at peak freshness so your family receives maximum nutritional purity.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 px-8 rounded-full transition-all shadow-md hover:shadow-xl"
          >
            Explore the Organic Market
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;