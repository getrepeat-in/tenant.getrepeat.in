"use client";
import { useDispatch } from "react-redux";
import Footer from "@/components/global/footer";
import { useState, useEffect, useRef } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { useRestaurant } from "@/hooks/useRestaurant";
import { useInfiniteQuery } from "@tanstack/react-query";
import { SearchHeader } from "./fragments/search-header";
import { setAddonGroups } from "@/store/slices/menuSlice";
import { SearchResults } from "./fragments/search-results";
import { useRouter, useSearchParams } from "next/navigation";
import { MenuService } from "@/services/frontend/menu.service";
import { SearchEmptyState } from "./fragments/search-empty-state";

export default function SearchPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { name: restaurantName, slug: restaurantSlug } = useRestaurant();
    const dispatch = useDispatch();

    const urlQuery = searchParams.get("q") || "";
    const urlIsVeg = searchParams.get("is_veg") === "true";

    const [searchVal, setSearchVal] = useState(urlQuery);
    const [isVeg, setIsVeg] = useState(urlIsVeg);
    const loaderRef = useRef(null);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error
    } = useInfiniteQuery({
        queryKey: ["menuSearch", restaurantSlug, urlQuery, urlIsVeg],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await MenuService.search({
                query: urlQuery,
                isVeg: urlIsVeg ? "true" : "",
                page: pageParam,
                limit: 10
            }, restaurantSlug);
            const resData = response.data || response;
            if (resData.addonGroups?.length > 0) {
                dispatch(setAddonGroups(resData.addonGroups));
            }
            return {
                items: resData.items || [],
                total: resData.total || 0,
                pageParam
            };
        },
        getNextPageParam: (lastPage, allPages) => {
            const limit = 10;
            const totalPages = Math.ceil(lastPage.total / limit);
            const nextPage = allPages.length + 1;
            return nextPage <= totalPages ? nextPage : undefined;
        },
        initialPageParam: 1,
    });

    useEffect(() => {
        if (!loaderRef.current) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1 }
        );
        observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        updateQueryParams(searchVal, isVeg);
    };

    const updateQueryParams = (q, veg) => {
        const params = new URLSearchParams();
        if (q) params.set("q", q);
        if (veg) params.set("is_veg", "true");
        router.replace(`/search?${params.toString()}`);
    };

    const handleFilterToggle = () => {
        const nextVeg = !isVeg;
        setIsVeg(nextVeg);
        updateQueryParams(searchVal, nextVeg);
    };

    useEffect(() => {
        setSearchVal(urlQuery);
        setIsVeg(urlIsVeg);
    }, [urlQuery, urlIsVeg]);

    const results = data?.pages?.flatMap((page) => page.items) || [];

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            <SearchHeader
                searchVal={searchVal}
                setSearchVal={setSearchVal}
                isVeg={isVeg}
                handleFilterToggle={handleFilterToggle}
                handleSearchSubmit={handleSearchSubmit}
            />

            <main className="mx-auto px-4 lg:px-[100px] pt-6">
                {isError && (
                    <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-650">
                        <AlertCircle className="size-5 shrink-0" />
                        <span className="font-medium">{error?.message || "Something went wrong while fetching items."}</span>
                    </div>
                )}

                {isLoading ? (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex gap-4 rounded-2xl border border-gray-150/50 bg-white p-4 animate-pulse">
                                <div className="size-24 rounded-xl bg-gray-200 shrink-0" />
                                <div className="flex-1 space-y-3 py-1">
                                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                                    <div className="flex justify-between items-center pt-2">
                                        <div className="h-5 bg-gray-200 rounded w-1/4" />
                                        <div className="h-8 bg-gray-200 rounded-lg w-[70px]" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : results.length > 0 ? (
                    <>
                        <SearchResults results={results} />
                        <div ref={loaderRef} className="h-10 flex items-center justify-center mt-4">
                            {isFetchingNextPage && (
                                <Loader2 className="size-6 animate-spin text-orange-500" />
                            )}
                        </div>
                        <Footer />
                    </>
                ) : (
                    <SearchEmptyState />
                )}
            </main>
        </div>
    );
}