import { proxyMerchantRequest } from "@/lib/api/proxy";
import { JsonResponse } from "@/lib/api/responseHandler";

export const PUT = async (req, { params }) => {
    try {
        const { domain } = await params;
        if (!domain) {
            return JsonResponse.error("Restaurant domain/slug is required", 400);
        }

        const body = await req.json();

        return await proxyMerchantRequest({
            method: "PUT",
            url: `/api/${domain}/user/profile`,
            req,
            data: body,
            successMessage: "Profile updated successfully",
            errorMessage: "Failed to update profile",
        });
    } catch (error) {
        return JsonResponse.error(error.message || "Merchant API error", 500);
    }
};
