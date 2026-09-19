"use client";
import React from "react";
import { getImageUrl, cn } from "@/lib/utils";
import { Camera, Loader2, Trash2, User } from "lucide-react";

export function AvatarSection({
    name,
    phone,
    avatar,
    isUploading,
    handleImageUpload,
    removeImage,
}) {
    const initials = name
        ? name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()
        : "U";

    return (
        <div className="flex flex-col items-center pb-6">
            {/* Avatar Circle Container */}
            <div className="relative group">
                <div className="size-24 sm:size-28 overflow-hidden rounded-full border-4 border-white dark:border-zinc-800 shadow-md bg-neutral-100 dark:bg-zinc-800 shrink-0">
                    {avatar ? (
                        <img
                            src={getImageUrl(avatar, true, "thumbnail")}
                            alt={name || "Avatar"}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-primary/10 text-2xl sm:text-3xl font-bold text-primary select-none">
                            {initials}
                        </div>
                    )}
                </div>

                {/* Floating Camera Button */}
                <label
                    className={cn(
                        "absolute bottom-0 right-0 flex size-8 sm:size-9 cursor-pointer items-center justify-center rounded-full border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-neutral-700 dark:text-zinc-200 shadow-md hover:bg-neutral-50 dark:hover:bg-zinc-700 active:scale-95 transition-all select-none",
                        isUploading && "pointer-events-none opacity-80"
                    )}
                    title="Upload profile photo"
                >
                    {isUploading ? (
                        <Loader2 className="size-4 animate-spin text-primary" />
                    ) : (
                        <Camera className="size-4" />
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                        className="hidden"
                    />
                </label>
            </div>

            {/* User Details Preview */}
            <div className="flex flex-col items-center text-center mt-3">
                <h2 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-zinc-100 tracking-tight">
                    {name || "Guest Customer"}
                </h2>
                {phone && (
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 font-normal mt-0.5">
                        +91 {phone}
                    </span>
                )}
            </div>

            {/* Photo Action Links */}
            {avatar && (
                <button
                    type="button"
                    onClick={removeImage}
                    className="inline-flex items-center gap-1.5 mt-2.5 px-3 py-1 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                >
                    <Trash2 size={13} />
                    <span>Remove Photo</span>
                </button>
            )}
        </div>
    );
}

export default AvatarSection;
