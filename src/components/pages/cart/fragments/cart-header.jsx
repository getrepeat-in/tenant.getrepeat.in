"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useRestaurant } from "@/hooks/useRestaurant";
import { getImageUrl } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { clearCart } from "@/store/slices/cartSlice";

export function CartHeader({ itemCount = 0 }) {
    const router = useRouter();
    const dispatch = useDispatch();
    const { restaurant, name: restaurantName } = useRestaurant();
    const [showConfirmClear, setShowConfirmClear] = useState(false);

    const handleClear = () => {
        dispatch(clearCart());
        setShowConfirmClear(false);
    };

    return (
        <header className="sticky top-0 z-40 w-full border-b border-gray-150/40 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <div className="mx-auto max-w-screen-md px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                    {/* Back & Restaurant info */}
                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 hover:bg-neutral-200/80 dark:bg-zinc-850 dark:hover:bg-zinc-800 text-neutral-800 dark:text-neutral-200 transition-all active:scale-95 cursor-pointer"
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
                                    {restaurant?.name || restaurantName || "Your Cart"}
                                </h1>
                                <span className="text-xs font-normal text-neutral-400 dark:text-neutral-500 truncate">
                                    {itemCount} {itemCount === 1 ? "item" : "items"} in cart
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Clear Cart Button with Confirmation */}
                    {itemCount > 0 && (
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setShowConfirmClear(true)}
                                className="flex h-8.5 items-center gap-1.5 px-2.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                                title="Clear Cart"
                            >
                                <Trash2 size={13} />
                                <span className="hidden sm:inline">Clear</span>
                            </button>

                            {/* Clear Confirmation Popover */}
                            {showConfirmClear && (
                                <div className="absolute right-0 top-11 z-50 w-64 rounded-2xl bg-white dark:bg-zinc-900 p-4 shadow-xl border border-gray-150 dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-200">
                                    <p className="text-xs font-bold text-neutral-900 dark:text-zinc-100">
                                        Clear your cart?
                                    </p>
                                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
                                        All items will be removed from your order.
                                    </p>
                                    <div className="flex items-center justify-end gap-2 mt-3.5">
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmClear(false)}
                                            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-zinc-800"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleClear}
                                            className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-xs"
                                        >
                                            Clear All
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default CartHeader;
