import { prisma } from '@/lib/db';
import { requireAuth, requireRole } from '@/lib/auth-middleware';
import { ApiResponse } from '@/lib/api-response';
import { logger } from '@/lib/logger';
import type { NextRequest } from 'next/server';
import { z } from 'zod';

const updateRequestSchema = z.object({
    status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).optional(),
    assignedToId: z.string().uuid('Invalid user ID').optional().nullable(),
    cost: z.number().nonnegative('Cost must be non-negative').optional().nullable(),
    description: z.string().min(10, 'Description must be at least 10 characters').optional(),
});

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Require authentication
        const authResult = await requireAuth(request);
        if (authResult.error) {
            return authResult.error;
        }

        const user = authResult.user!;
        const { id } = await params;

        // Get current request
        const currentRequest = await prisma.serviceRequest.findUnique({
            where: { id },
            include: {
                tenant: {
                    select: { userId: true },
                },
            },
        });

        if (!currentRequest) {
            return ApiResponse.notFound('Service request');
        }

        // Parse and validate request body
        const body = await request.json();
        const validation = updateRequestSchema.safeParse(body);

        if (!validation.success) {
            const zodError = validation.error;
            const errors = (zodError.issues || []).map((e) => ({
                path: (e.path || []).join('.'),
                message: e.message || 'Validation error',
            }));
            return ApiResponse.validationError(errors);
        }

        const { status, assignedToId, cost, description } = validation.data;

        // Permission checks
        // Tenants can only update their own requests (limited fields)
        if (user.role === 'TENANT') {
            if (currentRequest.tenant.userId !== user.id) {
                return ApiResponse.forbidden('You can only update your own requests');
            }
            // Tenants can only update description, not status or assignment
            if (status !== undefined || assignedToId !== undefined) {
                return ApiResponse.forbidden('You cannot change status or assignment');
            }
        }

        // Only ADMIN/MANAGER/STAFF can assign and change status
        if ((status !== undefined || assignedToId !== undefined) && 
            !['ADMIN', 'MANAGER', 'STAFF'].includes(user.role)) {
            return ApiResponse.forbidden('Only staff can change status and assignment');
        }

        // Verify assigned user exists and is staff/admin/manager if assigning
        if (assignedToId) {
            const assignedUser = await prisma.user.findUnique({
                where: { id: assignedToId },
            });
            if (!assignedUser) {
                return ApiResponse.error('Assigned user not found', 400);
            }
            if (!['ADMIN', 'MANAGER', 'STAFF'].includes(assignedUser.role)) {
                return ApiResponse.error('Can only assign to staff members', 400);
            }
        }

        // Update request
        const updatedRequest = await prisma.serviceRequest.update({
            where: { id },
            data: {
                ...(status !== undefined && { status }),
                ...(assignedToId !== undefined && { assignedToId }),
                ...(cost !== undefined && { cost }),
                ...(description !== undefined && { description }),
            },
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
        });

        logger.info('Service request updated', { 
            requestId: id, 
            status: status || currentRequest.status,
            updatedBy: user.id 
        });

        return ApiResponse.success(updatedRequest, 'Service request updated successfully');
    } catch (error: any) {
        logger.error('Failed to update request', error, { endpoint: '/api/requests/[id]' });
        return ApiResponse.internalError('Failed to update request');
    }
}

