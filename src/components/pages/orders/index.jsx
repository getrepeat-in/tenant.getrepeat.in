"use client";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { cn, getImageUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { addItem } from "@/store/slices/cartSlice";
import { useState, useMemo, useEffect } from "react";
import { useRestaurant } from "@/hooks/useRestaurant";
import useNotification from "@/hooks/useNotification";
import { OrderService } from "@/services/frontend/order";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ShoppingBag, ArrowLeft, Clock, ReceiptText, ChefHat, Utensils, CheckCircle2, XCircle, CheckCheck, BellRing, Search, RotateCcw, Copy, Check, ChevronDown, ChevronUp } from "lucide-react";

const ORDER_STATUS_CONFIG = {
    PLACED: { label: "Placed", icon: ReceiptText, badgeClass: "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800/50", indicatorClass: "bg-blue-500", isActive: true },
    ACCEPTED: { label: "Accepted", icon: CheckCheck, badgeClass: "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300 border-amber-200 dark:border-amber-800/50", indicatorClass: "bg-amber-500", isActive: true },
    PREPARING: { label: "Preparing", icon: ChefHat, badgeClass: "bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 border-purple-200 dark:border-purple-800/50", indicatorClass: "bg-purple-500", isActive: true },
    READY: { label: "Ready", icon: BellRing, badgeClass: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50", indicatorClass: "bg-emerald-500", isActive: true },
    COMPLETED: { label: "Completed", icon: CheckCircle2, badgeClass: "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700", indicatorClass: "bg-zinc-400", isActive: false },
    CANCELLED: { label: "Cancelled", icon: XCircle, badgeClass: "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 border-rose-200 dark:border-rose-800/50", indicatorClass: "bg-rose-500", isActive: false },
    REJECTED: { label: "Rejected", icon: XCircle, badgeClass: "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 border-rose-200 dark:border-rose-800/50", indicatorClass: "bg-rose-500", isActive: false },
};

const FULFILLMENT_STATUS_CONFIG = {
    IN_TRANSIT: { label: "Out for Delivery", icon: Clock, badgeClass: "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/50", indicatorClass: "bg-indigo-500", isActive: true },
    FULFILLED: { label: "Fulfilled", icon: CheckCircle2, badgeClass: "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700", indicatorClass: "bg-zinc-400", isActive: false },
};

function getDisplayStatus(order) {
    const oStatus = (order.orderStatus || "PLACED").toUpperCase();
    const fStatus = (order.fulfillmentStatus || "PENDING").toUpperCase();
    const oType = (order.orderType || "").toLowerCase();

    if (oStatus === "CANCELLED" || oStatus === "REJECTED") {
        return ORDER_STATUS_CONFIG[oStatus];
    }
    
    if (fStatus === "IN_TRANSIT") {
        return FULFILLMENT_STATUS_CONFIG.IN_TRANSIT;
    }
    
    if (oStatus === "COMPLETED" && fStatus === "FULFILLED") {
        return ORDER_STATUS_CONFIG.COMPLETED;
    }

    if (oStatus === "COMPLETED") {
        if (oType === "delivery") return { ...ORDER_STATUS_CONFIG.READY, label: "Waiting for Rider" };
        return { ...ORDER_STATUS_CONFIG.READY, label: "Ready for Pickup" };
    }

    return ORDER_STATUS_CONFIG[oStatus] || ORDER_STATUS_CONFIG.PLACED;
}

function formatOrderDate(dateString) {
    if (!dateString) return "Recently";
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "Recently";

        const now = new Date();
        const isToday =
            date.getDate() === now.getDate() &&
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear();

        const timeStr = date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });

        if (isToday) return `Today, ${timeStr}`;

        return date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    } catch {
        return "Recently";
    }
}

export default function MyOrdersPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const notify = useNotification();
    const { slug, restaurant, name: restaurantName } = useRestaurant();
    const { user } = useUser();

    const [activeTab, setActiveTab] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedOrderIds, setExpandedOrderIds] = useState({});
    const [copiedOrderId, setCopiedOrderId] = useState(null);

    const userPhone = user?.phone || user?.phoneNumber || "";
    const userId = user?._id || user?.id || "";

    const {
        data: serverOrdersData,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["orders-history", slug, userId, userPhone],
        queryFn: async () => {
            if (!slug) return { orders: [] };
            try {
                return await OrderService.getOrderHistory(slug, {
                    page: 1,
                    limit: 50,
                    ...(userPhone ? { phone: userPhone } : {}),
                    ...(userId ? { userId: userId } : {}),
                });
            } catch (err) {
                console.warn("Could not fetch server orders history:", err);
                return { orders: [] };
            }
        },
        enabled: !!slug,
    });



    const allOrders = useMemo(() => {
        let localOrders = [];
        if (typeof window !== "undefined" && slug) {
            try {
                const stored = localStorage.getItem(`recent_orders_${slug}`);
                if (stored) localOrders = JSON.parse(stored);
            } catch (e) {
                console.warn("Error reading local orders:", e);
            }
        }

        const rawServerOrders = Array.isArray(serverOrdersData)
            ? serverOrdersData
            : serverOrdersData?.orders || [];
        const mergedMap = new Map();

        rawServerOrders.forEach((order) => {
            const key = order._id || order.orderNumber;
            if (key) mergedMap.set(key, order);
        });

        localOrders.forEach((order) => {
            const key = order._id || order.orderNumber;
            if (key && !mergedMap.has(key)) {
                mergedMap.set(key, order);
            }
        });

        return Array.from(mergedMap.values()).sort((a, b) => {
            const timeA = new Date(a.createdAt || 0).getTime();
            const timeB = new Date(b.createdAt || 0).getTime();
            return timeB - timeA;
        });
    }, [serverOrdersData, slug]);

    const filteredOrders = useMemo(() => {
        return allOrders.filter((order) => {
            const oStatus = (order.orderStatus || "PLACED").toUpperCase();
            const fStatus = (order.fulfillmentStatus || "PENDING").toUpperCase();
            
            const isCancelled = oStatus === "CANCELLED" || oStatus === "REJECTED";
            const isCompleted = oStatus === "COMPLETED" && fStatus === "FULFILLED";
            const isOrderActive = !isCancelled && !isCompleted;

            if (activeTab === "ACTIVE" && !isOrderActive) return false;
            if (activeTab === "COMPLETED" && !isCompleted) return false;
            if (activeTab === "CANCELLED" && !isCancelled) return false;
            
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase().trim();
                const orderNumber = (order.orderNumber || order._id || "").toLowerCase();
                const hasItemMatch = (order.items || []).some((item) =>
                    (item.name || "").toLowerCase().includes(query)
                );
                if (!orderNumber.includes(query) && !hasItemMatch) {
                    return false;
                }
            }

            return true;
        });
    }, [allOrders, activeTab, searchQuery]);

    const activeOrdersCount = useMemo(() => {
        return allOrders.filter((order) => {
            const oStatus = (order.orderStatus || "PLACED").toUpperCase();
            const fStatus = (order.fulfillmentStatus || "PENDING").toUpperCase();
            const isCancelled = oStatus === "CANCELLED" || oStatus === "REJECTED";
            const isCompleted = oStatus === "COMPLETED" && fStatus === "FULFILLED";
            return !isCancelled && !isCompleted;
        }).length;
    }, [allOrders]);

    const toggleExpand = (id) => {
        setExpandedOrderIds((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleCopyOrderNumber = (orderNumber) => {
        if (typeof navigator !== "undefined" && navigator.clipboard) {
            navigator.clipboard.writeText(orderNumber);
            setCopiedOrderId(orderNumber);
            notify.success(`Copied #${orderNumber}`, { duration: 2000 });
            setTimeout(() => setCopiedOrderId(null), 2000);
        }
    };

    const handleReorder = (order) => {
        if (!order.items || order.items.length === 0) return;

        order.items.forEach((item) => {
            dispatch(
                addItem({
                    item: {
                        _id: item.menuItem || item._id || `reorder_${Date.now()}`,
                        name: item.name,
                        price: item.unitPrice || item.price || 0,
                    },
                    restaurantId: slug,
                    quantity: item.quantity || 1,
                    price: item.unitPrice || item.price || 0,
                    selectedCustomizations: item.variant || {},
                })
            );
        });

        notify.success(`Added ${order.items.length} items to your cart!`, { duration: 3000 });
        router.push("/cart");
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 pb-28 select-none">
            <header className="sticky top-0 z-40 w-full border-b border-gray-150/40 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
                <div className="mx-auto max-w-screen-md px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 hover:bg-neutral-200/80 dark:bg-zinc-850 dark:hover:bg-zinc-800 text-neutral-800 dark:text-neutral-200 transition-all active:scale-95 cursor-pointer"
                                aria-label="Go back"
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
                                    <h1 className="text-sm sm:text-base font-semibold text-neutral-800 dark:text-zinc-100 truncate leading-tight flex items-center gap-2">
                                        <span>My Orders</span>
                                        {allOrders.length > 0 && (
                                            <span className="px-1.5 py-0.2 rounded-full text-[11px] font-bold bg-neutral-100 dark:bg-zinc-800 text-neutral-600 dark:text-neutral-400">
                                                {allOrders.length}
                                            </span>
                                        )}
                                    </h1>
                                    <span className="text-xs font-normal text-neutral-400 dark:text-neutral-500 truncate">
                                        {restaurant?.name || restaurantName || "Order history & live tracking"}
                                    </span>
                                </div>
                            </div>
                        </div>

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

            <main className="mx-auto max-w-screen-md px-4 pt-4 sm:pt-6">
                <div className="relative mb-3.5">
                    <Search
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                    />
                    <input
                        type="text"
                        placeholder="Search by order ID (#ORD-...) or item name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-11 pl-10 pr-4 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 text-xs sm:text-sm text-neutral-800 dark:text-zinc-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-2xs"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-400 hover:text-neutral-600"
                        >
                            Clear
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-1.5 p-1 mb-5 rounded-2xl bg-neutral-200/60 dark:bg-zinc-900 overflow-x-auto no-scrollbar">
                    <button
                        type="button"
                        onClick={() => setActiveTab("ALL")}
                        className={cn(
                            "flex-1 min-w-[75px] h-8.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5",
                            activeTab === "ALL"
                                ? "bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 shadow-xs"
                                : "text-neutral-500 hover:text-neutral-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                        )}
                    >
                        <span>All</span>
                        <span className="text-[10px] opacity-70">({allOrders.length})</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab("ACTIVE")}
                        className={cn(
                            "flex-1 min-w-[85px] h-8.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5",
                            activeTab === "ACTIVE"
                                ? "bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-xs"
                                : "text-neutral-500 hover:text-neutral-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                        )}
                    >
                        {activeOrdersCount > 0 && (
                            <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
                        )}
                        <span>Active</span>
                        <span className="text-[10px] opacity-70">({activeOrdersCount})</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab("COMPLETED")}
                        className={cn(
                            "flex-1 min-w-[95px] h-8.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5",
                            activeTab === "COMPLETED"
                                ? "bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 shadow-xs"
                                : "text-neutral-500 hover:text-neutral-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                        )}
                    >
                        <span>Completed</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab("CANCELLED")}
                        className={cn(
                            "flex-1 min-w-[85px] h-8.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5",
                            activeTab === "CANCELLED"
                                ? "bg-white dark:bg-zinc-800 text-rose-600 dark:text-rose-400 shadow-xs"
                                : "text-neutral-500 hover:text-neutral-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                        )}
                    >
                        <span>Cancelled</span>
                    </button>
                </div>

                {isLoading && allOrders.length === 0 ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((n) => (
                            <div
                                key={n}
                                className="h-44 rounded-3xl bg-white dark:bg-zinc-900 border border-gray-150/80 dark:border-zinc-800 animate-pulse p-5 space-y-3"
                            >
                                <div className="flex justify-between">
                                    <div className="h-4 w-32 bg-neutral-200 dark:bg-zinc-800 rounded-md" />
                                    <div className="h-5 w-20 bg-neutral-200 dark:bg-zinc-800 rounded-full" />
                                </div>
                                <div className="h-12 bg-neutral-100 dark:bg-zinc-800/60 rounded-xl" />
                                <div className="flex justify-between items-center pt-2">
                                    <div className="h-4 w-16 bg-neutral-200 dark:bg-zinc-800 rounded-md" />
                                    <div className="h-9 w-28 bg-neutral-200 dark:bg-zinc-800 rounded-xl" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-8 sm:p-12 text-center flex flex-col items-center justify-center animate-in fade-in duration-300">
                        <div className="relative mb-4 flex size-16 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-zinc-800 text-neutral-400">
                            <ShoppingBag size={30} strokeWidth={1.8} />
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-neutral-800 dark:text-zinc-100">
                            No orders found
                        </h3>
                        <p className="mt-1 max-w-xs text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                            {searchQuery
                                ? `No orders matched "${searchQuery}". Try a different search.`
                                : activeTab !== "ALL"
                                    ? `You have no ${activeTab.toLowerCase()} orders right now.`
                                    : "You haven't placed any orders yet. Delicious food is waiting!"}
                        </p>
                        <Link
                            href="/menu"
                            className="mt-5 flex h-11 items-center gap-2 px-5 rounded-2xl bg-primary text-primary-foreground font-semibold text-xs sm:text-sm shadow-md shadow-primary/25 hover:brightness-95 active:scale-95 transition-all cursor-pointer"
                        >
                            <Utensils size={15} />
                            <span>Explore Menu</span>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredOrders.map((order) => {
                            const orderId = order._id || order.orderNumber;
                            const orderNumber =
                                order.orderNumber ||
                                (orderId && orderId.startsWith("ORD-")
                                    ? orderId
                                    : `ORD-${(orderId || "").slice(-6)}`);
                            
                            const statusCfg = getDisplayStatus(order);
                            const StatusIcon = statusCfg.icon;
                            const isExpanded = !!expandedOrderIds[orderId];
                            const items = order.items || [];
                            const totalAmount = order.totalAmount || order.amount || 0;
                            const isCash = (order.paymentMethod || "cash").toLowerCase() === "cash";
                            const isLive = statusCfg.isActive;

                            return (
                                <div
                                    key={orderId}
                                    className="rounded-3xl bg-white dark:bg-zinc-900 border border-gray-150/80 dark:border-zinc-800 p-4.5 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200"
                                >
                                    <div className="flex items-start justify-between gap-2 pb-3 border-b border-gray-100 dark:border-zinc-800/80">
                                        <div className="flex flex-col min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <span className="font-mono font-bold text-xs sm:text-sm text-neutral-900 dark:text-zinc-100">
                                                    #{orderNumber}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleCopyOrderNumber(orderNumber)}
                                                    className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                                                    title="Copy order number"
                                                >
                                                    {copiedOrderId === orderNumber ? (
                                                        <Check size={12} className="text-emerald-500" />
                                                    ) : (
                                                        <Copy size={12} />
                                                    )}
                                                </button>
                                            </div>
                                            <span className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-0.5">
                                                {formatOrderDate(order.createdAt)}
                                            </span>
                                        </div>

                                        <div
                                            className={cn(
                                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border shrink-0",
                                                statusCfg.badgeClass
                                            )}
                                        >
                                            {isLive ? (
                                                <span className="relative flex h-2 w-2">
                                                    <span
                                                        className={cn(
                                                            "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                                                            statusCfg.indicatorClass
                                                        )}
                                                    />
                                                    <span
                                                        className={cn(
                                                            "relative inline-flex rounded-full h-2 w-2",
                                                            statusCfg.indicatorClass
                                                        )}
                                                    />
                                                </span>
                                            ) : (
                                                <StatusIcon size={12} strokeWidth={2.5} />
                                            )}
                                            <span>{statusCfg.label}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2 py-2.5 text-[11px] text-neutral-600 dark:text-zinc-400">
                                        {order.table && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-zinc-800 font-medium">
                                                🍽️{" "}
                                                {typeof order.table === "object"
                                                    ? order.table.label || `Table ${order.table.tableNumber || 1}`
                                                    : `Table ${order.table}`}
                                            </span>
                                        )}
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-zinc-800 font-medium">
                                            {isCash ? "💵 Cash" : "💳 Paid Online"}
                                        </span>
                                        <span className="inline-flex items-center gap-1 text-neutral-400 ml-auto">
                                            {items.reduce((sum, it) => sum + (it.quantity || 1), 0)} items
                                        </span>
                                    </div>

                                    {items.length > 0 && (
                                        <div className="py-2.5 border-t border-gray-100 dark:border-zinc-800/80 space-y-1.5">
                                            {(isExpanded ? items : items.slice(0, 2)).map((item, idx) => (
                                                <div
                                                    key={item._id || idx}
                                                    className="flex items-center justify-between text-xs"
                                                >
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <span className="font-bold text-primary shrink-0">
                                                            {item.quantity}x
                                                        </span>
                                                        <span className="text-neutral-800 dark:text-zinc-200 truncate font-medium">
                                                            {item.name}
                                                        </span>
                                                        {item.variant?.name && (
                                                            <span className="text-[10px] text-neutral-400 bg-neutral-100 dark:bg-zinc-800 px-1.5 py-0.2 rounded shrink-0">
                                                                {item.variant.name}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="font-semibold text-neutral-900 dark:text-zinc-100 shrink-0 ml-2">
                                                        ₹{item.totalPrice || (item.unitPrice || item.price || 0) * (item.quantity || 1)}
                                                    </span>
                                                </div>
                                            ))}

                                            {items.length > 2 && (
                                                <button
                                                    type="button"
                                                    onClick={() => toggleExpand(orderId)}
                                                    className="flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline pt-1 cursor-pointer"
                                                >
                                                    <span>
                                                        {isExpanded
                                                            ? "Show less items"
                                                            : `+${items.length - 2} more item${items.length - 2 > 1 ? "s" : ""}`}
                                                    </span>
                                                    {isExpanded ? (
                                                        <ChevronUp size={13} />
                                                    ) : (
                                                        <ChevronDown size={13} />
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {/* Card Footer: Total Amount & Action Buttons */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 mt-1 border-t border-gray-100 dark:border-zinc-800">
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="text-xs text-neutral-400 font-normal">
                                                Total:
                                            </span>
                                            <span className="text-base sm:text-lg font-bold text-neutral-900 dark:text-zinc-100 font-mono">
                                                ₹{totalAmount}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {/* Reorder Button */}
                                            {items.length > 0 && (
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    onClick={() => handleReorder(order)}
                                                    className="h-9.5 px-3.5 rounded-xl bg-neutral-100 hover:bg-neutral-200/80 dark:bg-zinc-850 dark:hover:bg-zinc-800 text-neutral-700 dark:text-neutral-200 font-semibold text-xs gap-1.5 shadow-none cursor-pointer active:scale-95 transition-all"
                                                >
                                                    <RotateCcw size={13} />
                                                    <span>Reorder</span>
                                                </Button>
                                            )}

                                            {/* Live Track or View Details Button */}
                                            <Button
                                                type="button"
                                                onClick={() => router.push(`/order?orderId=${orderId}`)}
                                                className={cn(
                                                    "h-9.5 flex-1 sm:flex-initial px-4 rounded-xl font-semibold text-xs gap-1.5 cursor-pointer active:scale-95 transition-all",
                                                    isLive
                                                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:brightness-95"
                                                        : "bg-neutral-800 dark:bg-zinc-700 text-white hover:bg-neutral-900"
                                                )}
                                            >
                                                {isLive ? (
                                                    <>
                                                        <Clock size={13} />
                                                        <span>Live Track</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <ReceiptText size={13} />
                                                        <span>View Details</span>
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
