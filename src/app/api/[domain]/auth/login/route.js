import { cookies } from "next/headers";
import merchantApi from "@/lib/api/merchantInstance";
import { JsonResponse } from "@/lib/api/responseHandler";
import { validateRequiredFields } from "@/lib/api/helpers/validator";

const POST_LOGIN_REQUIRED_FIELDS = ["phone", "password"];

export const POST = async (req, { params }) => {
    try {
        const { domain } = await params;
        if (!domain) {
            return JsonResponse.error("Restaurant domain/slug is required", 400);
        }

        const body = await req.json();
        const { isValid, message } = validateRequiredFields(body, POST_LOGIN_REQUIRED_FIELDS);
        if (!isValid) {
            return JsonResponse.error(message, 400);
        }

        const response = await merchantApi.post(`/api/${domain}/user/auth/login`, body);
        const responseData = response.data.data || response.data;
        
        const token = responseData.token;
        if (token) {
            const cookieStore = await cookies();
            cookieStore.set("auth-token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 30 * 24 * 60 * 60, 
            });
        }

        return JsonResponse.success(responseData, response.data.message || "Login successful", response.status || 200);
    } catch (error) {
        return JsonResponse.error(error.response?.data?.message || "Merchant API error", 500);
    }
};