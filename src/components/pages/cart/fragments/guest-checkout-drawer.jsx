"use client";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/userSlice";
import { Loader2, User, Phone } from "lucide-react";
import useNotification from "@/hooks/useNotification";
import { AuthService } from "@/services/frontend/auth";
import { AddressManager } from "@/components/global/common/address";
import { CART_CONSTANTS } from "@/components/pages/cart/helpers/constants";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

export function GuestCheckoutDrawer({ open, onOpenChange, onLoginSuccess, orderType, selectedAddressId, onSelectAddress }) {
    const dispatch = useDispatch();
    const notify = useNotification();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const addressManagerRef = React.useRef(null);

    React.useEffect(() => {
        if (!open) {
            setTimeout(() => setStep(1), 300);
        }
    }, [open]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !phone) {
            notify.error("Please enter both name and phone number.");
            return;
        }

        try {
            setLoading(true);
            const response = await AuthService.guestLogin({ name, phone });
            if (response.success && response.data?.token) {
                const meResponse = await AuthService.me();
                if (meResponse.success) {
                    dispatch(setUser(meResponse.data));
                    if (orderType === CART_CONSTANTS.ORDER_TYPES.DELIVERY) {
                        setStep(2);
                    } else {
                        onLoginSuccess();
                    }
                }
            } else {
                notify.error(response.message || "Guest login failed");
            }
        } catch (error) {
            notify.error(error.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="bottom" className="rounded-t-2xl px-4 pb-8 pt-4">
                {step === 1 ? (
                    <>
                        <SheetHeader className="px-0 pb-5 text-left">
                            <SheetTitle className="flex items-center gap-2.5 text-xl">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <User size={18} strokeWidth={2.5} />
                                </div>
                                Guest Details
                            </SheetTitle>
                            <SheetDescription className="text-sm text-neutral-500 dark:text-neutral-400 mt-1.5">
                                Please provide your name and phone number to proceed with your order.
                            </SheetDescription>
                        </SheetHeader>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2.5">
                                <label className="text-[13px] font-semibold text-neutral-700 dark:text-zinc-300 ml-1">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-neutral-400">
                                        <User size={16} strokeWidth={2.25} />
                                    </div>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g. John Doe"
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3.5 pl-10 pr-4 text-sm text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white dark:focus:bg-zinc-900"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2.5">
                                <label className="text-[13px] font-semibold text-neutral-700 dark:text-zinc-300 ml-1">Phone Number</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-neutral-400">
                                        <Phone size={16} strokeWidth={2.25} />
                                    </div>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="e.g. 9876543210"
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3.5 pl-10 pr-4 text-sm text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white dark:focus:bg-zinc-900"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-2 flex items-center justify-center py-3.5 px-4 rounded-xl bg-primary text-white font-semibold text-[15px] shadow-[0_4px_12px_rgba(var(--primary-rgb),0.25)] hover:bg-primary/95 hover:shadow-[0_4px_16px_rgba(var(--primary-rgb),0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all focus:outline-none disabled:opacity-70 disabled:hover:translate-y-0"
                            >
                                {loading ? <Loader2 size={18} className="animate-spin" /> : "Continue to Checkout"}
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        <SheetHeader className="px-0 pb-2 text-left">
                            <SheetTitle>Delivery Address</SheetTitle>
                        </SheetHeader>
                        <div className="max-h-[60vh] overflow-y-auto pb-4 custom-scrollbar">
                            <AddressManager
                                ref={addressManagerRef}
                                selectedAddressId={selectedAddressId}
                                onSelectAddress={onSelectAddress}
                                onAddressesLoaded={(addrs) => {
                                    if (addrs.length === 0) {
                                        addressManagerRef.current?.openForm();
                                    }
                                }}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                if (!selectedAddressId) {
                                    notify.error("Please select a delivery address.");
                                    return;
                                }
                                onLoginSuccess();
                            }}
                            className="w-full mt-2 flex items-center justify-center py-2.5 px-4 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 focus:outline-none"
                        >
                            Place Order
                        </button>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}
