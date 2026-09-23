"use client";
import React, { useState } from "react";
import { MessageSquarePlus, Check } from "lucide-react";

export function CookingInstructions({ instructions, setInstructions, isItemVariant = false, hideHeader = false }) {
    const [isOpen, setIsOpen] = useState(Boolean(instructions));
    const showContent = hideHeader || isOpen;
    const presets = [
        "Less spicy",
        "Extra spicy",
        "No onion/garlic",
        "Less oil",
        "Cutlery needed",
        "Extra napkins",
    ];

    const togglePreset = (preset) => {
        if (!instructions) {
            setInstructions(preset);
            if (!hideHeader) setIsOpen(true);
            return;
        }

        const items = instructions.split(",").map((s) => s.trim()).filter(Boolean);
        if (items.includes(preset)) {
            const updated = items.filter((s) => s !== preset).join(", ");
            setInstructions(updated);
        } else {
            const updated = [...items, preset].join(", ");
            setInstructions(updated);
        }
    };

    const isPresetSelected = (preset) => {
        if (!instructions) return false;
        return instructions.split(",").map((s) => s.trim()).includes(preset);
    };

    return (
        <div className={hideHeader ? "" : (isItemVariant ? "mt-2 pt-2 border-t border-gray-100 dark:border-zinc-800/80" : "rounded-2xl bg-white dark:bg-zinc-900 p-4 border border-gray-150/70 dark:border-zinc-800 shadow-xs")}>
            {!hideHeader && (
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between gap-2 text-left cursor-pointer"
                >
                    <div className="flex items-center gap-2.5">
                        <div className={isItemVariant ? "flex size-6 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400" : "flex size-8 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400"}>
                            <MessageSquarePlus size={isItemVariant ? 14 : 16} />
                        </div>
                        <div>
                            <h3 className={isItemVariant ? "text-xs font-medium text-neutral-800 dark:text-zinc-100" : "text-xs sm:text-sm font-medium text-neutral-800 dark:text-zinc-100"}>
                                {isItemVariant ? "Special Instructions" : "Cooking / Special Instructions"}
                            </h3>
                            {!isItemVariant && (
                                <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                                    {instructions ? "Instructions added" : "Any special requests for the kitchen?"}
                                </p>
                            )}
                        </div>
                    </div>

                    <span className="text-xs font-medium text-primary">
                        {isOpen ? "Hide" : "+"}
                    </span>
                </button>
            )}

            {showContent && (
                <div className={hideHeader ? "space-y-3" : "mt-3 space-y-3 animate-in fade-in duration-200"}>
                    <div className="flex flex-wrap gap-1.5">
                        {presets.map((preset) => {
                            const isSelected = isPresetSelected(preset);
                            return (
                                <button
                                    key={preset}
                                    type="button"
                                    onClick={() => togglePreset(preset)}
                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all select-none cursor-pointer border ${isSelected
                                        ? "bg-primary text-primary-foreground border-primary shadow-2xs font-bold"
                                        : "bg-neutral-50 dark:bg-zinc-800 text-neutral-600 dark:text-neutral-300 border-gray-150/80 dark:border-zinc-700 hover:bg-neutral-100"
                                        }`}
                                >
                                    {isSelected && <Check size={12} strokeWidth={3} />}
                                    <span>{preset}</span>
                                </button>
                            );
                        })}
                    </div>

                    <textarea
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        placeholder="Write special requests (e.g. less spicy, extra onions)..."
                        maxLength={200}
                        rows={2}
                        className="w-full rounded-xl bg-neutral-50 dark:bg-zinc-850 p-2.5 text-xs text-neutral-900 dark:text-zinc-100 placeholder:text-neutral-400 border border-gray-150/70 dark:border-zinc-750 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    />
                </div>
            )}
        </div>
    );
}

export default CookingInstructions;
