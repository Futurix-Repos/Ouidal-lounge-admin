import {createSlice} from "@reduxjs/toolkit"

const productsSlice = createSlice({
  name: "products",
  initialState: {
    warehouse: {
      warehouseId: "",
      categoryId: "",
      productName: "",
      productId: "",
      product: {
        id: "",
        name: "",
        sellingPrice: "",
        buyingPrice: 0,
        sellingPerUnit: {price: 0, qty: 0, isTrue: false},
      },
    },
    stand: {
      standId: "",
      categoryId: "",
      productName: "",
      productId: "",
      product: {},
    },
  },
  reducers: {
    setWarehouseId: (state, action) => {
      state.warehouse.warehouseId = action.payload
    },
    setWarehouseCategoryId: (state, action) => {
      state.warehouse.categoryId = action.payload
    },
    setWarehouseProductName: (state, action) => {
      state.warehouse.productName = action.payload
    },
    setStandId: (state, action) => {
      state.stand.standId = action.payload
    },
    setStandCategoryId: (state, action) => {
      state.stand.categoryId = action.payload
    },
    setStandProductName: (state, action) => {
      state.stand.productName = action.payload
    },
    setWarehouseProductId: (state, action) => {
      state.warehouse.productId = action.payload
    },
    setStandProductId: (state, action) => {
      state.stand.productId = action.payload
    },
    setWarehouseProduct: (state, action) => {
      state.warehouse.product = action.payload
    },
    setStandProduct: (state, action) => {
      state.stand.product = action.payload
    },
  },
})
export const {
  setWarehouseId,
  setWarehouseCategoryId,
  setWarehouseProductName,

  setWarehouseProductId,
  setStandId,
  setStandProductName,

  setStandCategoryId,

  setStandProductId,
  setWarehouseProduct,
  setStandProduct,
} = productsSlice.actions
export default productsSlice.reducer
