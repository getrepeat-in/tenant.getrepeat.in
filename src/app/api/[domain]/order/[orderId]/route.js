import { proxyMerchantRequest } from "@/lib/api/proxy";
import { JsonResponse } from "@/lib/api/responseHandler";

export const GET = async (req, { params }) => {
    try {
        const { domain, orderId } = await params;

        if (!domain || !orderId) {
            return JsonResponse.error("Restaurant domain and order ID are required!", 400);
        }

        return await proxyMerchantRequest({
            method: "GET",
            url: `/api/${domain}/order/${orderId}`,
            req,
            successMessage: "Order details fetched successfully",
            errorMessage: "Failed to fetch order details from server",
        });
    } catch (err) {
        console.error("Get order by ID error:", err);
        return JsonResponse.error(err.message || "Failed to fetch order details", 500);
    }
};

export const PATCH = async (req, { params }) => {
    try {
        const { domain, orderId } = await params;
        const body = await req.json();

        if (!domain || !orderId) {
            return JsonResponse.error("Restaurant domain and order ID are required!", 400);
        }

        return await proxyMerchantRequest({
            method: "PATCH",
            url: `/api/${domain}/order/${orderId}`,
            req,
            data: body,
            successMessage: "Order updated successfully",
            errorMessage: "Failed to update order",
        });
    } catch (err) {
        console.error("Patch order error:", err);
        return JsonResponse.error(err.message || "Failed to cancel order", 500);
    }
};
