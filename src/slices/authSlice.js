import { createSlice } from '@reduxjs/toolkit';

const getInitialUserInfo = () => {
  try {
    const item = localStorage.getItem('userInfo');
    return item ? JSON.parse(item) : null;
  } catch (e) {
    return null;
  }
};

const initialState = {
  userInfo: getInitialUserInfo(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const user = {
        ...action.payload,
        isAdmin: action.payload.isAdmin || action.payload.role === 'admin',
      };
      state.userInfo = user;
      localStorage.setItem('userInfo', JSON.stringify(user));
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
