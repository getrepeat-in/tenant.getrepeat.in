import { JsonResponse } from "@/lib/api/responseHandler";
import { proxyMerchantRequest } from "@/lib/api/proxy";

export const GET = async (req, { params }) => {
    try {
        const { domain } = await params;
        const { searchParams } = new URL(req.url);
        const queryString = searchParams.toString();

        if (!domain) {
            return JsonResponse.error("Restaurant domain is required!", 400);
        }

        return await proxyMerchantRequest({
            method: "GET",
            url: `/api/${domain}/user/orders${queryString ? `?${queryString}` : ""}`,
            req,
            successMessage: "User orders fetched successfully",
            errorMessage: "Failed to fetch orders from server",
        });
    } catch (err) {
        console.error("Get orders list error:", err);
        return JsonResponse.error(err.message || "Failed to fetch orders list", 500);
    }
};

export const POST = async (req, { params }) => {
    try {
        const { domain } = await params;
        const body = await req.json();

        if (!domain) {
            return JsonResponse.error("Restaurant domain is required!", 400);
        }

        return await proxyMerchantRequest({
            method: "POST",
            url: `/api/${domain}/order`,
            req,
            data: body,
            successMessage: "Order placed successfully",
            errorMessage: "Failed to place order on server",
        });
    } catch (err) {
        console.error("Create order route error:", err);
        return JsonResponse.error(
            err.message || "Failed to process order",
            500
        );
    }
};
