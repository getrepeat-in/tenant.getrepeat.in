import axios from "axios";
import api from "@/lib/api/axiosInstance";
import { getTenantSlug } from "@/lib/utils";
import { API_ENDPOINTS } from "../../api-endpoints";

export const MenuService = {
    category: {
        getAll: async (slug = getTenantSlug()) => {
            const response = await axios.get(API_ENDPOINTS.MENU.CATEGORIES(slug));
            const data = response.data;
            if (!data.success) {
                throw new Error(data.message || "Failed to load categories.");
            }
            return data;
        },
    },
    item: {
        getByCategory: async (slug, categoryId) => {
            const response = await axios.get(API_ENDPOINTS.MENU.ITEMS(slug, categoryId));
            const data = response.data;
            if (!data.success) {
                throw new Error(data.message || "Failed to load items.");
            }
            return data;
        }
    },
    search: async ({ query = "", isVeg = "", page = 1, limit = 10 }, slug = getTenantSlug()) => {
        try {
            const response = await api.get(API_ENDPOINTS.MENU.SEARCH(slug), {
                params: {
                    q: query,
                    is_veg: isVeg,
                    page,
                    limit,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Search menu items error:", error);
            throw new Error(error.response?.data?.message || "Failed to search menu items");
        }
    }
};
