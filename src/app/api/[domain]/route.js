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
      url: `/api/${domain}`,
      req,
      successMessage: "Restaurant details fetched successfully",
      errorMessage: "Failed to fetch restaurant details from server",
    });
  } catch (err) {
    console.error("GET restaurant details error:", err);
    return JsonResponse.error(err.message || "Internal Server Error!", 500);
  }
};
