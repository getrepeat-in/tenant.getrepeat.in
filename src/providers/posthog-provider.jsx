"use client";
import posthog from "posthog-js";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { PostHogProvider as PHProvider } from "posthog-js/react";

const isPostHogConfigured = Boolean(
    process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN && process.env.NEXT_PUBLIC_POSTHOG_HOST
);

    // Move initialization inside the provider to ensure it only happens on client after hydration

export function PostHogPageview() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (pathname && isPostHogConfigured) {
            let url = window.origin + pathname;
            if (searchParams.toString()) {
                url = url + `?${searchParams.toString()}`;
            }
            posthog.capture("$pageview", {
                $current_url: url,
            });
        }
    }, [pathname, searchParams]);

    return null;
}

export default function PostHogProvider({ children }) {
    useEffect(() => {
        if (isPostHogConfigured) {
            posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN, {
                api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
                person_profiles: "identified_only",
                capture_pageview: false,
            });
        }
    }, []);

    if (!isPostHogConfigured) {
        return <>{children}</>;
    }
    return <PHProvider client={posthog}>{children}</PHProvider>;
}