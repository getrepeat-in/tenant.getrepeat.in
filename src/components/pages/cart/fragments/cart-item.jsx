"use client";
import { useDispatch } from "react-redux";
import { getImageUrl } from "@/lib/utils";
import DiaterySymbol from "@/components/global/diatery-symbol";
import { updateQuantity, removeItem } from "@/store/slices/cartSlice";

export function CartItem({ cartItem }) {
    const dispatch = useDispatch();
    const { item, quantity, price, selectedCustomizations, cartItemId } = cartItem;

    const handleUpdate = (newQuantity) => {
        if (newQuantity <= 0) {
            dispatch(removeItem(cartItemId));
        } else {
            dispatch(updateQuantity({ itemId: item._id, cartItemId, quantity: newQuantity }));
        }
    };

    const hasCustomizations = Object.keys(selectedCustomizations || {}).length > 0;

    const customizationsText = hasCustomizations
        ? Object.entries(selectedCustomizations)
            .map(([group, selection]) => {
                if (Array.isArray(selection)) {
                    return selection.join(", ");
                }
                return selection;
            })
            .filter(Boolean)
            .join(" | ")
        : null;

    return (
        <div className="flex flex-col gap-3 rounded-xl bg-white p-4 border border-gray-200">
            <div className="flex gap-4">
                <div className="relative h20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-50 border border-gray-100">
                    {item?.image ? (
                        <img
                            src={getImageUrl(item.image, true, "thumbnail")}
                            alt={item.name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-orange-50 font-bold text-orange-400 text-xl">
                            {item?.name?.charAt(0) || "I"}
                        </div>
                    )}
                </div>

                <div className="flex flex-1 flex-col pt-0.5">
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-[15px] font-bold leading-snug tracking-tight text-gray-900 line-clamp-2">
                            {item?.name}
                        </h3>
                        <div className="shrink-0 pt-0.5">
                            <DiaterySymbol type={item?.dietaryType} size={14} />
                        </div>
                    </div>

                    {customizationsText && (
                        <p className="text-[12px] font-medium leading-tight text-gray-500 line-clamp-2 mb-2">
                            {customizationsText}
                        </p>
                    )}

                    <div className="mt-auto flex items-end justify-between">
                        <div className="flex flex-col">
                            <span className="text-[15px] font-bold text-gray-900 tracking-tight">
                                ₹{price * quantity}
                            </span>
                        </div>

                        <div className="flex h-8 w-[80px] items-center justify-between rounded-lg border-[1.5px] border-orange-600/30 bg-orange-50/50 px-1 text-[14px] font-bold text-orange-600">
                            <button
                                onClick={() => handleUpdate(quantity - 1)}
                                className="flex h-full w-7 items-center justify-center hover:opacity-80 active:scale-95 focus:outline-none"
                            >
                                -
                            </button>
                            <span className="w-4 text-center">{quantity}</span>
                            <button
                                onClick={() => handleUpdate(quantity + 1)}
                                className="flex h-full w-7 items-center justify-center hover:opacity-80 active:scale-95 focus:outline-none"
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
