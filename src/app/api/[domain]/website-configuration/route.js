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
      url: `/api/${domain}/website-configuration`,
      req,
      successMessage: "Website configuration fetched successfully",
      errorMessage: "Failed to fetch website configuration from server",
    });
  } catch (err) {
    console.error("GET website configuration error:", err);
    return JsonResponse.error(err.message || "Internal Server Error!", 500);
  }
};
