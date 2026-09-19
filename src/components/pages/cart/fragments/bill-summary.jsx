"use client";
import React from "react";
import { ReceiptText, Info, Sparkles } from "lucide-react";

export function BillSummary({
    subtotal = 0,
    discount = 0,
    gstRate = 0.05,
    platformFee = 5,
}) {
    const discountedSubtotal = Math.max(0, subtotal - discount);
    const gst = Math.round(discountedSubtotal * gstRate);
    const grandTotal = subtotal > 0 ? discountedSubtotal + gst + platformFee : 0;
    const totalSavings = discount;

    return (
        <div className="rounded-2xl bg-white dark:bg-zinc-900 p-4 sm:p-5 border border-gray-150/70 dark:border-zinc-800 shadow-xs">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                    <ReceiptText size={17} className="text-primary" />
                    <h3 className="text-sm font-semibold tracking-tight text-neutral-800 dark:text-zinc-100">
                        Bill Summary
                    </h3>
                </div>

                {totalSavings > 0 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                        <Sparkles size={11} />
                        Saved ₹{totalSavings}
                    </span>
                )}
            </div>

            {/* Line Items */}
            <div className="flex flex-col gap-2.5 py-3.5 border-b border-dashed border-gray-200 dark:border-zinc-800 text-xs sm:text-sm">
                {/* Item Total */}
                <div className="flex items-center justify-between">
                    <span className="text-neutral-500 dark:text-neutral-400">
                        Item Subtotal
                    </span>
                    <span className="font-medium text-neutral-800 dark:text-zinc-100">
                        ₹{subtotal}
                    </span>
                </div>

                {/* Discount */}
                {discount > 0 && (
                    <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                        <span>Coupon Discount</span>
                        <span>-₹{discount}</span>
                    </div>
                )}

                {/* Platform Fee */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <span className="text-neutral-500 dark:text-neutral-400">
                            Platform Fee
                        </span>
                        <div
                            title="Supports continuous improvements of the platform"
                            className="flex size-3.5 items-center justify-center rounded-full bg-neutral-100 dark:bg-zinc-800 text-[9px] font-normal text-neutral-400 cursor-help"
                        >
                            <Info size={10} />
                        </div>
                    </div>
                    <span className="font-medium text-neutral-800 dark:text-zinc-100">
                        ₹{platformFee}
                    </span>
                </div>

                {/* Taxes (GST) */}
                <div className="flex items-center justify-between">
                    <span className="text-neutral-500 dark:text-neutral-400">
                        GST & Restaurant Taxes (5%)
                    </span>
                    <span className="font-medium text-neutral-800 dark:text-zinc-100">
                        ₹{gst}
                    </span>
                </div>
            </div>

            {/* Grand Total */}
            <div className="flex items-center justify-between pt-3.5">
                <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-semibold text-neutral-800 dark:text-zinc-100 uppercase tracking-wide">
                        To Pay
                    </span>
                    <span className="text-[11px] font-normal text-neutral-400 dark:text-neutral-500">
                        Inclusive of all taxes & charges
                    </span>
                </div>

                <span className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-zinc-100 tracking-tight">
                    ₹{grandTotal}
                </span>
            </div>
        </div>
    );
}

export default BillSummary;
