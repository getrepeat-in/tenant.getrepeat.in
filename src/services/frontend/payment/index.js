import axios from "axios";
import { API_ENDPOINTS } from "@/services/api-endpoints";

export const PaymentService = {
    /**
     * Dynamically loads Razorpay checkout script if not present
     */
    loadScript: () => {
        return new Promise((resolve) => {
            if (typeof window === "undefined") {
                resolve(false);
                return;
            }

            if (window.Razorpay) {
                resolve(true);
                return;
            }

            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    },

    /**
     * Create Razorpay order on server
     */
    createRazorpayOrder: async (domain, { amount, notes }) => {
        const response = await axios.post(
            API_ENDPOINTS.PAYMENT.CREATE_ORDER(domain),
            {
                amount,
                notes,
            }
        );
        return response.data?.data || response.data;
    },

    /**
     * Verify payment on server
     */
    verifyPayment: async (
        domain,
        { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData }
    ) => {
        const response = await axios.post(
            API_ENDPOINTS.PAYMENT.VERIFY(domain),
            {
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
                orderData,
            }
        );
        return response.data?.data || response.data;
    },

    /**
     * Create direct order (e.g. Cash on Delivery / Pay at Counter)
     */
    createDirectOrder: async (domain, orderData) => {
        const response = await axios.post(
            API_ENDPOINTS.ORDER.CREATE(domain),
            orderData
        );
        return response.data?.data || response.data;
    },
};

export default PaymentService;
