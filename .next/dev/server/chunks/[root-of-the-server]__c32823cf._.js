module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/@prisma/client [external] (@prisma/client, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("@prisma/client", () => require("@prisma/client"));

module.exports = mod;
}),
"[project]/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
;
const globalForPrisma = /*TURBOPACK member replacement*/ __turbopack_context__.g;
const prisma = globalForPrisma.prisma || new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["PrismaClient"]({
    log: ("TURBOPACK compile-time truthy", 1) ? [
        'query'
    ] : "TURBOPACK unreachable"
});
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = prisma;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "decrypt",
    ()=>decrypt,
    "encrypt",
    ()=>encrypt,
    "getSession",
    ()=>getSession,
    "updateSession",
    ()=>updateSession
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$sign$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/jwt/sign.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/jwt/verify.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
;
;
// Get JWT secret from environment variable (lazy loading)
const getSecretKey = ()=>{
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        // During build time, allow missing secret
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        // Fallback for development and build time
        if ("TURBOPACK compile-time truthy", 1) {
            console.warn('⚠️  JWT_SECRET not set, using default. This is unsafe for production!');
        }
        return 'dev-secret-key-change-in-production';
    }
    return secret;
};
const getKey = ()=>{
    const secretKey = getSecretKey();
    return new TextEncoder().encode(secretKey);
};
async function encrypt(payload) {
    const key = getKey();
    return await new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$sign$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SignJWT"](payload).setProtectedHeader({
        alg: 'HS256'
    }).setIssuedAt().setExpirationTime('24h').sign(key);
}
async function decrypt(input) {
    const key = getKey();
    const { payload } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jwtVerify"])(input, key, {
        algorithms: [
            'HS256'
        ]
    });
    return payload;
}
async function getSession() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    const session = cookieStore.get('session')?.value;
    if (!session) return null;
    return await decrypt(session);
}
async function updateSession(request) {
    const session = request.cookies.get('session')?.value;
    if (!session) return;
    // Refresh the session so it doesn't expire
    const parsed = await decrypt(session);
    parsed.expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const res = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].next();
    res.cookies.set({
        name: 'session',
        value: await encrypt(parsed),
        httpOnly: true,
        expires: parsed.expires
    });
    return res;
}
}),
"[project]/lib/api-response.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ApiResponse",
    ()=>ApiResponse,
    "calculatePaginationMeta",
    ()=>calculatePaginationMeta,
    "paginatedResponse",
    ()=>paginatedResponse,
    "parsePagination",
    ()=>parsePagination
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
class ApiResponse {
    /**
     * Success response
     */ static success(data, message, status = 200) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: message || 'Success',
            data
        }, {
            status
        });
    }
    /**
     * Error response
     */ static error(message, status = 400, details, code) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: {
                message,
                code: code || 'ERROR',
                ...details && {
                    details
                }
            }
        }, {
            status
        });
    }
    /**
     * Validation error response
     */ static validationError(errors) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: {
                message: 'Validation failed',
                code: 'VALIDATION_ERROR',
                details: errors
            }
        }, {
            status: 400
        });
    }
    /**
     * Unauthorized response
     */ static unauthorized(message = 'Unauthorized') {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: {
                message,
                code: 'UNAUTHORIZED'
            }
        }, {
            status: 401
        });
    }
    /**
     * Forbidden response
     */ static forbidden(message = 'Forbidden: Insufficient permissions') {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: {
                message,
                code: 'FORBIDDEN'
            }
        }, {
            status: 403
        });
    }
    /**
     * Not found response
     */ static notFound(resource = 'Resource') {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: {
                message: `${resource} not found`,
                code: 'NOT_FOUND'
            }
        }, {
            status: 404
        });
    }
    /**
     * Internal server error response
     */ static internalError(message = 'Internal server error') {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: {
                message,
                code: 'INTERNAL_ERROR'
            }
        }, {
            status: 500
        });
    }
}
function paginatedResponse(data, meta, message) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        success: true,
        message: message || 'Success',
        data,
        pagination: meta
    });
}
function parsePagination(request) {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));
    const skip = (page - 1) * limit;
    return {
        page,
        limit,
        skip
    };
}
function calculatePaginationMeta(total, page, limit) {
    const totalPages = Math.ceil(total / limit);
    return {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
    };
}
}),
"[project]/lib/auth-middleware.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ROLE_HIERARCHY",
    ()=>ROLE_HIERARCHY,
    "hasRolePermission",
    ()=>hasRolePermission,
    "requireAuth",
    ()=>requireAuth,
    "requireRole",
    ()=>requireRole
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-response.ts [app-route] (ecmascript)");
;
;
async function requireAuth(request) {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSession"])();
    if (!session) {
        return {
            error: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiResponse"].unauthorized(),
            user: null
        };
    }
    return {
        error: null,
        user: session
    };
}
async function requireRole(request, allowedRoles) {
    const authResult = await requireAuth(request);
    if (authResult.error) {
        return authResult;
    }
    const user = authResult.user;
    if (!allowedRoles.includes(user.role)) {
        return {
            error: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiResponse"].forbidden(),
            user: null
        };
    }
    return authResult;
}
const ROLE_HIERARCHY = {
    ADMIN: 4,
    MANAGER: 3,
    STAFF: 2,
    TENANT: 1
};
function hasRolePermission(userRole, requiredRole) {
    const userLevel = ROLE_HIERARCHY[userRole] || 0;
    const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;
    return userLevel >= requiredLevel;
}
}),
"[project]/lib/logger.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Simple logger utility for consistent error logging
 */ __turbopack_context__.s([
    "logger",
    ()=>logger
]);
class Logger {
    formatMessage(entry) {
        const { level, message, timestamp, context, error } = entry;
        let logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
        if (context && Object.keys(context).length > 0) {
            logMessage += ` | Context: ${JSON.stringify(context)}`;
        }
        if (error) {
            logMessage += ` | Error: ${error.message}`;
            if (error.stack) {
                logMessage += ` | Stack: ${error.stack}`;
            }
        }
        return logMessage;
    }
    log(level, message, context, error) {
        const entry = {
            level,
            message,
            timestamp: new Date().toISOString(),
            context,
            error
        };
        const formattedMessage = this.formatMessage(entry);
        switch(level){
            case 'error':
                console.error(formattedMessage);
                break;
            case 'warn':
                console.warn(formattedMessage);
                break;
            case 'debug':
                if ("TURBOPACK compile-time truthy", 1) {
                    console.debug(formattedMessage);
                }
                break;
            default:
                console.log(formattedMessage);
        }
    }
    info(message, context) {
        this.log('info', message, context);
    }
    warn(message, context) {
        this.log('warn', message, context);
    }
    error(message, error, context) {
        this.log('error', message, context, error);
    }
    debug(message, context) {
        this.log('debug', message, context);
    }
}
const logger = new Logger();
}),
"[project]/app/api/tenants/[id]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "PATCH",
    ()=>PATCH
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth-middleware.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-response.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/logger.ts [app-route] (ecmascript)");
;
;
;
;
async function GET(request, { params }) {
    try {
        // Require authentication
        const authResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requireAuth"])(request);
        if (authResult.error) {
            return authResult.error;
        }
        const user = authResult.user;
        const { id } = await params;
        const tenant = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].tenant.findUnique({
            where: {
                id
            },
            include: {
                user: true,
                flat: {
                    include: {
                        building: true
                    }
                }
            }
        });
        if (!tenant) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiResponse"].notFound('Tenant');
        }
        // Tenants can only view their own data
        if (user.role === 'TENANT' && tenant.userId !== user.id) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiResponse"].forbidden();
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiResponse"].success(tenant);
    } catch (error) {
        try {
            const { id } = await params;
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error('Fetch tenant error', error, {
                endpoint: '/api/tenants/[id]',
                tenantId: id
            });
        } catch  {
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error('Fetch tenant error', error, {
                endpoint: '/api/tenants/[id]'
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiResponse"].internalError('Failed to fetch tenant');
    }
}
async function PATCH(request, { params }) {
    try {
        // Require authentication
        const authResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requireAuth"])(request);
        if (authResult.error) {
            return authResult.error;
        }
        const user = authResult.user;
        const { id } = await params;
        const body = await request.json();
        const { name, email, flatId, moveInDate, moveOutDate, securityDeposit, photo, identityDocument, identityType } = body;
        // Get current tenant to check flat changes
        const currentTenant = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].tenant.findUnique({
            where: {
                id
            },
            include: {
                user: true
            }
        });
        if (!currentTenant) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiResponse"].notFound('Tenant');
        }
        // Tenants can only update their own data (limited fields)
        if (user.role === 'TENANT' && currentTenant.userId !== user.id) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiResponse"].forbidden();
        }
        // Only ADMIN/MANAGER can change flat assignments
        if (flatId !== undefined && ![
            'ADMIN',
            'MANAGER'
        ].includes(user.role)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiResponse"].forbidden('Only admins and managers can change flat assignments');
        }
        // Update user information
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.update({
            where: {
                id: currentTenant.userId
            },
            data: {
                name: name || currentTenant.user.name,
                email: email || currentTenant.user.email
            }
        });
        // Use transaction for atomicity
        const updatedTenant = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].$transaction(async (tx)=>{
            // Handle move-out logic
            if (moveOutDate && !currentTenant.moveOutDate) {
                // Tenant is moving out - free up their flat
                if (currentTenant.flatId) {
                    await tx.flat.update({
                        where: {
                            id: currentTenant.flatId
                        },
                        data: {
                            isOccupied: false
                        }
                    });
                }
            }
            // Handle flat assignment changes (only if not moving out)
            if (!moveOutDate) {
                // Normalize flatId - treat empty string as null
                const normalizedFlatId = flatId && flatId.trim() !== '' ? flatId : null;
                const currentFlatIdNormalized = currentTenant.flatId || null;
                if (currentFlatIdNormalized && currentFlatIdNormalized !== normalizedFlatId) {
                    // Mark old flat as unoccupied
                    await tx.flat.update({
                        where: {
                            id: currentFlatIdNormalized
                        },
                        data: {
                            isOccupied: false
                        }
                    });
                }
                if (normalizedFlatId && normalizedFlatId !== currentFlatIdNormalized) {
                    // Verify new flat exists and is not occupied
                    const newFlat = await tx.flat.findUnique({
                        where: {
                            id: normalizedFlatId
                        }
                    });
                    if (!newFlat) {
                        throw new Error('Flat not found');
                    }
                    if (newFlat.isOccupied) {
                        throw new Error('Flat is already occupied');
                    }
                    // Mark new flat as occupied
                    await tx.flat.update({
                        where: {
                            id: normalizedFlatId
                        },
                        data: {
                            isOccupied: true
                        }
                    });
                }
            }
            // Update user information
            if (name || email) {
                await tx.user.update({
                    where: {
                        id: currentTenant.userId
                    },
                    data: {
                        ...name && {
                            name
                        },
                        ...email && {
                            email
                        }
                    }
                });
            }
            // Update tenant
            const updateData = {
                moveInDate: moveInDate ? new Date(moveInDate) : currentTenant.moveInDate,
                securityDeposit: securityDeposit !== undefined ? parseFloat(String(securityDeposit)) : currentTenant.securityDeposit,
                photo: photo !== undefined ? photo : currentTenant.photo,
                identityDocument: identityDocument !== undefined ? identityDocument : currentTenant.identityDocument,
                identityType: identityType !== undefined ? identityType : currentTenant.identityType
            };
            // Handle moveOutDate
            if (moveOutDate !== undefined) {
                updateData.moveOutDate = moveOutDate ? new Date(moveOutDate) : null;
            }
            // Handle flatId (only if not moving out)
            if (!moveOutDate && flatId !== undefined) {
                const normalizedFlatId = flatId && flatId.trim() !== '' ? flatId : null;
                updateData.flatId = normalizedFlatId;
            }
            return await tx.tenant.update({
                where: {
                    id
                },
                data: updateData,
                include: {
                    user: true,
                    flat: {
                        include: {
                            building: true
                        }
                    }
                }
            });
        });
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].info('Tenant updated', {
            tenantId: id,
            userId: user.id
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiResponse"].success(updatedTenant, 'Tenant updated successfully');
    } catch (error) {
        try {
            const { id } = await params;
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error('Tenant update error', error, {
                endpoint: '/api/tenants/[id]',
                tenantId: id
            });
        } catch  {
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error('Tenant update error', error, {
                endpoint: '/api/tenants/[id]'
            });
        }
        if (error.message === 'Flat not found' || error.message === 'Flat is already occupied') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiResponse"].error(error.message, 400);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiResponse"].internalError('Failed to update tenant');
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__c32823cf._.js.map