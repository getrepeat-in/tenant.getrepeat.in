"use client";

export function ItemCardSkeleton() {
    return (
        <article className="relative flex w-full flex-col overflow-hidden rounded-[16px] bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm animate-pulse">
            <div className="relative aspect-[4/3] w-full bg-neutral-100 dark:bg-zinc-800/80" />

            <div className="flex flex-col p-3 pt-3.5">
                <div className="flex items-start justify-between gap-2">
                    <div className="h-[18px] w-3/4 bg-neutral-200/80 dark:bg-zinc-800 rounded-md" />
                    <div className="shrink-0 mt-[2px] bg-white dark:bg-zinc-900 rounded-sm p-[1px]">
                        <div className="h-4 w-4 bg-neutral-200/80 dark:bg-zinc-800 rounded-[3px]" />
                    </div>
                </div>

                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    <div className="h-[18px] w-14 bg-neutral-200/80 dark:bg-zinc-800 rounded-md" />
                </div>

                <div className="mt-3.5 flex flex-col">
                    <div className="flex h-[36px] w-[110px] rounded-xl border-[1.5px] border-neutral-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 shadow-sm" />
                    <div className="mt-1.5 w-[110px] flex justify-center">
                        <div className="h-2 w-16 bg-neutral-200/80 dark:bg-zinc-800 rounded-sm" />
                    </div>
                </div>
            </div>
        </article>
    );
}

export function MenuSkeleton() {
    return (
        <div className="w-full select-none">
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

            <div className="mx-auto max-w-screen-md mt-4 space-y-4">
                <div className="bg-white dark:bg-zinc-900 sm:rounded-2xl sm:border sm:border-gray-100 dark:sm:border-zinc-800 overflow-hidden shadow-xs">
                    <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/70 dark:bg-zinc-900/50 animate-pulse">
                        <div className="h-5 w-28 bg-neutral-200/80 dark:bg-zinc-800 rounded-md" />
                        <div className="h-5 w-8 bg-neutral-200/80 dark:bg-zinc-800 rounded-full" />
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 bg-white dark:bg-zinc-900">
                        <ItemCardSkeleton />
                        <ItemCardSkeleton />
                        <ItemCardSkeleton />
                        <ItemCardSkeleton />
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 sm:rounded-2xl sm:border sm:border-gray-100 dark:sm:border-zinc-800 overflow-hidden shadow-xs">
                    <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/70 dark:bg-zinc-900/50 animate-pulse">
                        <div className="h-5 w-36 bg-neutral-200/80 dark:bg-zinc-800 rounded-md" />
                        <div className="h-5 w-8 bg-neutral-200/80 dark:bg-zinc-800 rounded-full" />
                    </div>

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
