"use client";
import { Search, X } from "lucide-react";
import DiaterySymbol from "@/components/global/diatery-symbol";

export function MenuHeader({
    searchVal = "",
    setSearchVal = () => {},
    isVeg = false,
    handleFilterToggle = () => {},
    handleSearchSubmit = () => {},
}) {
    return (
        <header className="sticky top-0 z-40 w-full border-b border-gray-150/40 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.02)] px-4 py-2.5 sm:py-3">
            <div className="mx-auto max-w-screen-md flex items-center gap-2.5 sm:gap-3">
                <form
                    onSubmit={handleSearchSubmit}
                    className="flex h-10 sm:h-11 min-w-0 flex-1 items-center rounded-xl bg-neutral-100/70 dark:bg-zinc-900 px-3.5 border border-gray-150/40 dark:border-zinc-800 focus-within:bg-white dark:focus-within:bg-zinc-900 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all duration-200"
                >
                    <Search
                        size={18}
                        className="mr-2.5 shrink-0 text-neutral-400"
                    />
                    <input
                        type="text"
                        inputMode="search"
                        value={searchVal}
                        onChange={(e) => setSearchVal(e.target.value)}
                        placeholder="Search delicious meals, burgers, pizza..."
                        className="min-w-0 flex-1 bg-transparent text-sm text-neutral-900 dark:text-neutral-100 outline-none placeholder:text-neutral-400 p-0 border-0 focus:ring-0 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-cancel-button]:appearance-none"
                    />
                    {searchVal && (
                        <button
                            type="button"
                            onClick={() => setSearchVal("")}
                            className="ml-1.5 flex size-6 shrink-0 items-center justify-center rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                            aria-label="Clear search"
                        >
                            <X size={14} strokeWidth={2.5} />
                        </button>
                    )}
                </form>

                <button
                    type="button"
                    onClick={handleFilterToggle}
                    className={`flex h-10 sm:h-11 shrink-0 items-center gap-2 rounded-xl border px-3 transition-all active:scale-95 cursor-pointer select-none ${
                        isVeg
                            ? "border-emerald-300 bg-emerald-50/80 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300"
                            : "border-gray-150/40 dark:border-zinc-800 bg-neutral-100/70 dark:bg-zinc-900 text-neutral-700 dark:text-neutral-300"
                    }`}
                >
                    <DiaterySymbol type="VEG" size={13} />
                    <span className="text-xs font-bold">Veg</span>
                    <div
                        className={`relative w-7 h-4 rounded-full transition-colors duration-200 ${
                            isVeg
                                ? "bg-emerald-500"
                                : "bg-neutral-300 dark:bg-zinc-700"
                        }`}
                    >
                        <div
                            className={`absolute top-0.5 left-0.5 size-3 rounded-full bg-white shadow-xs transition-transform duration-200 ${
                                isVeg ? "translate-x-3" : "translate-x-0"
                            }`}
                        />
                    </div>
                </button>
            </div>
        </header>
    );
}
