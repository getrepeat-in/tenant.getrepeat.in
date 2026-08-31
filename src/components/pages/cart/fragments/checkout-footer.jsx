"use client";
import { ArrowRight } from "lucide-react";

export function CheckoutFooter({ grandTotal }) {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 p-4 pb-6 flex justify-center animate-in slide-in-from-bottom-5 duration-300">
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col w-[50%] pl-2">
                    <span className="text-[12px] font-bold tracking-widest text-gray-400 uppercase">To Pay</span>
                    <span className="text-[20px] font-extrabold text-gray-900 leading-none mt-1">₹{grandTotal}</span>
                </div>

                <button
                    type="button"
                    className="flex h-12 w-[50%] flex-1 items-center justify-center gap-2 rounded-md bg-primary text-[16px] font-bold tracking-wide text-primary-foreground transition-all duration-200 hover:bg-primary/90 active:scale-[0.98] focus:outline-none"
                >
                    <span>Proceed to Pay</span>
                    <ArrowRight size={18} strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
}