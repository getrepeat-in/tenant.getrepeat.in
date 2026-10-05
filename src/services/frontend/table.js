import api from "@/lib/api/axiosInstance";

export const TableService = {
    getAll: async (slug) => {
        try {
            const response = await api.get(`/api/${slug}/tables`);
            return response.data;
        } catch (error) {
            console.error("Table fetch error:", error.response?.data || error);
            throw error.response?.data || { message: "Failed to fetch tables" };
        }
    },
    verifyToken: async (slug, token) => {
        try {
            const response = await api.get(`/api/${slug}/tables/verify`, {
                params: { token }
            });
            return response.data;
        } catch (error) {
            console.error("Table token verify error:", error.response?.data || error);
            throw error.response?.data || { message: "Failed to verify table token" };
        }
    }
};
