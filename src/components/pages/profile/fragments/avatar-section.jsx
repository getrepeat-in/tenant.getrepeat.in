"use client";
import { getImageUrl } from "@/lib/utils";
import { Camera, Loader2 } from "lucide-react";

export function AvatarSection({ name, avatar, isUploading, handleImageUpload, removeImage }) {
    return (
        <div className="flex flex-col items-center pb-6">
            <div className="relative group">
                <div className="size-28 overflow-hidden rounded-[24px] border-2 border-gray-100 shadow-md bg-white">
                    {avatar ? (
                        <img
                            src={getImageUrl(avatar, true, "thumbnail")}
                            alt={name || "Avatar"}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-orange-50 text-3xl font-bold text-orange-500">
                            {name?.charAt(0).toUpperCase() || "U"}
                        </div>
                    )}
                </div>

                <label className="absolute -bottom-1 -right-1 flex size-8 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white shadow-md hover:bg-gray-50 active:scale-95 transition-all">
                    {isUploading ? (
                        <Loader2 className="size-4 animate-spin text-orange-500" />
                    ) : (
                        <Camera className="size-4 text-gray-500" />
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

            {avatar && (
                <button
                    type="button"
                    onClick={removeImage}
                    className="mt-4 text-xs font-bold tracking-wider text-rose-500 hover:text-rose-600 transition-colors uppercase"
                >
                    Remove Photo
                </button>
            )}
        </div>
    );
}
