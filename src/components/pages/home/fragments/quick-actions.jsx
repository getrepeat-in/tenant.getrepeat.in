"use client";
import { BookOpen, BellRing, Clock, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export const QuickActions = () => {
    const router = useRouter();

    const actions = [
        {
            id: "menu",
            title: "Full Menu",
            subtitle: "Browse all items",
            icon: <BookOpen size={20} className="text-gray-700" />,
            buttonText: "Open",
            onClick: () => router.push("/menu"),
        },
        {
            id: "waiter",
            title: "Call Waiter",
            subtitle: "Need assistance?",
            icon: <BellRing size={20} className="text-gray-700" />,
            buttonText: "Call",
            onClick: () => console.log("Call Waiter"),
        },
        {
            id: "history",
            title: "Order History",
            subtitle: "View past orders",
            icon: <Clock size={20} className="text-gray-700" />,
            buttonText: "View",
            onClick: () => router.push("/orders"),
        },
    ];

    return (
        <div className="w-full px-4 md:px-6 mb-8 mt-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-lg font-black text-gray-900 tracking-tight mb-4 uppercase">
                Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-3">
                {actions.map((action, index) => (
                    <div
                        key={action.id}
                        onClick={action.onClick}
                        className={cn(
                            "flex flex-col gap-3 p-3.5 rounded-2xl cursor-pointer transition-all duration-300 border border-gray-100 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:border-gray-200 hover:shadow-md hover:-translate-y-1 relative overflow-hidden group"
                        )}
                    >
                        <div className="flex items-center gap-3 w-full">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50 border border-gray-100 shadow-sm">
                                {action.icon}
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[14px] font-bold text-gray-900 leading-tight">
                                    {action.title}
                                </span>
                                <span className="text-[10px] font-medium text-gray-500 tracking-wide uppercase">
                                    {action.subtitle}
                                </span>
                            </div>
                        </div>
                        
                        <button className={cn(
                            "mt-2 w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-[12px] font-black tracking-wide uppercase transition-colors shadow-sm",
                            "bg-gray-50 text-gray-800 border border-gray-100 hover:bg-gray-100"
                        )}>
                            {action.buttonText}
                            <ChevronRight size={14} strokeWidth={3} className="opacity-70 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
