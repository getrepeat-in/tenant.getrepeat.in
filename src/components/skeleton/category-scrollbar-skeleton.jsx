export function CategoryScrollbarSkeleton() {
    return (
        <section className="w-full pt-6 animate-pulse">
            <div className="mb-5 flex items-center justify-between px-4 sm:px-6">
                <div className="h-7 w-48 rounded-lg bg-gray-200 dark:bg-zinc-800" />
            </div>

            <div className="flex gap-4 overflow-hidden px-4 pb-3 sm:gap-5 sm:px-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex w-[84px] shrink-0 flex-col items-center gap-2.5 sm:w-[96px]">
                        <div className="aspect-square w-full rounded-2xl bg-gray-200 dark:bg-zinc-800 border-[2.5px] border-white dark:border-zinc-950 shadow-sm" />
                        <div className="h-3.5 w-16 rounded-md bg-gray-200 dark:bg-zinc-800" />
                    </div>
                ))}
            </div>
        </section>
    );
}
