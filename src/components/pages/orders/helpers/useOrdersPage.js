import { useUser } from "@/hooks/useUser";
import { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { addItem } from "@/store/slices/cartSlice";
import { useRestaurant } from "@/hooks/useRestaurant";
import useNotification from "@/hooks/useNotification";
import { OrderService } from "@/services/frontend/order";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ORDER_STATUS_CONFIG } from "./constants";

const TERMINAL_STATUSES = ["COMPLETED", "CANCELLED", "REJECTED"];

export function getDisplayStatus(order) {
    const oStatus = (order.orderStatus || "PLACED").toUpperCase();
    return ORDER_STATUS_CONFIG[oStatus] || ORDER_STATUS_CONFIG.PLACED;
}

export function formatOrderDate(dateString) {
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

export function useOrdersPage() {
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

            const isCancelled = oStatus === "CANCELLED" || oStatus === "REJECTED";
            const isCompleted = oStatus === "COMPLETED";
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
            return !TERMINAL_STATUSES.includes(oStatus);
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

    return {
        slug,
        restaurant,
        restaurantName,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        expandedOrderIds,
        toggleExpand,
        copiedOrderId,
        handleCopyOrderNumber,
        handleReorder,
        allOrders,
        filteredOrders,
        activeOrdersCount,
        isLoading,
        refetch,
        router,
    };
}
