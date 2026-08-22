import { createSlice } from '@reduxjs/toolkit';

const getInitialCart = () => {
  try {
    const item = localStorage.getItem('cart');
    return item
      ? JSON.parse(item)
      : {
          cartItems: [],
          shippingAddress: {},
          paymentMethod: 'PayPal',
        };
  } catch (e) {
    return {
      cartItems: [],
      shippingAddress: {},
      paymentMethod: 'PayPal',
    };
  }
};

const initialState = getInitialCart();

const updateCartStorage = (state) => {
  localStorage.setItem('cart', JSON.stringify(state));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }

      updateCartStorage(state);
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      updateCartStorage(state);
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      updateCartStorage(state);
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      updateCartStorage(state);
    },
    clearCartItems: (state) => {
      state.cartItems = [];
      updateCartStorage(state);
    },
    resetCart: (state) => {
      state.cartItems = [];
      state.shippingAddress = {};
      state.paymentMethod = 'PayPal';
      localStorage.removeItem('cart');
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
  resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;
