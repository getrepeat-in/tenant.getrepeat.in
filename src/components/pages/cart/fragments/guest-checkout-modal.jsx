"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { X, Loader2 } from "lucide-react";
import { setUser } from "@/store/slices/userSlice";
import useNotification from "@/hooks/useNotification";
import { AuthService } from "@/services/frontend/auth";

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
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-lg">Guest Checkout</h3>
                    <button
                        onClick={() => onOpenChange(false)}
                        className="p-1 rounded-md text-gray-500 hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
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
                        className="w-full flex items-center justify-center py-2.5 px-4 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 focus:outline-none disabled:opacity-70"
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : "Continue to Checkout"}
                    </button>
                </form>
            </div>
        </div>
    );
}
