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
"[project]/app/api/analytics/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth-middleware.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-response.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/logger.ts [app-route] (ecmascript)");
;
;
;
;
async function GET(request) {
    try {
        // Require authentication
        const authResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requireAuth"])(request);
        if (authResult.error) {
            return authResult.error;
        }
        const user = authResult.user;
        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        // Parse dates or use defaults
        const start = startDate ? new Date(startDate) : new Date(new Date().setMonth(new Date().getMonth() - 12));
        const end = endDate ? new Date(endDate) : new Date();
        // Ensure end date is after start date
        if (end < start) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiResponse"].error('End date must be after start date', 400);
        }
        // Financial Analytics
        const payments = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].payment.findMany({
            where: {
                date: {
                    gte: start,
                    lte: end
                }
            },
            include: {
                tenant: {
                    include: {
                        user: true,
                        flat: {
                            include: {
                                building: true
                            }
                        }
                    }
                }
            }
        });
        const totalRevenue = payments.reduce((sum, p)=>sum + p.amount, 0);
        const revenueByType = payments.reduce((acc, p)=>{
            acc[p.type] = (acc[p.type] || 0) + p.amount;
            return acc;
        }, {});
        const revenueByMethod = payments.reduce((acc, p)=>{
            acc[p.method] = (acc[p.method] || 0) + p.amount;
            return acc;
        }, {});
        // Monthly revenue trend
        const monthlyRevenue = payments.reduce((acc, p)=>{
            const month = new Date(p.date).toISOString().slice(0, 7); // YYYY-MM
            acc[month] = (acc[month] || 0) + p.amount;
            return acc;
        }, {});
        // Tenant Analytics
        const totalTenants = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].tenant.count();
        const activeTenants = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].tenant.count({
            where: {
                moveOutDate: null
            }
        });
        const tenantsWithFlats = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].tenant.count({
            where: {
                flatId: {
                    not: null
                },
                moveOutDate: null
            }
        });
        // Tenant turnover
        const newTenants = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].tenant.count({
            where: {
                moveInDate: {
                    gte: start,
                    lte: end
                }
            }
        });
        const movedOutTenants = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].tenant.count({
            where: {
                moveOutDate: {
                    gte: start,
                    lte: end
                }
            }
        });
        // Building & Flat Analytics
        const totalBuildings = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].building.count();
        const totalFlats = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].flat.count();
        const occupiedFlats = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].flat.count({
            where: {
                isOccupied: true
            }
        });
        const occupancyRate = totalFlats > 0 ? occupiedFlats / totalFlats * 100 : 0;
        // Revenue by building
        const revenueByBuilding = payments.reduce((acc, p)=>{
            const buildingName = p.tenant.flat?.building?.name || 'Unassigned';
            acc[buildingName] = (acc[buildingName] || 0) + p.amount;
            return acc;
        }, {});
        // Maintenance & Service Request Analytics
        const serviceRequests = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].serviceRequest.findMany({
            where: {
                createdAt: {
                    gte: start,
                    lte: end
                }
            },
            include: {
                tenant: {
                    include: {
                        flat: {
                            include: {
                                building: true
                            }
                        }
                    }
                }
            }
        });
        const totalMaintenanceCost = serviceRequests.reduce((sum, r)=>sum + (r.cost || 0), 0);
        const requestsByStatus = serviceRequests.reduce((acc, r)=>{
            acc[r.status] = (acc[r.status] || 0) + 1;
            return acc;
        }, {});
        const requestsByCategory = serviceRequests.reduce((acc, r)=>{
            acc[r.category] = (acc[r.category] || 0) + 1;
            return acc;
        }, {});
        const maintenanceByCategory = serviceRequests.reduce((acc, r)=>{
            acc[r.category] = (acc[r.category] || 0) + (r.cost || 0);
            return acc;
        }, {});
        // Monthly maintenance trend
        const monthlyMaintenance = serviceRequests.reduce((acc, r)=>{
            const month = new Date(r.createdAt).toISOString().slice(0, 7);
            acc[month] = (acc[month] || 0) + (r.cost || 0);
            return acc;
        }, {});
        // Payment Status Analytics
        const paymentsByStatus = payments.reduce((acc, p)=>{
            acc[p.status] = (acc[p.status] || 0) + 1;
            return acc;
        }, {});
        // Top Paying Tenants
        const tenantPayments = payments.reduce((acc, p)=>{
            const tenantName = p.tenant.user.name;
            acc[tenantName] = (acc[tenantName] || 0) + p.amount;
            return acc;
        }, {});
        const topPayingTenants = Object.entries(tenantPayments).map(([name, amount])=>({
                name,
                amount
            })).sort((a, b)=>b.amount - a.amount).slice(0, 10);
        // Average rent per flat
        const flatsWithRent = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].flat.findMany({
            where: {
                isOccupied: true
            }
        });
        const averageRent = flatsWithRent.length > 0 ? flatsWithRent.reduce((sum, f)=>sum + f.rentAmount, 0) / flatsWithRent.length : 0;
        // Total security deposits
        const totalDeposits = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].tenant.aggregate({
            _sum: {
                securityDeposit: true
            },
            where: {
                moveOutDate: null
            }
        });
        // Format monthly data for charts
        const monthlyRevenueData = Object.entries(monthlyRevenue).map(([month, amount])=>({
                month,
                amount
            })).sort((a, b)=>a.month.localeCompare(b.month));
        const monthlyMaintenanceData = Object.entries(monthlyMaintenance).map(([month, cost])=>({
                month,
                cost
            })).sort((a, b)=>a.month.localeCompare(b.month));
        const analytics = {
            period: {
                start: start.toISOString(),
                end: end.toISOString()
            },
            financial: {
                totalRevenue,
                revenueByType,
                revenueByMethod,
                monthlyRevenue: monthlyRevenueData,
                averageRent,
                totalDeposits: totalDeposits._sum.securityDeposit || 0
            },
            tenants: {
                total: totalTenants,
                active: activeTenants,
                withFlats: tenantsWithFlats,
                newTenants,
                movedOut: movedOutTenants,
                turnoverRate: activeTenants > 0 ? movedOutTenants / activeTenants * 100 : 0
            },
            properties: {
                totalBuildings,
                totalFlats,
                occupiedFlats,
                occupancyRate,
                revenueByBuilding
            },
            maintenance: {
                totalCost: totalMaintenanceCost,
                requestsByStatus,
                requestsByCategory,
                costByCategory: maintenanceByCategory,
                monthlyMaintenance: monthlyMaintenanceData,
                totalRequests: serviceRequests.length
            },
            payments: {
                byStatus: paymentsByStatus,
                totalCount: payments.length
            },
            topPayingTenants
        };
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiResponse"].success(analytics, 'Analytics data retrieved successfully');
    } catch (error) {
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error('Failed to fetch analytics', error, {
            endpoint: '/api/analytics'
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiResponse"].internalError('Failed to fetch analytics');
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__2b336f09._.js.map