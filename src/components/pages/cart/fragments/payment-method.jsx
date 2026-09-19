"use client";
import React from "react";
import { CreditCard, Banknote, ShieldCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function PaymentMethodSelector({
    selectedMethod = "ONLINE",
    onSelectMethod,
}) {
    const methods = [
        {
            id: "ONLINE",
            title: "Online Payment",
            subtitle: "UPI, Cards, NetBanking (Instant)",
            icon: CreditCard,
            badge: "Fast & Recommended",
        },
        {
            id: "CASH",
            title: "Cash on Delivery",
            subtitle: "Pay cash at the counter or to staff",
            icon: Banknote,
            badge: "Pay Later",
        },
    ];

    return (
        <div className="rounded-2xl bg-white dark:bg-zinc-900 p-4 border border-gray-150/80 dark:border-zinc-800 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                    <Zap size={16} className="text-primary" />
                    <h3 className="text-xs sm:text-sm font-semibold tracking-tight text-neutral-800 dark:text-zinc-100">
                        Payment Method
                    </h3>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-normal text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck size={13} />
                    <span>Secure</span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3">
                {methods.map((method) => {
                    const isSelected = selectedMethod === method.id;
                    const Icon = method.icon;

                    return (
                        <div
                            key={method.id}
                            onClick={() => onSelectMethod(method.id)}
                            className={cn(
                                "flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none",
                                isSelected
                                    ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-2xs"
                                    : "border-gray-200/80 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 bg-neutral-50/50 dark:bg-zinc-850/50"
                            )}
                        >
                            <div
                                className={cn(
                                    "flex size-9 items-center justify-center rounded-lg shrink-0 transition-colors",
                                    isSelected
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-neutral-100 dark:bg-zinc-800 text-neutral-600 dark:text-neutral-300"
                                )}
                            >
                                <Icon size={18} />
                            </div>

                            <div className="flex flex-col min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-1">
                                    <span className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-zinc-100">
                                        {method.title}
                                    </span>
                                    {method.badge && (
                                        <span
                                            className={cn(
                                                "text-[9px] font-medium px-1.5 py-0.2 rounded shrink-0",
                                                isSelected
                                                    ? "bg-primary/15 text-primary"
                                                    : "bg-neutral-100 dark:bg-zinc-800 text-neutral-500"
                                            )}
                                        >
                                            {method.badge}
                                        </span>
                                    )}
                                </div>
                                <span className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-tight line-clamp-1 font-normal">
                                    {method.subtitle}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default PaymentMethodSelector;
