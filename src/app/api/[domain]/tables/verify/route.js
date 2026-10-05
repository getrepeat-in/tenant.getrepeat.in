import dbConnect from "@/lib/db";
import { proxyMerchantRequest } from "@/lib/api/proxy";
import { JsonResponse } from "@/lib/api/responseHandler";

export const GET = async (req, { params }) => {
  try {
    const { domain } = await params;
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!domain) {
      return JsonResponse.error("Restaurant slug is required!", 400);
    }
    
    if (!token) {
      return JsonResponse.error("Table token is required!", 400);
    }

    await dbConnect();

    return await proxyMerchantRequest({
      method: "GET",
      url: `/api/${domain}/tables/verify?token=${token}`,
      req,
      successMessage: "Table verified successfully",
      errorMessage: "Failed to verify table token",
    });
  } catch (err) {
    console.error("GET table verify error:", err);
    return JsonResponse.error(err.message || "Internal Server Error!", 500);
  }
};
