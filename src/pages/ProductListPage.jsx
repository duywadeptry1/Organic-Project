import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useCreateProductMutation,
  useBulkCreateProductsMutation,
} from '../slices/productsApiSlice';

function ProductListPage() {
  const navigate = useNavigate();

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('newest');

  // Bulk Generator State
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkCount, setBulkCount] = useState(20);
  const [bulkCategory, setBulkCategory] = useState('All');
  const [bulkMessage, setBulkMessage] = useState('');

  // Quick Create Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState(4.99);
  const [newProdCategory, setNewProdCategory] = useState('Vegetables');
  const [newProdStock, setNewProdStock] = useState(30);
  const [newProdBrand, setNewProdBrand] = useState('Organi Farm');

  const { data: productData, isLoading, error, refetch } = useGetProductsQuery({
    pageNumber,
    pageSize,
    keyword,
    category: category === 'All' ? '' : category,
    sort,
  });

  const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();
  const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();
  const [bulkCreateProducts, { isLoading: loadingBulk }] = useBulkCreateProductsMutation();

  const deleteHandler = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name || 'this product'}"?`)) {
      try {
        await deleteProduct(id).unwrap();
        refetch();
      } catch (err) {
        alert(err?.data?.message || err.error || 'Failed to delete product');
      }
    }
  };

  const handleInstantCreate = async () => {
    try {
      const res = await createProduct({
        name: 'Sample Organic Item',
        price: 3.99,
        category: 'Vegetables',
        countInStock: 25,
        brand: 'Organi Farm',
      }).unwrap();
      refetch();
      navigate(`/admin/product/${res._id}/edit`);
    } catch (err) {
      alert(err?.data?.message || err.error || 'Failed to create product');
    }
  };

  const handleCustomCreate = async (e) => {
    e.preventDefault();
    if (!newProdName.trim()) {
      alert('Please enter a product name');
      return;
    }
    try {
      const res = await createProduct({
        name: newProdName,
        price: Number(newProdPrice),
        category: newProdCategory,
        countInStock: Number(newProdStock),
        brand: newProdBrand,
      }).unwrap();
      setShowCreateModal(false);
      setNewProdName('');
      refetch();
      navigate(`/admin/product/${res._id}/edit`);
    } catch (err) {
      alert(err?.data?.message || err.error || 'Failed to create product');
    }
  };

  const handleBulkGenerate = async (count) => {
    const targetCount = count || bulkCount;
    try {
      setBulkMessage('');
      const res = await bulkCreateProducts({
        count: targetCount,
        category: bulkCategory,
      }).unwrap();
      setShowBulkModal(false);
      setBulkMessage(`✨ Successfully generated ${targetCount} items into catalog! (Total: ${res.totalCatalogCount || '1000+'})`);
      refetch();
      setTimeout(() => setBulkMessage(''), 6000);
    } catch (err) {
      alert(err?.data?.message || err.error || 'Failed to bulk generate items');
    }
  };

  const productList = Array.isArray(productData)
    ? productData
    : productData?.products || [];
  const totalItems = productData?.totalProducts || productList.length;
  const totalPages = productData?.pages || Math.ceil(totalItems / pageSize) || 1;

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-10">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-green-700 uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full border border-green-200/60">
                Admin Management
              </span>
              <span className="text-xs font-bold text-stone-600 bg-stone-100 px-2.5 py-1 rounded-full">
                {totalItems} total products
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight mt-2">
              Catalog & Inventory Management
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Supports scalable catalogs with up to 1,000+ items, instant bulk generators, stock edits, and search.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowBulkModal(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition duration-200 shadow-xs flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>⚡ Bulk Add Items</span>
            </button>

            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 font-bold py-2.5 px-4 rounded-xl text-xs transition duration-200 shadow-xs flex items-center gap-1.5"
            >
              <span>+ Custom Add</span>
            </button>

            <button 
              onClick={handleInstantCreate}
              disabled={loadingCreate}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-5 rounded-xl text-xs transition duration-200 shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loadingCreate ? 'Creating...' : '+ Quick New Produce'}
            </button>
          </div>
        </div>

        {/* Bulk Success Banner */}
        {bulkMessage && (
          <div className="bg-emerald-50 text-emerald-800 text-xs font-bold p-4 rounded-2xl mb-6 border border-emerald-200 flex items-center justify-between animate-fade-in">
            <span>{bulkMessage}</span>
            <button onClick={() => setBulkMessage('')} className="text-emerald-600 hover:text-emerald-900 font-black">✕</button>
          </div>
        )}

        {loadingDelete && (
          <div className="bg-amber-50 text-amber-800 text-xs font-semibold p-3 rounded-2xl mb-4 border border-amber-200">
            Deleting product from database...
          </div>
        )}

        {/* Filter and Page Size Controls */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-stone-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search catalog (name, ID)..."
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  setPageNumber(1);
                }}
                className="w-full pl-9 pr-8 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-stone-800"
              />
              {keyword && (
                <button
                  onClick={() => {
                    setKeyword('');
                    setPageNumber(1);
                  }}
                  className="absolute inset-y-0 right-2.5 flex items-center text-stone-400 hover:text-stone-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter */}
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPageNumber(1);
              }}
              className="py-2 px-3 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none text-stone-800 font-semibold cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Fruits">Fruits</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Dairy">Dairy & Eggs</option>
              <option value="Bread">Bread & Bakery</option>
            </select>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="py-2 px-3 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none text-stone-800 font-semibold cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          {/* Page Size Selector */}
          <div className="flex items-center gap-2 self-end md:self-auto text-xs font-semibold text-stone-600">
            <span>Show per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPageNumber(1);
              }}
              className="py-1.5 px-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 font-bold focus:outline-none cursor-pointer"
            >
              <option value={10}>10 items</option>
              <option value={25}>25 items</option>
              <option value={50}>50 items</option>
              <option value={100}>100 items</option>
              <option value={500}>500 items</option>
              <option value={1000}>1000 items (All)</option>
            </select>
          </div>

        </div>

        {/* Table & Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-stone-200/80">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-600 mb-3"></div>
            <p className="text-xs font-bold text-stone-500">Loading catalog items...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 text-xs p-6 rounded-3xl border border-red-200 text-center">
            {error?.data?.message || error.error || 'Failed to load products'}
          </div>
        ) : productList.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xs border border-stone-200/80 p-12 text-center">
            <h3 className="font-bold text-stone-800 text-base mb-1">No Products Matching Criteria</h3>
            <p className="text-stone-500 text-xs max-w-sm mx-auto mb-4">
              You can create single produce items or generate hundreds of test items with the bulk generator tool.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => handleBulkGenerate(20)}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl text-xs"
              >
                + Generate 20 Products
              </button>
              <button
                onClick={() => {
                  setKeyword('');
                  setCategory('All');
                  setPageNumber(1);
                }}
                className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-2 px-4 rounded-xl text-xs"
              >
                Reset Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xs border border-stone-200/80 p-6 sm:p-7 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-100 text-stone-400 font-bold uppercase tracking-wider">
                  <th className="pb-3 pr-4">Product Info</th>
                  <th className="pb-3 px-4">Price</th>
                  <th className="pb-3 px-4">Category</th>
                  <th className="pb-3 px-4">Stock Status</th>
                  <th className="pb-3 px-4">Brand</th>
                  <th className="pb-3 pl-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {productList.map((product) => (
                  <tr key={product._id} className="hover:bg-stone-50/60 transition">
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image || 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&q=80'}
                          alt={product.name}
                          className="w-10 h-10 rounded-xl object-cover bg-stone-50 border border-stone-100 shrink-0"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&q=80';
                          }}
                        />
                        <div>
                          <p className="font-bold text-stone-900 text-xs sm:text-sm">{product.name}</p>
                          <p className="text-[10px] text-stone-400 font-mono">#{product._id?.substring(0, 12)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-black text-stone-900">
                      ${Number(product.price || 0).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 font-bold text-[10px]">
                        {product.category || 'Vegetables'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {Number(product.countInStock || product.stock || 0) <= 0 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                          Out of Stock
                        </span>
                      ) : Number(product.countInStock || product.stock || 0) < 10 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          {product.countInStock || product.stock} in stock (Low)
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-green-50 text-green-800 border border-green-200">
                          {product.countInStock || product.stock} units
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-stone-500 font-medium text-xs">
                      {product.brand || 'Organi Farm'}
                    </td>
                    <td className="py-3.5 pl-4 text-right space-x-2 whitespace-nowrap">
                      <Link 
                        to={`/admin/product/${product._id}/edit`}
                        className="inline-block bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold py-1.5 px-3 rounded-lg text-xs transition"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => deleteHandler(product._id, product.name)}
                        className="inline-block bg-red-50 hover:bg-red-100 text-red-600 font-bold py-1.5 px-3 rounded-lg text-xs transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-5 border-t border-stone-100 text-xs">
              <div className="text-stone-500 font-semibold">
                Showing <span className="font-bold text-stone-900">{productList.length}</span> of{' '}
                <span className="font-bold text-stone-900">{totalItems}</span> items
                {pageSize < 1000 && ` (Page ${pageNumber} of ${totalPages})`}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center gap-1.5">
                  <button
                    disabled={pageNumber === 1}
                    onClick={() => setPageNumber(1)}
                    className="px-2.5 py-1.5 rounded-lg border border-stone-200 font-bold hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="First Page"
                  >
                    «
                  </button>
                  <button
                    disabled={pageNumber === 1}
                    onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                    className="px-3 py-1.5 rounded-lg border border-stone-200 font-bold hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    ‹ Prev
                  </button>
                  
                  <span className="px-3 py-1.5 bg-green-50 text-green-800 border border-green-200 font-black rounded-lg">
                    {pageNumber} / {totalPages}
                  </span>

                  <button
                    disabled={pageNumber >= totalPages}
                    onClick={() => setPageNumber((prev) => Math.min(prev + 1, totalPages))}
                    className="px-3 py-1.5 rounded-lg border border-stone-200 font-bold hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Next ›
                  </button>
                  <button
                    disabled={pageNumber >= totalPages}
                    onClick={() => setPageNumber(totalPages)}
                    className="px-2.5 py-1.5 rounded-lg border border-stone-200 font-bold hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Last Page"
                  >
                    »
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      {/* Bulk Generator Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-md w-full p-6 animate-scale-in">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
              <div>
                <h3 className="text-base font-black text-stone-900">⚡ Bulk Generate Test Products</h3>
                <p className="text-xs text-stone-500">Quickly add up to 1,000 items to the database</p>
              </div>
              <button
                onClick={() => setShowBulkModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1.5">Preset Quantities</label>
                <div className="grid grid-cols-4 gap-2">
                  {[10, 50, 100, 500].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setBulkCount(num)}
                      className={`py-2 rounded-xl font-black text-xs border transition ${
                        bulkCount === num
                          ? 'bg-amber-500 text-white border-amber-600'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      +{num}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Custom Amount (up to 1,000)</label>
                <input
                  type="number"
                  min={1}
                  max={1000}
                  value={bulkCount}
                  onChange={(e) => setBulkCount(Math.min(Number(e.target.value) || 1, 1000))}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Category Focus</label>
                <select
                  value={bulkCategory}
                  onChange={(e) => setBulkCategory(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold text-stone-800 text-xs focus:outline-none"
                >
                  <option value="All">All Categories (Evenly Distributed)</option>
                  <option value="Fruits">Fruits Only</option>
                  <option value="Vegetables">Vegetables Only</option>
                  <option value="Dairy">Dairy & Eggs Only</option>
                  <option value="Bread">Bread & Bakery Only</option>
                </select>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowBulkModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-stone-200 text-stone-700 font-bold hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={loadingBulk}
                  onClick={() => handleBulkGenerate(bulkCount)}
                  className="w-1/2 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {loadingBulk ? 'Generating...' : `Generate ${bulkCount} Items`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Single Item Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCustomCreate} className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-md w-full p-6 animate-scale-in">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
              <div>
                <h3 className="text-base font-black text-stone-900">Add New Inventory Item</h3>
                <p className="text-xs text-stone-500">Specify details to add directly to database</p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Rainbow Carrots"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Initial Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-800 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Category</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold text-stone-800 focus:outline-none"
                  >
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Dairy">Dairy & Eggs</option>
                    <option value="Bread">Bread & Bakery</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Brand</label>
                  <input
                    type="text"
                    value={newProdBrand}
                    onChange={(e) => setNewProdBrand(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-800 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-stone-200 text-stone-700 font-bold hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loadingCreate}
                  className="w-1/2 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold disabled:opacity-50"
                >
                  {loadingCreate ? 'Saving...' : 'Create & Edit'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}

export default ProductListPage;