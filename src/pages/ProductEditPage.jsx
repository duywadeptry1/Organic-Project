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
    <div className="bg-[#FDFBF7] min-h-screen py-10">
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        
        <Link 
          to="/admin/productlist" 
          className="text-xs font-bold text-green-700 hover:text-green-800 mb-6 inline-flex items-center gap-1.5"
        >
          &larr; Back to Catalog List
        </Link>

        <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-xs border border-stone-200/80">
          
          <div className="mb-6 pb-4 border-b border-stone-100">
            <span className="text-xs font-bold text-green-700 uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full">
              Product Editor
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight mt-2">
              Edit Produce Details
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Modify inventory counts, organic certificates, pricing, and display imagery.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-700 text-xs p-6 rounded-2xl text-center">
              {error?.data?.message || error.error || 'Failed to load product details'}
            </div>
          ) : (
            <form onSubmit={submitHandler} className="space-y-5">
              
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Produce Name
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Organic Avocados" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-stone-800"
                  required 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Price ($ USD)
                  </label>
                  <input 
                    type="number" 
                    step="0.01" 
                    placeholder="0.00" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)} 
                    className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-stone-800"
                    required 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Count In Stock
                  </label>
                  <input 
                    type="number" 
                    placeholder="0" 
                    value={countInStock} 
                    onChange={(e) => setCountInStock(e.target.value)} 
                    className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-stone-800"
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Vegetables, Fresh Fruit, Dairy" 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)} 
                    className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-stone-800"
                    required 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Farm / Brand
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Valley Organic Farm" 
                    value={brand} 
                    onChange={(e) => setBrand(e.target.value)} 
                    className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-stone-800"
                    required 
                  />
                </div>
              </div>

              {/* Image Section */}
              <div className="p-4 bg-stone-50/70 border border-stone-200/70 rounded-2xl space-y-3">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Product Image
                </label>
                
                <div className="flex items-center gap-4">
                  {image ? (
                    <img 
                      src={image} 
                      alt="Preview" 
                      className="w-16 h-16 rounded-xl object-cover border border-stone-200 bg-white shrink-0" 
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl border border-stone-200 bg-stone-100 flex items-center justify-center text-stone-400 text-xs shrink-0">
                      No Img
                    </div>
                  )}

                  <div className="flex-1 space-y-2">
                    <input 
                      type="text" 
                      placeholder="Image URL (or upload below)" 
                      value={image} 
                      onChange={(e) => setImage(e.target.value)} 
                      className="w-full px-3.5 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 text-stone-800"
                      required 
                    />
                    
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-white border border-stone-200 px-3 py-1.5 rounded-lg hover:bg-stone-50 transition shadow-2xs">
                        <span>📁 Choose File</span>
                        <input
                          type="file"
                          onChange={uploadFileHandler}
                          className="hidden"
                        />
                      </label>
                      {loadingUpload && <span className="text-xs text-stone-500">Uploading image...</span>}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Detailed Description
                </label>
                <textarea 
                  placeholder="Describe farm origins, harvest certifications, flavor profile..." 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  rows={4}
                  className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-stone-800" 
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={loadingUpdate}
                className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 px-6 rounded-2xl text-sm transition duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
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