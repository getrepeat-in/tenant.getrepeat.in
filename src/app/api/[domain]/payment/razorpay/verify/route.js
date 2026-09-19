import crypto from "crypto";
import { JsonResponse } from "@/lib/api/responseHandler";
import merchantApi from "@/lib/api/merchantInstance";

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

        const key_secret = process.env.RAZORPAY_KEY_SECRET;
        if (!key_secret) {
            return JsonResponse.error(
                "Razorpay secret key not configured on server.",
                500
            );
        }

        // Generate expected signature
        const hmac = crypto.createHmac("sha256", key_secret);
        hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const generatedSignature = hmac.digest("hex");

        const isValid = generatedSignature === razorpay_signature;

        if (!isValid) {
            return JsonResponse.error(
                "Payment verification failed: Invalid signature",
                400
            );
        }

        // Optional: Notify or sync order to merchant API
        let merchantOrderResult = null;
        try {
            if (process.env.MERCHANT_APP_URL && orderData) {
                const res = await merchantApi.post(`/api/${domain}/orders`, {
                    ...orderData,
                    payment: {
                        method: "RAZORPAY",
                        status: "PAID",
                        razorpay_order_id,
                        razorpay_payment_id,
                        razorpay_signature,
                    },
                });
                merchantOrderResult = res.data?.data || res.data;
            }
        } catch (merchantErr) {
            console.warn(
                "Could not sync order to merchant API (continuing):",
                merchantErr.message
            );
        }

        return JsonResponse.success(
            {
                verified: true,
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id,
                order: merchantOrderResult,
            },
            "Payment verified successfully",
            200
        );
    } catch (err) {
        console.error("Razorpay verification error:", err);
        return JsonResponse.error(
            err.message || "Failed to verify payment",
            500
        );
    }
};
