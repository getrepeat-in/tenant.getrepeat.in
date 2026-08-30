import { Search, ArrowRight } from "lucide-react";

export function SearchBar({
    placeholder = "Search...",
    value = "",
    onChange,
    onSubmit,
    onFocus,
}) {
    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit?.(value);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex h-11 min-w-0 flex-1 items-center rounded-xl bg-neutral-50/60 px-3.5 border border-gray-150/40 focus-within:bg-white focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/10 transition-all duration-200"
        >
            <Search
                size={18}
                strokeWidth={2}
                className="mr-3 shrink-0 text-neutral-500"
                aria-hidden="true"
            />

            <input
                type="search"
                value={value}
                onChange={(event) => onChange?.(event.target.value)}
                onFocus={onFocus}
                placeholder={placeholder}
                aria-label={placeholder}
                className="min-w-0 flex-1 bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400 p-0 border-0 focus:ring-0"
            />

            {value && (
                <button
                    type="submit"
                    aria-label="Submit search"
                    className="ml-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-600 text-white transition hover:bg-orange-700 active:scale-95 cursor-pointer"
                >
                    <ArrowRight size={13} />
                </button>
            )}
        </form>
    );
}