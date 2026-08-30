import merchantApi from "@/lib/api/merchantInstance";
import { JsonResponse } from "@/lib/api/responseHandler";

export const GET = async (req, { params }) => {
  try {
    const { domain } = await params;

    if (!domain) {
      return JsonResponse.error(
        "Restaurant slug is required!",
        400
      );
    }

    const response = await merchantApi.get(`/api/${domain}`);

    return JsonResponse.success(
      response.data?.data || response.data || {},
      "Restaurant details fetched successfully",
      200
    );
  } catch (err) {
    console.error("GET restaurant details error:", err.response?.data || err.message);
    return JsonResponse.error(
      err.response?.data?.message || "Internal Server Error!",
      err.response?.status || 500
    );
  }
};
