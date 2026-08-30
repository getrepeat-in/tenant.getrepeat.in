import { JsonResponse } from "@/lib/api/responseHandler";
import { cookies } from "next/headers";

export const POST = async (req, { params }) => {
    try {
        const { domain } = await params;
        if (!domain) {
            return JsonResponse.error("Restaurant domain/slug is required", 400);
        }

        const cookieStore = await cookies();
        cookieStore.delete("auth-token");

        return JsonResponse.success(null, "Logged out successfully", 200);
    } catch (error) {
        return JsonResponse.error("Failed to logout", 500);
    }
};
