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

    const response = await merchantApi.get(
      `/api/${domain}/menu/category`
    );

    const categories = response.data?.data?.categories || response.data?.categories || response.data || [];
    return JsonResponse.success(
      categories,
      "Categories fetched successfully",
      200
    );
  } catch (err) {
    console.error("GET categories error:", err.response?.data || err.message);
    return JsonResponse.error(
      err.response?.data?.message || err.message || "Internal Server Error!",
      err.response?.status || 500
    );
  }
};