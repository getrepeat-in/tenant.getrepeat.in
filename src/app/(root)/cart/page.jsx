"use client";
import React, { Suspense, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { CartHeader } from "@/components/pages/cart/fragments/cart-header";
import { CartItem } from "@/components/pages/cart/fragments/cart-item";
import { EmptyCart } from "@/components/pages/cart/fragments/empty-cart";
import { CookingInstructions } from "@/components/pages/cart/fragments/cooking-instructions";
import { CouponSection } from "@/components/pages/cart/fragments/coupon-section";
import { BillSummary } from "@/components/pages/cart/fragments/bill-summary";
import { CheckoutFooter } from "@/components/pages/cart/fragments/checkout-footer";
import { OrderTypeSelector } from "@/components/pages/cart/fragments/order-type-selector";
import { TableNumberModal } from "@/components/pages/cart/fragments/table-number-modal";
import { AddressManager } from "@/components/global/address";
import { useRestaurant } from "@/hooks/useRestaurant";
import { useUser } from "@/hooks/useUser";
import useNotification from "@/hooks/useNotification";
import { clearCart } from "@/store/slices/cartSlice";
import PaymentService from "@/services/frontend/payment";
import { getImageUrl } from "@/lib/utils";

export default function CartPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { slug, restaurant } = useRestaurant();
    const { user } = useUser();
    const notify = useNotification();
    const cartItems = useSelector((state) => state.cart.items || []);

    const [instructions, setInstructions] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("ONLINE");
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [orderType, setOrderType] = useState("dine-in");
    
    // Modal states
    const [isTableModalOpen, setIsTableModalOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    
    // Calculate totals
    const subtotal = cartItems.reduce((acc, curr) => {
        const itemPrice = curr.price || curr.item?.base_price || curr.item?.price || 0;
        return acc + itemPrice * curr.quantity;
    }, 0);

    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const discount = appliedCoupon?.discount || 0;
    const discountedSubtotal = Math.max(0, subtotal - discount);
    const gst = Math.round(discountedSubtotal * 0.05);
    const platformFee = 5;
    const grandTotal = subtotal > 0 ? discountedSubtotal + gst + platformFee : 0;

    const handleCheckout = () => {
        if (!grandTotal || grandTotal <= 0) {
            notify.error("Your cart is empty or total is 0", { duration: 3000 });
            return;
        }

        if (!slug) {
            notify.error("Restaurant information is unavailable", { duration: 3000 });
            return;
        }

        if (orderType === "dine-in") {
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
        } else if (orderType === "delivery") {
            if (!selectedAddress) {
                notify.error("Please select a delivery address", { duration: 3000 });
                return;
            }
            const addrStr = `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state ? selectedAddress.state + " " : ""}${selectedAddress.zipCode}`;
            processCheckout("", addrStr);
        } else {
            processCheckout("", "");
        }
    };

    const processCheckout = async (tableNum, address) => {
        setIsCheckingOut(true);

        // Format items according to backend order API contract
        const formattedItems = cartItems.map((cartItem) => {
            const rawItem = cartItem.item || {};
            const menuItemId = rawItem._id || rawItem.id || cartItem.itemId;
            const name = rawItem.name || cartItem.name || "Item";
            const quantity = cartItem.quantity || 1;
            const unitPrice = cartItem.price || rawItem.base_price || rawItem.price || 0;

            let variant = undefined;
            if (cartItem.selectedCustomizations?.variant) {
                variant = {
                    name: cartItem.selectedCustomizations.variant.name || "Regular",
                    price: cartItem.selectedCustomizations.variant.price || unitPrice,
                };
            }

            let addons = [];
            if (Array.isArray(cartItem.selectedCustomizations?.addons)) {
                addons = cartItem.selectedCustomizations.addons.map((addon) => ({
                    name: addon.name || addon.title,
                    price: addon.price || 0,
                }));
            } else if (
                cartItem.selectedCustomizations?.addons &&
                typeof cartItem.selectedCustomizations.addons === "object"
            ) {
                addons = Object.values(cartItem.selectedCustomizations.addons)
                    .flat()
                    .map((addon) => ({
                        name: addon.name || addon.title,
                        price: addon.price || 0,
                    }));
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

        // Retrieve table QR code/ID from query or storage if passed
        const currentUrlParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
        const fallbackTable =
            currentUrlParams.get("table") ||
            currentUrlParams.get("t") ||
            (typeof window !== "undefined" ? localStorage.getItem("table") || sessionStorage.getItem("table") : "");

        const finalTable = tableNum || fallbackTable || (orderType === "dine-in" ? "1" : null);

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
            paymentMethod: paymentMethod === "CASH" ? "cash" : "online",
            paymentStatus: paymentMethod === "CASH" ? "pending" : "completed",
            specialInstructions: instructions || "",
        };

        // CASE 1: Cash on Delivery / Pay at Counter
        if (paymentMethod === "CASH") {
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

                // Save to local storage for instant orders history access
                if (typeof window !== "undefined") {
                    try {
                        const localOrder = {
                            _id: createdOrderId,
                            orderNumber: orderResult?.orderNumber || (createdOrderId.startsWith("ORD-") ? createdOrderId : `ORD-${createdOrderId.slice(-6)}`),
                            orderType: orderPayload.orderType || "dine-in",
                            status: "PLACED",
                            paymentMethod: "cash",
                            paymentStatus: "pending",
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

                // Clear cart and show notification
                dispatch(clearCart());
                notify.success("Order placed! Pay in cash at counter.", { duration: 3500 });

                // Redirect to /order
                router.push(
                    `/order?orderId=${createdOrderId}&method=CASH&amount=${grandTotal}`
                );
            } catch (cashErr) {
                console.error("Cash order error:", cashErr);
                notify.error(
                    cashErr?.response?.data?.message || cashErr?.message || "Failed to place order. Please try again.",
                    { duration: 4000 }
                );
            } finally {
                setIsCheckingOut(false);
            }
            return;
        }

        // CASE 2: Online Payment via Razorpay
        try {
            // 1. Load Razorpay Checkout Script
            const isScriptLoaded = await PaymentService.loadScript();
            if (!isScriptLoaded) {
                notify.error("Could not load payment gateway. Please check your internet connection.", { duration: 4000 });
                setIsCheckingOut(false);
                return;
            }

            // 2. Create Razorpay Order on server
            const razorpayOrder = await PaymentService.createRazorpayOrder(slug, {
                amount: grandTotal,
                notes: {
                    instructions,
                    appliedCoupon: appliedCoupon?.code || "NONE",
                    totalItems: totalQuantity,
                },
            });

            if (!razorpayOrder?.orderId) {
                throw new Error("Failed to initialize payment order");
            }

            // 3. Configure Razorpay Options
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
                description: `Dine-in Order (${totalQuantity} items)`,
                image: restaurant?.logo ? getImageUrl(restaurant.logo, true, "thumbnail") : undefined,
                order_id: razorpayOrder.orderId,
                handler: async function (response) {
                    try {
                        notify.info("Verifying payment...", { duration: 2500 });

                        // 4. Verify payment signature on backend and place order
                        const onlineOrderPayload = {
                            ...orderPayload,
                            paymentMethod: "online",
                            paymentStatus: "completed",
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

                        // 5. Clear cart and show success toast
                        dispatch(clearCart());
                        notify.success("Payment successful! Order placed.", { duration: 3500 });

                        // 6. Navigate to /order confirmation page
                        router.push(
                            `/order?orderId=${confirmedOrderId}&paymentId=${response.razorpay_payment_id}&method=ONLINE&amount=${grandTotal}`
                        );
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
                notify.error(
                    failResponse?.error?.description || "Payment failed. Please try again.",
                    { duration: 4000 }
                );
            });

            rzp.open();
        } catch (err) {
            console.error("Checkout initialization error:", err);
            notify.error(
                err?.response?.data?.message || err?.message || "Failed to start checkout. Please try again.",
                { duration: 4000 }
            );
            setIsCheckingOut(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 pb-[130px] select-none">
            {/* Top Navigation */}
            <CartHeader itemCount={cartItems.length} />

            <main className="mx-auto max-w-screen-md px-4 pt-4 sm:pt-6">
                {cartItems.length === 0 ? (
                    <EmptyCart />
                ) : (
                    <div className="flex flex-col gap-4 sm:gap-5 animate-in fade-in slide-in-from-bottom-3 duration-300">
                        {/* Order Type Selector */}
                        <OrderTypeSelector 
                            orderType={orderType} 
                            setOrderType={setOrderType} 
                        />

                        {orderType === "delivery" && (
                            <div className="bg-white dark:bg-zinc-900 border border-gray-150/80 dark:border-zinc-800 rounded-xl p-4 sm:p-5 shadow-xs">
                                <AddressManager 
                                    onSelectAddress={setSelectedAddress} 
                                    selectedAddressId={selectedAddress?._id}
                                />
                            </div>
                        )}

                        {/* Items Card Section */}
                        <div className="flex flex-col gap-2.5">
                            <div className="flex items-center justify-between px-1">
                                <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                                    Order Items ({totalQuantity})
                                </h2>

                                <Link
                                    href="/menu"
                                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                                >
                                    <Plus size={13} strokeWidth={2} />
                                    <span>Add More Items</span>
                                </Link>
                            </div>

                            <div className="flex flex-col gap-2.5">
                                {cartItems.map((cartItem) => (
                                    <CartItem
                                        key={cartItem.cartItemId || cartItem.item?._id}
                                        cartItem={cartItem}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Cooking Instructions */}
                        <CookingInstructions
                            instructions={instructions}
                            setInstructions={setInstructions}
                        />

                        {/* Offers & Coupons */}
                        <CouponSection
                            appliedCoupon={appliedCoupon}
                            setAppliedCoupon={setAppliedCoupon}
                            subtotal={subtotal}
                        />

                        {/* Bill Breakdown Summary */}
                        <BillSummary
                            subtotal={subtotal}
                            discount={discount}
                            platformFee={platformFee}
                        />
                    </div>
                )}
            </main>

            {/* Sticky Checkout Bar */}
            {cartItems.length > 0 && (
                <CheckoutFooter
                    grandTotal={grandTotal}
                    itemCount={totalQuantity}
                    paymentMethod={paymentMethod}
                    onSelectPaymentMethod={setPaymentMethod}
                    onCheckout={handleCheckout}
                    isLoading={isCheckingOut}
                />
            )}

            <TableNumberModal 
                open={isTableModalOpen} 
                onOpenChange={setIsTableModalOpen} 
                onConfirm={(table) => {
                    setIsTableModalOpen(false);
                    processCheckout(table, "");
                }} 
            />
        </div>
    );
}
