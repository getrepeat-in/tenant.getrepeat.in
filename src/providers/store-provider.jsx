"use client";
import posthog from "posthog-js";
import { makeStore } from "@/store";
import { useRef, useEffect } from "react";
import { fetchUser } from "@/store/slices/userSlice";
import { Provider, useDispatch, useSelector } from "react-redux";
import { fetchRestaurant } from "@/store/slices/restaurantSlice";
import { loadCart, setCartLoaded } from "@/store/slices/cartSlice";

const isPostHogConfigured = Boolean(
    process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN && process.env.NEXT_PUBLIC_POSTHOG_HOST,
);

function PostHogUserIdentity() {
    const user = useSelector((state) => state.user.user);
    const previousDistinctId = useRef(null);

    useEffect(() => {
        if (!isPostHogConfigured) return;

        const distinctId = user?._id || user?.id;

        if (!distinctId) {
            if (previousDistinctId.current) {
                posthog.reset();
                previousDistinctId.current = null;
            }
            return;
        }

        const normalizedDistinctId = String(distinctId);
        if (
            previousDistinctId.current &&
            previousDistinctId.current !== normalizedDistinctId &&
            posthog.get_distinct_id() !== normalizedDistinctId
        ) {
            posthog.reset();
        }

        posthog.identify(normalizedDistinctId, {
            name: user.name,
            phone: user.phone,
            is_guest: Boolean(user.isGuest),
        });
        previousDistinctId.current = normalizedDistinctId;
    }, [user]);

    return null;
}

function StateHydrator({ children }) {
    const dispatch = useDispatch();
    const hasHydrated = useRef(false);

    useEffect(() => {
        if (hasHydrated.current) return;
        hasHydrated.current = true;
        dispatch(fetchUser());
        dispatch(fetchRestaurant());
        try {
            const storedCart = localStorage.getItem("getrepeat-cart");
            if (storedCart) {
                dispatch(loadCart(JSON.parse(storedCart)));
            } else {
                dispatch(setCartLoaded());
            }
        } catch (error) {
            console.error("Failed to hydrate cart from local storage:", error);
            dispatch(setCartLoaded());
        }
    }, [dispatch]);

    return <>{children}</>;
}

export default function StoreProvider({ children, slug }) {
    const storeRef = useRef(undefined);

    if (!storeRef.current) {
        storeRef.current = makeStore();
        if (slug) {
            storeRef.current.dispatch({ type: 'restaurant/setSlug', payload: slug });
        }
    }

    return (
        <Provider store={storeRef.current}>
            <PostHogUserIdentity />
            <StateHydrator>
                {children}
            </StateHydrator>
        </Provider>
    );
}
