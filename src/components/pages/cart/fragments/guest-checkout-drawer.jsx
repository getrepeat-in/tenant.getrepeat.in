"use client";
import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/userSlice";
import useNotification from "@/hooks/useNotification";
import { AuthService } from "@/services/frontend/auth";
import { AddressManager } from "@/components/global/common/address";
import { CART_CONSTANTS } from "@/components/pages/cart/helpers/constants";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

export function GuestCheckoutDrawer({
    open,
    onOpenChange,
    onLoginSuccess,
    orderType,
    selectedAddressId,
    onSelectAddress
}) {
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
                        <SheetHeader className="px-0 pb-4 text-left">
                            <SheetTitle>Guest Details</SheetTitle>
                            <SheetDescription>
                                Please provide your name and phone number to proceed with your order.
                            </SheetDescription>
                        </SheetHeader>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="9876543210"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-4 flex items-center justify-center py-2.5 px-4 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 focus:outline-none disabled:opacity-70"
                            >
                                {loading ? <Loader2 size={18} className="animate-spin" /> : "Continue"}
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
