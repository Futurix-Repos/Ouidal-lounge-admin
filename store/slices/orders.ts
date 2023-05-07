import {createSlice} from "@reduxjs/toolkit"

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    status: "success",
    paymentMethod: "",
    date: "",
    startDate: "",
    endDate: "",
  },
  reducers: {
    setStatus: (state, action) => {
      state.status = action.payload
    },
    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload
    },
    setDate: (state, action) => {
      state.date = action.payload
    },
    setStartDate: (state, action) => {
      state.startDate = action.payload
    },
    setEndDate: (state, action) => {
      state.endDate = action.payload
    },
  },
})
export const {setStatus, setDate, setPaymentMethod, setStartDate, setEndDate} = ordersSlice.actions
export default ordersSlice.reducer
