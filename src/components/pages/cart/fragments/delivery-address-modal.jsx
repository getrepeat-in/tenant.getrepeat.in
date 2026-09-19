import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function DeliveryAddressModal({ open, onOpenChange, onConfirm }) {
    const [address, setAddress] = useState("");

    const handleConfirm = () => {
        if (!address.trim()) return;
        onConfirm(address.trim());
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="bottom" className="rounded-t-3xl pb-10 pt-6 px-6">
                <SheetHeader className="px-0 pb-4">
                    <SheetTitle className="text-lg">Delivery Address</SheetTitle>
                    <SheetDescription>
                        Where should we deliver your food?
                    </SheetDescription>
                </SheetHeader>
                
                <div className="flex flex-col gap-4 py-4">
                    <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="e.g. 123 Main St, Apt 4B, City"
                        className="w-full h-24 p-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-neutral-50 dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                        autoFocus
                    />
                </div>

                <SheetFooter className="px-0 pt-2">
                    <Button
                        type="button"
                        onClick={handleConfirm}
                        disabled={!address.trim()}
                        className="w-full h-12 rounded-xl text-sm font-semibold"
                    >
                        Confirm & Checkout
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
