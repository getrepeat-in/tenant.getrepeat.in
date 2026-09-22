"use client";
import { cn } from "@/lib/utils";
import Button from "@/components/global/common/Button";
import { ArrowRight, ShieldCheck, CreditCard, Banknote } from "lucide-react";

export function CheckoutFooter({ grandTotal = 0, paymentMethod = "ONLINE", onSelectPaymentMethod, onCheckout, isLoading = false, allowedPaymentMethods = ["ONLINE", "CASH"] }) {
    const isCash = paymentMethod === "CASH";
    const isCashAllowed = allowedPaymentMethods?.includes("CASH") || false;
    const isOnlineAllowed = allowedPaymentMethods?.includes("ONLINE") || false;
    const hasAnyPaymentMethod = isCashAllowed || isOnlineAllowed;
    const showToggle = isCashAllowed && isOnlineAllowed;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-t border-gray-150/70 dark:border-zinc-800 p-3 sm:p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] animate-in slide-in-from-bottom-5 duration-300">
            <div className="mx-auto max-w-screen-md flex items-center justify-between gap-3 sm:gap-4">
                {showToggle && (
                    <div className="inline-flex h-12 items-center rounded-xl bg-neutral-100 dark:bg-zinc-850 p-1 border border-gray-200/80 dark:border-zinc-750 shrink-0 select-none shadow-2xs">
                        <button
                            type="button"
                            onClick={() => onSelectPaymentMethod?.("ONLINE")}
                            className={cn(
                                "flex h-full items-center gap-1.5 px-3 sm:px-4 rounded-lg text-xs sm:text-sm transition-all cursor-pointer",
                                !isCash
                                    ? "bg-white dark:bg-zinc-700 text-neutral-900 dark:text-zinc-100 shadow-xs font-semibold"
                                    : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 font-normal"
                            )}
                        >
                            <CreditCard size={15} className={!isCash ? "text-primary" : "opacity-60"} />
                            <span>Online</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => onSelectPaymentMethod?.("CASH")}
                            className={cn(
                                "flex h-full items-center gap-1.5 px-3 sm:px-4 rounded-lg text-xs sm:text-sm transition-all cursor-pointer",
                                isCash
                                    ? "bg-white dark:bg-zinc-700 text-neutral-900 dark:text-zinc-100 shadow-xs font-semibold"
                                    : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 font-normal"
                            )}
                        >
                            <Banknote size={15} className={isCash ? "text-emerald-600" : "opacity-60"} />
                            <span>Cash</span>
                        </button>
                    </div>
                )}

                {hasAnyPaymentMethod ? (
                    <Button
                        onClick={onCheckout}
                        disabled={grandTotal <= 0}
                        isLoading={isLoading}
                        icon={!isLoading ? <ArrowRight size={17} strokeWidth={2} /> : null}
                        iconPosition="right"
                        className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-sm sm:text-base tracking-normal shadow-md shadow-primary/20 hover:brightness-95 active:scale-[0.98] transition-all"
                    >
                        {isCash ? "Place Order" : `Pay ₹${grandTotal}`}
                    </Button>
                ) : (
                    <div className="flex-1 h-12 rounded-xl bg-neutral-100 dark:bg-zinc-800 text-neutral-400 dark:text-neutral-500 font-semibold text-sm sm:text-base flex items-center justify-center cursor-not-allowed border border-neutral-200 dark:border-zinc-700 shadow-inner">
                        Ordering Unavailable
                    </div>
                )}
            </div>

            <div className="mx-auto max-w-screen-md flex items-center justify-center gap-1.5 mt-1.5 text-[10px] font-normal text-neutral-400 dark:text-neutral-500">
                <ShieldCheck size={12} className="text-emerald-500" />
                <span>100% Safe & Secure Ordering</span>
            </div>
        </div>
    );
}

export default CheckoutFooter;