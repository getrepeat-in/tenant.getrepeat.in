import merchantApi from "@/lib/api/merchantInstance";
import { JsonResponse } from "@/lib/api/responseHandler";
import { withAuthHeaders } from "@/lib/api/helpers/auth";

export const GET = async (req, { params }) => {
    try {
        const { domain } = await params;
        if (!domain) {
            return JsonResponse.error("Restaurant domain/slug is required", 400);
        }

        const config = withAuthHeaders(req);

        const response = await merchantApi.get(`/api/${domain}/user/auth/me`, config);

        const responseData = response.data.data || response.data;
        return JsonResponse.success(responseData, response.data.message || "User fetched successfully", response.status || 200);
    } catch (error) {
        if (error.isAuthError) {
            return JsonResponse.error(error.message, error.status);
        }
        return JsonResponse.error(error.response?.data?.message || "Merchant API error", error.response?.status || 500);
    }
};