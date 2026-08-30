"use client";
import { ItemImage } from "@/components/global/item-image";

const CategoryCardV1 = ({ category }) => {
    return (
        <button
            type="button"
            className="group flex w-[84px] shrink-0 flex-col items-center justify-center gap-2.5 focus:outline-none sm:w-[96px]"
        >
            <div className="relative flex h-[72px] w-[72px] items-center justify-center rounded-full bg-gradient-to-tr from-border/50 to-border/20 p-[2px] transition-all duration-300 ease-out group-hover:scale-105 group-hover:from-primary/80 group-hover:to-primary/30 group-hover:shadow-lg group-hover:shadow-primary/20 group-active:scale-95 sm:h-[84px] sm:w-[84px]">
                <div className="relative h-full w-full overflow-hidden rounded-full border-[2.5px] border-background bg-muted">
                    <ItemImage
                        src={category?.image}
                        alt={category?.name || "Category"}
                        className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
                    />
                </div>
            </div>

            <span className="w-full truncate text-center font-heading text-[11px] font-semibold tracking-wide text-muted-foreground transition-colors duration-200 group-hover:text-foreground sm:text-xs">
                {category?.name}
            </span>
        </button>
    );
};

export default CategoryCardV1;