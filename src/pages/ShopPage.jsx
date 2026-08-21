import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import ProductCard from '../components/ProductCard';
import { categories } from '../data/categories';

function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [sortOption, setSortOption] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Sync category state when URL changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setActiveCategory(cat);
    } else {
      setActiveCategory('All');
    }
  }, [searchParams]);

  const { data, isLoading, error } = useGetProductsQuery({
    pageNumber: currentPage,
    category: activeCategory === 'All' ? '' : activeCategory,
    keyword: searchQuery,
    sort: sortOption,
  });

  const handleCategoryChange = (categoryName) => {
    setActiveCategory(categoryName);
    setCurrentPage(1);
    if (categoryName === 'All') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: categoryName });
    }
  };

  const products = Array.isArray(data) ? data : (data?.products || []);
  const totalPages = data?.pages || 1;

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-10">
      <div className="container mx-auto px-4 sm:px-6">
        
        {/* Page Header / Breadcrumb */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Organic Marketplace
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Carefully curated fresh, pesticide-free harvest and wholesome pantry staples.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-white p-5 rounded-2xl shadow-xs border border-stone-200/80 sticky top-24">
              <h2 className="text-base font-bold text-stone-900 mb-3 pb-2 border-b border-stone-100 flex items-center justify-between">
                <span>Categories</span>
                <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                  All Natural
                </span>
              </h2>

              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => handleCategoryChange('All')}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-between ${
                      activeCategory === 'All'
                        ? 'bg-green-600 text-white shadow-xs'
                        : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                    }`}
                  >
                    <span>All Products</span>
                    <span className={`text-xs ${activeCategory === 'All' ? 'text-green-100' : 'text-stone-400'}`}>
                      &rarr;
                    </span>
                  </button>
                </li>

                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => handleCategoryChange(cat.name)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-between ${
                        activeCategory.toLowerCase() === cat.name.toLowerCase()
                          ? 'bg-green-600 text-white shadow-xs'
                          : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className={`text-xs ${activeCategory.toLowerCase() === cat.name.toLowerCase() ? 'text-green-100' : 'text-stone-400'}`}>
                        &rarr;
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              {/* Quality Guarantee Note */}
              <div className="mt-6 pt-5 border-t border-stone-100 text-xs text-stone-500">
                <p className="font-bold text-stone-700 mb-1">🌿 Farm Verified</p>
                <p>All items meet stringent non-GMO and ethical agricultural certifications.</p>
              </div>
            </div>
          </aside>

          {/* Main Product Area */}
          <main className="flex-1 w-full">
            
            {/* Search and Sort Toolbar */}
            <div className="bg-white p-4 rounded-2xl shadow-xs border border-stone-200/80 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {/* Search input with clear button */}
              <div className="relative w-full sm:w-80">
                <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-stone-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search organic goods..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-8 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-stone-800"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-2.5 flex items-center text-stone-400 hover:text-stone-600"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Sort dropdown */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <span className="text-xs font-semibold text-stone-500 shrink-0">Sort by:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="py-2 px-3 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-stone-800 font-medium cursor-pointer"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>

            </div>

            {/* Products Display */}
            {isLoading ? (
              <div className="flex justify-center items-center h-80">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center">
                <p className="font-bold">Failed to load products</p>
                <p className="text-sm mt-1">{error?.data?.message || error.error || 'Server error'}</p>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200/80 p-12 text-center">
                <div className="w-16 h-16 bg-stone-100 text-stone-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-stone-800 text-lg">No Products Found</h3>
                <p className="text-stone-500 text-sm mt-1 max-w-sm mx-auto">
                  Try adjusting your search keyword or switching the category filter.
                </p>
                <button
                  onClick={() => {
                    setActiveCategory('All');
                    setSearchQuery('');
                    setSearchParams({});
                  }}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((prev) => prev - 1)}
                      className="px-4 py-2 bg-white border border-stone-200 rounded-xl text-sm font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      &larr; Previous
                    </button>
                    <span className="text-sm font-semibold text-stone-600 px-3">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                      className="px-4 py-2 bg-white border border-stone-200 rounded-xl text-sm font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      Next &rarr;
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default ShopPage;