import { NextResponse } from 'next/server';

/**
 * Standardized API response wrapper
 */
export class ApiResponse {
    /**
     * Success response
     */
    static success<T>(data: T, message?: string, status: number = 200) {
        return NextResponse.json(
            {
                success: true,
                message: message || 'Success',
                data,
            },
            { status }
        );
    }

    /**
     * Error response
     */
    static error(
        message: string,
        status: number = 400,
        details?: any,
        code?: string
    ) {
        return NextResponse.json(
            {
                success: false,
                error: {
                    message,
                    code: code || 'ERROR',
                    ...(details && { details }),
                },
            },
            { status }
        );
    }

    /**
     * Validation error response
     */
    static validationError(errors: Array<{ path: string; message: string }>) {
        return NextResponse.json(
            {
                success: false,
                error: {
                    message: 'Validation failed',
                    code: 'VALIDATION_ERROR',
                    details: errors,
                },
            },
            { status: 400 }
        );
    }

    /**
     * Unauthorized response
     */
    static unauthorized(message: string = 'Unauthorized') {
        return NextResponse.json(
            {
                success: false,
                error: {
                    message,
                    code: 'UNAUTHORIZED',
                },
            },
            { status: 401 }
        );
    }

    /**
     * Forbidden response
     */
    static forbidden(message: string = 'Forbidden: Insufficient permissions') {
        return NextResponse.json(
            {
                success: false,
                error: {
                    message,
                    code: 'FORBIDDEN',
                },
            },
            { status: 403 }
        );
    }

    /**
     * Not found response
     */
    static notFound(resource: string = 'Resource') {
        return NextResponse.json(
            {
                success: false,
                error: {
                    message: `${resource} not found`,
                    code: 'NOT_FOUND',
                },
            },
            { status: 404 }
        );
    }

    /**
     * Internal server error response
     */
    static internalError(message: string = 'Internal server error') {
        return NextResponse.json(
            {
                success: false,
                error: {
                    message,
                    code: 'INTERNAL_ERROR',
                },
            },
            { status: 500 }
        );
    }
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

/**
 * Paginated response
 */
export function paginatedResponse<T>(
    data: T[],
    meta: PaginationMeta,
    message?: string
) {
    return NextResponse.json({
        success: true,
        message: message || 'Success',
        data,
        pagination: meta,
    });
}

/**
 * Parse pagination query parameters
 */
export function parsePagination(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));
    const skip = (page - 1) * limit;

    return { page, limit, skip };
}

/**
 * Calculate pagination metadata
 */
export function calculatePaginationMeta(
    total: number,
    page: number,
    limit: number
): PaginationMeta {
    const totalPages = Math.ceil(total / limit);
    return {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
    };
}

