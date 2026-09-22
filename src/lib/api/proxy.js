import merchantApi from "@/lib/api/merchantInstance";
import { JsonResponse } from "@/lib/api/responseHandler";

export async function proxyMerchantRequest({ method, url, req, data, successMessage, errorMessage }) {
    try {
        let authHeader = req.headers.get("authorization");
        if (!authHeader && req.cookies) {
            const cookieToken = req.cookies.get("auth-token")?.value;
            if (cookieToken) {
                authHeader = `Bearer ${cookieToken}`;
            }
        }

        const response = await merchantApi.request({
            method,
            url,
            data,
            headers: {
                ...(authHeader && {
                    Authorization: authHeader,
                }),
            },
        });

        return JsonResponse.success(
            response.data?.data ?? response.data,
            response.data?.message ?? successMessage,
            response.status ?? 200
        );
    } catch (error) {
        console.error(
            `Merchant API ${method} ${url} error:`,
            error?.response?.data ?? error?.message
        );

        if (error?.response?.data) {
            return Response.json(error.response.data, {
                status: error.response.status || 500
            });
        }

        return JsonResponse.error(
            errorMessage,
            error?.response?.status ?? 500
        );
    }
}
