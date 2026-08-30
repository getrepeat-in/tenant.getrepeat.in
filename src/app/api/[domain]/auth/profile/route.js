import merchantApi from "@/lib/api/merchantInstance";
import { JsonResponse } from "@/lib/api/responseHandler";
import { withAuthHeaders } from "@/lib/api/helpers/auth";

export const PUT = async (req, { params }) => {
    try {
        const { domain } = await params;
        if (!domain) {
            return JsonResponse.error("Restaurant domain/slug is required", 400);
        }

        const config = withAuthHeaders(req);
        const body = await req.json();

        const response = await merchantApi.put(`/api/${domain}/user/profile`, body, config);

        const responseData = response.data.data || response.data;
        return JsonResponse.success(responseData, response.data.message || "Profile updated successfully", response.status || 200);
    } catch (error) {
        if (error.isAuthError) {
            return JsonResponse.error(error.message, error.status);
        }
        return JsonResponse.error(error.response?.data?.message || "Merchant API error", error.response?.status || 500);
    }
};
