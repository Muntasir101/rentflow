import { prisma } from '@/lib/db';
import { requireAuth, requireRole } from '@/lib/auth-middleware';
import { serviceRequestSchema, validateRequest } from '@/lib/validations';
import { ApiResponse, parsePagination, paginatedResponse, calculatePaginationMeta } from '@/lib/api-response';
import { logger } from '@/lib/logger';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        // Require authentication
        const authResult = await requireAuth(request);
        if (authResult.error) {
            return authResult.error;
        }

        const user = authResult.user!;
        const { page, limit, skip } = parsePagination(request);

        // Tenants can only see their own requests
        let whereClause: any = {};
        if (user.role === 'TENANT') {
            const tenant = await prisma.tenant.findUnique({
                where: { userId: user.id },
            });
            if (!tenant) {
                return ApiResponse.notFound('Tenant record');
            }
            whereClause.tenantId = tenant.id;
        }

        const [requests, total] = await Promise.all([
            prisma.serviceRequest.findMany({
                where: whereClause,
                include: {
                    tenant: {
                        include: {
                            user: true,
                            flat: {
                                include: {
                                    building: true,
                                },
                            },
                        },
                    },
                    assignedTo: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take: limit,
            }),
            prisma.serviceRequest.count({ where: whereClause }),
        ]);

        const meta = calculatePaginationMeta(total, page, limit);
        return paginatedResponse(requests, meta);
    } catch (error: any) {
        logger.error('Failed to fetch requests', error, { endpoint: '/api/requests' });
        return ApiResponse.internalError('Failed to fetch requests');
    }
}

export async function POST(request: NextRequest) {
    try {
        // Require authentication
        const authResult = await requireAuth(request);
        if (authResult.error) {
            return authResult.error;
        }

        const user = authResult.user!;

        // Validate request body
        const validation = await validateRequest(request, serviceRequestSchema);
        if (!validation.success) {
            return validation.error;
        }

        const { tenantId, category, description, assignedToId, cost, status } = validation.data;

        // Tenants can only create requests for themselves
        if (user.role === 'TENANT') {
            const tenant = await prisma.tenant.findUnique({
                where: { userId: user.id },
            });
            if (!tenant || tenant.id !== tenantId) {
                return ApiResponse.forbidden('You can only create requests for yourself');
            }
        }

        const serviceRequest = await prisma.serviceRequest.create({
            data: {
                tenantId,
                category,
                description,
                assignedToId: assignedToId || null,
                cost: cost || null,
                status: status || 'PENDING',
            },
        });

        logger.info('Service request created', { requestId: serviceRequest.id, tenantId, category });
        return ApiResponse.success(serviceRequest, 'Service request created successfully', 201);
    } catch (error: any) {
        logger.error('Failed to create request', error, { endpoint: '/api/requests' });
        return ApiResponse.internalError('Failed to create request');
    }
}
