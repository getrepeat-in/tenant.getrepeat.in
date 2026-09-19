"use client";
import React from "react";
import { User, Phone, Lock, Eye, EyeOff, KeyRound, ShieldCheck, CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProfileForm({
    formik,
    showPassword,
    setShowPassword,
    isResettingPassword,
    setIsResettingPassword,
    userStatus,
}) {
    const isStatusActive = (userStatus || "ACTIVE").toUpperCase() === "ACTIVE";

    return (
        <div className="flex flex-col gap-4 sm:gap-5">
            {/* Full Name Field */}
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-neutral-700 dark:text-zinc-300">
                    Full Name
                </label>
                <div
                    className={cn(
                        "relative flex h-12 items-center rounded-xl bg-neutral-50/80 dark:bg-zinc-850 px-3.5 border transition-all",
                        formik.touched.name && formik.errors.name
                            ? "border-rose-400 bg-rose-50/30"
                            : "border-gray-200/90 dark:border-zinc-750 focus-within:border-primary focus-within:bg-white dark:focus-within:bg-zinc-900 focus-within:ring-2 focus-within:ring-primary/10"
                    )}
                >
                    <User className="size-4.5 text-neutral-400 dark:text-zinc-500 mr-2.5 shrink-0" />
                    <input
                        type="text"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full bg-transparent border-0 outline-none text-sm text-neutral-900 dark:text-zinc-100 placeholder:text-neutral-400 p-0 focus:ring-0"
                        placeholder="e.g. John Doe"
                    />
                </div>
                {formik.touched.name && formik.errors.name && (
                    <span className="text-[11px] font-medium text-rose-500 px-1">
                        {formik.errors.name}
                    </span>
                )}
            </div>

            {/* Phone Number Field */}
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-neutral-700 dark:text-zinc-300">
                    Phone Number
                </label>
                <div
                    className={cn(
                        "relative flex h-12 items-center rounded-xl bg-neutral-50/80 dark:bg-zinc-850 px-3.5 border transition-all",
                        formik.touched.phone && formik.errors.phone
                            ? "border-rose-400 bg-rose-50/30"
                            : "border-gray-200/90 dark:border-zinc-750 focus-within:border-primary focus-within:bg-white dark:focus-within:bg-zinc-900 focus-within:ring-2 focus-within:ring-primary/10"
                    )}
                >
                    <Phone className="size-4.5 text-neutral-400 dark:text-zinc-500 mr-2.5 shrink-0" />
                    <span className="text-sm font-medium text-neutral-400 mr-1.5 select-none">
                        +91
                    </span>
                    <input
                        type="tel"
                        name="phone"
                        value={formik.values.phone}
                        onChange={(e) => {
                            const cleanVal = e.target.value.replace(/[^0-9]/g, "");
                            if (cleanVal.length <= 10) {
                                formik.setFieldValue("phone", cleanVal);
                            }
                        }}
                        onBlur={formik.handleBlur}
                        className="w-full bg-transparent border-0 outline-none text-sm text-neutral-900 dark:text-zinc-100 placeholder:text-neutral-400 p-0 focus:ring-0 tracking-wide"
                        placeholder="9876543210"
                        maxLength={10}
                    />
                </div>
                {formik.touched.phone && formik.errors.phone && (
                    <span className="text-[11px] font-medium text-rose-500 px-1">
                        {formik.errors.phone}
                    </span>
                )}
            </div>

            {/* Password Section */}
            <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-neutral-700 dark:text-zinc-300">
                        Password
                    </label>
                    {isResettingPassword && (
                        <button
                            type="button"
                            onClick={() => {
                                formik.setFieldValue("password", "");
                                setIsResettingPassword(false);
                            }}
                            className="text-[11px] font-medium text-neutral-500 hover:text-neutral-700 dark:hover:text-zinc-300 transition-colors"
                        >
                            Cancel Reset
                        </button>
                    )}
                </div>

                {isResettingPassword ? (
                    <div
                        className={cn(
                            "relative flex h-12 items-center rounded-xl bg-neutral-50/80 dark:bg-zinc-850 px-3.5 border transition-all",
                            formik.touched.password && formik.errors.password
                                ? "border-rose-400 bg-rose-50/30"
                                : "border-gray-200/90 dark:border-zinc-750 focus-within:border-primary focus-within:bg-white dark:focus-within:bg-zinc-900 focus-within:ring-2 focus-within:ring-primary/10"
                        )}
                    >
                        <Lock className="size-4.5 text-neutral-400 dark:text-zinc-500 mr-2.5 shrink-0" />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="w-full bg-transparent border-0 outline-none text-sm text-neutral-900 dark:text-zinc-100 placeholder:text-neutral-400 p-0 focus:ring-0"
                            placeholder="Enter new password (min 6 chars)"
                            autoFocus
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="p-1 rounded-md text-neutral-400 hover:text-neutral-600 dark:hover:text-zinc-200 focus:outline-none shrink-0"
                        >
                            {showPassword ? (
                                <EyeOff size={16} />
                            ) : (
                                <Eye size={16} />
                            )}
                        </button>
                    </div>
                ) : (
                    <div className="flex h-12 items-center justify-between rounded-xl bg-neutral-50/80 dark:bg-zinc-850 px-3.5 border border-gray-200/90 dark:border-zinc-750">
                        <div className="flex items-center gap-2.5">
                            <Lock className="size-4.5 text-neutral-400 dark:text-zinc-500 shrink-0" />
                            <span className="text-sm tracking-widest text-neutral-500 dark:text-neutral-400 font-mono">
                                ••••••••••
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsResettingPassword(true)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/15 text-primary text-xs font-semibold transition-all active:scale-95 cursor-pointer"
                        >
                            <KeyRound size={13} />
                            <span>Change</span>
                        </button>
                    </div>
                )}

                {isResettingPassword && formik.touched.password && formik.errors.password && (
                    <span className="text-[11px] font-medium text-rose-500 px-1">
                        {formik.errors.password}
                    </span>
                )}
            </div>

            {/* Account Status Card */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-50 dark:bg-zinc-850 border border-gray-200/70 dark:border-zinc-800 mt-1">
                <div className="flex items-center gap-2.5">
                    <ShieldCheck size={18} className="text-emerald-600 dark:text-emerald-400" />
                    <div className="flex flex-col">
                        <span className="text-xs font-semibold text-neutral-800 dark:text-zinc-200">
                            Account Status
                        </span>
                        <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-normal">
                            Verified Customer Profile
                        </span>
                    </div>
                </div>

                <div
                    className={cn(
                        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold",
                        isStatusActive
                            ? "bg-emerald-100/80 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40"
                            : "bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300"
                    )}
                >
                    <CheckCircle2 size={12} />
                    <span>{userStatus || "Active"}</span>
                </div>
            </div>
        </div>
    );
}

export default ProfileForm;
