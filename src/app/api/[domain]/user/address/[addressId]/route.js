import { proxyMerchantRequest } from "@/lib/api/proxy";
import { JsonResponse } from "@/lib/api/responseHandler";

export const PUT = async (req, { params }) => {
    try {
        const { domain, addressId } = await params;
        if (!domain || !addressId) return JsonResponse.error("Restaurant slug and addressId are required", 400);

        const body = await req.json();

        return await proxyMerchantRequest({
            method: "PUT",
            url: `/api/${domain}/user/address/${addressId}`,
            req,
            data: body,
            successMessage: "Address updated successfully",
            errorMessage: "Failed to update address",
        });
    } catch (error) {
        return JsonResponse.error(error.message || "Merchant API error", 500);
    }
};

export const DELETE = async (req, { params }) => {
    try {
        const { domain, addressId } = await params;
        if (!domain || !addressId) return JsonResponse.error("Restaurant slug and addressId are required", 400);

        return await proxyMerchantRequest({
            method: "DELETE",
            url: `/api/${domain}/user/address/${addressId}`,
            req,
            successMessage: "Address deleted successfully",
            errorMessage: "Failed to delete address",
        });
    } catch (error) {
        return JsonResponse.error(error.message || "Merchant API error", 500);
    }
};
