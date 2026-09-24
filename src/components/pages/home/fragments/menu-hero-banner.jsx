"use client";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ArrowRight, UtensilsCrossed } from "lucide-react";

export const MenuHeroBanner = () => {
    const router = useRouter();

    return (
        <section className="w-full px-4 md:px-6 my-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div
                onClick={() => router.push('/menu')}
                className={cn(
                    "relative overflow-hidden w-full rounded-[14px] p-5 sm:p-7 cursor-pointer transition-all duration-300",
                    "bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground",
                    "shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 group"
                )}
            >
                <div className="absolute -right-6 -bottom-10 size-36 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                <div className="absolute left-1/3 -top-10 size-28 rounded-full bg-black/10 blur-xl pointer-events-none" />

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                            <div className="flex size-8 sm:size-9 items-center justify-center rounded-lg bg-white/20 backdrop-blur-xs text-white shadow-xs">
                                <UtensilsCrossed size={18} />
                            </div>
                            <h3 className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight">
                                Explore Full Menu
                            </h3>
                        </div>
                        <p className="text-primary-foreground/85 font-medium max-w-md text-xs sm:text-sm pl-0.5">
                            Discover delicious dishes, beverages, and special treats curated just for you.
                        </p>
                    </div>

                    <div className="flex items-center">
                        <div className="flex items-center justify-center h-11 sm:h-12 px-5 sm:px-6 rounded-xl bg-white text-primary text-sm sm:text-base font-bold shadow-md transition-all duration-200 group-hover:bg-gray-50 group-hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto">
                            <span>View All Menu</span>
                            <ArrowRight size={18} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

