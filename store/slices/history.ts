import {createSlice} from "@reduxjs/toolkit"

const historySlice = createSlice({
  name: "history",
  initialState: {
    warehouse: {
      productName: "",
      categoryId: "",
      warehouseId: "",
      type: "",
      date: "",
    },
    stand: {
      productName: "",
      categoryId: "",
      standId: "",
      type: "",
      date: "",
    },
  },
  reducers: {
    setWarehouseProductName: (state, action) => {
      state.warehouse.productName = action.payload
    },
    setWarehouseCategoryId: (state, action) => {
      state.warehouse.categoryId = action.payload
    },
    setWarehouseId: (state, action) => {
      state.warehouse.warehouseId = action.payload
    },
    setStandProductName: (state, action) => {
      state.stand.productName = action.payload
    },
    setStandCategoryId: (state, action) => {
      state.stand.categoryId = action.payload
    },
    setStandId: (state, action) => {
      state.stand.standId = action.payload
    },
    setStandType: (state, action) => {
      state.stand.type = action.payload
    },
    setWarehouseType: (state, action) => {
      state.warehouse.type = action.payload
    },
    setStandDate: (state, action) => {
      state.stand.date = action.payload
    },
    setWarehouseDate: (state, action) => {
      state.warehouse.date = action.payload
    },
  },
})
export const {
  setWarehouseProductName,
  setWarehouseCategoryId,
  setWarehouseId,
  setStandProductName,
  setStandCategoryId,
  setStandId,
  setWarehouseType,
  setStandType,

  setStandDate,
  setWarehouseDate,
} = historySlice.actions
export default historySlice.reducer
