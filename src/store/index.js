import userReducer from "./slices/userSlice";
import cartReducer from "./slices/cartSlice";
import menuReducer from "./slices/menuSlice";
import restaurantReducer from "./slices/restaurantSlice";
import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./slices/notificationSlice";

const localStorageMiddleware = (storeAPI) => (next) => (action) => {
    const result = next(action);
    if (action.type?.startsWith("cart/")) {
        const state = storeAPI.getState();
        if (typeof window !== "undefined") {
            try {
                localStorage.setItem("getrepeat-cart", JSON.stringify(state.cart));
            } catch (e) {
                console.error("Could not save cart state", e);
            }
        }
    }
    return result;
};

export const makeStore = () => {
    return configureStore({
        reducer: {
            user: userReducer,
            notification: notificationReducer,
            cart: cartReducer,
            menu: menuReducer,
            restaurant: restaurantReducer,
        },
        middleware: (getDefaultMiddleware) => 
            getDefaultMiddleware().concat(localStorageMiddleware),
    });
};
