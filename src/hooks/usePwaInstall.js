"use client";
import { useState, useEffect } from "react";

// Keep a global reference so it persists across component remounts
let globalDeferredPrompt = null;
let isSwRegistered = false;

export function usePwaInstall() {
    const [deferredPrompt, setDeferredPrompt] = useState(globalDeferredPrompt);
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        try {
            const isMatch = window.matchMedia ? window.matchMedia('(display-mode: standalone)').matches : false;
            setIsStandalone(isMatch || !!window.navigator.standalone);
        } catch (e) {
            console.error(e);
        }

        if ('serviceWorker' in navigator && !isSwRegistered) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').then(() => {
                    isSwRegistered = true;
                }).catch(err => {
                    console.log('SW registration failed: ', err);
                });
            });
        }

        const handler = (e) => {
            e.preventDefault();
            globalDeferredPrompt = e;
            setDeferredPrompt(e);
        };

        window.addEventListener("beforeinstallprompt", handler);

        // If it was already fired before this hook mounted, set it
        if (globalDeferredPrompt) {
            setDeferredPrompt(globalDeferredPrompt);
        }

        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const promptInstall = async () => {
        if (!deferredPrompt) return false;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            globalDeferredPrompt = null;
            setDeferredPrompt(null);
            return true;
        }
        return false;
    };

    return {
        isInstallable: !!deferredPrompt,
        isStandalone,
        promptInstall
    };
}
