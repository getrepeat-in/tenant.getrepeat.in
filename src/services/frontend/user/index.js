import axios from "axios";
import { API_ENDPOINTS } from "../../api-endpoints";

export const UserService = {
    getAddresses: async (slug) => {
        try {
            const response = await axios.get(API_ENDPOINTS.USER.ADDRESSES(slug));
            console.log("GET ADDRESSES RAW RESPONSE:", response.data);
            return response.data.data;
        } catch (error) {
            console.error("UserService.getAddresses Error:", error);
            throw new Error(error.response?.data?.message || "Failed to fetch addresses");
        }
    },

    addAddress: async (slug, addressData) => {
        try {
            const response = await axios.post(API_ENDPOINTS.USER.ADDRESSES(slug), addressData);
            return response.data.data;
        } catch (error) {
            console.error("UserService.addAddress Error:", error);
            throw new Error(error.response?.data?.message || "Failed to add address");
        }
    },

    updateAddress: async (slug, addressId, addressData) => {
        try {
            const response = await axios.put(API_ENDPOINTS.USER.ADDRESS(slug, addressId), addressData);
            return response.data.data;
        } catch (error) {
            console.error("UserService.updateAddress Error:", error);
            throw new Error(error.response?.data?.message || "Failed to update address");
        }
    },

    deleteAddress: async (slug, addressId) => {
        try {
            const response = await axios.delete(API_ENDPOINTS.USER.ADDRESS(slug, addressId));
            return response.data;
        } catch (error) {
            console.error("UserService.deleteAddress Error:", error);
            throw new Error(error.response?.data?.message || "Failed to delete address");
        }
    }
};
