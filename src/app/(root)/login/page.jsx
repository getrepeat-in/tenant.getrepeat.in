"use client";
import * as Yup from "yup";
import { useState } from "react";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchUser } from "@/store/slices/userSlice";
import useNotification from "@/hooks/useNotification";
import { AuthService } from "@/services/frontend/auth";
import { PhoneIcon, LockIcon, Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const notify = useNotification();
    const [isLoading, setIsLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            phone: "",
            password: "",
        },
        validationSchema: Yup.object({
            phone: Yup.string()
                .matches(/^[0-9]+$/, "Phone number must contain only digits")
                .length(10, "Phone number must be exactly 10 digits")
                .required("Phone number is required"),
            password: Yup.string().required("Password is required"),
        }),
        onSubmit: async (values) => {
            setIsLoading(true);

            try {
                await AuthService.login({ phone: values.phone, password: values.password });
                const userData = await dispatch(fetchUser()).unwrap();
                notify.success(`Welcome back, ${userData?.name || "User"}!`);
                router.push("/");
            } catch (err) {
                notify.error(err.message || "Failed to sign in. Please try again.");
                setIsLoading(false);
            }
        },
    });

    const handlePhoneChange = (e) => {
        const val = e.target.value.replace(/\D/g, ''); 
        if (val.length <= 10) {
            formik.setFieldValue('phone', val);
        }
    };

    return (
        <div className="flex min-h-[100svh] flex-col bg-background font-poppins sm:items-center sm:justify-center sm:p-4">
            <div className="flex w-full max-w-md flex-1 flex-col justify-center bg-card px-6 py-6 sm:flex-none sm:rounded-2xl sm:p-10 sm:shadow-sm">
                <div className="mb-4 sm:mb-8 flex flex-col items-center text-center">
                    <img
                        src="/assets/images/food-delivery.png"
                        alt="Welcome Back"
                        className="w-full max-w-[200px] object-contain py-4"
                    />
                </div>

                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <div className="relative group">
                            <div className="absolute -top-2.5 left-3 z-10 bg-card px-1.5">
                                <span className={`text-[11px] font-semibold uppercase tracking-wider transition-colors ${formik.touched.phone && formik.errors.phone ? "text-red-500" : "text-muted-foreground group-focus-within:text-primary"}`}>
                                    Phone Number
                                </span>
                            </div>
                            <div className={`relative flex items-center rounded-2xl border bg-white transition-all sm:bg-white/90 ${formik.touched.phone && formik.errors.phone ? "border-red-500 focus-within:ring-1 focus-within:ring-red-500" : "border-gray-300 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary"}`}>
                                <div className="pointer-events-none flex items-center pl-3.5 text-gray-500 font-medium">
                                    +91
                                </div>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    inputMode="numeric"
                                    value={formik.values.phone}
                                    onChange={handlePhoneChange}
                                    onBlur={formik.handleBlur}
                                    className="h-14 w-full bg-transparent px-3 text-base text-neutral-900 outline-none placeholder:text-transparent focus:placeholder:text-gray-400"
                                    placeholder="9876543210"
                                    maxLength={10}
                                />
                                <div className="pointer-events-none flex items-center pr-3.5">
                                    <PhoneIcon className={`h-5 w-5 ${formik.touched.phone && formik.errors.phone ? "text-red-500" : "text-primary"}`} />
                                </div>
                            </div>
                        </div>
                        {formik.touched.phone && formik.errors.phone ? (
                            <p className="text-xs font-medium text-red-500 pl-1">{formik.errors.phone}</p>
                        ) : null}
                    </div>

                    <div className="space-y-2">
                        <div className="relative group">
                            <div className="absolute -top-2.5 left-3 z-10 bg-white px-1.5 sm:bg-white">
                                <span className={`text-[11px] font-semibold uppercase tracking-wider transition-colors ${formik.touched.password && formik.errors.password ? "text-red-500" : "text-slate-500 group-focus-within:text-primary"}`}>
                                    Password
                                </span>
                            </div>
                            <div className={`relative flex items-center rounded-2xl border bg-white transition-all sm:bg-white/90 ${formik.touched.password && formik.errors.password ? "border-red-500 focus-within:ring-1 focus-within:ring-red-500" : "border-gray-300 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary"}`}>
                                <div className="pointer-events-none flex items-center pl-3.5">
                                    <LockIcon className={`h-5 w-5 ${formik.touched.password && formik.errors.password ? "text-red-500" : "text-primary"}`} />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="h-14 w-full bg-transparent px-3 text-base text-neutral-900 outline-none placeholder:text-transparent focus:placeholder:text-gray-400"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                        {formik.touched.password && formik.errors.password ? (
                            <p className="text-xs font-medium text-red-500 pl-1">{formik.errors.password}</p>
                        ) : null}
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-primary p-4 text-[15px] font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/30 disabled:opacity-70 active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <Loader2 className="size-5 animate-spin" />
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm font-medium text-neutral-600">
                    Don't have an account?{" "}
                    <a href="/register" className="font-bold text-primary transition-colors hover:text-primary">
                        Sign up now
                    </a>
                </p>
            </div>
        </div>
    );
}
