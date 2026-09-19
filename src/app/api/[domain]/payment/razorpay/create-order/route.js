import Razorpay from "razorpay";
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

        const key_id = process.env.RAZORPAY_API_KEY;
        const key_secret = process.env.RAZORPAY_KEY_SECRET;

        if (!key_id || !key_secret) {
            return JsonResponse.error(
                "Razorpay API credentials not configured on server.",
                500
            );
        }

        const razorpayInstance = new Razorpay({
            key_id,
            key_secret,
        });

        // Amount must be in the smallest currency sub-unit (paise for INR)
        const amountInPaise = Math.round(Number(amount) * 100);

        const options = {
            amount: amountInPaise,
            currency,
            receipt: `rcpt_${domain}_${Date.now()}`,
            notes: {
                domain,
                ...notes,
            },
        };

        const order = await razorpayInstance.orders.create(options);

        return JsonResponse.success(
            {
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                key: key_id,
            },
            "Razorpay order created successfully",
            201
        );
    } catch (err) {
        console.error("Razorpay create order error:", err);
        return JsonResponse.error(
            err.message || "Failed to create Razorpay order",
            500
        );
    }
};
