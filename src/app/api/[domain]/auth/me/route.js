import { proxyMerchantRequest } from "@/lib/api/proxy";
import { JsonResponse } from "@/lib/api/responseHandler";

export const GET = async (req, { params }) => {
    try {
        const { domain } = await params;
        if (!domain) {
            return JsonResponse.error("Restaurant domain/slug is required", 400);
        }

        return await proxyMerchantRequest({
            method: "GET",
            url: `/api/${domain}/user/auth/me`,
            req,
            successMessage: "User fetched successfully",
            errorMessage: "Failed to fetch user details from server",
        });
    } catch (error) {
        return JsonResponse.error(error.message || "Merchant API error", 500);
    }
};