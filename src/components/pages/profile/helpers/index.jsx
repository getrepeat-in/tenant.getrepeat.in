import { AuthService } from "@/services/frontend/auth";
import { UploadService } from "@/services/frontend/upload";
import { clearUser, setUser } from "@/store/slices/userSlice";

export const handleProfileUpdate = async ({ values, setIsUpdating, isResettingPassword, dispatch, setFieldValue, setIsResettingPassword, notify }) => {
    try {
        setIsUpdating(true);
        const payload = {
            name: values.name,
            phone: values.phone,
            image: values.avatar,
        };
        if (isResettingPassword && values.password) {
            payload.password = values.password;
        }

        const response = await AuthService.updateProfile(payload);
        const updatedUser = response.data || response;

        dispatch(setUser(updatedUser));
        setFieldValue("password", "");
        setIsResettingPassword(false);
        notify.success("Profile updated successfully!", { duration: 3000 });
    } catch (error) {
        notify.error(error?.message || "Failed to update profile", { duration: 3500 });
    } finally {
        setIsUpdating(false);
    }
};

export const handleImageUpload = async ({ e, setIsUploading, setFieldValue, notify }) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("path", "user-profiles");

        const response = await UploadService.uploadFile(formData);
        const imageUrl = response.data?.url || response.url || response.data?.data?.url;
        setFieldValue("avatar", imageUrl);
        notify.success("Photo uploaded! Click Save to apply.", { duration: 3000 });
    } catch (error) {
        notify.error(error?.message || "Failed to upload profile photo", { duration: 3500 });
    } finally {
        setIsUploading(false);
    }
};

export const handleRemoveImage = (setFieldValue) => {
    setFieldValue("avatar", "");
};

export const handleLogout = async ({ setIsLoggingOut, dispatch, notify, router }) => {
    try {
        setIsLoggingOut(true);
        await AuthService.logout();
        dispatch(clearUser());
        notify.success("Signed out successfully", { duration: 2500 });
        router.push("/login");
    } catch (err) {
        console.error("Logout error:", err);
        notify.error("Failed to sign out. Please try again.", { duration: 3000 });
    } finally {
        setIsLoggingOut(false);
    }
};
