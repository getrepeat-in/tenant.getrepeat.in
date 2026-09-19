import axios from "axios";
import { API_ENDPOINTS } from "@/services/api-endpoints";

export const InstagramService = {
    getPosts: async (slug) => {
        const response = await axios.get(API_ENDPOINTS.INSTAGRAM.POSTS(slug));
        const data = response.data;
        if (!data.success) {
            throw new Error(data.message || "Failed to load Instagram posts.");
        }
        return data.data || [];
    },
};