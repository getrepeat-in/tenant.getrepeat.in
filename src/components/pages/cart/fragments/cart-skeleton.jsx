import React from "react";

export function CartSkeleton() {
    return (
        <div className="flex flex-col gap-4 sm:gap-5 animate-pulse w-full">
            <div className="flex flex-col gap-2.5">
                <div className="h-3 w-24 bg-gray-200 dark:bg-zinc-800 rounded-md px-1" />
                <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="h-[74px] rounded-2xl border border-gray-150 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                        />
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-between px-1 mt-2">
                <div className="h-3 w-28 bg-gray-200 dark:bg-zinc-800 rounded-md" />
                <div className="h-3 w-24 bg-gray-200 dark:bg-zinc-800 rounded-md" />
            </div>

            <div className="flex flex-col gap-3">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 flex flex-col gap-4 shadow-sm"
                    >
                        <div className="flex gap-4">
                            <div className="w-[72px] h-[72px] rounded-lg bg-gray-200 dark:bg-zinc-800 shrink-0" />
                            
                            <div className="flex flex-col gap-2 flex-1 pt-1">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="h-4 w-full bg-gray-200 dark:bg-zinc-800 rounded-md" />
                                    <div className="h-4 w-4 bg-gray-200 dark:bg-zinc-800 rounded flex-shrink-0" />
                                </div>
                                <div className="h-3 w-3/4 bg-gray-100 dark:bg-zinc-800/80 rounded-md" />
                                <div className="h-3 w-1/2 bg-gray-100 dark:bg-zinc-800/80 rounded-md" />
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-center mt-1">
                            <div className="flex items-center gap-2">
                                <div className="h-5 w-12 bg-gray-200 dark:bg-zinc-800 rounded-md" />
                                <div className="h-4 w-16 bg-gray-100 dark:bg-zinc-800 rounded-md" />
                            </div>
                            <div className="h-8 w-24 bg-gray-200 dark:bg-zinc-800 rounded-lg" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="h-[76px] mt-2 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm" />
            <div className="h-[64px] rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm" />
            <div className="h-[180px] rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm" />
        </div>
    );
}
