"use client";
import React from "react";
import { ReceiptText, Info, Sparkles } from "lucide-react";

export function BillSummary({
    subtotal = 0,
    discount = 0,
    packingCharges = 0,
    platformFee = 0,
    taxAmount = 0,
    taxRate = 0,
}) {
    const discountedSubtotal = Math.max(0, subtotal - discount);
    const grandTotal = subtotal > 0 ? discountedSubtotal + packingCharges + taxAmount + platformFee : 0;
    const totalSavings = discount;

    return (
        <div className="rounded-2xl bg-white dark:bg-zinc-900 p-4 sm:p-5 border border-gray-150/70 dark:border-zinc-800 shadow-xs">
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

                {/* Packing Charges */}
                {packingCharges > 0 && (
                    <div className="flex items-center justify-between">
                        <span className="text-neutral-500 dark:text-neutral-400">
                            Packing Charges
                        </span>
                        <span className="font-medium text-neutral-800 dark:text-zinc-100">
                            ₹{packingCharges}
                        </span>
                    </div>
                )}

                {/* Platform Fee */}
                {platformFee > 0 && (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <span className="text-neutral-500 dark:text-neutral-400">
                                Platform Fee
                            </span>
                            <Info size={12} className="text-neutral-400" />
                        </div>
                        <span className="font-medium text-neutral-800 dark:text-zinc-100">
                            ₹{platformFee}
                        </span>
                    </div>
                )}

                {/* Taxes & Fees */}
                {taxAmount > 0 && (
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-0.5">
                            <span className="text-neutral-500 dark:text-neutral-400">
                                Taxes & Fees
                            </span>
                            <span className="text-[10px] text-neutral-400 dark:text-neutral-500">
                                Includes {taxRate}% GST
                            </span>
                        </div>
                        <span className="font-medium text-neutral-800 dark:text-zinc-100 mt-0.5">
                            ₹{taxAmount}
                        </span>
                    </div>
                )}
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
