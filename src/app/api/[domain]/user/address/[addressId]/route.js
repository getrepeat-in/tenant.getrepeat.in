import merchantApi from "@/lib/api/merchantInstance";
import { JsonResponse } from "@/lib/api/responseHandler";
import { withAuthHeaders } from "@/lib/api/helpers/auth";

export const PUT = async (req, { params }) => {
    try {
        const { domain, addressId } = await params;
        if (!domain || !addressId) return JsonResponse.error("Restaurant slug and addressId are required", 400);

        const config = withAuthHeaders(req);
        const body = await req.json();

        const response = await merchantApi.put(`/api/${domain}/user/address/${addressId}`, body, config);
        
        return JsonResponse.success(response.data.data, response.data.message || "Address updated successfully", 200);
    } catch (error) {
        if (error.isAuthError) return JsonResponse.error(error.message, error.status);
        return JsonResponse.error(error.response?.data?.message || "Merchant API error", error.response?.status || 500);
    }
};

export const DELETE = async (req, { params }) => {
    try {
        const { domain, addressId } = await params;
        if (!domain || !addressId) return JsonResponse.error("Restaurant slug and addressId are required", 400);

        const config = withAuthHeaders(req);

        const response = await merchantApi.delete(`/api/${domain}/user/address/${addressId}`, config);
        
        return JsonResponse.success(response.data.data, response.data.message || "Address deleted successfully", 200);
    } catch (error) {
        if (error.isAuthError) return JsonResponse.error(error.message, error.status);
        return JsonResponse.error(error.response?.data?.message || "Merchant API error", error.response?.status || 500);
    }
};
