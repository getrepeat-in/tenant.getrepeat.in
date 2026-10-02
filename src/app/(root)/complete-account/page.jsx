"use client";
import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setUser } from "@/store/slices/userSlice";
import useNotification from "@/hooks/useNotification";
import { AuthService } from "@/services/frontend/auth";
import ProtectedRoute from "@/components/global/protected-route";

export default function CompleteAccountPage() {
    const { user } = useUser();
    const router = useRouter();
    const dispatch = useDispatch();
    const notify = useNotification();
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    if (user && !user.isGuest) {
        router.push("/profile");
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!password || password.length < 6) {
            notify.error("Password must be at least 6 characters long.");
            return;
        }

        try {
            setLoading(true);
            const response = await AuthService.updateProfile({ password });
            if (response.success) {
                notify.success("Account completed successfully!");
                const meResponse = await AuthService.me();
                if (meResponse.success) {
                    dispatch(setUser(meResponse.data));
                }
                router.push("/profile");
            } else {
                notify.error(response.message || "Failed to complete account.");
            }
        } catch (error) {
            notify.error(error.message || "An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className="min-h-[70vh] flex items-center justify-center bg-gray-50/50">
                <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Complete Your Account</h1>
                        <p className="mt-2 text-sm text-gray-500">
                            Set a password to secure your account and access all features.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">New Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter a secure password"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                                required
                                minLength={6}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Saving..." : "Save Password"}
                        </button>
                    </form>
                </div>
            </div>
        </ProtectedRoute>
    );
}
