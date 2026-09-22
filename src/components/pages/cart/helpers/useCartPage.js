import { getImageUrl } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { CART_CONSTANTS } from "./constants";
import { clearCart } from "@/store/slices/cartSlice";
import { useSelector, useDispatch } from "react-redux";
import PaymentService from "@/services/frontend/payment";

export function useCartPage({ slug, restaurant, user, notify, configuration }) {
    const router = useRouter();
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.items || []);
    const isCartLoaded = useSelector((state) => state.cart.isLoaded);
    const globalAddonGroups = useSelector((state) => state.menu?.addonGroups || []);


    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState(CART_CONSTANTS.PAYMENT_METHODS.ONLINE);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [orderType, setOrderType] = useState(CART_CONSTANTS.ORDER_TYPES.DINE_IN);

    const [isTableModalOpen, setIsTableModalOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);

    useEffect(() => {
        if (configuration?.ordering) {
            const acceptedTypes = configuration.ordering.acceptedTypes || ["DINE_IN", "TAKEAWAY", "DELIVERY"];
            const paymentMethods = configuration.ordering.paymentMethods || ["ONLINE", "CASH"];
            
            setOrderType(current => {
                if (!acceptedTypes.includes(current) && acceptedTypes.length > 0) {
                    return acceptedTypes[0];
                }
                return current;
            });
            
            setPaymentMethod(current => {
                const isCashAllowed = paymentMethods.includes("CASH");
                const isOnlineAllowed = paymentMethods.includes("ONLINE");
                
                if (current === CART_CONSTANTS.PAYMENT_METHODS.CASH && !isCashAllowed && isOnlineAllowed) {
                    return CART_CONSTANTS.PAYMENT_METHODS.ONLINE;
                }
                if (current === CART_CONSTANTS.PAYMENT_METHODS.ONLINE && !isOnlineAllowed && isCashAllowed) {
                    return CART_CONSTANTS.PAYMENT_METHODS.CASH;
                }
                return current;
            });
        }
    }, [configuration]);

    const subtotal = cartItems.reduce((acc, curr) => {
        const itemPrice = curr.price || curr.item?.base_price || curr.item?.price || 0;
        return acc + itemPrice * curr.quantity;
    }, 0);

    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const discount = appliedCoupon?.discount || 0;
    const discountedSubtotal = Math.max(0, subtotal - discount);

    const orderingConfig = configuration?.ordering || {};
    const packingChargesConfig = orderingConfig.packingCharges || { isEnabled: false, amount: 0 };
    const platformFeeConfig = orderingConfig.platformFee || { isEnabled: false, amount: 0 };
    const taxConfig = orderingConfig.taxAndServiceFee || { isEnabled: false, amount: 0 };

    const packingCharges = packingChargesConfig.isEnabled ? packingChargesConfig.amount : 0;
    const platformFee = platformFeeConfig.isEnabled ? platformFeeConfig.amount : 0;
    const taxAmount = taxConfig.isEnabled ? Math.round(discountedSubtotal * (taxConfig.amount / 100)) : 0;
    const taxRate = taxConfig.isEnabled ? taxConfig.amount : 0;

    const grandTotal = subtotal > 0 ? discountedSubtotal + packingCharges + taxAmount + platformFee : 0;

    const handleCheckout = () => {
        if (!grandTotal || grandTotal <= 0) {
            notify.error("Your cart is empty or total is 0", { duration: 3000 });
            return;
        }

        if (!slug) {
            notify.error("Restaurant information is unavailable", { duration: 3000 });
            return;
        }

        if (orderType === CART_CONSTANTS.ORDER_TYPES.DINE_IN) {
            const currentUrlParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
            const existingTable =
                currentUrlParams.get("table") ||
                currentUrlParams.get("t") ||
                (typeof window !== "undefined" ? localStorage.getItem("table") || sessionStorage.getItem("table") : "");

            if (!existingTable) {
                setIsTableModalOpen(true);
                return;
            }
            processCheckout(existingTable, "");
        } else if (orderType === CART_CONSTANTS.ORDER_TYPES.DELIVERY) {
            if (!selectedAddress) {
                notify.error("Please select a delivery address", { duration: 3000 });
                return;
            }
            processCheckout("", selectedAddress);
        } else {
            processCheckout("", "");
        }
    };

    const processCheckout = async (tableNum, address) => {
        setIsCheckingOut(true);

        const formattedItems = cartItems.map((cartItem) => {
            const rawItem = cartItem.item || {};
            const menuItemId = rawItem._id || rawItem.id || cartItem.itemId;
            const name = rawItem.name || cartItem.name || "Item";
            const quantity = cartItem.quantity || 1;
            const unitPrice = cartItem.price || rawItem.base_price || rawItem.price || 0;

            let variant = undefined;
            let addons = [];

            if (cartItem.selectedCustomizations && Object.keys(cartItem.selectedCustomizations).length > 0) {
                if (rawItem.variants?.length > 0) {
                    rawItem.variants.forEach((v) => {
                        const vKey = v.name || v.property_name;
                        const selectedVal = cartItem.selectedCustomizations[vKey];
                        if (selectedVal) {
                            const option = v.options?.find((o) => o.name === selectedVal);
                            if (option) {
                                variant = { name: option.name, price: option.price };
                            }
                        }
                    });
                }

                if (rawItem.addonGroups?.length > 0 && globalAddonGroups.length > 0) {
                    rawItem.addonGroups.forEach((itemGroupId) => {
                        const group = globalAddonGroups.find(
                            (g) => String(g._id || g) === String(itemGroupId._id || itemGroupId)
                        );
                        if (group && group.name) {
                            const selectedNames = cartItem.selectedCustomizations[group.name] || [];
                            if (Array.isArray(selectedNames) && selectedNames.length > 0) {
                                group.items?.forEach((addon) => {
                                    if (selectedNames.includes(addon.name)) {
                                        addons.push({
                                            name: addon.name,
                                            price: addon.price || 0,
                                            isFree: addon.isFree || false,
                                            dietaryType: addon.dietaryType || "veg",
                                        });
                                    }
                                });
                            }
                        }
                    });
                }
            }

            return {
                menuItem: menuItemId,
                name,
                quantity,
                unitPrice,
                ...(variant && { variant }),
                ...(addons.length > 0 && { addons }),
                ...(cartItem.instructions && { specialInstructions: cartItem.instructions }),
            };
        });

        const currentUrlParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
        const fallbackTable =
            currentUrlParams.get("table") ||
            currentUrlParams.get("t") ||
            (typeof window !== "undefined" ? localStorage.getItem("table") || sessionStorage.getItem("table") : "");

        const finalTable = tableNum || fallbackTable || (orderType === CART_CONSTANTS.ORDER_TYPES.DINE_IN ? "1" : null);

        const orderPayload = {
            orderType: orderType,
            ...(finalTable && { table: finalTable }),
            ...(address && { deliveryAddress: address }),
            customerInfo: {
                name: user?.name || "Guest Customer",
                phone: user?.phone || user?.phoneNumber || "",
                email: user?.email || "",
            },
            items: formattedItems,
            subtotal,
            tax: gst,
            discount,
            totalAmount: grandTotal,
            paymentMethod: paymentMethod === CART_CONSTANTS.PAYMENT_METHODS.CASH ? "CASH" : "ONLINE",
            paymentStatus: paymentMethod === CART_CONSTANTS.PAYMENT_METHODS.CASH ? "PENDING" : "PAID",
        };

        if (paymentMethod === CART_CONSTANTS.PAYMENT_METHODS.CASH) {
            try {
                notify.info("Placing your order...", { duration: 2000 });

                const orderResult = await PaymentService.createDirectOrder(slug, orderPayload);
                const createdOrderId =
                    orderResult?._id ||
                    orderResult?.id ||
                    orderResult?.order?._id ||
                    orderResult?.orderNumber ||
                    orderResult?.orderId ||
                    `ORD-${Date.now().toString().slice(-6)}`;

                if (typeof window !== "undefined") {
                    try {
                        const localOrder = {
                            _id: createdOrderId,
                            orderNumber: orderResult?.orderNumber || (createdOrderId.startsWith("ORD-") ? createdOrderId : `ORD-${createdOrderId.slice(-6)}`),
                            orderType: orderPayload.orderType || CART_CONSTANTS.ORDER_TYPES.DINE_IN,
                            status: "PLACED",
                            paymentMethod: "CASH",
                            paymentStatus: "PENDING",
                            totalAmount: grandTotal,
                            items: orderPayload.items || [],
                            ...(orderPayload.table && { table: orderPayload.table }),
                            ...(orderPayload.deliveryAddress && { deliveryAddress: orderPayload.deliveryAddress }),
                            createdAt: new Date().toISOString(),
                        };
                        const key = `recent_orders_${slug}`;
                        const existing = JSON.parse(localStorage.getItem(key) || "[]");
                        const filtered = existing.filter((o) => (o._id || o.orderNumber) !== createdOrderId);
                        localStorage.setItem(key, JSON.stringify([localOrder, ...filtered].slice(0, 40)));
                    } catch (e) {
                        console.warn("Local storage save error:", e);
                    }
                }

                dispatch(clearCart());
                notify.success("Order placed successfully!", { duration: 3500 });
                router.push(`/orders/${createdOrderId}?method=CASH&amount=${grandTotal}`);
            } catch (cashErr) {
                console.error("Cash order error:", cashErr);
                notify.error(cashErr?.response?.data?.message || cashErr?.message || "Failed to place order. Please try again.", { duration: 4000 });
            } finally {
                setIsCheckingOut(false);
            }
            return;
        }

        try {
            const isScriptLoaded = await PaymentService.loadScript();
            if (!isScriptLoaded) {
                notify.error("Could not load payment gateway. Please check your internet connection.", { duration: 4000 });
                setIsCheckingOut(false);
                return;
            }

            const razorpayOrder = await PaymentService.createRazorpayOrder(slug, {
                amount: grandTotal,
                notes: {
                    appliedCoupon: appliedCoupon?.code || "NONE",
                    totalItems: totalQuantity,
                },
            });

            if (!razorpayOrder?.orderId) {
                throw new Error("Failed to initialize payment order");
            }

            const razorpayKey =
                razorpayOrder.key ||
                process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
                process.env.NEXT_PUBLIC_RAZORPAY_API_KEY ||
                "rzp_test_Tco4Gpy2RzkVr9";

            const options = {
                key: razorpayKey,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency || "INR",
                name: restaurant?.name || "Restaurant Order",
                description: `${orderType === CART_CONSTANTS.ORDER_TYPES.DINE_IN ? 'Dine-in' : 'Delivery'} Order (${totalQuantity} items)`,
                image: restaurant?.logo ? getImageUrl(restaurant.logo, true, "thumbnail") : undefined,
                order_id: razorpayOrder.orderId,
                handler: async function (response) {
                    try {
                        notify.info("Verifying payment...", { duration: 2500 });

                        const onlineOrderPayload = {
                            ...orderPayload,
                            paymentMethod: "ONLINE",
                            paymentStatus: "PAID",
                        };

                        const verifyResult = await PaymentService.verifyPayment(slug, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            orderData: onlineOrderPayload,
                        });

                        const confirmedOrderId =
                            verifyResult?._id ||
                            verifyResult?.id ||
                            verifyResult?.order?._id ||
                            response.razorpay_order_id;

                        dispatch(clearCart());
                        notify.success("Payment successful! Order placed.", { duration: 3500 });
                        router.push(`/orders/${confirmedOrderId}?paymentId=${response.razorpay_payment_id}&method=ONLINE&amount=${grandTotal}`);
                    } catch (verifyErr) {
                        console.error("Payment verification error:", verifyErr);
                        notify.error("Payment received, but verification encountered an issue. Please notify staff.", { duration: 5000 });
                    } finally {
                        setIsCheckingOut(false);
                    }
                },
                prefill: {
                    name: user?.name || "",
                    email: user?.email || "",
                    contact: user?.phone || user?.phoneNumber || "",
                },
                theme: {
                    color: "#16a34a",
                },
                modal: {
                    ondismiss: function () {
                        setIsCheckingOut(false);
                        notify.info("Payment was cancelled", { duration: 3000 });
                    },
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.on("payment.failed", function (failResponse) {
                setIsCheckingOut(false);
                notify.error(failResponse?.error?.description || "Payment failed. Please try again.", { duration: 4000 });
            });
            rzp.open();
        } catch (err) {
            console.error("Checkout initialization error:", err);
            notify.error(err?.response?.data?.message || err?.message || "Failed to start checkout. Please try again.", { duration: 4000 });
            setIsCheckingOut(false);
        }
    };

    return {
        cartItems,
        appliedCoupon,
        setAppliedCoupon,
        paymentMethod,
        setPaymentMethod,
        isCheckingOut,
        orderType,
        setOrderType,
        isTableModalOpen,
        setIsTableModalOpen,
        selectedAddress,
        setSelectedAddress,
        subtotal,
        totalQuantity,
        discount,
        packingCharges,
        platformFee,
        taxAmount,
        taxRate,
        grandTotal,
        handleCheckout,
        processCheckout,
        isCartLoaded,
    };
}
