import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { 
  useGetProductDetailsQuery, 
  useUpdateProductMutation, 
  useUploadProductImageMutation 
} from '../slices/productsApiSlice';

function ProductEditPage() {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

  const { data: product, isLoading, error, refetch } = useGetProductDetailsQuery(productId);
  const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation();
  const [uploadProductImage, { isLoading: loadingUpload }] = useUploadProductImageMutation();

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setPrice(product.price || 0);
      setImage(product.image || '');
      setBrand(product.brand || '');
      setCategory(product.category || '');
      setCountInStock(product.countInStock || product.stock || 0);
      setDescription(product.description || '');
    }
  }, [product]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({
        productId,
        name,
        price,
        image,
        brand,
        category,
        countInStock,
        description,
      }).unwrap();

      refetch();
      navigate('/admin/productlist');
    } catch (err) {
      alert(err?.data?.message || err.error || 'Failed to update product');
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await uploadProductImage(formData).unwrap();
      setImage(res.image);
    } catch (err) {
      alert(err?.data?.message || err.error || 'Failed to upload image');
    }
  };

  return (
    <div className="bg-[#FDFBF7] dark:bg-stone-950 min-h-screen py-10 text-stone-800 dark:text-stone-100 transition-colors duration-200">
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        
        <Link 
          to="/admin/productlist" 
          className="text-xs font-bold text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 mb-6 inline-flex items-center gap-1.5"
        >
          &larr; Back to Catalog List
        </Link>

        <div className="bg-white dark:bg-stone-900 p-6 sm:p-10 rounded-3xl shadow-xs border border-stone-200/80 dark:border-stone-800 transition-colors duration-200">
          
          <div className="mb-6 pb-4 border-b border-stone-100 dark:border-stone-800">
            <span className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-widest bg-green-50 dark:bg-green-950/50 px-3 py-1 rounded-full border border-green-200/30 dark:border-green-800/40">
              Product Editor
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-50 tracking-tight mt-2">
              Edit Produce Details
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Modify inventory counts, organic certificates, pricing, and display imagery.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs p-6 rounded-2xl border border-red-200 dark:border-red-900/60 text-center">
              {error?.data?.message || error.error || 'Failed to load product details'}
            </div>
          ) : (
            <form onSubmit={submitHandler} className="space-y-5">
              
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                  Produce Name
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Organic Avocados" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="w-full px-4 py-2.5 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 transition"
                  required 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                    Price ($ USD)
                  </label>
                  <input 
                    type="number" 
                    step="0.01" 
                    placeholder="0.00" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)} 
                    className="w-full px-4 py-2.5 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 transition"
                    required 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                    Count In Stock
                  </label>
                  <input 
                    type="number" 
                    placeholder="0" 
                    value={countInStock} 
                    onChange={(e) => setCountInStock(e.target.value)} 
                    className="w-full px-4 py-2.5 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 transition"
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Vegetables, Fresh Fruit, Dairy" 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)} 
                    className="w-full px-4 py-2.5 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 transition"
                    required 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                    Farm / Brand
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Valley Organic Farm" 
                    value={brand} 
                    onChange={(e) => setBrand(e.target.value)} 
                    className="w-full px-4 py-2.5 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 transition"
                    required 
                  />
                </div>
              </div>

              {/* Image Section */}
              <div className="p-4 bg-stone-50/70 dark:bg-stone-850/60 border border-stone-200/70 dark:border-stone-800 rounded-2xl space-y-3">
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                  Product Image
                </label>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {image ? (
                    <img 
                      src={image} 
                      alt="Preview" 
                      className="w-16 h-16 rounded-xl object-cover border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 shrink-0" 
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400 text-xs shrink-0">
                      No Img
                    </div>
                  )}

                  <div className="flex-1 w-full space-y-2">
                    <input 
                      type="text" 
                      placeholder="Image URL (or upload below)" 
                      value={image} 
                      onChange={(e) => setImage(e.target.value)} 
                      className="w-full px-3.5 py-2 text-xs bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 transition"
                      required 
                    />
                    
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-1 text-xs font-bold text-green-700 dark:text-green-400 bg-white dark:bg-stone-750 border border-stone-200 dark:border-stone-700 px-3 py-1.5 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-700 transition shadow-2xs">
                        <span>📁 Choose File</span>
                        <input
                          type="file"
                          onChange={uploadFileHandler}
                          className="hidden"
                        />
                      </label>
                      {loadingUpload && <span className="text-xs text-stone-500 dark:text-stone-400">Uploading image...</span>}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                  Detailed Description
                </label>
                <textarea 
                  placeholder="Describe farm origins, harvest certifications, flavor profile..." 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  rows={4}
                  className="w-full px-4 py-2.5 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 transition" 
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={loadingUpdate}
                className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 px-6 rounded-2xl text-sm transition duration-200 shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
              >
                {loadingUpdate ? 'Saving Updates...' : 'Update Product & Return to List →'}
              </button>

            </form>
          )}

        </div>
      </div>
    </div>
  );
}

export default ProductEditPage;