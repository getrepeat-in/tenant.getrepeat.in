"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "next/navigation";
import { TableService } from "@/services/frontend/table";
import { setTableInfo } from "@/store/slices/restaurantSlice";

export function TableParamHandler({ slug }) {
    const searchParams = useSearchParams();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!slug) return;

        const tableToken = searchParams.get("token") || searchParams.get("t");
        if (!tableToken) return;

        const verifyAndSetTable = async (token) => {
            try {
                const response = await TableService.verifyToken(slug, token);
                const matchedTable = response?.data?.table || response?.table || response?.data || response;

                if (matchedTable && (matchedTable.tableNumber || matchedTable._id)) {
                    dispatch(setTableInfo({
                        tableToken: token,
                        tableNumber: matchedTable.label || matchedTable.tableNumber || token,
                        isDineIn: true,
                        tableId: matchedTable._id
                    }));
                } else {
                    console.warn("Invalid table token received.");
                }
            } catch (error) {
                console.error("Failed to verify table token:", error);
            }
        };

        verifyAndSetTable(tableToken);
    }, [searchParams, dispatch, slug]);

    return null;
}
