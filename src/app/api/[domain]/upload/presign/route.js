import merchantApi from "@/lib/api/merchantInstance";
import { JsonResponse } from "@/lib/api/responseHandler";

export const POST = async (req) => {
    try {
        const body = await req.json();
        const { restaurantId, filename, contentType, path, sizeBytes, width, height } = body;

        if (!restaurantId) {
            return JsonResponse.error("restaurantId is required", 400);
        }

        const payload = { filename, contentType, path, sizeBytes, width, height };

        const response = await merchantApi.post(`/api/restaurant/${restaurantId}/uploads/presign`, payload);

        return JsonResponse.success(
            response.data?.data || response.data,
            "Presigned URL fetched successfully",
            200
        );
    } catch (error) {
        console.error("Upload presign proxy error:", error);
        return JsonResponse.error(
            error.response?.data?.message || "Failed to generate presigned URL",
            error.response?.status || 500
        );
    }
};
