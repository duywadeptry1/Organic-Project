import { apiSlice } from './apiSlice';

export const farmApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFarmWallet: builder.query({
      query: (brand) => ({
        url: brand ? `/api/farm/wallet?brand=${encodeURIComponent(brand)}` : '/api/farm/wallet',
      }),
      providesTags: ['Farm'],
      keepUnusedDataFor: 5,
    }),

    requestWithdrawal: builder.mutation({
      query: (data) => ({
        url: '/api/farm/withdraw',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Farm'],
    }),

    getMyWithdrawals: builder.query({
      query: (brand) => ({
        url: brand ? `/api/farm/withdrawals?brand=${encodeURIComponent(brand)}` : '/api/farm/withdrawals',
      }),
      providesTags: ['Farm'],
      keepUnusedDataFor: 5,
    }),

    updateBankInfo: builder.mutation({
      query: (data) => ({
        url: '/api/farm/bank-info',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Farm', 'User'],
    }),

    // Admin Endpoints
    getAllWithdrawals: builder.query({
      query: () => ({
        url: '/api/farm/admin/withdrawals',
      }),
      providesTags: ['Farm'],
      keepUnusedDataFor: 5,
    }),

    approveWithdrawal: builder.mutation({
      query: ({ id, adminNotes }) => ({
        url: `/api/farm/admin/withdrawals/${id}/approve`,
        method: 'PUT',
        body: { adminNotes },
      }),
      invalidatesTags: ['Farm'],
    }),

    rejectWithdrawal: builder.mutation({
      query: ({ id, adminNotes }) => ({
        url: `/api/farm/admin/withdrawals/${id}/reject`,
        method: 'PUT',
        body: { adminNotes },
      }),
      invalidatesTags: ['Farm'],
    }),
  }),
});

export const {
  useGetFarmWalletQuery,
  useRequestWithdrawalMutation,
  useGetMyWithdrawalsQuery,
  useUpdateBankInfoMutation,
  useGetAllWithdrawalsQuery,
  useApproveWithdrawalMutation,
  useRejectWithdrawalMutation,
} = farmApiSlice;
