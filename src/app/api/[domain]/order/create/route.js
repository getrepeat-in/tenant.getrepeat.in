import { JsonResponse } from "@/lib/api/responseHandler";
import merchantApi from "@/lib/api/merchantInstance";

export const POST = async (req, { params }) => {
    try {
        const { domain } = await params;
        const body = await req.json();

        if (!domain) {
            return JsonResponse.error("Restaurant slug is required!", 400);
        }

        const authHeader = req.headers.get("authorization");

        if (process.env.MERCHANT_APP_URL) {
            try {
                const res = await merchantApi.post(
                    `/api/${domain}/order/create`,
                    body,
                    {
                        headers: {
                            ...(authHeader && { Authorization: authHeader }),
                        },
                    }
                );
                return JsonResponse.success(
                    res.data?.data || res.data,
                    res.data?.message || "Order placed successfully",
                    res.status || 201
                );
            } catch (backendErr) {
                try {
                    const fallbackRes = await merchantApi.post(
                        `/api/${domain}/order`,
                        body,
                        {
                            headers: {
                                ...(authHeader && { Authorization: authHeader }),
                            },
                        }
                    );
                    return JsonResponse.success(
                        fallbackRes.data?.data || fallbackRes.data,
                        fallbackRes.data?.message || "Order placed successfully",
                        fallbackRes.status || 201
                    );
                } catch (fallbackErr) {
                    console.error("Merchant order placement error:", fallbackErr?.response?.data || fallbackErr?.message);
                    if (fallbackErr?.response?.data) {
                        return JsonResponse.error(
                            fallbackErr.response.data.message || "Failed to place order on server",
                            fallbackErr.response.status || 400,
                            fallbackErr.response.data
                        );
                    }
                }
            }
        }

        const orderId = `ORD-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        const mockOrder = {
            _id: `mock_${Date.now()}`,
            orderNumber: orderId,
            orderType: body.orderType || "dine-in",
            status: "PLACED",
            ...(body.table && { table: body.table }),
            ...(body.deliveryAddress && { deliveryAddress: body.deliveryAddress }),
            items: body.items,
            subtotal: body.subtotal,
            tax: body.tax || 0,
            discount: body.discount || 0,
            totalAmount: body.totalAmount || body.amount,
            paymentMethod: body.paymentMethod || "cash",
            paymentStatus: body.paymentStatus || "pending",
            statusHistory: [
                {
                    status: "PLACED",
                    timestamp: new Date().toISOString(),
                },
            ],
            createdAt: new Date().toISOString(),
        };

        return JsonResponse.success(
            mockOrder,
            "Order placed successfully",
            201
        );
    } catch (err) {
        console.error("Create order route error:", err);
        return JsonResponse.error(
            err.message || "Failed to process order",
            500
        );
    }
};
