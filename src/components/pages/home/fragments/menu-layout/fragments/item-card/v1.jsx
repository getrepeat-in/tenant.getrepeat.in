"use client";
import { useState } from "react";
import { useRestaurant } from "@/hooks/useRestaurant";
import { useDispatch, useSelector } from "react-redux";
import { ItemImage } from "@/components/global/item-image";
import DiaterySymbol from "@/components/global/diatery-symbol";
import VariantDrawer from "@/components/global/variant-drawer";
import { addItem, updateQuantity } from "@/store/slices/cartSlice";

const ItemCardV1 = ({ item }) => {
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

    const handleUpdate = (newQuantity, e) => {
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
                className={`group flex w-full flex-col gap-3 rounded-[20px] p-2 transition-all duration-300 hover:bg-gray-50/50 ${hasCustomizations ? "cursor-pointer" : ""}`}
            >
                <div className="relative aspect-[1.15/1] w-full overflow-hidden rounded-[20px] bg-muted shadow-sm">
                    <ItemImage
                        src={item?.image}
                        alt={item?.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>

                <div className="flex flex-col px-1">
                    <div className="flex items-start justify-between gap-3">
                        <h3 className="line-clamp-2 font-heading text-[17px] font-bold leading-[1.3] text-foreground">
                            {item?.name}
                        </h3>

                        <div className="mt-1 shrink-0">
                            <DiaterySymbol type={item?.dietaryType} size={16} />
                        </div>
                    </div>

                    <div className="mt-3 flex flex-1 items-end justify-between gap-2 font-heading tracking-tight">
                        <div className="flex flex-col mb-1">
                            <span className="text-[18px] font-bold text-foreground">
                                ₹{price}
                            </span>
                        </div>

                        <div className="flex flex-col items-center gap-1 relative z-10">
                            {!hasCustomizations && simpleQuantity > 0 ? (
                                <div className="flex h-9 w-[90px] items-center justify-between rounded-lg bg-white border-[1.5px] border-orange-600 px-0.5 text-[15px] font-bold text-orange-600 shadow-sm transition-all duration-200">
                                    <button onClick={(e) => handleUpdate(simpleQuantity - 1, e)} className="flex h-full w-8 items-center justify-center hover:bg-orange-50 active:scale-95 focus:outline-none rounded-l-md">-</button>
                                    <span className="w-5 text-center">{simpleQuantity}</span>
                                    <button onClick={(e) => handleUpdate(simpleQuantity + 1, e)} className="flex h-full w-8 items-center justify-center hover:bg-orange-50 active:scale-95 focus:outline-none rounded-r-md">+</button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleAdd}
                                    className="relative flex h-9 w-[90px] items-center justify-center rounded-lg border-[1.5px] border-orange-600/60 bg-background text-[15px] font-bold tracking-wide text-orange-600 shadow-sm transition-all duration-200 hover:border-orange-600 hover:bg-orange-50 active:scale-[0.95] focus:outline-none"
                                >
                                    ADD
                                    {hasCustomizations && totalItemQuantity > 0 && (
                                        <div className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-[10px] text-white shadow-sm">
                                            {totalItemQuantity}
                                        </div>
                                    )}
                                </button>
                            )}
                            {hasCustomizations && (
                                <span className="text-[10px] text-gray-500 font-medium">Customizable</span>
                            )}
                        </div>
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

export default ItemCardV1;
