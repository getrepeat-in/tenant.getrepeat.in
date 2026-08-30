"use client";
import { useRouter } from "next/navigation";
import { Home } from "lucide-react";

export function SearchEmptyState() {
    const router = useRouter();

    return (
        <div className="flex flex-col min-h-[90vh] items-center justify-center text-center py-16 px-4 bg-transparent md:bg-white rounded-none md:rounded-2xl border-0 md:border border-gray-150/40 shadow-none md:shadow-xs mt-4">
            <img
                src="/assets/images/no-results.png"
                alt="No results found"
                className="object-contain mb-6"
            />
            <button
                type="button"
                onClick={() => router.push("/")}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-orange-600/15 transition-all duration-200 active:scale-95 cursor-pointer"
            >
                <Home size={14} />
                Go Back Home
            </button>
        </div>
    );
}
