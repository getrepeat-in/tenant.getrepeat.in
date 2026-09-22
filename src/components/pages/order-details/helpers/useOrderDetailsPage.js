import { useState } from "react";
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
        retry: 1,
    });

    const order = orderData || {};
    const orderNumber = order.orderNumber || order._id || orderParam || `ORD-${Date.now().toString().slice(-6)}`;

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
        router,
        isAddressExpanded,
        setIsAddressExpanded
    };
}