"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useRestaurant } from "@/hooks/useRestaurant";
import { useDispatch, useSelector } from "react-redux";
import { ItemImage } from "@/components/global/common/item-image";
import DiaterySymbol from "@/components/global/common/diatery-symbol";
import VariantDrawer from "@/components/global/common/variant-drawer";
import { addItem, updateQuantity } from "@/store/slices/cartSlice";

export const ItemCardV1 = ({ item, promo }) => {
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

    const description = item?.description || item?.desc || "";

    return (
        <>
            <article
                onClick={() => hasCustomizations && setIsVariantDrawerOpen(true)}
                className={cn(
                    "relative flex w-full flex-row justify-between py-6 border-b border-dashed border-gray-200 transition-all duration-300",
                    hasCustomizations ? "cursor-pointer" : ""
                )}
            >
                <div className="flex flex-col flex-1 pr-6 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                        <DiaterySymbol type={item?.dietaryType} size={16} />
                        {promo?.type === 'BESTSELLER' && (
                            <span className="bg-[#e21b70] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-[4px] tracking-wide">
                                Bestseller
                            </span>
                        )}
                    </div>
                    
                    <h3 className="text-[17px] font-bold leading-snug text-gray-800 text-wrap mt-0.5">
                        {item?.name}
                    </h3>
                    
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        {hasDiscount ? (
                            <>
                                <span className="text-[14px] font-medium text-gray-400 line-through">
                                    ₹{basePrice}
                                </span>
                                <span className="text-[16px] font-bold text-gray-800">
                                    ₹{finalPrice.toFixed(2).replace(/\.00$/, '')}
                                </span>
                            </>
                        ) : (
                            <span className="text-[16px] font-bold text-gray-800">
                                ₹{basePrice}
                            </span>
                        )}
                    </div>

                    {description && (
                        <p className="text-[14px] text-gray-500 mt-2.5 line-clamp-2 leading-relaxed">
                            {description}
                        </p>
                    )}
                </div>

                <div className="relative shrink-0 w-[140px] flex flex-col items-center">
                    <div className="relative w-[140px] h-[140px] rounded-[24px] overflow-hidden bg-gray-50 border border-gray-100 shadow-sm group">
                        <ItemImage
                            src={item?.image}
                            alt={item?.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm rounded-[4px] p-[2px] shadow-sm z-10">
                            <DiaterySymbol type={item?.dietaryType} size={10} />
                        </div>
                    </div>
                    
                    <div className="absolute -bottom-[18px] left-1/2 -translate-x-1/2 z-20 w-[110px]">
                        {!hasCustomizations && simpleQuantity > 0 ? (
                            <div className="flex h-[38px] w-full items-center justify-between rounded-xl border-[1.5px] border-primary bg-white text-primary font-bold text-[16px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
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
                                className="flex h-[38px] w-full items-center justify-center rounded-xl border-[1.5px] border-primary bg-white text-primary text-[16px] font-bold tracking-wide transition-all duration-200 hover:bg-primary/5 active:scale-95 focus:outline-none shadow-[0_2px_8px_rgba(0,0,0,0.08)] relative"
                            >
                                Add
                                {hasCustomizations && totalItemQuantity === 0 && (
                                    <span className="absolute -top-2 -right-1 text-white bg-primary text-[14px] font-bold leading-none rounded-full w-[18px] h-[18px] flex items-center justify-center shadow-sm border-2 border-white pointer-events-none">+</span>
                                )}
                                {hasCustomizations && totalItemQuantity > 0 && (
                                    <div className="absolute -top-2 -right-1 flex h-[20px] w-[20px] items-center justify-center rounded-full bg-primary text-[11px] text-white shadow-sm font-bold border-2 border-white pointer-events-none">
                                        {totalItemQuantity}
                                    </div>
                                )}
                            </button>
                        )}
                        
                        {hasCustomizations && (
                            <div className="absolute -bottom-4 left-0 w-full text-center">
                                <span className="text-[10px] text-gray-500 font-medium leading-none tracking-wider lowercase bg-white/80 px-1 rounded">
                                    customizable
                                </span>
                            </div>
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
