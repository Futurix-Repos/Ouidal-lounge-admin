import { createSlice } from "@reduxjs/toolkit";

const ingredientsSlice = createSlice({
  name: "ingredients",
  initialState: {
    items: [],

    open: false,
  },
  reducers: {
    addIngredient: (state, action) => {
        const product = action.payload
        // @ts-ignore
        if(state.items.find((item) => item.id === product.id)) {
            return;
        }
      // @ts-ignore
      state.items.push({id:product.id, qty: 1, unit:product.sellingPerUnit.unit, name:product.name, contenance: product.contenance});
    },
    removeIngredient: (state, action) => {
      state.items = state.items.filter((item) => {
        // @ts-ignore
        return item.id !== action.payload;
      });
    },
    incIngredientQty: (state, action) => {
      state.items = state.items.map((item) => {
        // @ts-ignore
        if (item.id === action.payload) {
          // @ts-ignore
          item.qty = item.qty + 1;
        }
        return item;
      });
    },
    decIngredientQty: (state, action) => {
        state.items = state.items.map((item) => {
            // @ts-ignore
            if (item.id === action.payload && item.qty > 1) {
            // @ts-ignore
            item.qty = item.qty - 1;
            }
            return item;
        });
    },
      resetIngredients: (state) => {
            state.items = [];

      },
      openSelection: (state) => {
            state.open = true;
      },
      closeSelection: (state) => {
            state.open = false;
      }
  },
});
export const {
    addIngredient,
    removeIngredient,
    incIngredientQty,
    decIngredientQty,
    openSelection,
    closeSelection,
    resetIngredients
} = ingredientsSlice.actions;
export default ingredientsSlice.reducer;
