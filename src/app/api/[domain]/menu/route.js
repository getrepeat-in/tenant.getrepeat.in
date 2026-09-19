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
      `/api/${domain}/menu`
    );

    const menuData = response.data?.data || response.data || {};
    return JsonResponse.success(
      menuData,
      "Menu fetched successfully",
      200
    );
  } catch (err) {
    console.error("GET menu error:", err.response?.data || err.message);
    return JsonResponse.error(
      err.response?.data?.message || err.message || "Internal Server Error!",
      err.response?.status || 500
    );
  }
};
