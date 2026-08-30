import { Suspense } from "react";
import SearchPage from "@/components/pages/search";

export default function Page() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 rounded-full border-4 border-orange-200 border-t-orange-500 animate-spin" />
                    <span className="text-xs font-bold text-gray-400">Loading...</span>
                </div>
            </div>
        }>
            <SearchPage />
        </Suspense>
    );
}
