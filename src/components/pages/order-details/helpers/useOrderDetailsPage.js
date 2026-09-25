import { useState, useRef, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRestaurant } from "@/hooks/useRestaurant";
import useNotification from "@/hooks/useNotification";
import { OrderService } from "@/services/frontend/order";
import { getStepsForType, getStepIndex } from "./constants";
import { useSearchParams, useRouter, useParams } from "next/navigation";

export function useOrderDetailsPage() {
    const searchParams = useSearchParams();
    const params = useParams();
    const router = useRouter();
    const { slug, restaurant, name: restaurantName } = useRestaurant();
    const notify = useNotification();

    const orderParam = params?.orderId || "";
    const paymentId = searchParams.get("paymentId");
    const methodParam = searchParams.get("method") || (paymentId ? "ONLINE" : "CASH");
    const amountParam = searchParams.get("amount");

    const [copied, setCopied] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const [isAddressExpanded, setIsAddressExpanded] = useState(false);

    const prevStatusRef = useRef(null);

    const {
        data: orderData,
        isLoading,
        isFetching,
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
        retry: 1,
        // Smart polling: poll every 5s while order is active, stop when completed/cancelled
        refetchInterval: (query) => {
            const currentOrder = query.state.data;
            const status = (currentOrder?.orderStatus || "").toUpperCase();
            if (status === "COMPLETED" || status === "CANCELLED" || status === "REJECTED") {
                return false;
            }
            return 5000;
        },
        refetchIntervalInBackground: false,
    });

    const order = useMemo(() => orderData || {}, [orderData]);
    const orderNumber = order.orderNumber || order._id || orderParam || "ORD-RECENT";

    const orderStatus = (order.orderStatus || "PLACED").toUpperCase();
    const orderType = (order.orderType || "DINE_IN").toUpperCase();

    const isCancelled = orderStatus === "CANCELLED" || orderStatus === "REJECTED";
    const isCompleted = orderStatus === "COMPLETED";

    const ORDER_STEPS = getStepsForType(orderType);
    const currentStepIndex = getStepIndex(ORDER_STEPS, orderStatus);
    const currentStatus = ORDER_STEPS[currentStepIndex]?.label || "Processing";

    const isDelivery = orderType === "DELIVERY";

    const paymentMethod = (order.paymentMethod || methodParam || "CASH").toUpperCase();
    const isCash = paymentMethod === "CASH";
    const totalAmount = order.totalAmount || amountParam || 0;
    const items = order.items || [];
    const tableInfo = order.table;
    const customerInfo = order.customerInfo || {};
    const rejectionReason = order.rejectionReason || null;

    // Detect status updates across poll cycles
    useEffect(() => {
        if (!order?.orderStatus) return;

        const currentOS = (order.orderStatus || "").toUpperCase();
        if (prevStatusRef.current && prevStatusRef.current !== currentOS) {
            const steps = getStepsForType(order?.orderType || orderType);
            const stepLabel = steps.find((s) => s.key === currentOS)?.label || currentOS.replace(/_/g, " ");
            notify.info(`Order updated: ${stepLabel}!`, { duration: 4000 });

            // Sync with local storage
            if (typeof window !== "undefined" && slug) {
                try {
                    const key = `recent_orders_${slug}`;
                    const stored = JSON.parse(localStorage.getItem(key) || "[]");
                    const targetKey = order._id || order.orderNumber;
                    const updated = stored.map((item) => {
                        const itemKey = item._id || item.orderNumber;
                        if (itemKey === targetKey) {
                            return { ...item, ...order, status: currentOS };
                        }
                        return item;
                    });
                    localStorage.setItem(key, JSON.stringify(updated));
                } catch (e) {
                    console.warn("Could not sync local orders:", e);
                }
            }
        }
        prevStatusRef.current = currentOS;
    }, [order, orderType, slug, notify]);

    const isLive = !isCancelled && !isCompleted;

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

    const canCancel = orderStatus === "PLACED";

    return {
        slug,
        restaurant,
        restaurantName,
        order,
        orderNumber,
        orderType,
        orderStatus,
        rejectionReason,
        isCancelled,
        isCompleted,
        isDelivery,
        isCash,
        totalAmount,
        items,
        tableInfo,
        customerInfo,
        paymentId,
        ORDER_STEPS,
        currentStepIndex,
        currentStatus,
        copied,
        handleShare,
        isCancelling,
        handleCancelOrder,
        canCancel,
        isLoading,
        isFetching,
        isLive,
        isConnected: isLive, // Keep isConnected for UI compatibility
        router,
        isAddressExpanded,
        setIsAddressExpanded,
    };
}