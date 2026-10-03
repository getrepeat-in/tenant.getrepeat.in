"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/userSlice";
import useNotification from "@/hooks/useNotification";
import { AuthService } from "@/services/frontend/auth";
import { X, Loader2, User, Phone } from "lucide-react";

export function GuestCheckoutModal({ open, onOpenChange, onLoginSuccess }) {
    const dispatch = useDispatch();
    const notify = useNotification();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);

    if (!open) return null;

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
                document.cookie = `auth-token=${response.data.token}; path=/; max-age=2592000; secure=true; samesite=lax`;

                const meResponse = await AuthService.me();
                if (meResponse.success) {
                    dispatch(setUser(meResponse.data));
                    onLoginSuccess();
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between p-4 px-5 border-b border-gray-100 dark:border-zinc-800">
                    <h3 className="flex items-center gap-2.5 text-lg font-bold">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <User size={16} strokeWidth={2.5} />
                        </div>
                        Guest Details
                    </h3>
                    <button
                        onClick={() => onOpenChange(false)}
                        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                        <X size={18} strokeWidth={2.5} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-5">
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
            </div>
        </div>
    );
}
