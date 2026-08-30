import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
    restaurantId: null,
};

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        loadCart: (state, action) => {
            state.items = action.payload.items || [];
            state.restaurantId = action.payload.restaurantId || null;
        },

        addItem: (state, action) => {
            const {
                item,
                restaurantId,
                selectedCustomizations = {},
                price = item.price || item.base_price || item.defaultPrice,
                quantity = 1
            } = action.payload;
            if (state.restaurantId && state.restaurantId !== restaurantId) {
                state.items = [];
            }
            state.restaurantId = restaurantId;

            const variantKey = Object.keys(selectedCustomizations).length ? `|${JSON.stringify(selectedCustomizations)}` : "";
            const cartItemId = `${item._id}${variantKey}`;

            const existingItem = state.items.find(i => i.cartItemId === cartItemId || (i.item._id === item._id && !i.cartItemId && !variantKey));

            if (existingItem) {
                existingItem.quantity += quantity;
                return;
            }

            state.items.push({ cartItemId, item, quantity, selectedCustomizations, price });
        },

        removeItem: (state, action) => {
            state.items = state.items.filter(i => (i.cartItemId || i.item._id) !== action.payload);
            if (!state.items.length) state.restaurantId = null;
        },

        updateQuantity: (state, action) => {
            const { itemId, cartItemId, quantity } = action.payload;
            const targetId = cartItemId || itemId;

            const itemIndex = state.items.findIndex(i => (i.cartItemId || i.item._id) === targetId);
            if (itemIndex === -1) return;

            if (quantity <= 0) {
                state.items.splice(itemIndex, 1);
            } else {
                state.items[itemIndex].quantity = quantity;
            }

            if (!state.items.length) state.restaurantId = null;
        },

        clearCart: (state) => {
            state.items = [];
            state.restaurantId = null;
        }
    }
});

export const { loadCart, addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
