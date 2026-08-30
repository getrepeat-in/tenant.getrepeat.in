"use client";
import { useSelector } from "react-redux";

export const useUser = () => {
    const user = useSelector((state) => state.user.user);
    const loading = useSelector((state) => state.user.loading);
    
    const isAuthenticated = !!user;

    return { 
        user,
        loading,
        isAuthenticated
    };
};
