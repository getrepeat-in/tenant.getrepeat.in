export function HeaderSkeleton({ showMenu = true, showSearch = true, showFilter = true, actions = [] }) {
    return (
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-8 w-full animate-pulse">
            <div className="flex w-full min-w-0 items-center justify-between lg:w-auto lg:max-w-[40%]">
                <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
                    {showMenu && (
                        <div className="h-11 w-11 rounded-xl bg-gray-200 dark:bg-zinc-800 shrink-0 md:hidden"></div>
                    )}
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-md bg-gray-200 dark:bg-zinc-800 shrink-0"></div>
                        <div className="space-y-2">
                            <div className="h-3 w-20 bg-gray-200 dark:bg-zinc-800 rounded"></div>
                            <div className="h-5 w-32 bg-gray-200 dark:bg-zinc-800 rounded"></div>
                        </div>
                    </div>
                </div>
                <div className="flex shrink-0 items-center gap-2 lg:hidden pl-2">
                    {actions.map((_, i) => (
                        <div key={i} className="h-11 w-11 rounded-full bg-gray-200 dark:bg-zinc-800"></div>
                    ))}
                </div>
            </div>

            {showSearch && (
                <div className="flex w-full min-w-0 items-center gap-3 lg:max-w-[500px] xl:max-w-[620px] lg:flex-1">
                    <div className="h-11 w-full rounded-xl bg-gray-200 dark:bg-zinc-800"></div>
                    {showFilter && (
                        <div className="h-11 w-11 rounded-xl bg-gray-200 dark:bg-zinc-800 shrink-0"></div>
                    )}
                </div>
            )}

            <div className="hidden shrink-0 items-center gap-4 lg:flex">
                {actions.map((_, i) => (
                    <div key={i} className="h-11 w-11 rounded-full bg-gray-200 dark:bg-zinc-800"></div>
                ))}
                <div className="flex items-center gap-2">
                    <div className="h-11 w-24 bg-gray-200 rounded-xl dark:bg-zinc-800"></div>
                    <div className="h-11 w-28 bg-orange-200 rounded-xl dark:bg-orange-900/50"></div>
                </div>
            </div>
        </div>
    );
}
