"use client";
import { useQuery } from "@tanstack/react-query";
import { useSelector, useDispatch } from "react-redux";
import { PromotionService } from "@/services/frontend/promotion";
import { useRestaurant } from "@/hooks/useRestaurant";
import { addItem, removeItem } from "@/store/slices/cartSlice";
import { Lock, Unlock, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";
import { ItemImage } from "@/components/global/item-image";

export const FreebieItems = () => {
    const { slug } = useRestaurant();
    const cartItems = useSelector((state) => state.cart.items) || [];
    const cartTotal = cartItems.reduce((acc, item) => acc + ((item.price || item.base_price || 0) * (item.quantity || 1)), 0);

    const { data: promotions = [], isPending } = useQuery({
        queryKey: ["promotions", slug],
        queryFn: async () => {
            const response = await PromotionService.getAll(slug);
            return response?.data || response || [];
        },
        enabled: !!slug,
    });

    const activeFreebies = promotions.filter(p => (!p.status || p.status === 'ACTIVE') && p.type === 'FREEBIE');

    if (isPending || activeFreebies.length === 0) return null;

    return (
        <div className="w-full flex pt-2 flex-col gap-6 mt-2 mb-6 px-4 md:px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeFreebies.map((promo, idx) => {
                const threshold = promo.min_order_value || 0;
                const isLocked = cartTotal < threshold;
                const remaining = threshold - cartTotal;

                return (
                    <div key={promo._id || idx} className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
                                    {promo.name || "Free Treats"}
                                    {!isLocked && (
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600">
                                            <Unlock size={12} strokeWidth={3} />
                                        </span>
                                    )}
                                </h2>
                                {isLocked ? (
                                    <p className="text-[13px] text-gray-500 font-medium">
                                        Add <span className="text-primary font-bold">₹{remaining.toFixed(2)}</span> more to unlock free items
                                    </p>
                                ) : (
                                    <p className="text-[13px] text-green-600 font-medium">
                                        Unlocked! Claim your free item now.
                                    </p>
                                )}
                            </div>
                        </div>

                        {isLocked && (
                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-1">
                                <div
                                    className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
                                    style={{ width: `${Math.min(100, (cartTotal / threshold) * 100)}%` }}
                                />
                            </div>
                        )}

                        <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            {(promo.items || []).map((item) => (
                                <FreebieCard
                                    key={item._id}
                                    item={item}
                                    isLocked={isLocked}
                                    promo={promo}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const FreebieCard = ({ item, isLocked, promo }) => {
    const dispatch = useDispatch();
    const { restaurant } = useRestaurant();
    const cartItems = useSelector((state) => state.cart.items);
    const isAdded = cartItems.some(
        (i) => i.item?._id === item._id && i.price === 0
    );

    const handleToggle = (e) => {
        if (e) e.stopPropagation();
        if (isLocked) return;
        if (isAdded) {
            dispatch(removeItem(`${item._id}`));
        } else {
            dispatch(
                addItem({
                    item,
                    restaurantId: restaurant?._id || restaurant?.id,
                    price: 0,
                    selectedCustomizations: {},
                    quantity: 1,
                })
            );
        }
    };

    return (
        <div
            className={cn(
                "relative flex min-w-[145px] w-[145px] shrink-0 snap-start flex-col rounded-xl bg-white dark:bg-zinc-900 p-2.5 transition-all duration-300 border shadow-[0_2px_8px_rgba(0,0,0,0.04)]",
                isLocked
                    ? "border-gray-100 dark:border-zinc-800"
                    : "border-primary/20 hover:border-primary/40 cursor-pointer"
            )}
            onClick={handleToggle}
        >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-50 dark:bg-zinc-800 group mb-3">
                <ItemImage
                    src={item?.image}
                    alt={item?.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute top-0 left-0 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-br-lg shadow-xs uppercase tracking-wider">
                    Freebie
                </div>
            </div>

            <div className="flex items-center justify-between gap-2 px-0.5">
                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <h3 className="text-[13px] font-bold leading-tight text-gray-900 dark:text-zinc-100 line-clamp-1 truncate pr-1">
                        {item.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[12px] font-medium text-gray-400 line-through">
                            ₹{item.base_price || item.price}
                        </span>
                        <span className="text-[12px] font-black text-green-600">
                            ₹0
                        </span>
                    </div>
                </div>

                <div
                    className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-md shadow-xs transition-all duration-300 border",
                        isLocked
                            ? "bg-gray-50 dark:bg-zinc-800 text-gray-400 border-gray-100 dark:border-zinc-700 cursor-not-allowed"
                            : isAdded
                            ? "bg-green-500 text-white border-green-500 cursor-pointer"
                            : "bg-primary text-primary-foreground border-primary/20 cursor-pointer hover:brightness-95"
                    )}
                >
                    {isLocked ? (
                        <Lock size={14} strokeWidth={2.5} />
                    ) : isAdded ? (
                        <Check size={16} strokeWidth={3} />
                    ) : (
                        <Plus size={18} strokeWidth={2.5} />
                    )}
                </div>
            </div>
        </div>
    );
};
