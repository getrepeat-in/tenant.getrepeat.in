"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Utensils, SearchX, Home, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MenuEmptyState({
    title = "No Dishes Found",
    description = "We couldn't find any items matching your search. Explore our full menu to discover delicious meals and drinks.",
    onReset,
    showHome = false,
    searchVal = "",
}) {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center text-center px-4 py-16 sm:py-20 mx-auto max-w-md select-none animate-in fade-in duration-300">
            {/* Visual Icon Illustration */}
            <div className="relative mb-5 flex items-center justify-center">
                <div className="absolute -inset-3 rounded-full bg-primary/20 blur-2xl animate-pulse" />
                <div className="relative flex size-20 sm:size-24 items-center justify-center rounded-3xl bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-zinc-800 text-primary shadow-lg shadow-black/5 dark:shadow-black/40">
                    <SearchX className="size-10 sm:size-11 stroke-[1.8]" />
                </div>
            </div>

            {/* Context Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 mb-3">
                <Sparkles size={11} />
                <span>{searchVal ? "Search Result" : "Menu Update"}</span>
            </span>

            {/* Title & Description */}
            <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-zinc-100 tracking-tight">
                {title}
            </h3>

            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-neutral-500 dark:text-neutral-400 max-w-xs sm:max-w-sm font-normal">
                {description}
            </p>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-xs sm:max-w-sm">
                {onReset && (
                    <Button
                        type="button"
                        onClick={onReset}
                        className="h-12 w-full flex items-center justify-center gap-2.5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm shadow-md shadow-primary/25 hover:brightness-95 active:scale-95 transition-all cursor-pointer"
                    >
                        <Utensils size={17} strokeWidth={2.2} />
                        <span>View Full Menu</span>
                        <ArrowRight size={15} strokeWidth={2.2} />
                    </Button>
                )}

                {showHome && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/")}
                        className="h-12 w-full flex items-center justify-center gap-2 rounded-2xl border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs sm:text-sm font-semibold text-neutral-700 dark:text-zinc-300 hover:bg-neutral-50 dark:hover:bg-zinc-800 transition-all active:scale-95 cursor-pointer"
                    >
                        <Home size={15} />
                        <span>Go to Home</span>
                    </Button>
                )}
            </div>
        </div>
    );
}

export default MenuEmptyState;

