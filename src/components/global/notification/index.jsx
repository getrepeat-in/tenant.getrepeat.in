"use client";
import { X } from "lucide-react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import useNotification from "@/hooks/useNotification";
import { AnimatePresence, motion } from "framer-motion";
import { NOTIFICATION_VARIANTS } from "./fragments/helpers/constants";

export default function NotificationBanner() {
    const notification = useSelector((state) => state.notification);
    const notify = useNotification();

    useEffect(() => {
        if (!notification.visible) return;
        if (notification.duration == null) return;

        const timer = setTimeout(() => {
            notify.hide();
        }, notification.duration);

        return () => clearTimeout(timer);
    }, [notification.visible, notification.duration, notify]);

    if (!notification.visible) return null;

    const config = NOTIFICATION_VARIANTS[notification.type] || NOTIFICATION_VARIANTS.info;
    const Icon = config.icon;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`fixed inset-x-0 top-0 z-[9999] border-b shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-md bg-opacity-95 ${config.className}`}
            >
                <div className="relative mx-auto flex min-h-[3.25rem] w-full items-center gap-3 sm:gap-4 px-4 py-2.5 sm:px-6">
                    <Icon className={`h-5 w-5 sm:h-6 sm:w-6 shrink-0 ${config.iconClass}`} />

                    <div className="flex flex-1 flex-col justify-center min-w-0">
                        {notification.title && (
                            <p className="font-semibold text-xs sm:text-[15px] leading-snug truncate">
                                {notification.title}
                            </p>
                        )}
                        <p className="text-xs sm:text-sm font-medium leading-tight truncate">
                            {notification.message}
                        </p>
                    </div>

                    <button
                        onClick={notify.hide}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-black/5 active:scale-95"
                        aria-label="Close notification"
                    >
                        <X className="h-4 w-4" />
                    </button>

                    {notification.duration != null && (
                        <motion.div
                            initial={{ width: "100%" }}
                            animate={{ width: 0 }}
                            transition={{
                                duration: notification.duration / 1000,
                                ease: "linear",
                            }}
                            className={`absolute bottom-0 left-0 h-[3px] ${config.progress}`}
                        />
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
