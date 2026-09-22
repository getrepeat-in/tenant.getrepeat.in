import { useState } from "react";
import { useFormik } from "formik";
import { useUser } from "@/hooks/useUser";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useRestaurant } from "@/hooks/useRestaurant";
import useNotification from "@/hooks/useNotification";
import { profileSchema } from "../validators/profile.validator";
import { handleProfileUpdate, handleImageUpload, handleRemoveImage, handleLogout } from "./index";

export function useProfilePage() {
    const { user, loading: userLoading } = useUser();
    const { restaurant, name: restaurantName } = useRestaurant();
    const dispatch = useDispatch();
    const router = useRouter();
    const notify = useNotification();

    const [showPassword, setShowPassword] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isResettingPassword, setIsResettingPassword] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

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
            await handleProfileUpdate({
                values,
                setIsUpdating,
                isResettingPassword,
                dispatch,
                setFieldValue: formik.setFieldValue,
                setIsResettingPassword,
                notify,
            });
        },
    });

    const onImageUpload = (e) => handleImageUpload({
        e,
        setIsUploading,
        setFieldValue: formik.setFieldValue,
        notify
    });

    const onRemoveImage = () => handleRemoveImage(formik.setFieldValue);

    const onLogout = () => handleLogout({
        setIsLoggingOut,
        dispatch,
        notify,
        router
    });

    return {
        user,
        userLoading,
        restaurant,
        restaurantName,
        formik,
        showPassword,
        setShowPassword,
        isUpdating,
        isUploading,
        isResettingPassword,
        setIsResettingPassword,
        isLoggingOut,
        onImageUpload,
        onRemoveImage,
        onLogout,
        router
    };
}
