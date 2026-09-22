import { proxyMerchantRequest } from "@/lib/api/proxy";
import { JsonResponse } from "@/lib/api/responseHandler";

export const dynamic = 'force-dynamic';

export const GET = async (req, { params }) => {
    try {
        const { domain } = await params;
        if (!domain) return JsonResponse.error("Restaurant slug is required", 400);

        return await proxyMerchantRequest({
            method: "GET",
            url: `/api/${domain}/user/address`,
            req,
            successMessage: "Addresses fetched successfully",
            errorMessage: "Failed to fetch addresses from server",
        });
    } catch (error) {
        return JsonResponse.error(error.message || "Merchant API error", 500);
    }
};

export const POST = async (req, { params }) => {
    try {
        const { domain } = await params;
        if (!domain) return JsonResponse.error("Restaurant slug is required", 400);

        const body = await req.json();

        return await proxyMerchantRequest({
            method: "POST",
            url: `/api/${domain}/user/address`,
            req,
            data: body,
            successMessage: "Address added successfully",
            errorMessage: "Failed to add address",
        });
    } catch (error) {
        return JsonResponse.error(error.message || "Merchant API error", 500);
    }
};
