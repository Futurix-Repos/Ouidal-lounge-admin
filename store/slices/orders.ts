import { createSlice } from "@reduxjs/toolkit";

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    status: "",
    paymentMethod: "",
    date: "",
    startDate: "",
    endDate: "",
    open: false,
    stand: "",
  },
  reducers: {
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
    setDate: (state, action) => {
      state.date = action.payload;
    },
    setStartDate: (state, action) => {
      state.startDate = action.payload;
    },
    setEndDate: (state, action) => {
      state.endDate = action.payload;
    },
    setStand: (state, action) => {
      state.stand = action.payload;
    },
    toggleOrderFilter: (state) => {
      state.open = !state.open;
    },
  },
});
export const {
  setStatus,
  setDate,
  setPaymentMethod,
  setStartDate,
  setEndDate,
  setStand,
  toggleOrderFilter,
} = ordersSlice.actions;
export default ordersSlice.reducer;
