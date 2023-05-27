import { createSlice } from "@reduxjs/toolkit";

const ticketsSlice = createSlice({
  name: "tickets",
  initialState: {
    date: "",
    startDate: "",
    endDate: "",
    open: false,
    stand: "",
  },
  reducers: {
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
    toggleTicketFilter: (state) => {
      state.open = !state.open;
    },
  },
});
export const {
  setDate,
  setStartDate,
  setEndDate,
  setStand,
  toggleTicketFilter,
} = ticketsSlice.actions;
export default ticketsSlice.reducer;
