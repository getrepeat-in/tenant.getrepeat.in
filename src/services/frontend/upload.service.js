import api from "@/lib/api/axiosInstance";

export const UploadService = {
    uploadFile: async (formData) => {
        try {
            const response = await api.post("/api/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            console.error("Upload service error:", error);
            throw new Error(error.response?.data?.message || "Failed to upload file");
        }
    },
};
