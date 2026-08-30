import axios from "axios";
import { API_ENDPOINTS } from "@/services/api-endpoints";

export const MenuService = {
    category: {
        getAll: async (slug) => {
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
    }
};
