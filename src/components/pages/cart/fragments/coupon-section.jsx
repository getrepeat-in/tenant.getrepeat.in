"use client";
import React, { useState } from "react";
import { Tag, CheckCircle2, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CouponSection({
    appliedCoupon,
    setAppliedCoupon,
    subtotal = 0,
}) {
    const [couponCode, setCouponCode] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    // Demo coupons or common promo codes
    const availableCoupons = [
        { code: "REPEAT50", discountPercent: 10, minOrder: 199, maxDiscount: 50, label: "10% OFF up to ₹50" },
        { code: "FEAST20", discountPercent: 20, minOrder: 499, maxDiscount: 100, label: "20% OFF above ₹499" },
    ];

    const handleApply = (codeToApply) => {
        setErrorMsg("");
        const code = (codeToApply || couponCode).trim().toUpperCase();

        if (!code) {
            setErrorMsg("Please enter a coupon code");
            return;
        }

        const found = availableCoupons.find((c) => c.code === code);
        if (!found) {
            // Support generic discount for custom codes
            if (code.startsWith("SAVE")) {
                const discountAmount = Math.min(Math.round(subtotal * 0.15), 100);
                setAppliedCoupon({
                    code,
                    discount: discountAmount,
                    label: "15% Promotional Discount",
                });
                setCouponCode("");
                return;
            }
            setErrorMsg("Invalid coupon code. Try REPEAT50");
            return;
        }

        if (subtotal < found.minOrder) {
            setErrorMsg(`Min order of ₹${found.minOrder} required for ${found.code}`);
            return;
        }

        const calculated = Math.min(
            Math.round((subtotal * found.discountPercent) / 100),
            found.maxDiscount
        );

        setAppliedCoupon({
            code: found.code,
            discount: calculated,
            label: found.label,
        });
        setCouponCode("");
    };

    const handleRemove = () => {
        setAppliedCoupon(null);
        setErrorMsg("");
    };

    return (
        <div className="rounded-2xl bg-white dark:bg-zinc-900 p-4 border border-gray-150/70 dark:border-zinc-800 shadow-xs">
            {appliedCoupon ? (
                /* Applied Coupon State */
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 animate-in zoom-in-95 duration-200">
                    <div className="flex items-center gap-2.5">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500 text-white shadow-2xs">
                            <CheckCircle2 size={16} strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 tracking-wide uppercase">
                                    {appliedCoupon.code}
                                </span>
                                <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-emerald-200/70 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                                    APPLIED
                                </span>
                            </div>
                            <span className="text-[11px] font-normal text-emerald-700 dark:text-emerald-400 mt-0.5">
                                You save ₹{appliedCoupon.discount} with this coupon!
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleRemove}
                        className="p-1.5 rounded-lg text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
                        title="Remove Coupon"
                    >
                        <X size={15} />
                    </button>
                </div>
            ) : (
                /* Apply Coupon Input & Suggestions */
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Tag size={16} className="text-primary" />
                        <h3 className="text-xs sm:text-sm font-medium text-neutral-800 dark:text-zinc-100">
                            Offers & Coupons
                        </h3>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={couponCode}
                                onChange={(e) => {
                                    setCouponCode(e.target.value.toUpperCase());
                                    setErrorMsg("");
                                }}
                                placeholder="Enter coupon code (e.g. REPEAT50)"
                                className="w-full rounded-xl bg-neutral-50 dark:bg-zinc-850 px-3.5 py-2.5 text-xs sm:text-sm font-medium tracking-wide uppercase text-neutral-900 dark:text-zinc-100 placeholder:normal-case placeholder:font-normal placeholder:tracking-normal placeholder:text-neutral-400 border border-gray-150/70 dark:border-zinc-750 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>

                        <Button
                            type="button"
                            disabled={!couponCode.trim()}
                            onClick={() => handleApply()}
                            className="px-4 py-2.5 h-auto rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-xs shrink-0"
                        >
                            Apply
                        </Button>
                    </div>

                    {errorMsg && (
                        <p className="text-[11px] font-medium text-rose-500 animate-in fade-in">
                            {errorMsg}
                        </p>
                    )}

                    {/* Quick suggestion pills */}
                    <div className="flex items-center gap-2 pt-1 overflow-x-auto no-scrollbar">
                        <Sparkles size={13} className="text-amber-500 shrink-0" />
                        {availableCoupons.map((c) => (
                            <button
                                key={c.code}
                                type="button"
                                onClick={() => handleApply(c.code)}
                                className="shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-zinc-800 text-neutral-700 dark:text-neutral-300 border border-dashed border-gray-200 dark:border-zinc-700 hover:border-primary hover:text-primary transition-colors cursor-pointer"
                            >
                                {c.code} <span className="opacity-60 font-normal">({c.label})</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default CouponSection;
