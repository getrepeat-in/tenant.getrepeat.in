import { X } from "lucide-react";
import { ItemImage } from "@/components/global/common/item-image";
import { SheetTitle, SheetDescription } from "@/components/ui/sheet";
import DiaterySymbol from "@/components/global/common/diatery-symbol";

export function VariantDrawerHeader({ item, currentPrice, setIsOpen }) {
    if (!item) return null;

    const dietaryType = item.dietaryType || item.dietary_type;
    const descriptionText =
        item.description ||
        item.desc ||
        item.short_description ||
        item.item_description ||
        item.details ||
        "Freshly prepared with quality ingredients, made to order.";

    return (
        <>
            <div className="w-12 h-1.5 bg-neutral-200 dark:bg-zinc-800 rounded-full mx-auto my-2.5 shrink-0" />
            <div className="px-4 sm:px-5">
                <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-neutral-100 dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-xs border border-neutral-100 dark:border-zinc-800">
                    <ItemImage
                        src={item.image}
                        alt={item.name}
                        variant="detail"
                        className="h-full w-full object-cover"
                    />
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-all hover:bg-black/70 active:scale-90 shadow-md"
                    >
                        <X size={16} strokeWidth={2.5} />
                        <span className="sr-only">Close</span>
                    </button>
                </div>
            </div>

            <div className="px-5 pt-4 pb-2">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                        {dietaryType && (
                            <div className="shrink-0 flex items-center justify-center mt-1.5">
                                <DiaterySymbol
                                    type={dietaryType}
                                    size={16}
                                />
                            </div>
                        )}
                        <SheetTitle className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight leading-snug">
                            {item.name}
                        </SheetTitle>
                    </div>
                    <SheetDescription className="text-xl font-bold text-neutral-900 dark:text-neutral-100 shrink-0 mt-0.5">
                        ₹{currentPrice}
                    </SheetDescription>
                </div>

                {descriptionText && (
                    <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed">
                        {descriptionText}
                    </p>
                )}
            </div>
        </>
    );
}
