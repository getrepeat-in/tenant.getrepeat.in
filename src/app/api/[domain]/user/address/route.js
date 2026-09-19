import merchantApi from "@/lib/api/merchantInstance";
import { JsonResponse } from "@/lib/api/responseHandler";
import { withAuthHeaders } from "@/lib/api/helpers/auth";

export const dynamic = 'force-dynamic';

export const GET = async (req, { params }) => {
    try {
        const { domain } = await params;
        if (!domain) return JsonResponse.error("Restaurant slug is required", 400);

        const config = withAuthHeaders(req);
        const response = await merchantApi.get(`/api/${domain}/user/address`, config);
        return JsonResponse.success(response.data.data, response.data.message || "Addresses fetched successfully", 200);
    } catch (error) {
        if (error.isAuthError) return JsonResponse.error(error.message, error.status);
        return JsonResponse.error(error.response?.data?.message || "Merchant API error", error.response?.status || 500);
    }
};

export const POST = async (req, { params }) => {
    try {
        const { domain } = await params;
        if (!domain) return JsonResponse.error("Restaurant slug is required", 400);

        const config = withAuthHeaders(req);
        const body = await req.json();

        const response = await merchantApi.post(`/api/${domain}/user/address`, body, config);
        return JsonResponse.success(response.data.data, response.data.message || "Address added successfully", 201);
    } catch (error) {
        if (error.isAuthError) return JsonResponse.error(error.message, error.status);
        return JsonResponse.error(error.response?.data?.message || "Merchant API error", error.response?.status || 500);
    }
};
