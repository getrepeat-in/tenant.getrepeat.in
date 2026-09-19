import { JsonResponse } from "@/lib/api/responseHandler";
import merchantApi from "@/lib/api/merchantInstance";

export const GET = async (req, { params }) => {
    try {
        const { domain } = await params;
        const { searchParams } = new URL(req.url);
        const queryString = searchParams.toString();

        if (!domain) {
            return JsonResponse.error("Restaurant domain is required!", 400);
        }

        const cookieToken = req.cookies?.get?.("auth-token")?.value;
        const authHeader = req.headers.get("authorization") || (cookieToken ? `Bearer ${cookieToken}` : null);

        if (process.env.MERCHANT_APP_URL) {
            // 1. Try dedicated user orders endpoint: GET /api/:slug/user/orders
            try {
                const res = await merchantApi.get(
                    `/api/${domain}/user/orders${queryString ? `?${queryString}` : ""}`,
                    {
                        headers: {
                            ...(authHeader && { Authorization: authHeader }),
                        },
                    }
                );
                return JsonResponse.success(
                    res.data?.data || res.data,
                    res.data?.message || "User orders fetched successfully",
                    res.status || 200
                );
            } catch (userOrdersErr) {
                // 2. Fallback to /api/:slug/order
                try {
                    const fallbackRes = await merchantApi.get(
                        `/api/${domain}/order${queryString ? `?${queryString}` : ""}`,
                        {
                            headers: {
                                ...(authHeader && { Authorization: authHeader }),
                            },
                        }
                    );
                    return JsonResponse.success(
                        fallbackRes.data?.data || fallbackRes.data,
                        fallbackRes.data?.message || "Orders fetched successfully",
                        fallbackRes.status || 200
                    );
                } catch (fallbackErr) {
                    console.warn(
                        "Merchant fetch orders error:",
                        fallbackErr?.response?.data || fallbackErr?.message || userOrdersErr?.message
                    );
                }
            }
        }

        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);

        return JsonResponse.success({
            orders: [],
            total: 0,
            page,
            limit,
            totalPages: 0,
        });
    } catch (err) {
        console.error("Get orders list error:", err);
        return JsonResponse.error(err.message || "Failed to fetch orders list", 500);
    }
};
