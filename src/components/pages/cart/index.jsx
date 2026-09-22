"use client";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { Store, AlertCircle } from "lucide-react";
import useNotification from "@/hooks/useNotification";
import { useRestaurant } from "@/hooks/useRestaurant";
import { AddressManager } from "@/components/global/common/address";
import { EmptyState } from "@/components/global/common/empty-state";
import { CartItem } from "@/components/pages/cart/fragments/cart-item";
import { EmptyCart } from "@/components/pages/cart/fragments/empty-cart";
import { useCartPage } from "@/components/pages/cart/helpers/useCartPage";
import { useWebsiteConfiguration } from "@/hooks/useWebsiteConfiguration";
import { CART_CONSTANTS } from "@/components/pages/cart/helpers/constants";
import { CartHeader } from "@/components/pages/cart/fragments/cart-header";
import { BillSummary } from "@/components/pages/cart/fragments/bill-summary";
import { CartSkeleton } from "@/components/pages/cart/fragments/cart-skeleton";
import { CouponSection } from "@/components/pages/cart/fragments/coupon-section";
import { CheckoutFooter } from "@/components/pages/cart/fragments/checkout-footer";
import { TableNumberModal } from "@/components/pages/cart/fragments/table-number-modal";
import { OrderTypeSelector } from "@/components/pages/cart/fragments/order-type-selector";

export default function CartPage() {
    const { slug, restaurant } = useRestaurant();
    const { user } = useUser();
    const notify = useNotification();
    const { configuration, isLoading: isConfigLoading } = useWebsiteConfiguration();

    const {
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
    } = useCartPage({ slug, restaurant, user, notify, configuration });

    const acceptedTypes = configuration?.ordering?.acceptedTypes || [];
    const paymentMethods = configuration?.ordering?.paymentMethods || [];
    const isOrderingDisabled = acceptedTypes.length === 0 || paymentMethods.length === 0;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 pb-[130px] select-none">
            <CartHeader itemCount={cartItems.length} />

            <main className="mx-auto max-w-screen-md px-4 pt-4 sm:pt-6">
                {(!isCartLoaded || isConfigLoading) ? (
                    <CartSkeleton />
                ) : isOrderingDisabled ? (
                    <EmptyState
                        icon={Store}
                        badgeIcon={AlertCircle}
                        badgeText="Temporarily Unavailable"
                        title="Ordering is currently disabled"
                        description="We are currently not accepting online orders. Please check back later."
                        buttonText="Return to Menu"
                    />
                ) : cartItems.length === 0 ? (
                    <EmptyCart />
                ) : (
                    <div className="flex flex-col gap-4 sm:gap-5 animate-in fade-in slide-in-from-bottom-3 duration-300">
                        <OrderTypeSelector
                            orderType={orderType}
                            setOrderType={setOrderType}
                            acceptedTypes={configuration?.ordering?.acceptedTypes}
                        />

                        {orderType === CART_CONSTANTS.ORDER_TYPES.DELIVERY && (
                            <div className="bg-white dark:bg-zinc-900 border border-gray-150/80 dark:border-zinc-800 rounded-xl p-4 sm:p-5 shadow-xs">
                                <AddressManager
                                    onSelectAddress={setSelectedAddress}
                                    selectedAddressId={selectedAddress?._id}
                                />
                            </div>
                        )}

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

                        <CouponSection
                            appliedCoupon={appliedCoupon}
                            setAppliedCoupon={setAppliedCoupon}
                            subtotal={subtotal}
                        />

                        <BillSummary
                            subtotal={subtotal}
                            discount={discount}
                            packingCharges={packingCharges}
                            platformFee={platformFee}
                            taxAmount={taxAmount}
                            taxRate={taxRate}
                        />
                    </div>
                )}
            </main>

            {cartItems.length > 0 && (
                <CheckoutFooter
                    grandTotal={grandTotal}
                    itemCount={totalQuantity}
                    paymentMethod={paymentMethod}
                    onSelectPaymentMethod={setPaymentMethod}
                    onCheckout={handleCheckout}
                    isLoading={isCheckingOut}
                    allowedPaymentMethods={configuration?.ordering?.paymentMethods}
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
