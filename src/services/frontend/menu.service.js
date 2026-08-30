import api from "@/lib/api/axiosInstance";
import { getTenantSlug } from "@/lib/utils";
import { API_ENDPOINTS } from "../api-endpoints";

export class MenuService {
    static async search({ query = "", isVeg = "", page = 1, limit = 10 }, slug = getTenantSlug()) {
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
}
