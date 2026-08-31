"use client";
import { useEffect } from "react";
import Footer from "@/components/global/footer";
import { ArrowLeft, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { MenuService } from "@/services/frontend/menu";
import { useRestaurant } from "@/hooks/useRestaurant";
import { useRouter, useSearchParams } from "next/navigation";
import CartBar from "@/components/pages/home/fragments/cart-bar";
import { MenuEmptyState } from "@/components/pages/home/fragments/empty-state";
import CategoryScrollbar from "@/components/pages/home/fragments/category-scollbar";
import { MenuLayout } from "@/components/pages/home/fragments/menu-layout/fragments";

export default function MenuPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { slug, name: restaurantName } = useRestaurant();
    const urlCategory = searchParams.get("category") || "";

    const { data: categories = [], isPending: isCategoriesPending } = useQuery({
        queryKey: ["categories", slug],
        queryFn: async () => {
            const response = await MenuService.category.getAll(slug);
            return response?.data || response || [];
        },
        enabled: !!slug,
        retry: false,
    });

    const isEmptyMenu = !isCategoriesPending && categories.length === 0;

    useEffect(() => {
        if (urlCategory) {
            const scrollToCategory = () => {
                const element = document.getElementById(`category-${urlCategory}`);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                    return true;
                }
                return false;
            };

            if (!scrollToCategory()) {
                const interval = setInterval(() => {
                    if (scrollToCategory()) {
                        clearInterval(interval);
                    }
                }, 100);
                const timeout = setTimeout(() => {
                    clearInterval(interval);
                }, 2000);
                return () => {
                    clearInterval(interval);
                    clearTimeout(timeout);
                };
            }
        }
    }, [urlCategory]);

    if (isEmptyMenu) {
        return <MenuEmptyState />;
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            <header className="sticky top-0 z-40 w-full border-b border-gray-150/40 bg-white/80 backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.02)] px-4 py-3">
                <div className="mx-auto max-w-screen-md flex items-center justify-between gap-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-neutral-50/60 text-neutral-700 border border-gray-150/40 hover:bg-neutral-100/50 active:scale-95 transition-all cursor-pointer"
                    >
                        <ArrowLeft size={18} />
                    </button>

                    <div className="flex flex-col items-center text-center min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
                            Menu
                        </span>
                        <h1 className="text-sm font-bold text-gray-900 truncate max-w-[200px]">
                            {restaurantName}
                        </h1>
                    </div>

                    <button
                        type="button"
                        onClick={() => router.push("/search")}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-neutral-50/60 text-neutral-700 border border-gray-150/40 hover:bg-neutral-100/50 active:scale-95 transition-all cursor-pointer"
                    >
                        <Search size={18} />
                    </button>
                </div>
            </header>

            <div className="bg-white border-b border-gray-150/30 sticky top-[69px] z-30">
                <div className="mx-auto max-w-screen-md">
                    <CategoryScrollbar hideTitle={true} />
                </div>
            </div>

            <main className="mx-auto max-w-screen-md px-4">
                <MenuLayout.V2 />
            </main>
            <CartBar />
            <Footer />
        </div>
    );
}

