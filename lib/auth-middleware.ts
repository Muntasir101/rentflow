import { getSession } from './auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ApiResponse } from './api-response';

export interface AuthenticatedRequest extends NextRequest {
    user?: {
        id: string;
        email: string;
        role: string;
    };
}

/**
 * Require authentication for API routes
 * Returns the session user or null if unauthorized
 */
export async function requireAuth(request: NextRequest) {
    const session = await getSession();
    
    if (!session) {
        return {
            error: ApiResponse.unauthorized(),
            user: null,
        };
    }

    return {
        error: null,
        user: session as { id: string; email: string; role: string },
    };
}

/**
 * Require specific role(s) for API routes
 * @param allowedRoles - Array of allowed roles (e.g., ['ADMIN', 'MANAGER'])
 */
export async function requireRole(
    request: NextRequest,
    allowedRoles: string[]
) {
    const authResult = await requireAuth(request);
    
    if (authResult.error) {
        return authResult;
    }

    const user = authResult.user!;
    
    if (!allowedRoles.includes(user.role)) {
        return {
            error: ApiResponse.forbidden(),
            user: null,
        };
    }

    return authResult;
}

/**
 * Role hierarchy check
 * Higher roles have more permissions
 */
export const ROLE_HIERARCHY: Record<string, number> = {
    ADMIN: 4,
    MANAGER: 3,
    STAFF: 2,
    TENANT: 1,
};

export function hasRolePermission(userRole: string, requiredRole: string): boolean {
    const userLevel = ROLE_HIERARCHY[userRole] || 0;
    const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;
    return userLevel >= requiredLevel;
}

