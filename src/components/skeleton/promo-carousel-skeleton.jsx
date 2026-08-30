export function PromoCarouselSkeleton() {
    return (
        <section className="relative w-full px-4 pt-6 pb-2 sm:px-6 animate-pulse">
            <div className="flex w-full gap-4 pb-4 overflow-hidden">
                <div className="relative flex aspect-video w-[90%] shrink-0 rounded-[20px] bg-gray-200 dark:bg-zinc-800 sm:w-[85%] md:w-[80%]" />
                <div className="relative flex aspect-video w-[90%] shrink-0 rounded-[20px] bg-gray-200 dark:bg-zinc-800 sm:w-[85%] md:w-[80%]" />
            </div>
            
            <div className="mt-1 flex items-center justify-center gap-2">
                <div className="h-1.5 w-6 rounded-full bg-gray-200 dark:bg-zinc-800" />
                <div className="h-1.5 w-1.5 rounded-full bg-gray-200 dark:bg-zinc-800" />
                <div className="h-1.5 w-1.5 rounded-full bg-gray-200 dark:bg-zinc-800" />
            </div>
        </section>
    );
}
