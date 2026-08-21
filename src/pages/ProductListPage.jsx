import { Link, useNavigate } from 'react-router-dom';
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useCreateProductMutation,
} from '../slices/productsApiSlice';

function ProductListPage() {
  const navigate = useNavigate();

  const { data: products, isLoading, error, refetch } = useGetProductsQuery();
  const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();
  const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id).unwrap();
        refetch();
      } catch (err) {
        alert(err?.data?.message || err.error || 'Failed to delete product');
      }
    }
  };

  const createProductHandler = async () => {
    try {
      const res = await createProduct().unwrap();
      refetch();
      navigate(`/admin/product/${res._id}/edit`);
    } catch (err) {
      alert(err?.data?.message || err.error || 'Failed to create product');
    }
  };

  const productList = Array.isArray(products)
    ? products
    : products?.products || [];

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-10">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-green-700 uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full">
              Admin Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight mt-2">
              Harvest Products Catalog
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Manage live inventory items, prices, classifications, and imagery.
            </p>
          </div>

          <button 
            onClick={createProductHandler}
            disabled={loadingCreate}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-5 rounded-2xl text-xs transition duration-200 shadow-sm flex items-center justify-center gap-2 self-start sm:self-auto disabled:opacity-50"
          >
            {loadingCreate ? 'Generating...' : '+ Create New Product'}
          </button>
        </div>

        {loadingDelete && (
          <div className="bg-amber-50 text-amber-800 text-xs font-semibold p-3 rounded-2xl mb-4 border border-amber-200">
            Deleting product from database...
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 text-xs p-6 rounded-3xl border border-red-200 text-center">
            {error?.data?.message || error.error || 'Failed to load products'}
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xs border border-stone-200/80 p-6 sm:p-7 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-100 text-stone-400 font-bold uppercase tracking-wider">
                  <th className="pb-3 pr-4">Product</th>
                  <th className="pb-3 px-4">Price</th>
                  <th className="pb-3 px-4">Category</th>
                  <th className="pb-3 px-4">Stock</th>
                  <th className="pb-3 pl-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {productList.map((product) => (
                  <tr key={product._id} className="hover:bg-stone-50/60 transition">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 rounded-xl object-cover bg-stone-50 border border-stone-100 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-stone-900 text-xs sm:text-sm">{product.name}</p>
                          <p className="text-[10px] text-stone-400 font-mono">#{product._id.substring(0, 10)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-bold text-stone-900">
                      ${Number(product.price || 0).toFixed(2)}
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 font-bold text-[10px]">
                        {product.category || 'General'}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-semibold text-stone-600">
                      {product.countInStock || product.stock || 0} units
                    </td>
                    <td className="py-4 pl-4 text-right space-x-2 whitespace-nowrap">
                      <Link 
                        to={`/admin/product/${product._id}/edit`}
                        className="inline-block bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold py-1.5 px-3 rounded-lg text-xs transition"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => deleteHandler(product._id)}
                        className="inline-block bg-red-50 hover:bg-red-100 text-red-600 font-bold py-1.5 px-3 rounded-lg text-xs transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductListPage;