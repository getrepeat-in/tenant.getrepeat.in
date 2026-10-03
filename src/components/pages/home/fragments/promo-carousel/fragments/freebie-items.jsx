"use client";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useRestaurant } from "@/hooks/useRestaurant";
import { useSelector, useDispatch } from "react-redux";
import { Lock, Unlock, Plus, Check } from "lucide-react";
import { addItem, removeItem } from "@/store/slices/cartSlice";
import { PromotionService } from "@/services/frontend/promotion";
import { ItemImage } from "@/components/global/common/item-image";

export const FreebieItems = () => {
    const { slug } = useRestaurant();
    const cartItems = useSelector((state) => state.cart.items) || [];
    const cartTotal = cartItems.reduce((acc, item) => {
        const p = item.price !== undefined ? item.price : (item.item?.base_price || item.item?.price || 0);
        return acc + (p * (item.quantity || 1));
    }, 0);

    const { data: promotions = [], isPending } = useQuery({
        queryKey: ["promotions", slug],
        queryFn: async () => {
            const response = await PromotionService.getAll(slug);
            const data = response?.data || response;
            return Array.isArray(data) ? data : [];
        },
        enabled: !!slug,
    });

    const activeFreebies = promotions.filter(p => (!p.status || p.status === 'ACTIVE') && p.type === 'FREEBIE');

    if (isPending || activeFreebies.length === 0) return null;

    return (
        <div className="w-full flex pt-2 flex-col gap-6 mt-2 px-4 md:px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeFreebies.map((promo, idx) => {
                const threshold = promo.min_order_value || 0;
                const isLocked = cartTotal < threshold;
                const remaining = threshold - cartTotal;

                return (
                    <div key={promo._id || idx} className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-[19px] font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2 uppercase">
                                    GET FREE ITEM
                                    {!isLocked && (
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                                            <Unlock size={12} strokeWidth={3} />
                                        </span>
                                    )}
                                </h2>
                                {isLocked ? (
                                    <p className="text-[14px] text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                                        Add <span className="text-primary font-bold">₹{remaining.toFixed(2)}</span> more to unlock free items
                                    </p>
                                ) : (
                                    <p className="text-[14px] text-green-600 dark:text-green-400 font-medium mt-0.5">
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

                        <div className="flex md:grid gap-3 overflow-x-auto md:overflow-visible pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-4">
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
        (i) => i.item?._id === item._id && i.selectedCustomizations?.freebie
    );

    const handleToggle = (e) => {
        if (e) e.stopPropagation();
        if (isLocked) return;
        if (isAdded) {
            dispatch(removeItem(`${item._id}|{"freebie":true}`));
        } else {
            const existingFreebies = cartItems.filter(i => i.selectedCustomizations?.freebie);
            existingFreebies.forEach(f => {
                dispatch(removeItem(f.cartItemId || `${f.item._id}|{"freebie":true}`));
            });

            dispatch(
                addItem({
                    item,
                    restaurantId: restaurant?._id || restaurant?.id,
                    price: 0,
                    selectedCustomizations: { freebie: true },
                    quantity: 1,
                })
            );
        }
    };

    return (
        <div
            className={cn(
                "relative flex w-[155px] md:w-full shrink-0 snap-start flex-col rounded-2xl bg-white dark:bg-zinc-900 p-2.5 transition-all duration-300 border shadow-xs",
                isLocked
                    ? "border-gray-100 dark:border-zinc-800"
                    : isAdded
                        ? "border-green-500 ring-1 ring-green-500"
                        : "border-gray-200 hover:border-primary/30 cursor-pointer dark:border-zinc-700"
            )}
            onClick={handleToggle}
        >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-50 dark:bg-zinc-800 group mb-3">
                <ItemImage
                    src={item?.image}
                    alt={item?.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute top-0 left-0 bg-primary text-primary-foreground text-[10px] font-bold px-2.5 py-1 rounded-br-xl shadow-xs uppercase tracking-widest z-10">
                    Freebie
                </div>
            </div>

            <div className="flex items-center justify-between gap-2 px-0.5">
                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <h3 className="text-[14px] font-bold leading-tight text-gray-900 dark:text-zinc-100 line-clamp-1 truncate pr-1">
                        {item.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[13px] font-semibold text-gray-400 line-through">
                            ₹{item.base_price || item.price}
                        </span>
                        <span className="text-[13px] font-black text-green-600 dark:text-green-500">
                            ₹0
                        </span>
                    </div>
                </div>

                <div
                    className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] shadow-sm transition-all duration-300",
                        isLocked
                            ? "bg-gray-100 dark:bg-zinc-800 text-gray-400 cursor-not-allowed"
                            : isAdded
                                ? "bg-[#00C853] text-white cursor-pointer hover:bg-[#00B048]"
                                : "bg-primary text-primary-foreground cursor-pointer hover:brightness-95"
                    )}
                >
                    {isLocked ? (
                        <Lock size={15} strokeWidth={2.5} />
                    ) : isAdded ? (
                        <Check size={18} strokeWidth={3} />
                    ) : (
                        <Plus size={18} strokeWidth={2.5} />
                    )}
                </div>
            </div>
        </div>
    );
};
