import {combineReducers, configureStore} from "@reduxjs/toolkit"
import productsReducer from "./slices/products"
import historyReducer from "./slices/history"
import zonesReducer from "./slices/zones"
import ordersReducer from "./slices/orders"
import statsReducer from "./slices/stats"
import membersReducer from "./slices/members";
import ticketsReducer from "./slices/tickets";
export let store = configureStore({
  reducer: combineReducers({
    products: productsReducer,
    history: historyReducer,
    zones: zonesReducer,
    orders: ordersReducer,
    stats: statsReducer,
    members: membersReducer,
    tickets: ticketsReducer,
  }),
});

export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
