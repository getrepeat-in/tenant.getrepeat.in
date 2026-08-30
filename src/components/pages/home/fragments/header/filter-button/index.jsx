import { SlidersHorizontal } from "lucide-react";

export function FilterButton({
    onClick,
    icon,
}) {
    return (
        <button
            type="button"
            aria-label="Open filters"
            onClick={onClick}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-neutral-50/60 text-neutral-700 border border-gray-150/40 transition hover:bg-neutral-100/50 active:scale-95 cursor-pointer"
        >
            {icon ?? (
                <SlidersHorizontal
                    size={18}
                    strokeWidth={2}
                    aria-hidden="true"
                />
            )}
        </button>
    );
}