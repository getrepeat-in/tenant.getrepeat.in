"use client";

export function BillSummary({ subtotal }) {
    const gst = Math.round(subtotal * 0.05); 
    const platformFee = 5;
    const grandTotal = subtotal + gst + platformFee;

    return (
        <div className="flex flex-col gap-4 rounded-xl bg-white p-5 border border-gray-200">
            <h3 className="text-[16px] font-bold tracking-tight text-gray-900">
                Bill Details
            </h3>

            <div className="flex flex-col gap-3 pb-4 border-b border-gray-100 border-dashed">
                <div className="flex items-center justify-between text-[14px]">
                    <span className="font-medium text-gray-600">Item Total</span>
                    <span className="font-semibold text-gray-900">₹{subtotal}</span>
                </div>
                
                <div className="flex items-center justify-between text-[14px]">
                    <div className="flex items-center gap-1.5">
                        <span className="font-medium text-gray-600">Platform Fee</span>
                        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-gray-100 text-[10px] font-bold text-gray-500">i</div>
                    </div>
                    <span className="font-semibold text-gray-900">₹{platformFee}</span>
                </div>

                <div className="flex items-center justify-between text-[14px]">
                    <span className="font-medium text-gray-600">Taxes (GST)</span>
                    <span className="font-semibold text-gray-900">₹{gst}</span>
                </div>
            </div>

            <div className="flex items-center justify-between pt-1">
                <span className="text-[16px] font-bold text-gray-900">To Pay</span>
                <span className="text-[18px] font-extrabold text-gray-900">₹{grandTotal}</span>
            </div>
        </div>
    );
}
