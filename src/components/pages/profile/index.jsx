"use client";
import { useFormik } from "formik";
import { useUser } from "@/hooks/useUser";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { setUser } from "@/store/slices/userSlice";
import useNotification from "@/hooks/useNotification";
import { ProfileForm } from "./fragments/profile-form";
import { AvatarSection } from "./fragments/avatar-section";
import { profileSchema } from "./validators/profile.validator";
import { AuthService } from "@/services/frontend/auth";
import { UploadService } from "@/services/frontend/upload";

export default function Profile() {
    const { user, loading: userLoading } = useUser();
    const dispatch = useDispatch();
    const router = useRouter();
    const notify = useNotification();

    const [showPassword, setShowPassword] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isResettingPassword, setIsResettingPassword] = useState(false);

    useEffect(() => {
        if (!userLoading && !user) {
            router.push("/login");
        }
    }, [user, userLoading, router]);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: user?.name || "",
            phone: user?.phone || "",
            avatar: user?.avatar || "",
            password: "",
        },
        validationSchema: profileSchema,
        onSubmit: async (values) => {
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
                formik.setFieldValue("password", "");
                setIsResettingPassword(false);
                notify.success("Profile updated successfully!");
            } catch (error) {
                notify.error(error.message || "Failed to update profile");
            } finally {
                setIsUpdating(false);
            }
        },
    });

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const formData = new FormData();
            formData.append("file", file);
            formData.append("path", "user-profiles");

            const response = await UploadService.uploadFile(formData);
            const imageUrl = response.data?.url || response.url || response.data?.data?.url;
            formik.setFieldValue("avatar", imageUrl);
            notify.success("Profile photo uploaded successfully!");
        } catch (error) {
            notify.error(error.message || "Failed to upload profile photo");
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveImage = () => {
        formik.setFieldValue("avatar", "");
    };

    if (userLoading || !user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f0f5f9]">
                <Loader2 className="size-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white md:bg-[#f0f5f9] pb-32">
            <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-gray-150 bg-white px-4 shadow-sm">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex size-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 active:scale-95 transition-all"
                >
                    <ArrowLeft className="size-4" />
                </button>
                <h1 className="text-base font-bold text-gray-900">Edit Profile</h1>
            </header>

            <main className="mx-auto max-w-md px-4 md:px-4 pt-6 md:pt-8">
                <div className="rounded-none md:rounded-2xl border-0 md:border border-gray-200/80 bg-white p-0 md:p-6 shadow-none md:shadow-sm">
                    <AvatarSection
                        name={user?.name}
                        avatar={formik.values.avatar}
                        isUploading={isUploading}
                        handleImageUpload={handleImageUpload}
                        removeImage={handleRemoveImage}
                    />

                    <form onSubmit={formik.handleSubmit}>
                        <ProfileForm
                            formik={formik}
                            showPassword={showPassword}
                            setShowPassword={setShowPassword}
                            isResettingPassword={isResettingPassword}
                            setIsResettingPassword={setIsResettingPassword}
                            userStatus={user?.status || "ACTIVE"}
                        />
                    </form>

                    <div className="my-6 border-t border-gray-100" />

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 h-12 border border-gray-200 hover:bg-gray-50 rounded-xl font-bold text-sm transition-all text-gray-700 active:scale-98"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={formik.handleSubmit}
                            disabled={isUpdating || isUploading}
                            className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl text-sm shadow-md shadow-primary/10 transition-all flex items-center justify-center gap-2 active:scale-98"
                        >
                            {isUpdating ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
