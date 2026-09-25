"use client";
import { useState, useEffect, useRef } from "react";
import { OrderService } from "@/services/frontend/order";

/**
 * Polling-based hook to track order status in real-time on tenant tracking pages
 * without consuming Pusher WebSocket connection slots.
 *
 * @param {Object} params
 * @param {string} params.slug - Restaurant domain / slug
 * @param {string} params.orderId - MongoDB ObjectId of the order
 * @param {string} params.orderNumber - ORD-... identifier
 * @param {Function} [params.onStatusChange] - Callback with updated order
 * @param {Function} [params.refetch] - Optional React Query or fetcher to reload order
 * @param {number} [params.interval=5000] - Polling interval in ms
 */
export function useRealtimeOrderStatus({
  slug,
  orderId,
  orderNumber,
  onStatusChange,
  refetch,
  interval = 10000,
} = {}) {
  const [latestOrder, setLatestOrder] = useState(null);
  const [isLive, setIsLive] = useState(true);
  const identifier = orderId || orderNumber;

  const onStatusChangeRef = useRef(onStatusChange);
  const refetchRef = useRef(refetch);

  useEffect(() => {
    onStatusChangeRef.current = onStatusChange;
    refetchRef.current = refetch;
  }, [onStatusChange, refetch]);

  useEffect(() => {
    if (!slug || !identifier) return;

    let isMounted = true;
    let timerId = null;

    const poll = async () => {
      try {
        const data = await OrderService.getOrderById(slug, identifier);
        if (!isMounted || !data) return;

        setLatestOrder(data);
        if (onStatusChangeRef.current) {
          onStatusChangeRef.current(data);
        }
        if (refetchRef.current) {
          refetchRef.current();
        }

        const status = (data?.orderStatus || "").toUpperCase();
        if (status === "COMPLETED" || status === "CANCELLED" || status === "REJECTED") {
          setIsLive(false);
          return;
        }
      } catch (err) {
        console.warn("Order poll error:", err);
      }

      if (isMounted) {
        timerId = setTimeout(poll, interval);
      }
    };

    timerId = setTimeout(poll, interval);

    return () => {
      isMounted = false;
      if (timerId) clearTimeout(timerId);
    };
  }, [slug, identifier, interval]);

  return { isConnected: isLive, isLive, latestOrder };

}

export default useRealtimeOrderStatus;
