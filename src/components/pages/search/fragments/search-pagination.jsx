"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function SearchPagination({ page, totalPages, handlePageChange }) {
    return (
        <div className="mt-8 flex items-center justify-between border-t border-gray-150/50 pt-4">
            <span className="text-xs font-semibold text-gray-400">
                Page <span className="text-gray-900">{page}</span> of <span className="text-gray-900">{totalPages}</span>
            </span>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    disabled={page === 1}
                    onClick={() => handlePageChange(page - 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                >
                    <ChevronLeft size={16} />
                </button>
                
                {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNum = i + 1;
                    if (pageNum === 1 || pageNum === totalPages || Math.abs(pageNum - page) <= 1) {
                        return (
                            <button
                                key={pageNum}
                                type="button"
                                onClick={() => handlePageChange(pageNum)}
                                className={`h-9 w-9 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    page === pageNum
                                        ? "bg-orange-500 text-white shadow-sm shadow-orange-500/10"
                                        : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 active:scale-95"
                                }`}
                            >
                                {pageNum}
                            </button>
                        );
                    }
                    if (pageNum === 2 || pageNum === totalPages - 1) {
                        return <span key={pageNum} className="text-gray-300 px-1 text-xs">...</span>;
                    }
                    return null;
                })}

                <button
                    type="button"
                    disabled={page === totalPages}
                    onClick={() => handlePageChange(page + 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
}
