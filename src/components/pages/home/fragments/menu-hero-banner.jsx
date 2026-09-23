"use client";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ArrowRight, UtensilsCrossed } from "lucide-react";

export const MenuHeroBanner = () => {
    const router = useRouter();

    return (
        <section className="px-4 md:px-6">
            <div
                onClick={() => router.push('/menu')}
                className={cn(
                    "relative overflow-hidden w-full rounded-[12px] p-6 sm:p-8 cursor-pointer transition-all duration-500",
                    "bg-gradient-to-br from-primary/95 to-primary text-primary-foreground",
                    "shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1.5 group"
                )}
            >
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex flex-col gap-2">
                        <p className="text-primary-foreground/80 font-medium max-w-sm mt-1 text-[15px]">
                            Discover delicious dishes, beverages, and special treats curated just for you.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center h-14 px-6 rounded-2xl bg-white text-primary font-bold shadow-md transition-all duration-300 group-hover:bg-gray-50 group-hover:scale-105 active:scale-95">
                            View Menu
                            <ArrowRight size={20} className="ml-2 transform group-hover:translate-x-1.5 transition-transform" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
