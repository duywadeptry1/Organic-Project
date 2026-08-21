import { apiSlice } from './apiSlice';

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    
    createOrder: builder.mutation({
      query: (order) => ({
        url: '/api/orders', // Hardcoded string instead of variable
        method: 'POST',
        body: {...order},
      }),
    }),
    
    getOrderDetails: builder.query({
      query: (orderId) => ({
        url: `/api/orders/${orderId}`, // Hardcoded string
      }),
      keepUnusedDataFor: 5,
    }),
    
    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `/api/orders/${orderId}/pay`, // Hardcoded string
        method: 'PUT',
        body: { ...details },
      }),
    }),
    
    getPayPalClientId: builder.query({
      query: () => ({
        url: '/api/config/paypal', // Hardcoded string
      }),
      keepUnusedDataFor: 5,
    }),
    
    // THIS IS THE ONE CRASHING YOUR PROFILE PAGE!
    getMyOrders: builder.query({
      query: () => ({
        url: '/api/orders/mine', // Hardcoded string
      }),
      keepUnusedDataFor: 5,
    }),

    getOrders: builder.query({
      query: () => ({
        url: '/api/orders',
      }),
      keepUnusedDataFor: 5,
    }),

    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `/api/orders/${orderId}/deliver`,
        method: 'PUT',
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPayPalClientIdQuery,
  useGetMyOrdersQuery,
  useGetOrdersQuery,
  useDeliverOrderMutation,
} = ordersApiSlice;