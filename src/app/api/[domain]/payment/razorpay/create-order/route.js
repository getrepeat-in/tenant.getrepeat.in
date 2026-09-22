import merchantApi from "@/lib/api/merchantInstance";
import { JsonResponse } from "@/lib/api/responseHandler";

export const POST = async (req, { params }) => {
    try {
        const { domain } = await params;
        const body = await req.json();
        const { amount, currency = "INR", notes = {} } = body;

        if (!domain) {
            return JsonResponse.error("Restaurant slug is required!", 400);
        }

        if (!amount || amount <= 0) {
            return JsonResponse.error("Valid order amount is required!", 400);
        }

        const response = await merchantApi.post(`/api/${domain}/payment/razorpay/create-order`, {
            amount,
            currency,
            notes
        });

        const responseData = response.data?.data || response.data;

        return JsonResponse.success(
            responseData,
            "Razorpay order created successfully",
            201
        );
    } catch (err) {
        console.error("Razorpay create order error:", err);
        return JsonResponse.error(
            err?.response?.data?.message || err.message || "Failed to create Razorpay order",
            err?.response?.status || 500
        );
    }
};
