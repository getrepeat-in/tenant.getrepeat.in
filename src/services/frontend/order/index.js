import axios from "axios";
import { API_ENDPOINTS } from "@/services/api-endpoints";

export const OrderService = {
    /**
     * Create a new order (Dine-in / Takeaway / Online)
     */
    createOrder: async (domain, payload) => {
        const response = await axios.post(
            API_ENDPOINTS.ORDER.CREATE(domain),
            payload
        );
        return response.data?.data || response.data;
    },

    /**
     * Live order details & tracking by MongoDB _id or orderNumber
     */
    getOrderById: async (domain, orderId) => {
        const response = await axios.get(
            API_ENDPOINTS.ORDER.GET_BY_ID(domain, orderId)
        );
        return response.data?.data || response.data;
    },

    /**
     * Fetch customer order history (supports JWT auth, phone, userId, status, page, limit)
     */
    getOrderHistory: async (domain, params = {}) => {
        let queryParams = {};
        if (typeof params === "number") {
            queryParams = { page: params, limit: 20 };
        } else if (typeof params === "object" && params !== null) {
            queryParams = params;
        }

        const query = new URLSearchParams();
        if (queryParams.page) query.append("page", queryParams.page);
        if (queryParams.limit) query.append("limit", queryParams.limit);
        if (queryParams.phone) query.append("phone", queryParams.phone);
        if (queryParams.userId) query.append("userId", queryParams.userId);
        if (queryParams.status) query.append("status", queryParams.status);

        const qs = query.toString();
        const response = await axios.get(
            `/api/${domain}/order${qs ? `?${qs}` : ""}`
        );
        return response.data?.data || response.data;
    },

    /**
     * Cancel an order (for orders in PENDING_PAYMENT or PLACED status)
     */
    cancelOrder: async (domain, orderId, reason = "Changed my mind") => {
        const response = await axios.patch(
            API_ENDPOINTS.ORDER.CANCEL(domain, orderId),
            {
                action: "cancel",
                reason,
            }
        );
        return response.data?.data || response.data;
    },
};

export default OrderService;
