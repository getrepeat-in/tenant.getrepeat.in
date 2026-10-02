"use client";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function InstallAppBanner() {
    const restaurant = useSelector((state) => state.restaurant.restaurant);
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').catch(err => {
                    console.log('SW registration failed: ', err);
                });
            });
        }

        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            const dismissed = localStorage.getItem("installBannerDismissed");
            if (!dismissed) {
                setTimeout(() => {
                    setIsVisible(true);
                }, 3000);
            }
        };

        window.addEventListener("beforeinstallprompt", handler);
        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            setIsVisible(false);
        }
        
        setDeferredPrompt(null);
    };

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem("installBannerDismissed", "true");
    };

    if (!isVisible) return null;

    const logo = restaurant?.logo || "/logo.png";
    const name = restaurant?.name || "Repeat";

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[150] p-4 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] flex items-center justify-between gap-4 animate-in slide-in-from-bottom-full duration-300 sm:bottom-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:w-[400px] sm:rounded-2xl sm:border">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <img src={logo} alt={`${name} Logo`} className="w-full h-full object-cover" />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-zinc-100 line-clamp-1">Install {name}</h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Add to home screen for quick access</p>
                </div>
            </div>
            
            <div className="flex items-center gap-2">
                <button
                    onClick={handleInstallClick}
                    className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                >
                    Install
                </button>
                <button
                    onClick={handleDismiss}
                    className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors rounded-full hover:bg-neutral-100 dark:hover:bg-zinc-800"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
}
