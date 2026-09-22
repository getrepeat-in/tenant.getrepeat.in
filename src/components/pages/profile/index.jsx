"use client";
import { getImageUrl } from "@/lib/utils";
import Button from "@/components/global/common/Button";
import { ProfileForm } from "./fragments/profile-form";
import { useProfilePage } from "./helpers/useProfilePage";
import { AvatarSection } from "./fragments/avatar-section";
import AddressManager from "@/components/global/common/address";
import { ArrowLeft, Loader2, LogOut, ShoppingBag, ChevronRight } from "lucide-react";

export default function Profile() {
    const {
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
    } = useProfilePage();

    if (userLoading || !user) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <Loader2 className="size-7 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 pb-28 select-none">
            <header className="sticky top-0 z-40 w-full border-b border-gray-150/40 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
                <div className="px-2 py-3">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 hover:bg-neutral-200/80 dark:bg-zinc-850 dark:hover:bg-zinc-800 text-neutral-800 dark:text-neutral-200 transition-all active:scale-95 cursor-pointer"
                                aria-label="Go back"
                            >
                                <ArrowLeft size={18} strokeWidth={2.5} />
                            </button>

                            <div className="flex items-center gap-2.5 min-w-0">
                                {restaurant?.logo && (
                                    <div className="size-9 rounded-xl overflow-hidden bg-neutral-100 dark:bg-zinc-800 border border-black/5 dark:border-white/10 shrink-0 shadow-2xs">
                                        <img
                                            src={getImageUrl(restaurant.logo, true, "thumbnail")}
                                            alt={restaurant?.name || "Logo"}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                )}
                                <div className="flex flex-col min-w-0">
                                    <h1 className="text-sm sm:text-base font-semibold text-neutral-800 dark:text-zinc-100 truncate leading-tight">
                                        {restaurant?.name || restaurantName || "My Profile"}
                                    </h1>
                                    <span className="text-xs font-normal text-neutral-400 dark:text-neutral-500 truncate">
                                        Customer Profile & Account
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onLogout}
                            disabled={isLoggingOut}
                            className="flex h-8.5 items-center gap-1.5 px-2.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-950/50 transition-colors cursor-pointer shrink-0"
                            title="Sign out"
                        >
                            {isLoggingOut ? (
                                <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                                <LogOut size={13} />
                            )}
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="px-2 pt-4 sm:pt-6">
                <div className="rounded-2xl border border-gray-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 sm:p-4 shadow-xs animate-in fade-in slide-in-from-bottom-3 duration-300">
                    <AvatarSection
                        name={user?.name}
                        phone={user?.phone}
                        avatar={formik.values.avatar}
                        isUploading={isUploading}
                        handleImageUpload={onImageUpload}
                        removeImage={onRemoveImage}
                    />
                    <button
                        type="button"
                        onClick={() => router.push("/orders")}
                        className="w-full my-4 flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 hover:bg-neutral-100/80 dark:bg-zinc-800/60 dark:hover:bg-zinc-800 border border-neutral-200/70 dark:border-zinc-700/60 transition-all text-left cursor-pointer group shadow-2xs active:scale-[0.99]"
                    >
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                <ShoppingBag size={18} strokeWidth={2.2} />
                            </div>
                            <div>
                                <h4 className="text-xs sm:text-sm font-semibold text-neutral-800 dark:text-zinc-100">
                                    My Orders
                                </h4>
                                <p className="text-[11px] text-neutral-400 dark:text-zinc-400">
                                    View past orders & live tracking
                                </p>
                            </div>
                        </div>
                        <ChevronRight size={16} className="text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>

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

                    <div className="my-5 border-t border-gray-100 dark:border-zinc-800" />

                    <div className="mb-6">
                        <AddressManager />
                    </div>

                    <div className="my-5 border-t border-gray-100 dark:border-zinc-800" />

                    <div className="flex items-center gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            className="flex-1 h-11 rounded-xl text-xs sm:text-sm font-semibold border-gray-200 dark:border-zinc-700 hover:bg-neutral-50 dark:hover:bg-zinc-800 text-neutral-700 dark:text-zinc-200"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={formik.handleSubmit}
                            disabled={isUpdating || isUploading}
                            isLoading={isUpdating}
                            className="flex-1 h-11 rounded-xl text-xs sm:text-sm font-semibold bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:brightness-95 active:scale-[0.98] transition-all"
                        >
                            Save Changes
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
}
