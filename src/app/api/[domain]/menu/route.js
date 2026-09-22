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
      url: `/api/${domain}/menu`,
      req,
      successMessage: "Menu fetched successfully",
      errorMessage: "Failed to fetch menu from server",
    });
  } catch (err) {
    console.error("GET menu error:", err);
    return JsonResponse.error(err.message || "Internal Server Error!", 500);
  }
};
