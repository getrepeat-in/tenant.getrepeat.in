import { NextResponse } from "next/server";
import axios from "axios";

export const POST = async (req) => {
    try {
        const formData = await req.formData();
        const response = await axios.post(`${process.env.MERCHANT_APP_URL}/api/upload`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        console.error("Upload proxy error:", error);
        return NextResponse.json(
            { message: error.response?.data?.message || "Failed to upload file" },
            { status: error.response?.status || 500 }
        );
    }
};
