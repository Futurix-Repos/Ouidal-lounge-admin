import {createSlice} from "@reduxjs/toolkit"

const statsSlice = createSlice({
  name: "stats",
  initialState: {
    global: {
      date: "",
      productName: "",
      interval: {
        start: "",
        end: "",
      },
    },
    perStand: {
      date: "",
      productName: "",
      interval: {
        start: "",
        end: "",
      },
      standId: "",
    },
  },
  reducers: {
    setGlobalDate: (state, action) => {
      state.global.date = action.payload
    },
    setGlobalProductName: (state, action) => {
      state.global.productName = action.payload
    },
    setPerStandDate: (state, action) => {
      state.perStand.date = action.payload
    },
    setPerStandProductName: (state, action) => {
      state.perStand.productName = action.payload
    },

    setGlobalIntervalStart: (state, action) => {
      state.global.interval.start = action.payload
    },
    setGlobalIntervalEnd: (state, action) => {
      state.global.interval.end = action.payload
    },
    setPerStandIntervalStart: (state, action) => {
      state.perStand.interval.start = action.payload
    },
    setPerStandIntervalEnd: (state, action) => {
      state.perStand.interval.end = action.payload
    },

    setPerStandStandId: (state, action) => {
      state.perStand.standId = action.payload
    },
  },
})
export const {
  setGlobalDate,
  setGlobalProductName,
  setPerStandDate,
  setPerStandProductName,
  setGlobalIntervalStart,
  setGlobalIntervalEnd,
  setPerStandIntervalStart,
  setPerStandIntervalEnd,
  setPerStandStandId,
} = statsSlice.actions
export default statsSlice.reducer
