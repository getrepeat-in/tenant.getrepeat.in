"use client";
import { useState } from "react";
import { useRestaurant } from "@/hooks/useRestaurant";
import { useDispatch, useSelector } from "react-redux";
import { ItemImage } from "@/components/global/item-image";
import DiaterySymbol from "@/components/global/diatery-symbol";
import VariantDrawer from "@/components/global/variant-drawer";
import { addItem, updateQuantity } from "@/store/slices/cartSlice";
import { cn } from "@/lib/utils";
import { Flame } from "lucide-react";

export const ItemCard = ({ item, promo }) => {
    const dispatch = useDispatch();
    const { restaurant } = useRestaurant();
    const cartItems = useSelector(state => state.cart.items);
    
    const hasCustomizations = (item?.variants?.length > 0) || (item?.addonGroups?.length > 0);
    const [isVariantDrawerOpen, setIsVariantDrawerOpen] = useState(false);

    const basePrice = item?.price || item?.base_price || item?.defaultPrice || 0;
    let finalPrice = basePrice;
    
    // Apply promo if passed
    if (promo) {
        if (promo.discount_type === 'PERCENTAGE' || promo.discount_type === 'PERCENTAGE_DISCOUNT') {
            finalPrice = basePrice - (basePrice * (promo.discount_value / 100));
        } else if (promo.discount_type === 'FLAT' || promo.discount_type === 'FLAT_DISCOUNT') {
            finalPrice = basePrice - promo.discount_value;
        }
        finalPrice = Math.max(0, finalPrice);
    } else if (item?.discounted_price !== undefined && item?.discounted_price < basePrice) {
        finalPrice = item.discounted_price;
    }

    const hasDiscount = finalPrice < basePrice;

    const totalItemQuantity = cartItems
        .filter(i => i.item._id === item._id)
        .reduce((sum, current) => sum + current.quantity, 0);

    const simpleCartItem = cartItems.find(i => (i.cartItemId === item._id) || (i.item._id === item._id && (!i.selectedCustomizations || Object.keys(i.selectedCustomizations).length === 0)));
    const simpleQuantity = simpleCartItem?.quantity || 0;

    const handleAdd = (e) => {
        if (e) e.stopPropagation();
        if (hasCustomizations) {
            setIsVariantDrawerOpen(true);
        } else {
            dispatch(addItem({
                item,
                restaurantId: restaurant?._id || restaurant?.id,
                selectedCustomizations: {}
            }));
        }
    };

    const handleUpdate = (e, newQuantity) => {
        if (e) e.stopPropagation();
        if (hasCustomizations) {
            setIsVariantDrawerOpen(true);
        } else {
            dispatch(updateQuantity({ itemId: item._id, quantity: newQuantity }));
        }
    };

    return (
        <>
            <article
                onClick={() => hasCustomizations && setIsVariantDrawerOpen(true)}
                className={cn(
                    "relative flex w-full flex-col overflow-hidden rounded-[16px] bg-white border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md",
                    hasCustomizations ? "cursor-pointer" : ""
                )}
            >
                <div className="relative aspect-[4/3] w-full bg-gray-50 group">
                    <ItemImage
                        src={item?.image}
                        alt={item?.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {promo?.type === 'BESTSELLER' && (
                        <div className="absolute top-0 left-0 bg-primary text-primary-foreground text-[10px] font-black px-2 py-1 rounded-br-lg shadow-sm uppercase tracking-wider flex items-center gap-1 z-10">
                            <Flame size={10} className="fill-primary-foreground/50" />
                            Hot
                        </div>
                    )}
                    <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm rounded-[4px] flex items-center justify-center p-[3px] shadow-sm z-10">
                        <DiaterySymbol type={item?.dietaryType} size={12} />
                    </div>
                </div>

                <div className="flex flex-col p-3 pt-3.5">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="text-[15px] font-bold leading-tight text-gray-800 line-clamp-2">
                            {item?.name}
                        </h3>
                        <div className="shrink-0 mt-[2px] bg-white rounded-sm p-[1px]">
                            <DiaterySymbol type={item?.dietaryType} size={16} />
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        {hasDiscount ? (
                            <>
                                <span className="text-[13px] font-medium text-gray-400 line-through">
                                    ₹{basePrice}
                                </span>
                                <span className="text-[15px] font-bold text-gray-800">
                                    ₹{finalPrice.toFixed(2).replace(/\.00$/, '')}
                                </span>
                            </>
                        ) : (
                            <span className="text-[15px] font-bold text-gray-800">
                                ₹{basePrice}
                            </span>
                        )}
                    </div>

                    <div className="mt-3.5 flex flex-col">
                        {!hasCustomizations && simpleQuantity > 0 ? (
                            <div className="flex h-[36px] w-[110px] items-center justify-between rounded-xl border-[1.5px] border-primary bg-white text-primary font-bold text-[16px] overflow-hidden shadow-sm">
                                <button onClick={(e) => handleUpdate(e, simpleQuantity - 1)} className="flex h-full w-[36px] items-center justify-center hover:bg-primary/5 active:bg-primary/10 transition-colors">
                                    <span className="leading-none mb-[2px]">-</span>
                                </button>
                                <span className="flex-1 text-center flex items-center justify-center">{simpleQuantity}</span>
                                <button onClick={(e) => handleUpdate(e, simpleQuantity + 1)} className="flex h-full w-[36px] items-center justify-center hover:bg-primary/5 active:bg-primary/10 transition-colors">
                                    <span className="leading-none mb-[2px]">+</span>
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={handleAdd}
                                className="flex h-[36px] w-[110px] items-center justify-center rounded-xl border-[1.5px] border-primary bg-white text-primary text-[15px] font-bold tracking-wide transition-all duration-200 hover:bg-primary/5 active:scale-95 focus:outline-none relative shadow-sm"
                            >
                                Add
                                {hasCustomizations && totalItemQuantity === 0 && (
                                    <span className="absolute -top-2 -right-2 text-white bg-primary text-[14px] font-bold leading-none rounded-full w-[18px] h-[18px] flex items-center justify-center shadow-sm border-2 border-white">+</span>
                                )}
                                {hasCustomizations && totalItemQuantity > 0 && (
                                    <div className="absolute -top-2 -right-2 flex h-[20px] w-[20px] items-center justify-center rounded-full bg-primary text-[11px] text-white shadow-sm font-bold border-2 border-white">
                                        {totalItemQuantity}
                                    </div>
                                )}
                            </button>
                        )}
                        
                        {hasCustomizations && (
                            <span className="text-[10px] text-gray-500 font-medium mt-1.5 leading-none tracking-wider lowercase w-[110px] text-center">
                                customizable
                            </span>
                        )}
                    </div>
                </div>
            </article>

            {hasCustomizations && (
                <VariantDrawer
                    isOpen={isVariantDrawerOpen}
                    setIsOpen={setIsVariantDrawerOpen}
                    item={item}
                />
            )}
        </>
    );
};