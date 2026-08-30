import merchantApi from "@/lib/api/merchantInstance";
import { JsonResponse } from "@/lib/api/responseHandler";

export const GET = async (req, { params }) => {
  try {
    const { domain } = await params;
    const { searchParams } = new URL(req.url);

    const query = searchParams.get("q") || "";
    const isVeg = searchParams.get("is_veg") || "";
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const categoryId = searchParams.get("categoryId") || "";

    if (!domain) {
      return JsonResponse.error(
        "Restaurant slug is required!",
        400
      );
    }

    const response = await merchantApi.get(
      `/api/${domain}/menu/search`,
      {
        params: {
          q: query,
          is_veg: isVeg,
          page,
          limit,
          categoryId
        }
      }
    );

    const respData = {
      items: response.data?.data || [],
      total: response.data?.meta?.totalCount || 0,
      addonGroups: response.data?.addonGroups || [],
    }

    return JsonResponse.success(
      respData,
      "Search results fetched successfully",
      200
    );
  } catch (err) {
    console.error("GET search error:", err.response?.data || err.message);
    return JsonResponse.error(
      err.response?.data?.message || "Internal Server Error!",
      err.response?.status || 500
    );
  }
};
