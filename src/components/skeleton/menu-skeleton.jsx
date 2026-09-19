"use client";
import React from "react";

export function ItemCardSkeleton() {
    return (
        <div className="flex flex-col justify-between w-full overflow-hidden rounded-md bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-2.5 sm:p-3 animate-pulse">
            <div className="flex flex-col w-full">
                {/* Image Placeholder */}
                <div className="aspect-[4/3] w-full rounded-md bg-neutral-200/70 dark:bg-zinc-800" />

                {/* Dietary Symbol & Title */}
                <div className="flex items-center gap-2 mt-2.5">
                    <div className="h-3.5 w-3.5 rounded-[3px] bg-neutral-200/80 dark:bg-zinc-800 shrink-0" />
                    <div className="h-4 w-3/4 bg-neutral-200/80 dark:bg-zinc-800 rounded-md" />
                </div>

                {/* Description lines */}
                <div className="space-y-1.5 mt-2">
                    <div className="h-2.5 w-full bg-neutral-150 dark:bg-zinc-850 rounded" />
                    <div className="h-2.5 w-2/3 bg-neutral-150 dark:bg-zinc-850 rounded" />
                </div>
            </div>

            {/* Price & Add Button */}
            <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-gray-50 dark:border-zinc-850">
                <div className="h-4 w-12 bg-neutral-200/80 dark:bg-zinc-800 rounded" />
                <div className="h-8 w-16 bg-neutral-200/80 dark:bg-zinc-800 rounded-lg" />
            </div>
        </div>
    );
}

export function MenuSkeleton() {
    return (
        <div className="w-full select-none">
            {/* Sticky Category Tabs Bar Skeleton */}
            <div className="sticky top-[57px] sm:top-[65px] z-20 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800 shadow-2xs">
                <div className="mx-auto max-w-screen-md flex items-center gap-2 overflow-x-hidden px-4 py-2.5">
                    {[110, 130, 95, 120, 105].map((width, idx) => (
                        <div
                            key={idx}
                            className="h-8 shrink-0 flex items-center gap-2 rounded-full pl-1.5 pr-3.5 py-1 bg-neutral-100 dark:bg-zinc-850 animate-pulse border border-transparent"
                            style={{ width: `${width}px` }}
                        >
                            <div className="h-6 w-6 rounded-full bg-neutral-200 dark:bg-zinc-750 shrink-0" />
                            <div className="h-3 flex-1 bg-neutral-200/80 dark:bg-zinc-750 rounded-full" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Menu Container */}
            <div className="mx-auto max-w-screen-md mt-4 space-y-4">
                {/* Category Block 1 */}
                <div className="bg-white dark:bg-zinc-900 sm:rounded-2xl sm:border sm:border-gray-100 dark:sm:border-zinc-800 overflow-hidden shadow-xs">
                    {/* Category Header */}
                    <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/70 dark:bg-zinc-900/50 animate-pulse">
                        <div className="h-5 w-28 bg-neutral-200/80 dark:bg-zinc-800 rounded-md" />
                        <div className="h-5 w-8 bg-neutral-200/80 dark:bg-zinc-800 rounded-full" />
                    </div>

                    {/* Items Grid */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 bg-white dark:bg-zinc-900">
                        <ItemCardSkeleton />
                        <ItemCardSkeleton />
                        <ItemCardSkeleton />
                        <ItemCardSkeleton />
                    </div>
                </div>

                {/* Category Block 2 */}
                <div className="bg-white dark:bg-zinc-900 sm:rounded-2xl sm:border sm:border-gray-100 dark:sm:border-zinc-800 overflow-hidden shadow-xs">
                    {/* Category Header */}
                    <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/70 dark:bg-zinc-900/50 animate-pulse">
                        <div className="h-5 w-36 bg-neutral-200/80 dark:bg-zinc-800 rounded-md" />
                        <div className="h-5 w-8 bg-neutral-200/80 dark:bg-zinc-800 rounded-full" />
                    </div>

                    {/* Items Grid */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 bg-white dark:bg-zinc-900">
                        <ItemCardSkeleton />
                        <ItemCardSkeleton />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MenuSkeleton;
