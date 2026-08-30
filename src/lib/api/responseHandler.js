import { NextResponse } from "next/server";

export class JsonResponse {
    static success(data, message = "Success", status = 200) {
        const body = {
            success: true,
            message,
            data,
        };
        return NextResponse.json(body, { status });
    }

    static collection(data, totalCount, options, message = "Success") {
        const { page, limit, search, extraFilters } = options;
        const totalPages = Math.ceil(totalCount / limit);

        const meta = {
            page,
            limit,
            totalCount,
            totalPages,
            ...(search && { search }),
            ...extraFilters,
        };

        const body = {
            success: true,
            message,
            data,
            meta,
        };

        return NextResponse.json(body, { status: 200 });
    }

    static error(message = "Internal Server Error", status = 500, errors = null) {
        const body = {
            success: false,
            message,
            ...(errors && { errors }),
        };
        return NextResponse.json(body, { status });
    }
}
