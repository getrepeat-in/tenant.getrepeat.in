"use client";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useRestaurant } from "@/hooks/useRestaurant";

import { BookOpen, BellRing, Clock, ArrowRight } from "lucide-react";

export const QuickActions = () => {
    const router = useRouter();
    const { restaurant } = useRestaurant();

    const actions = [
        {
            id: "menu",
            title: "Full Menu",
            subtitle: "Browse all items",
            icon: <BookOpen size={22} className="text-zinc-700 dark:text-zinc-300 transition-colors group-hover:text-primary" />,
            actionText: "View Menu",
            onClick: () => router.push("/menu"),
            color: "from-blue-500/5 to-transparent dark:from-blue-500/10"
        },
        {
            id: "waiter",
            title: "Call Waiter",
            subtitle: "Need assistance?",
            icon: <BellRing size={22} className="text-zinc-700 dark:text-zinc-300 transition-colors group-hover:text-primary" />,
            actionText: "Call Now",
            onClick: () => {
                if (restaurant?.phone) {
                    window.location.href = `tel:${restaurant.phone}`;
                }
            },
            color: "from-amber-500/5 to-transparent dark:from-amber-500/10"
        },
        {
            id: "history",
            title: "Order History",
            subtitle: "View past orders",
            icon: <Clock size={22} className="text-zinc-700 dark:text-zinc-300 transition-colors group-hover:text-primary" />,
            actionText: "View History",
            onClick: () => router.push("/orders"),
            color: "from-emerald-500/5 to-transparent dark:from-emerald-500/10"
        },
    ];

    return (
        <div className="w-full px-4 md:px-6 mb-8 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-4">
                Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {actions.map((action, index) => {
                    const isLastOdd = index === actions.length - 1 && actions.length % 2 !== 0;

                    return (
                        <div
                            key={action.id}
                            onClick={action.onClick}
                            className={cn(
                                "group relative flex p-4 rounded-[10px] cursor-pointer transition-all duration-300",
                                "bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800",
                                "shadow-sm hover:shadow-md hover:border-zinc-200 dark:hover:border-zinc-700 overflow-hidden",
                                isLastOdd ? "col-span-2 flex-row items-center justify-between" : "flex-col gap-4"
                            )}
                        >
                            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500", action.color)} />

                            <div className={cn(
                                "flex z-10",
                                isLastOdd ? "items-center gap-4" : "flex-col gap-3"
                            )}>
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-100 dark:border-zinc-700/50 shadow-sm group-hover:scale-105 group-hover:shadow transition-all duration-300">
                                    {action.icon}
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[15px] font-semibold text-zinc-900 dark:text-zinc-100 leading-tight group-hover:text-primary transition-colors">
                                        {action.title}
                                    </span>
                                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                                        {action.subtitle}
                                    </span>
                                </div>
                            </div>

                            {isLastOdd ? (
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-50 dark:bg-zinc-800/80 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 z-10 border border-zinc-100 dark:border-zinc-700/50 group-hover:border-primary">
                                    <ArrowRight size={18} className="transform group-hover:translate-x-0.5 transition-transform" />
                                </div>
                            ) : (
                                <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400 group-hover:text-primary transition-colors z-10">
                                    <span>{action.actionText}</span>
                                    <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
