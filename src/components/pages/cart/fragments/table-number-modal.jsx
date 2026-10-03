import { cn } from "@/lib/utils";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRestaurant } from "@/hooks/useRestaurant";
import Button from "@/components/global/common/Button";
import { TableService } from "@/services/frontend/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";

export function TableNumberModal({ open, onOpenChange, onConfirm }) {
    const [tableNumber, setTableNumber] = useState("");
    const { slug } = useRestaurant();

    const { data: tableData, isPending } = useQuery({
        queryKey: ["restaurant-tables", slug],
        queryFn: () => TableService.getAll(slug),
        enabled: open && !!slug,
    });

    const tables = tableData?.data?.tables || [];

    useEffect(() => {
        if (!open) {
            setTableNumber("");
        }
    }, [open]);

    const handleConfirm = () => {
        if (!tableNumber.trim()) return;
        onConfirm(tableNumber.trim());
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="bottom" className="rounded-t-3xl pb-6 pt-3 px-6 max-h-[85vh] overflow-y-auto">
                <SheetHeader className="px-0 pb-4">
                    <SheetTitle className="text-lg">Dine-in Table</SheetTitle>
                    <SheetDescription className="text-gray-500 mt-1.5">
                        {tables.length > 0
                            ? "Please select your table to proceed with the order."
                            : "No tables available at the moment."}
                    </SheetDescription>
                </SheetHeader>

                <div className="flex flex-col gap-4 py-2 min-h-[120px]">
                    {isPending ? (
                        <div className="flex items-center justify-center py-10">
                            <Loader2 className="w-8 h-8 animate-spin text-primary/80" />
                        </div>
                    ) : tables.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {tables.map((table) => {
                                const tValue = table.tableNumber || table.label || table._id;
                                const isSelected = tableNumber === String(tValue);
                                const isOccupied = table.status === "occupied" || table.status === "reserved";

                                return (
                                    <button
                                        key={table._id || tValue}
                                        type="button"
                                        disabled={isOccupied}
                                        onClick={() => setTableNumber(String(tValue))}
                                        className={cn(
                                            "relative flex flex-col items-center justify-center px-2 py-4 rounded-2xl transition-all duration-300 min-h-[60px]",
                                            isSelected
                                                ? "bg-primary text-white shadow-lg shadow-primary/25 scale-[0.97] ring-1 ring-primary/20"
                                                : isOccupied
                                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-100 opacity-60"
                                                    : "bg-white text-gray-700 border border-gray-200 shadow-sm hover:border-primary/30 hover:bg-primary/5 hover:text-primary hover:shadow-md"
                                        )}
                                    >
                                        {isSelected && (
                                            <div className="absolute top-1.5 right-1.5">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-white/90" />
                                            </div>
                                        )}
                                        <span className="text-[14px] font-bold w-full text-center break-words leading-tight px-1 z-10">
                                            {table.label || `T-${table.tableNumber}`}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-3 px-4 text-center bg-gray-50 rounded-2xl border border-gray-100">
                            <span className="text-[28px] mb-2">🍽️</span>
                            <h4 className="text-[15px] font-bold text-gray-900">No Tables Available</h4>
                            <p className="text-[13px] text-gray-500 mt-1">
                                There are currently no dine-in tables configured for this restaurant.
                            </p>
                        </div>
                    )}
                </div>

                <SheetFooter className="px-0 pt-2 pb-2">
                    <Button
                        type="button"
                        onClick={handleConfirm}
                        disabled={!tableNumber.trim()}
                        className="w-full h-12 rounded-xl text-[15px] font-bold shadow-md hover:shadow-lg transition-all"
                    >
                        Confirm & Checkout
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
