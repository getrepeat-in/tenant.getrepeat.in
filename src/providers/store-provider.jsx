"use client";
import { makeStore } from "@/store";
import { useRef, useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { loadCart } from "@/store/slices/cartSlice";
import { fetchUser } from "@/store/slices/userSlice";
import { fetchRestaurant } from "@/store/slices/restaurantSlice";

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
            }
        } catch (error) {
            console.error("Failed to hydrate cart from local storage:", error);
        }
    }, [dispatch]);

    return <>{children}</>;
}

export default function StoreProvider({ children }) {
    const storeRef = useRef(undefined);

    if (!storeRef.current) {
        storeRef.current = makeStore();
    }

    return (
        <Provider store={storeRef.current}>
            <StateHydrator>
                {children}
            </StateHydrator>
        </Provider>
    );
}
