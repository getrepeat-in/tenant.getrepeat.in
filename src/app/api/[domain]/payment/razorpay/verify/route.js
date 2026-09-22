import merchantApi from "@/lib/api/merchantInstance";
import { JsonResponse } from "@/lib/api/responseHandler";

export const POST = async (req, { params }) => {
    try {
        const { domain } = await params;
        const body = await req.json();
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderData,
        } = body;

        if (!domain) {
            return JsonResponse.error("Restaurant slug is required!", 400);
        }

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return JsonResponse.error(
                "Missing Razorpay payment verification details!",
                400
            );
        }

        const response = await merchantApi.post(`/api/${domain}/payment/razorpay/verify`, {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderData,
        });

        const responseData = response.data?.data || response.data;

        return JsonResponse.success(
            responseData,
            "Payment verified successfully",
            200
        );
    } catch (err) {
        console.error("Razorpay verification error:", err);
        return JsonResponse.error(
            err?.response?.data?.message || err.message || "Failed to verify payment",
            err?.response?.status || 500
        );
    }
};
