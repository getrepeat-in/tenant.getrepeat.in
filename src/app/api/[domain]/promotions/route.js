import { proxyMerchantRequest } from "@/lib/api/proxy";
import { JsonResponse } from "@/lib/api/responseHandler";

export const GET = async (req, { params }) => {
  try {
    const { domain } = await params;

    if (!domain) {
      return JsonResponse.error("Restaurant slug is required!", 400);
    }

    return await proxyMerchantRequest({
      method: "GET",
      url: `/api/${domain}/promotions`,
      req,
      successMessage: "Promotions fetched successfully",
      errorMessage: "Failed to fetch promotions from server",
    });
  } catch (err) {
    console.error("GET promotions error:", err);
    return JsonResponse.error(err.message || "Internal Server Error!", 500);
  }
};
