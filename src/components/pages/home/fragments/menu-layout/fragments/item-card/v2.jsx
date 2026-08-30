"use client";
import { useState } from "react";
import { useRestaurant } from "@/hooks/useRestaurant";
import { useDispatch, useSelector } from "react-redux";
import { ItemImage } from "@/components/global/item-image";
import DiaterySymbol from "@/components/global/diatery-symbol";
import VariantDrawer from "@/components/global/variant-drawer";
import { addItem, updateQuantity } from "@/store/slices/cartSlice";

const ItemCardV2 = ({ item }) => {
    const price = item?.price || item?.base_price || item?.defaultPrice || 0;
    const dispatch = useDispatch();
    const { restaurant } = useRestaurant();

    const hasCustomizations = (item?.variants?.length > 0) || (item?.addonGroups?.length > 0);
    const [isVariantDrawerOpen, setIsVariantDrawerOpen] = useState(false);
    const cartItems = useSelector(state => state.cart.items);
    
    const totalItemQuantity = cartItems
        .filter(i => i.item._id === item._id)
        .reduce((sum, current) => sum + current.quantity, 0);

    const simpleCartItem = cartItems.find(i => (i.cartItemId === item._id) || (i.item._id === item._id && (!i.selectedCustomizations || Object.keys(i.selectedCustomizations).length === 0)));
    const simpleQuantity = simpleCartItem?.quantity || 0;

    const handleAdd = (e) => {
        e.stopPropagation();
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

    const handleUpdate = (newQuantity) => {
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
                className={`flex w-full items-start justify-between gap-4 rounded-2xl bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] ${hasCustomizations ? "cursor-pointer" : ""}`}
            >
                <div className="flex flex-1 flex-col pb-2">
                    <div className="flex items-center gap-2 mb-2">
                        <DiaterySymbol type={item?.dietaryType} size={16} />
                        {item?.isBestseller && (
                            <div className="flex items-center gap-1 rounded-[4px] bg-[#fef2f2] px-1.5 py-0.5 text-[11px] font-bold tracking-wide text-[#e23744]">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                                Bestseller
                            </div>
                        )}
                    </div>

                    <h3 className="font-heading text-[17px] font-bold leading-snug tracking-tight">
                        {item?.name}
                    </h3>

                    <div className="mt-1.5 flex items-center gap-2">
                        <span className="font-heading text-[16px] font-bold tracking-tight text-gray-900">
                            ₹{price}
                        </span>
                    </div>

                    {item?.description && (
                        <p className="mt-2.5 line-clamp-2 text-[13px] leading-relaxed text-gray-500 sm:text-[14px]">
                            {item.description}
                        </p>
                    )}
                </div>

                <div className="relative shrink-0 pt-1">
                    <div className="relative h-[130px] w-[130px] overflow-hidden rounded-[16px] bg-gray-50 sm:h-[140px] sm:w-[140px]">
                        <ItemImage
                            src={item?.image}
                            alt={item?.name}
                            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                    </div>

                    <div className="absolute -bottom-3 left-1/2 flex flex-col items-center gap-1 -translate-x-1/2">
                        {!hasCustomizations && simpleQuantity > 0 ? (
                            <div className="flex h-9 w-[90px] items-center justify-between rounded-lg bg-white text-[15px] font-bold text-orange-600 shadow-md border-[1.5px] border-orange-600 px-0.5 transition-all duration-200">
                                <button onClick={(e) => { e.stopPropagation(); handleUpdate(simpleQuantity - 1); }} className="flex h-full w-7 items-center justify-center hover:bg-orange-50 active:scale-95 focus:outline-none rounded-l-md">-</button>
                                <span className="w-4 text-center">{simpleQuantity}</span>
                                <button onClick={(e) => { e.stopPropagation(); handleUpdate(simpleQuantity + 1); }} className="flex h-full w-7 items-center justify-center hover:bg-orange-50 active:scale-95 focus:outline-none rounded-r-md">+</button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={handleAdd}
                                className="flex h-9 w-[90px] items-center justify-center rounded-lg bg-white text-[15px] font-bold tracking-wide text-orange-600 shadow-md transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none border border-orange-200 relative"
                            >
                                {hasCustomizations ? "ADD" : "ADD"}
                                {hasCustomizations && totalItemQuantity > 0 && (
                                    <div className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-[10px] text-white shadow-sm">
                                        {totalItemQuantity}
                                    </div>
                                )}
                            </button>
                        )}
                        {hasCustomizations && (
                            <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap bg-white/80 px-1 rounded-sm shadow-xs border border-gray-100">Customizable</span>
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

export default ItemCardV2;
