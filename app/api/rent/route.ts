import { prisma } from '@/lib/db';
import { requireAuth, requireRole } from '@/lib/auth-middleware';
import { paymentSchema, validateRequest } from '@/lib/validations';
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

        // Tenants can only see their own payments
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

        const [payments, total] = await Promise.all([
            prisma.payment.findMany({
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
                },
                orderBy: {
                    date: 'desc',
                },
                skip,
                take: limit,
            }),
            prisma.payment.count({ where: whereClause }),
        ]);

        const meta = calculatePaginationMeta(total, page, limit);
        return paginatedResponse(payments, meta);
    } catch (error: any) {
        logger.error('Failed to fetch payments', error, { endpoint: '/api/rent' });
        return ApiResponse.internalError('Failed to fetch payments');
    }
}

export async function POST(request: NextRequest) {
    try {
        // Require authentication and ADMIN/MANAGER/STAFF role
        const authResult = await requireRole(request, ['ADMIN', 'MANAGER', 'STAFF']);
        if (authResult.error) {
            return authResult.error;
        }

        // Validate request body
        const validation = await validateRequest(request, paymentSchema);
        if (!validation.success) {
            return validation.error;
        }

        const { tenantId, amount, type, method, month, status } = validation.data;

        const payment = await prisma.payment.create({
            data: {
                tenantId,
                amount,
                type,
                method,
                month,
                status: status || 'PAID',
            },
        });

        logger.info('Payment recorded', { paymentId: payment.id, tenantId, amount, type });
        return ApiResponse.success(payment, 'Payment recorded successfully', 201);
    } catch (error: any) {
        logger.error('Failed to record payment', error, { endpoint: '/api/rent' });
        return ApiResponse.internalError('Failed to record payment');
    }
}
