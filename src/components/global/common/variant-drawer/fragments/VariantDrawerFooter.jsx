import Button from "@/components/global/common/Button";

export function VariantDrawerFooter({ localQuantity, setLocalQuantity, handleAdd, currentPrice }) {
    return (
        <div className="sticky bottom-0 left-0 right-0 z-30 p-4 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-t border-neutral-100 dark:border-zinc-800 flex items-center gap-3 shadow-lg">
            <div className="flex h-12 w-28 items-center justify-between rounded-xl bg-neutral-100 dark:bg-zinc-900 border border-neutral-200/80 dark:border-zinc-700 px-1">
                <button
                    type="button"
                    onClick={() => setLocalQuantity(Math.max(1, localQuantity - 1))}
                    className="flex h-10 w-8 items-center justify-center text-lg font-bold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200/60 dark:hover:bg-zinc-800 rounded-lg transition-all active:scale-95 select-none"
                >
                    -
                </button>
                <span className="w-6 text-center font-bold text-sm text-neutral-900 dark:text-neutral-100 select-none">
                    {localQuantity}
                </span>
                <button
                    type="button"
                    onClick={() => setLocalQuantity(localQuantity + 1)}
                    className="flex h-10 w-8 items-center justify-center text-lg font-bold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200/60 dark:hover:bg-zinc-800 rounded-lg transition-all active:scale-95 select-none"
                >
                    +
                </button>
            </div>

            <Button
                onClick={handleAdd}
                className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-[15px] shadow-sm hover:brightness-95 active:scale-[0.98] transition-all"
            >
                <span>Add</span>
                <span className="opacity-60">|</span>
                <span>₹{currentPrice * localQuantity}</span>
            </Button>
        </div>
    );
}
