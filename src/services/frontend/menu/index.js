import axios from "axios";
import { getTenantSlug } from "@/lib/utils";
import { API_ENDPOINTS } from "../../api-endpoints";

export const MenuService = {
    getMenu: async (slug = getTenantSlug()) => {
        const response = await axios.get(API_ENDPOINTS.MENU.GET(slug));
        const data = response.data;
        if (!data.success) {
            throw new Error(data.message || "Failed to load menu.");
        }
        return data;
    },
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
};
