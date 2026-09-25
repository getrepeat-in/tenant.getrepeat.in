"use client";
import Link from "next/link";
import { cn, getImageUrl } from "@/lib/utils";
import Button from "@/components/global/common/Button";
import { useOrderDetailsPage } from "./helpers/useOrderDetailsPage";
import { CheckCircle2, ArrowRight, ArrowLeft, Clock, ReceiptText, ShoppingBag, Share2, Utensils, XCircle, Check, MapPin, Plus } from "lucide-react";

export default function OrderDetailsPage() {
    const {
        restaurant,
        restaurantName,
        order,
        orderNumber,
        isCancelled,
        isCash,
        currentStatus,
        ORDER_STEPS,
        currentStepIndex,
        tableInfo,
        items,
        paymentId,
        totalAmount,
        copied,
        handleShare,
        isCancelling,
        handleCancelOrder,
        canCancel,
        isDelivery,
        router,
        isAddressExpanded,
        setIsAddressExpanded,
        isConnected,
        rejectionReason,
    } = useOrderDetailsPage();

    return (
        <div style={{ fontFamily: "\'Poppins\', sans-serif" }} className="min-h-screen bg-slate-50 dark:bg-zinc-950 pb-14 sm:pb-10 select-none">
            <header className="sticky top-0 z-40 w-full border-b border-gray-100 dark:border-zinc-800 bg-background shadow-sm">
                <div className="mx-auto max-w-screen-md px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                            <button
                                type="button"
                                onClick={() => router.push("/menu")}
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border border-gray-100 dark:border-zinc-800 hover:bg-neutral-50 dark:hover:bg-zinc-800 text-neutral-800 dark:text-neutral-200 transition-all active:scale-95 cursor-pointer"
                                aria-label="Back to menu"
                            >
                                <ArrowLeft size={18} strokeWidth={2.5} />
                            </button>

                            <div className="flex items-center gap-2.5 min-w-0">
                                {restaurant?.logo && (
                                    <div className="size-10 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 p-0.5 shrink-0 shadow-sm border border-gray-100 dark:border-zinc-800">
                                        <div className="size-full rounded-xl overflow-hidden">
                                            <img
                                                src={getImageUrl(restaurant.logo, true, "thumbnail")}
                                                alt={restaurant?.name || "Logo"}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className="flex flex-col min-w-0">
                                    <h1 className="text-sm sm:text-base font-normal text-neutral-900 dark:text-zinc-50 truncate leading-tight tracking-tight">
                                        {restaurant?.name || restaurantName || "Order Status"}
                                    </h1>
                                    <div className="flex items-center gap-1.5 min-w-0">
                                        <span className={cn(
                                            "size-1.5 rounded-full shrink-0",
                                            isCancelled
                                                ? "bg-rose-500"
                                                : isConnected
                                                    ? "bg-emerald-500 animate-pulse"
                                                    : "bg-amber-400"
                                        )} />
                                        <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 truncate">
                                            {isCancelled
                                                ? "Order Cancelled"
                                                : isConnected
                                                    ? "Live Tracking"
                                                    : "Syncing..."}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Link
                            href="/menu"
                            className="flex h-9 items-center gap-1.5 px-3.5 rounded-xl text-[13px] font-normal text-primary bg-primary/10 hover:bg-primary/15 active:scale-95 transition-all cursor-pointer shrink-0"
                        >
                            <Utensils size={14} strokeWidth={2.5} />
                            <span>Menu</span>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="bg-white dark:bg-zinc-950 max-w-screen-md mx-auto px-4 py-10 sm:py-14 sm:px-6 m-2 sm:m-4 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-zinc-800 relative overflow-hidden">
                <div className="flex flex-col items-center text-center relative z-10">
                    <div className="relative mb-8 mt-2">
                        <div className={cn(
                            "absolute -inset-4 rounded-full animate-pulse opacity-10 dark:opacity-20 blur-xl",
                            isCancelled ? "bg-rose-500" : "bg-green-600"
                        )} />
                        <div className={cn(
                            "absolute inset-0 rounded-full animate-ping opacity-20 duration-1000",
                            isCancelled ? "bg-rose-500" : "bg-green-600"
                        )} />

                        <div
                            className={cn(
                                "relative flex size-20 sm:size-24 items-center justify-center rounded-full text-white shadow-xl animate-in zoom-in-95 duration-500 ease-out ring-8 ring-white/80 dark:ring-zinc-950/80 backdrop-blur-sm z-10",
                                isCancelled
                                    ? "bg-gradient-to-br from-rose-400 to-rose-600 shadow-rose-500/30"
                                    : "bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-emerald-500/30"
                            )}
                        >
                            {isCancelled ? (
                                <XCircle size={44} strokeWidth={2.5} />
                            ) : (
                                <CheckCircle2 size={44} strokeWidth={2.5} />
                            )}
                        </div>
                    </div>

                    <span
                        className={cn(
                            "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4 shadow-sm backdrop-blur-md border",
                            isCancelled
                                ? "bg-rose-50/80 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-500/20"
                                : "bg-emerald-50/80 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20"
                        )}
                    >
                        {isCancelled
                            ? "Order Cancelled"
                            : isCash
                                ? "Order Placed (Cash)"
                                : "Payment & Order Confirmed"}
                    </span>

                    <h1 className="text-3xl sm:text-[2.5rem] font-black text-gray-900 dark:text-white tracking-tight leading-none mb-3">
                        {isCancelled
                            ? "Order Cancelled!"
                            : isCash
                                ? (isDelivery ? "Sent for Delivery!" : "Sent to Kitchen!")
                                : "Order Confirmed!"}
                    </h1>

                    <p className="max-w-sm text-[15px] text-gray-500 dark:text-neutral-400 font-medium">
                        {isCancelled
                            ? (rejectionReason ? `Reason: ${rejectionReason}` : "This order has been cancelled.")
                            : `Preparing freshly at ${restaurant?.name || restaurantName || "the restaurant"}.`}
                    </p>

                    {!isCancelled && (
                        <div className="w-full mt-8 rounded-xl bg-white dark:bg-zinc-900 p-3 sm:p-4 shadow-sm border border-gray-100 dark:border-zinc-800 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                            <div className="flex items-center justify-between pb-4 border-b border-gray-100/60 dark:border-zinc-800/60 mb-6 sm:mb-8 relative z-10 gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="relative flex h-2.5 w-2.5">
                                        <span className={cn(
                                            "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                                            isConnected ? "bg-emerald-400" : "bg-amber-400"
                                        )}></span>
                                        <span className={cn(
                                            "relative inline-flex rounded-full h-2.5 w-2.5",
                                            isConnected ? "bg-emerald-500" : "bg-amber-500"
                                        )}></span>
                                    </span>
                                    <span className="text-xs font-normal uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                                        Live Order Status
                                    </span>
                                    <span className={cn(
                                        "text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-colors",
                                        isConnected
                                            ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/60"
                                            : "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/60"
                                    )}>
                                        {isConnected ? "● Live Updates" : "Syncing..."}
                                    </span>
                                </div>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-normal bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/15 shrink-0">
                                    <Clock size={12} strokeWidth={2.5} />
                                    <span>{currentStatus}</span>
                                </span>
                            </div>

                            <div className="relative overflow-x-auto pb-2 -mx-1 px-1 hide-scrollbar">
                                <div
                                    className="relative"
                                    style={{ minWidth: `${ORDER_STEPS.length * 25}%` }}
                                >
                                    <div
                                        className="absolute top-6 h-1 bg-neutral-200/60 dark:bg-zinc-800 rounded-full z-0 overflow-hidden"
                                        style={{
                                            left: `${100 / ORDER_STEPS.length / 2}%`,
                                            right: `${100 / ORDER_STEPS.length / 2}%`,
                                        }}
                                    >
                                        <div
                                            className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
                                            style={{
                                                width: `${(Math.min(Math.max(currentStepIndex, 0), ORDER_STEPS.length - 1) / (ORDER_STEPS.length - 1)) * 100}%`,
                                            }}
                                        />
                                    </div>

                                    <div
                                        className="relative z-10 grid"
                                        style={{ gridTemplateColumns: `repeat(${ORDER_STEPS.length}, 1fr)` }}
                                    >
                                        {ORDER_STEPS.map((step, idx) => {
                                            const StepIcon = step.icon;
                                            const isDone = idx < currentStepIndex;
                                            const isCurrent = idx === currentStepIndex;

                                            return (
                                                <div
                                                    key={step.key}
                                                    className="flex flex-col items-center text-center group py-1"
                                                >
                                                    <div
                                                        className={cn(
                                                            "size-12 rounded-full flex items-center justify-center transition-all duration-500 ring-4",
                                                            isDone
                                                                ? "bg-emerald-500 text-white ring-white dark:ring-zinc-900 shadow-sm"
                                                                : isCurrent
                                                                    ? "bg-primary text-primary-foreground ring-primary/20 scale-110 shadow-[0_0_18px_rgba(var(--primary),0.35)]"
                                                                    : "bg-white dark:bg-zinc-800 text-neutral-400 dark:text-zinc-500 ring-transparent border border-gray-200 dark:border-zinc-700"
                                                        )}
                                                    >
                                                        {isDone ? (
                                                            <Check size={18} strokeWidth={2.5} />
                                                        ) : (
                                                            <StepIcon
                                                                size={16}
                                                                strokeWidth={isCurrent ? 2.5 : 2}
                                                                className={cn(
                                                                    "transition-transform duration-300",
                                                                    isCurrent && "animate-pulse"
                                                                )}
                                                            />
                                                        )}
                                                    </div>

                                                    <span
                                                        className={cn(
                                                            "mt-2 text-[11px] leading-tight transition-colors whitespace-nowrap",
                                                            isCurrent
                                                                ? "font-semibold text-primary"
                                                                : isDone
                                                                    ? "font-normal text-neutral-600 dark:text-zinc-300"
                                                                    : "font-normal text-neutral-400 dark:text-zinc-500"
                                                        )}
                                                    >
                                                        {step.label}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="w-full mt-4 rounded-xl bg-white dark:bg-zinc-900 p-5 sm:p-6 shadow-sm border border-gray-100 dark:border-zinc-800 text-left flex flex-col gap-0 relative overflow-hidden">
                        <div className="flex items-center justify-between py-3">
                            <div className="flex items-center gap-2">
                                <ReceiptText size={14} className="text-neutral-400" />
                                <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                                    Order Number
                                </span>
                            </div>
                            <span className="text-sm font-bold text-neutral-900 dark:text-zinc-100 font-mono">
                                #{orderNumber}
                            </span>
                        </div>
                        <div className="h-px bg-gray-100 dark:bg-zinc-800" />

                        {isDelivery && order.deliveryAddress && (() => {
                            const addressStr = typeof order.deliveryAddress === "object"
                                ? order.deliveryAddress.fullAddress || order.deliveryAddress.street || JSON.stringify(order.deliveryAddress)
                                : order.deliveryAddress;
                            const isLong = addressStr?.length > 40;

                            return (
                                <>
                                    <div className="flex items-start justify-between text-xs py-3">
                                        <div className="flex items-center gap-2 text-neutral-400 dark:text-neutral-500 shrink-0">
                                            <MapPin size={14} />
                                            <span className="text-[11px] font-medium uppercase tracking-wider">Delivery Address</span>
                                        </div>
                                        <div className="flex flex-col items-end max-w-[58%]">
                                            <span
                                                className={cn(
                                                    "font-medium text-neutral-900 dark:text-zinc-100 text-right leading-relaxed",
                                                    !isAddressExpanded && "line-clamp-2"
                                                )}
                                            >
                                                {addressStr}
                                            </span>
                                            {isLong && (
                                                <button
                                                    onClick={() => setIsAddressExpanded(!isAddressExpanded)}
                                                    className="text-[10px] font-semibold text-primary mt-1 hover:underline active:scale-95 transition-all"
                                                >
                                                    {isAddressExpanded ? "View Less ↑" : "View More ↓"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="h-px bg-gray-100 dark:bg-zinc-800" />
                                </>
                            );
                        })()}

                        {!isDelivery && tableInfo && (
                            <>
                                <div className="flex items-center justify-between text-xs py-3">
                                    <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                                        Dine-in Table
                                    </span>
                                    <span className="font-bold text-neutral-900 dark:text-zinc-100 text-sm">
                                        {typeof tableInfo === "object"
                                            ? tableInfo.label || `Table ${tableInfo.tableNumber || 1}`
                                            : `Table ${tableInfo}`}
                                    </span>
                                </div>
                                <div className="h-px bg-gray-100 dark:bg-zinc-800" />
                            </>
                        )}

                        {items.length > 0 && (
                            <>
                                <div className="flex flex-col gap-2.5 py-3">
                                    <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                                        Ordered Items ({items.length})
                                    </span>
                                    <div className="space-y-2">
                                        {items.map((item, idx) => (
                                            <div
                                                key={item._id || idx}
                                                className="flex flex-col gap-1 text-xs pb-1"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-start gap-2 min-w-0">
                                                        <span className="inline-flex items-center justify-center size-5 rounded-md bg-primary/10 text-primary text-[10px] font-bold shrink-0 mt-0.5">
                                                            {item.quantity}
                                                        </span>
                                                        <div className="flex flex-col min-w-0">
                                                            <span className="text-neutral-700 dark:text-zinc-300 font-medium truncate">
                                                                {item.name}
                                                            </span>

                                                            {(item.variant || (item.addons && item.addons.length > 0)) && (
                                                                <div className="flex flex-wrap gap-1 mt-1">
                                                                    {item.variant && (
                                                                        <span className="inline-flex text-[10px] bg-neutral-100 dark:bg-zinc-800 text-neutral-600 dark:text-neutral-400 px-1.5 py-0.5 rounded-sm">
                                                                            {item.variant.name}
                                                                        </span>
                                                                    )}
                                                                    {item.addons?.map((addon, aIdx) => (
                                                                        <span key={aIdx} className="inline-flex items-center gap-0.5 text-[10px] bg-neutral-100 dark:bg-zinc-800 text-neutral-600 dark:text-neutral-400 px-1.5 py-0.5 rounded-sm">
                                                                            <Plus size={10} className="text-neutral-400 shrink-0" />
                                                                            {addon.name}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}

                                                            {item.specialInstructions && (
                                                                <span className="text-[10px] italic text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">
                                                                    Note: {item.specialInstructions}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <span className="font-bold text-neutral-900 dark:text-zinc-100 shrink-0 ml-2 mt-0.5">
                                                        ₹{item.totalPrice || item.unitPrice * item.quantity}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="h-px bg-gray-100 dark:bg-zinc-800" />
                            </>
                        )}
                        <div className="flex items-center justify-between text-xs py-3">
                            <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                                Payment
                            </span>
                            <span className={cn(
                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold",
                                isCash
                                    ? "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400"
                                    : "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400"
                            )}>
                                {isCash ? "💵 Cash" : "💳 Online"}
                            </span>
                        </div>

                        {paymentId && (
                            <>
                                <div className="h-px bg-gray-100 dark:bg-zinc-800" />
                                <div className="flex items-center justify-between text-xs py-3">
                                    <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                                        Payment ID
                                    </span>
                                    <span className="font-mono text-xs text-neutral-600 dark:text-neutral-300 truncate max-w-[55%] text-right">
                                        {paymentId}
                                    </span>
                                </div>
                            </>
                        )}

                        {totalAmount > 0 && (
                            <div className="flex items-center justify-between pt-3 mt-1 border-t border-gray-100 dark:border-zinc-800">
                                <span className="text-sm font-medium text-neutral-600 dark:text-zinc-400">
                                    {isCash ? "Total Due" : "Total Paid"}
                                </span>
                                <span className="text-xl font-bold text-primary">
                                    ₹{totalAmount}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex flex-col gap-3 w-full">
                        <Link
                            href="/menu"
                            className="flex h-12.5 w-full items-center justify-center gap-2.5 rounded-2xl bg-primary text-primary-foreground font-normal text-sm shadow-md shadow-primary/25 hover:brightness-95 active:scale-[0.98] transition-all cursor-pointer"
                        >
                            <ShoppingBag size={18} strokeWidth={2} />
                            <span>Order More Items</span>
                            <ArrowRight size={16} strokeWidth={2.2} />
                        </Link>

                        <div
                            className={cn(
                                "grid gap-3 w-full",
                                canCancel && !isCancelled ? "grid-cols-2" : "grid-cols-1"
                            )}
                        >
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleShare}
                                className="h-11.5 w-full px-3 rounded-2xl bg-neutral-100 hover:bg-neutral-200/80 dark:bg-zinc-850 dark:hover:bg-zinc-800 text-neutral-750 dark:text-neutral-200 font-normal text-xs sm:text-sm shadow-none cursor-pointer gap-2 transition-all active:scale-[0.98]"
                            >
                                {copied ? (
                                    <Check size={16} strokeWidth={2.5} className="text-emerald-600" />
                                ) : (
                                    <Share2 size={16} strokeWidth={2} />
                                )}
                                <span>{copied ? "Link Copied!" : "Share Order"}</span>
                            </Button>

                            {canCancel && !isCancelled && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancelOrder}
                                    disabled={isCancelling}
                                    isLoading={isCancelling}
                                    className="h-11.5 w-full px-3 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 hover:bg-rose-100/80 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs sm:text-sm font-normal cursor-pointer gap-2 active:scale-[0.98] transition-all"
                                >
                                    <XCircle size={16} strokeWidth={2.2} />
                                    <span>Cancel Order</span>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
