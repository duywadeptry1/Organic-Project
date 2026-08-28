import { apiSlice } from './apiSlice';

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.pageNumber) queryParams.append('pageNumber', params.pageNumber);
        if (params.pageSize) queryParams.append('pageSize', params.pageSize);
        if (params.limit) queryParams.append('limit', params.limit);
        if (params.category && params.category !== 'All') queryParams.append('category', params.category);
        if (params.keyword) queryParams.append('keyword', params.keyword);
        if (params.sort) queryParams.append('sort', params.sort);

        const queryString = queryParams.toString();
        return {
          url: `/api/products${queryString ? `?${queryString}` : ''}`,
        };
      },
      providesTags: ['Product'],
      keepUnusedDataFor: 5,
    }),

    getProductDetails: builder.query({
      query: (productId) => ({
        url: `/api/products/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),

    createProduct: builder.mutation({
      query: (data) => ({
        url: '/api/products',
        method: 'POST',
        body: data || {},
      }),
      invalidatesTags: ['Product'],
    }),

    bulkCreateProducts: builder.mutation({
      query: (data) => ({
        url: '/api/products/bulk',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),

    updateProduct: builder.mutation({
      query: (data) => ({
        url: `/api/products/${data.productId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),

    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: '/api/upload',
        method: 'POST',
        body: data,
      }),
    }),

    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `/api/products/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useBulkCreateProductsMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useDeleteProductMutation,
} = productsApiSlice;
