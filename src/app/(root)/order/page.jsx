"use client";
import Link from "next/link";
import { cn, getImageUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import React, { Suspense, useState } from "react";
import { useRestaurant } from "@/hooks/useRestaurant";
import useNotification from "@/hooks/useNotification";
import { OrderService } from "@/services/frontend/order";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight, ArrowLeft, Clock, ReceiptText, ChefHat, ShoppingBag, Share2, Loader2, Utensils, XCircle, Check, CheckCheck, BellRing } from "lucide-react";

const KITCHEN_STEPS = [
    { key: "PLACED", label: "Placed", desc: "Sent to kitchen", icon: ReceiptText },
    { key: "ACCEPTED", label: "Accepted", desc: "Confirmed", icon: CheckCheck },
    { key: "PREPARING", label: "Preparing", desc: "Cooking freshly", icon: ChefHat },
    { key: "READY", label: "Ready", desc: "Ready for pickup", icon: BellRing },
];

const DELIVERY_STEPS = [
    { key: "PENDING", label: "Pending", desc: "Assigning rider", icon: Clock },
    { key: "READY", label: "Ready", desc: "Waiting for pickup", icon: ShoppingBag },
    { key: "IN_TRANSIT", label: "In Transit", desc: "Out for delivery", icon: CheckCheck },
    { key: "FULFILLED", label: "Delivered", desc: "Order delivered", icon: CheckCircle2 },
];

function getKitchenStepIndex(status = "PLACED") {
    const s = (status || "").toUpperCase();
    if (s === "CANCELLED" || s === "REJECTED") return -1;
    if (s === "COMPLETED") return 3;
    const idx = KITCHEN_STEPS.findIndex((step) => step.key === s);
    return idx !== -1 ? idx : 0;
}

function getDeliveryStepIndex(status = "PENDING") {
    const s = (status || "").toUpperCase();
    if (s === "FULFILLED") return 3;
    const idx = DELIVERY_STEPS.findIndex((step) => step.key === s);
    return idx !== -1 ? idx : 0;
}

function OrderContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { slug, restaurant, name: restaurantName } = useRestaurant();
    const notify = useNotification();

    const orderParam =
        searchParams.get("orderId") ||
        searchParams.get("id") ||
        "";
    const paymentId = searchParams.get("paymentId");
    const methodParam = searchParams.get("method") || (paymentId ? "ONLINE" : "CASH");
    const amountParam = searchParams.get("amount");

    const [copied, setCopied] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);

    const {
        data: orderData,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["order-details", slug, orderParam],
        queryFn: async () => {
            if (!slug || !orderParam) return null;
            try {
                return await OrderService.getOrderById(slug, orderParam);
            } catch (err) {
                console.warn("Could not fetch order status from server:", err);
                return null;
            }
        },
        enabled: !!slug && !!orderParam,
        refetchInterval: (query) => {
            const data = query.state.data || {};
            const oStatus = (data.orderStatus || "").toUpperCase();
            const fStatus = (data.fulfillmentStatus || "").toUpperCase();
            if (oStatus === "CANCELLED" || oStatus === "REJECTED") return false;
            if (oStatus === "COMPLETED" && fStatus === "FULFILLED") return false;
            return 8000;
        },
        retry: 1,
    });

    const order = orderData || {};
    const orderNumber = order.orderNumber || order._id || orderParam || `ORD-${Date.now().toString().slice(-6)}`;

    const orderStatus = (order.orderStatus || "PLACED").toUpperCase();
    const fulfillmentStatus = (order.fulfillmentStatus || "PENDING").toUpperCase();
    const orderType = (order.orderType || "dine-in").toLowerCase();

    const isCancelled = orderStatus === "CANCELLED" || orderStatus === "REJECTED";
    const isCompleted = orderStatus === "COMPLETED" && fulfillmentStatus === "FULFILLED";

    const kitchenStepIndex = getKitchenStepIndex(orderStatus);
    const deliveryStepIndex = getDeliveryStepIndex(fulfillmentStatus);

    const isDelivery = orderType === "delivery";
    const ORDER_STEPS = isDelivery ? DELIVERY_STEPS : KITCHEN_STEPS;
    const currentStepIndex = isDelivery ? deliveryStepIndex : kitchenStepIndex;
    const currentStatus = ORDER_STEPS[currentStepIndex]?.label || "Processing";

    const paymentMethod = (order.paymentMethod || methodParam || "cash").toUpperCase();
    const isCash = paymentMethod === "CASH";
    const totalAmount = order.totalAmount || amountParam || 0;
    const items = order.items || [];
    const tableInfo = order.table;

    const handleShare = () => {
        if (typeof navigator !== "undefined" && navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            notify.success("Order link copied!", { duration: 2500 });
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleCancelOrder = async () => {
        if (!confirm("Are you sure you want to cancel this order?")) return;

        try {
            setIsCancelling(true);
            await OrderService.cancelOrder(slug, orderParam, "Customer requested cancellation");
            notify.success("Order has been cancelled", { duration: 3000 });
            refetch();
        } catch (err) {
            console.error("Cancel order error:", err);
            notify.error(err?.response?.data?.message || err?.message || "Could not cancel order", {
                duration: 3500,
            });
        } finally {
            setIsCancelling(false);
        }
    };

    const canCancel = orderStatus === "PLACED" && fulfillmentStatus === "PENDING";

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 pb-36 sm:pb-28 select-none">
            {/* Top Sticky Header matching Cart/Profile */}
            <header className="sticky top-0 z-40 w-full border-b border-gray-150/40 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
                <div className="mx-auto max-w-screen-md px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                        {/* Back & Restaurant info */}
                        <div className="flex items-center gap-3 min-w-0">
                            <button
                                type="button"
                                onClick={() => router.push("/menu")}
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 hover:bg-neutral-200/80 dark:bg-zinc-850 dark:hover:bg-zinc-800 text-neutral-800 dark:text-neutral-200 transition-all active:scale-95 cursor-pointer"
                                aria-label="Back to menu"
                            >
                                <ArrowLeft size={18} strokeWidth={2.5} />
                            </button>

                            <div className="flex items-center gap-2.5 min-w-0">
                                {restaurant?.logo && (
                                    <div className="size-9 rounded-xl overflow-hidden bg-neutral-100 dark:bg-zinc-800 border border-black/5 dark:border-white/10 shrink-0 shadow-2xs">
                                        <img
                                            src={getImageUrl(restaurant.logo, true, "thumbnail")}
                                            alt={restaurant?.name || "Logo"}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                )}
                                <div className="flex flex-col min-w-0">
                                    <h1 className="text-sm sm:text-base font-semibold text-neutral-800 dark:text-zinc-100 truncate leading-tight">
                                        {restaurant?.name || restaurantName || "Order Status"}
                                    </h1>
                                    <span className="text-xs font-normal text-neutral-400 dark:text-neutral-500 truncate">
                                        {isCancelled ? "Order Cancelled" : "Live Kitchen Tracking"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Menu Link Button */}
                        <Link
                            href="/menu"
                            className="flex h-8.5 items-center gap-1.5 px-3 rounded-lg text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/15 transition-colors cursor-pointer shrink-0"
                        >
                            <Utensils size={13} />
                            <span>Menu</span>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-screen-md px-4 pt-6 sm:pt-10">
                <div className="flex flex-col items-center text-center">
                    {/* Status Badge Icon */}
                    <div className="relative mb-4 flex items-center justify-center">
                        <div
                            className={cn(
                                "absolute -inset-3 rounded-full blur-xl animate-pulse",
                                isCancelled ? "bg-rose-500/20" : "bg-emerald-500/20"
                            )}
                        />
                        <div
                            className={cn(
                                "relative flex size-20 sm:size-22 items-center justify-center rounded-full text-white shadow-lg animate-in zoom-in-75 duration-300",
                                isCancelled
                                    ? "bg-rose-600 shadow-rose-500/25"
                                    : "bg-emerald-500 shadow-emerald-500/25"
                            )}
                        >
                            {isCancelled ? (
                                <XCircle size={40} strokeWidth={2.2} />
                            ) : (
                                <CheckCircle2 size={40} strokeWidth={2.2} />
                            )}
                        </div>
                    </div>

                    {/* Order Heading */}
                    <span
                        className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider mb-1.5 border",
                            isCancelled
                                ? "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/50"
                                : "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50"
                        )}
                    >
                        {isCancelled
                            ? "Order Cancelled"
                            : isCash
                                ? "Order Placed (Cash)"
                                : "Payment & Order Confirmed"}
                    </span>

                    <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-zinc-100 tracking-tight">
                        {isCancelled
                            ? "Order Was Cancelled"
                            : isCash
                                ? "Order Sent to Kitchen!"
                                : "Order Confirmed!"}
                    </h1>

                    <p className="mt-1 max-w-sm text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-normal">
                        {isCancelled
                            ? "This order has been cancelled."
                            : `Preparing freshly at ${restaurant?.name || restaurantName || "the restaurant"}.`}
                    </p>

                    {/* Live Status Connected Progress Stepper */}
                    {!isCancelled && (
                        <div className="w-full mt-6 rounded-3xl bg-white dark:bg-zinc-900 p-4.5 sm:p-6 border border-gray-150/80 dark:border-zinc-800 shadow-xs">
                            <div className="flex items-center justify-between pb-3.5 border-b border-gray-100 dark:border-zinc-800 mb-5 sm:mb-6">
                                <div className="flex items-center gap-2">
                                    <span className="relative flex h-2.5 w-2.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                    </span>
                                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                                        Live Kitchen Status
                                    </span>
                                </div>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/15">
                                    <Clock size={12} />
                                    <span>{currentStatus}</span>
                                </span>
                            </div>

                            {/* Stepper with connecting line */}
                            <div className="relative pb-1">
                                {/* Background connecting line */}
                                <div className="absolute top-5 sm:top-6 left-[12.5%] right-[12.5%] h-1 sm:h-1.5 -translate-y-1/2 bg-neutral-100 dark:bg-zinc-800 rounded-full z-0 overflow-hidden">
                                    {/* Active filled line */}
                                    <div
                                        className="h-full bg-gradient-to-r from-emerald-500 to-primary rounded-full transition-all duration-700 ease-out"
                                        style={{
                                            width: `${(Math.min(Math.max(currentStepIndex, 0), 3) / 3) * 100}%`,
                                        }}
                                    />
                                </div>

                                {/* Step Nodes */}
                                <div className="grid grid-cols-4 relative z-10">
                                    {ORDER_STEPS.map((step, idx) => {
                                        const StepIcon = step.icon;
                                        const isDone = idx < currentStepIndex;
                                        const isCurrent = idx === currentStepIndex;

                                        return (
                                            <div
                                                key={step.key}
                                                className="flex flex-col items-center text-center"
                                            >
                                                <div
                                                    className={cn(
                                                        "size-10 sm:size-12 rounded-full flex items-center justify-center transition-all duration-300 ring-4",
                                                        isDone
                                                            ? "bg-emerald-500 text-white shadow-sm ring-white dark:ring-zinc-900"
                                                            : isCurrent
                                                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-primary/20 scale-105"
                                                                : "bg-neutral-100 dark:bg-zinc-800/90 text-neutral-400 dark:text-zinc-500 ring-white dark:ring-zinc-900"
                                                    )}
                                                >
                                                    {isDone ? (
                                                        <Check size={16} strokeWidth={3} className="sm:size-4.5" />
                                                    ) : (
                                                        <StepIcon
                                                            size={17}
                                                            strokeWidth={isCurrent ? 2.3 : 1.8}
                                                            className={cn(
                                                                "sm:size-5 transition-transform",
                                                                isCurrent && "animate-pulse"
                                                            )}
                                                        />
                                                    )}
                                                </div>

                                                <span
                                                    className={cn(
                                                        "mt-2 text-[11px] sm:text-xs leading-tight transition-colors",
                                                        isCurrent
                                                            ? "font-bold text-primary dark:text-primary-foreground"
                                                            : isDone
                                                                ? "font-semibold text-neutral-800 dark:text-zinc-200"
                                                                : "font-medium text-neutral-400 dark:text-zinc-500"
                                                    )}
                                                >
                                                    {step.label}
                                                </span>
                                                <span className="text-[10px] text-neutral-400 dark:text-zinc-500 font-normal hidden sm:block mt-0.5">
                                                    {step.desc}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Order Details Card */}
                    <div className="w-full mt-4 rounded-3xl bg-white dark:bg-zinc-900 p-4.5 sm:p-6 border border-gray-150/80 dark:border-zinc-800 shadow-xs text-left flex flex-col gap-3">
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-zinc-800">
                            <div className="flex items-center gap-2">
                                <ReceiptText size={18} className="text-primary" />
                                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                                    Order Number
                                </span>
                            </div>
                            <span className="text-sm font-semibold text-neutral-900 dark:text-zinc-100 font-mono">
                                #{orderNumber}
                            </span>
                        </div>

                        {/* Table Information if Dine-in */}
                        {tableInfo && (
                            <div className="flex items-center justify-between text-xs pb-2 border-b border-gray-100 dark:border-zinc-800">
                                <span className="text-neutral-500 dark:text-neutral-400 font-normal">
                                    Dine-in Table
                                </span>
                                <span className="font-semibold text-neutral-800 dark:text-zinc-200">
                                    {typeof tableInfo === "object"
                                        ? tableInfo.label || `Table ${tableInfo.tableNumber || 1}`
                                        : `Table ${tableInfo}`}
                                </span>
                            </div>
                        )}

                        {/* Items Ordered Breakdown */}
                        {items.length > 0 && (
                            <div className="flex flex-col gap-2 py-1 border-b border-gray-100 dark:border-zinc-800">
                                <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                    Ordered Items ({items.length})
                                </span>
                                <div className="space-y-1.5">
                                    {items.map((item, idx) => (
                                        <div
                                            key={item._id || idx}
                                            className="flex items-center justify-between text-xs"
                                        >
                                            <div className="flex items-center gap-2 min-w-0">
                                                <span className="font-semibold text-primary shrink-0">
                                                    {item.quantity}x
                                                </span>
                                                <span className="text-neutral-800 dark:text-zinc-200 truncate">
                                                    {item.name}
                                                </span>
                                            </div>
                                            <span className="font-medium text-neutral-900 dark:text-zinc-100 shrink-0 ml-2">
                                                ₹{item.totalPrice || item.unitPrice * item.quantity}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Payment Method */}
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-neutral-500 dark:text-neutral-400 font-normal">
                                Payment Method
                            </span>
                            <span className="font-medium text-neutral-800 dark:text-zinc-200">
                                {isCash ? "💵 Cash on Delivery / Pay at Counter" : "💳 Online Payment"}
                            </span>
                        </div>

                        {paymentId && (
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-neutral-500 dark:text-neutral-400 font-normal">
                                    Payment ID
                                </span>
                                <span className="font-mono text-neutral-700 dark:text-neutral-300">
                                    {paymentId}
                                </span>
                            </div>
                        )}

                        {totalAmount > 0 && (
                            <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100 dark:border-zinc-800 font-semibold">
                                <span className="text-neutral-800 dark:text-zinc-200">
                                    {isCash ? "Total Due" : "Total Paid"}
                                </span>
                                <span className="text-base text-primary">
                                    ₹{totalAmount}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex flex-col gap-3 w-full">
                        {/* Primary Action: Order More Items */}
                        <Link
                            href="/menu"
                            className="flex h-12.5 w-full items-center justify-center gap-2.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm shadow-md shadow-primary/25 hover:brightness-95 active:scale-[0.98] transition-all cursor-pointer"
                        >
                            <ShoppingBag size={18} strokeWidth={2} />
                            <span>Order More Items</span>
                            <ArrowRight size={16} strokeWidth={2.2} />
                        </Link>

                        {/* Secondary Actions: Share Order & Cancel Order side by side */}
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
                                className="h-11.5 w-full px-3 rounded-2xl bg-neutral-100 hover:bg-neutral-200/80 dark:bg-zinc-850 dark:hover:bg-zinc-800 text-neutral-750 dark:text-neutral-200 font-semibold text-xs sm:text-sm shadow-none cursor-pointer gap-2 transition-all active:scale-[0.98]"
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
                                    className="h-11.5 w-full px-3 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 hover:bg-rose-100/80 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs sm:text-sm font-semibold cursor-pointer gap-2 active:scale-[0.98] transition-all"
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

export default function OrderPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-[60vh] flex items-center justify-center">
                    <Loader2 size={28} className="animate-spin text-primary" />
                </div>
            }
        >
            <OrderContent />
        </Suspense>
    );
}
