import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    addonGroups: [],
};

export const menuSlice = createSlice({
    name: "menu",
    initialState,
    reducers: {
        setAddonGroups: (state, action) => {
            const newGroups = action.payload || [];
            if (!Array.isArray(newGroups)) return;
            
            const existingIds = new Set(state.addonGroups.map(g => g._id));
            newGroups.forEach(group => {
                if (!existingIds.has(group._id)) {
                    state.addonGroups.push(group);
                }
            });
        },
        clearMenu: (state) => {
            state.addonGroups = [];
        }
    }
});

export const { setAddonGroups, clearMenu } = menuSlice.actions;
export default menuSlice.reducer;
