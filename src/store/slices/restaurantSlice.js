import api from "@/lib/api/axiosInstance";
import { getTenantSlug } from "@/lib/utils";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchRestaurant = createAsyncThunk(
    "restaurant/fetchRestaurant",
    async (customSlug, { rejectWithValue }) => {
        const slug = customSlug || getTenantSlug();
        if (!slug) return {};
        try {
            const response = await api.get(`/api/${slug}`);
            return response.data?.data || response.data || {};
        } catch (error) {
            console.error("fetchRestaurant error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch restaurant");
        }
    }
);

const initialState = {
    restaurant: null,
    loading: true,
    error: null,
    slug: null,
    tableInfo: {
        tableToken: null,
        tableNumber: null,
        isDineIn: false,
        tableId: null
    }
};

export const restaurantSlice = createSlice({
    name: "restaurant",
    initialState,
    reducers: {
        setRestaurant: (state, action) => {
            state.restaurant = action.payload;
            state.loading = false;
        },
        setSlug: (state, action) => {
            state.slug = action.payload;
        },
        setTableInfo: (state, action) => {
            state.tableInfo = { ...state.tableInfo, ...action.payload };
        },
        clearRestaurant: (state) => {
            state.restaurant = null;
            state.loading = false;
            state.error = null;
            state.tableInfo = { tableToken: null, tableNumber: null, isDineIn: false, tableId: null };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRestaurant.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRestaurant.fulfilled, (state, action) => {
                state.loading = false;
                state.restaurant = action.payload;
                state.slug = action.payload?.slug || getTenantSlug();
                state.error = null;
            })
            .addCase(fetchRestaurant.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch restaurant";
            });
    },
});

export const { setRestaurant, setSlug, setTableInfo, clearRestaurant } = restaurantSlice.actions;
export default restaurantSlice.reducer;
