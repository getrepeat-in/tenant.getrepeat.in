import React from "react";
import { cn } from "@/lib/utils";
import { Utensils, ShoppingBag, Bike } from "lucide-react";

export function OrderTypeSelector({ orderType, setOrderType }) {
    const options = [
        { id: "dine-in", label: "Dine-in", icon: Utensils },
        { id: "takeaway", label: "Takeaway", icon: ShoppingBag },
        { id: "delivery", label: "Delivery", icon: Bike },
    ];

    return (
        <div className="flex flex-col gap-2.5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 px-1">
                Order Type
            </h2>
            <div className="grid grid-cols-3 gap-2">
                {options.map((option) => {
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
