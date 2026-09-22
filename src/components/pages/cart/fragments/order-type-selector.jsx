import { cn } from "@/lib/utils";
import { Utensils, ShoppingBag, Bike } from "lucide-react";

export function OrderTypeSelector({ orderType, setOrderType, acceptedTypes = ["DINE_IN", "TAKEAWAY", "DELIVERY"] }) {
    const options = [
        { id: "DINE_IN", label: "Dine-in", icon: Utensils },
        { id: "TAKEAWAY", label: "Takeaway", icon: ShoppingBag },
        { id: "DELIVERY", label: "Delivery", icon: Bike },
    ];

    const filteredOptions = options.filter(opt => acceptedTypes.includes(opt.id));
    if (filteredOptions.length === 0) return null;

    return (
        <div className="flex flex-col gap-2.5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 px-1">
                Order Type
            </h2>
            <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${filteredOptions.length}, minmax(0, 1fr))` }}>
                {filteredOptions.map((option) => {
                    const Icon = option.icon;
                    const isActive = orderType === option.id;
                    return (
                        <button
                            key={option.id}
                            type="button"
                            onClick={() => setOrderType(option.id)}
                            className={cn(
                                "flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border transition-all cursor-pointer",
                                isActive
                                    ? "bg-primary/10 border-primary text-primary shadow-sm"
                                    : "bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-zinc-800/80"
                            )}
                        >
                            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                            <span className={cn("text-[11px] sm:text-xs leading-none", isActive ? "font-bold" : "font-medium")}>
                                {option.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
