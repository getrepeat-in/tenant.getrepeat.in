import { AuthService } from "@/services/frontend/auth.service";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUser = createAsyncThunk("user/fetchUser", async (_, { rejectWithValue }) => {
    try {
        const response = await AuthService.me();
        return response.data;
    } catch (error) {
        AuthService.logout().catch(console.error);
        return rejectWithValue(error.message || "Failed to fetch user");
    }
});

const initialState = {
    user: null,
    loading: true,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        clearUser: (state) => {
            state.user = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(fetchUser.rejected, (state) => {
                state.loading = false;
                state.user = null;
            });
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
