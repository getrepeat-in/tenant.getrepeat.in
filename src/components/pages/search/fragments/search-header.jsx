"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search } from "lucide-react";

export function SearchHeader({ searchVal, setSearchVal, isVeg, handleFilterToggle, handleSearchSubmit }) {
    const router = useRouter();

    return (
        <header className="sticky top-0 z-40 w-full border-b border-gray-150/40 bg-white/80 backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.02)] px-4 py-3">
            <div className="mx-auto max-w-screen-md flex items-center gap-3">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-neutral-50/60 text-neutral-700 border border-gray-150/40 hover:bg-neutral-100/50 active:scale-95 transition-all cursor-pointer"
                >
                    <ArrowLeft size={18} />
                </button>

                <form onSubmit={handleSearchSubmit} className="flex h-11 min-w-0 flex-1 items-center rounded-xl bg-neutral-50/60 px-3.5 border border-gray-150/40 focus-within:bg-white focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/10 transition-all duration-200">
                    <Search size={18} className="mr-3 shrink-0 text-neutral-500" />
                    <input
                        type="search"
                        value={searchVal}
                        onChange={(e) => setSearchVal(e.target.value)}
                        placeholder="Search delicious meals, burgers, pizza..."
                        className="min-w-0 flex-1 bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400 p-0 border-0 focus:ring-0"
                    />
                </form>

                <button
                    type="button"
                    onClick={handleFilterToggle}
                    className="flex h-11 shrink-0 items-center justify-between gap-3.5 rounded-xl border border-gray-150/40 bg-neutral-50/60 pl-4 pr-3 transition-all active:scale-95 cursor-pointer"
                >
                    <div className={`relative w-8.5 h-5 rounded-full transition-colors duration-250 ease-in-out ${
                        isVeg ? "bg-emerald-500" : "bg-neutral-200"
                    }`}>
                        <div className={`absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow-xs transition-transform duration-250 ease-in-out ${
                            isVeg ? "translate-x-3.5" : "translate-x-0"
                        }`} />
                    </div>
                </button>
            </div>
        </header>
    );
}
