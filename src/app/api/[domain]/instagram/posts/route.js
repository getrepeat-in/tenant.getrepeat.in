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
      url: `/api/${domain}/instagram/posts`,
      req,
      successMessage: "Instagram posts fetched successfully",
      errorMessage: "Failed to fetch Instagram posts from server",
    });
  } catch (err) {
    console.error("GET instagram posts error:", err);
    return JsonResponse.error(err.message || "Internal Server Error!", 500);
  }
};
