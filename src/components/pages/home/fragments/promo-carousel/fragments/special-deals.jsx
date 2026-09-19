"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { useSelector, useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { useRestaurant } from "@/hooks/useRestaurant";
import { ItemImage } from "@/components/global/item-image";
import { PromotionService } from "@/services/frontend/promotion";
import { addItem, removeItem } from "@/store/slices/cartSlice";
import { Sparkles, Plus, Check, Lock, Unlock } from "lucide-react";

export const SpecialDeals = () => {
    const { slug } = useRestaurant();
    const cartItems = useSelector((state) => state.cart.items) || [];
    const cartTotal = cartItems.reduce((acc, item) => acc + ((item.base_price || item.price || 0) * (item.quantity || 1)), 0);

    const { data: promotions = [], isPending } = useQuery({
        queryKey: ["promotions", slug],
        queryFn: async () => {
            const response = await PromotionService.getAll(slug);
            return response?.data || response || [];
        },
        enabled: !!slug,
    });

    const activeDeals = promotions.filter(p => (!p.status || p.status === 'ACTIVE') && p.type === 'FLAT_PRICE');

    if (isPending || activeDeals.length === 0) return null;

    return (
        <div className="w-full flex pt-2 flex-col gap-6 mt-2 mb-6 px-4 md:px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeDeals.map((promo, idx) => {
                const threshold = promo.min_order_value || 0;
                const isLocked = cartTotal < threshold;
                const remaining = threshold - cartTotal;

                return (
                    <div key={promo._id || idx} className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
                                    <Sparkles size={18} className="text-primary" />
                                    {promo.name || "Special Deals"}
                                    {!isLocked && (
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600 ml-1">
                                            <Unlock size={12} strokeWidth={3} />
                                        </span>
                                    )}
                                </h2>
                                {isLocked ? (
                                    <p className="text-[13px] text-gray-500 font-medium">
                                        Add <span className="text-primary font-bold">₹{remaining.toFixed(2)}</span> more to unlock deals at <span className="font-bold text-gray-900 dark:text-zinc-200">₹{promo.discount_value}</span>
                                    </p>
                                ) : (
                                    <p className="text-[13px] text-green-600 font-medium">
                                        Unlocked! Grab these items at <span className="font-bold">₹{promo.discount_value}</span>
                                    </p>
                                )}
                            </div>
                        </div>

                        {isLocked && (
                            <div className="w-full h-1.5 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden mt-1">
                                <div
                                    className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
                                    style={{ width: `${Math.min(100, (cartTotal / threshold) * 100)}%` }}
                                />
                            </div>
                        )}

                        <div className="flex gap-3 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            {(promo.items || []).map((item) => (
                                <DealCard
                                    key={item._id}
                                    item={item}
                                    dealPrice={promo.discount_value}
                                    isLocked={isLocked}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const DealCard = ({ item, dealPrice, isLocked }) => {
    const dispatch = useDispatch();
    const { restaurant } = useRestaurant();
    const cartItems = useSelector((state) => state.cart.items) || [];
    const isAdded = cartItems.some(
        (i) => i.item?._id === item._id && i.price === dealPrice
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
                    price: dealPrice,
                    selectedCustomizations: {},
                    quantity: 1,
                })
            );
        }
    };

    return (
        <div
            className={cn(
                "relative flex min-w-[145px] w-[145px] shrink-0 snap-start flex-col rounded-xl bg-white dark:bg-zinc-900 p-2.5 transition-all duration-300 border shadow-xs",
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
                    className={cn(
                        "h-full w-full object-cover transition-transform duration-500",
                        !isLocked && "group-hover:scale-105"
                    )}
                />

                <div className="absolute top-0 left-0 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-br-lg shadow-xs uppercase tracking-wider">
                    Deal
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
                        <span className={cn("text-[13px] font-black", isLocked ? "text-gray-400" : "text-primary")}>
                            ₹{dealPrice}
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

