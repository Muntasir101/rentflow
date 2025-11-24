import { prisma } from '@/lib/db';
import { requireAuth, requireRole } from '@/lib/auth-middleware';
import { ApiResponse } from '@/lib/api-response';
import { logger } from '@/lib/logger';
import type { NextRequest } from 'next/server';

export async function GET(
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

        const tenant = await prisma.tenant.findUnique({
            where: { id },
            include: {
                user: true,
                flat: {
                    include: {
                        building: true,
                    },
                },
            },
        });

        if (!tenant) {
            return ApiResponse.notFound('Tenant');
        }

        // Tenants can only view their own data
        if (user.role === 'TENANT' && tenant.userId !== user.id) {
            return ApiResponse.forbidden();
        }

        return ApiResponse.success(tenant);
    } catch (error: any) {
        try {
            const { id } = await params;
            logger.error('Fetch tenant error', error, { endpoint: '/api/tenants/[id]', tenantId: id });
        } catch {
            logger.error('Fetch tenant error', error, { endpoint: '/api/tenants/[id]' });
        }
        return ApiResponse.internalError('Failed to fetch tenant');
    }
}

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
        const body = await request.json();
        const { name, email, flatId, moveInDate, moveOutDate, securityDeposit, photo, identityDocument, identityType } = body;

        // Get current tenant to check flat changes
        const currentTenant = await prisma.tenant.findUnique({
            where: { id },
            include: { user: true },
        });

        if (!currentTenant) {
            return ApiResponse.notFound('Tenant');
        }

        // Tenants can only update their own data (limited fields)
        if (user.role === 'TENANT' && currentTenant.userId !== user.id) {
            return ApiResponse.forbidden();
        }

        // Only ADMIN/MANAGER can change flat assignments
        if (flatId !== undefined && !['ADMIN', 'MANAGER'].includes(user.role)) {
            return ApiResponse.forbidden('Only admins and managers can change flat assignments');
        }

        // Update user information
        await prisma.user.update({
            where: { id: currentTenant.userId },
            data: {
                name: name || currentTenant.user.name,
                email: email || currentTenant.user.email,
            },
        });

        // Use transaction for atomicity
        const updatedTenant = await prisma.$transaction(async (tx) => {
            // Handle move-out logic
            if (moveOutDate && !currentTenant.moveOutDate) {
                // Tenant is moving out - free up their flat
                if (currentTenant.flatId) {
                    await tx.flat.update({
                        where: { id: currentTenant.flatId },
                        data: { isOccupied: false },
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
                        where: { id: currentFlatIdNormalized },
                        data: { isOccupied: false },
                    });
                }

                if (normalizedFlatId && normalizedFlatId !== currentFlatIdNormalized) {
                    // Verify new flat exists and is not occupied
                    const newFlat = await tx.flat.findUnique({ where: { id: normalizedFlatId } });
                    if (!newFlat) {
                        throw new Error('Flat not found');
                    }
                    if (newFlat.isOccupied) {
                        throw new Error('Flat is already occupied');
                    }
                    // Mark new flat as occupied
                    await tx.flat.update({
                        where: { id: normalizedFlatId },
                        data: { isOccupied: true },
                    });
                }
            }

            // Update user information
            if (name || email) {
                await tx.user.update({
                    where: { id: currentTenant.userId },
                    data: {
                        ...(name && { name }),
                        ...(email && { email }),
                    },
                });
            }

            // Update tenant
            const updateData: any = {
                moveInDate: moveInDate ? new Date(moveInDate) : currentTenant.moveInDate,
                securityDeposit: securityDeposit !== undefined ? parseFloat(String(securityDeposit)) : currentTenant.securityDeposit,
                photo: photo !== undefined ? photo : currentTenant.photo,
                identityDocument: identityDocument !== undefined ? identityDocument : currentTenant.identityDocument,
                identityType: identityType !== undefined ? identityType : currentTenant.identityType,
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
                where: { id },
                data: updateData,
                include: {
                    user: true,
                    flat: {
                        include: {
                            building: true,
                        },
                    },
                },
            });
        });

        logger.info('Tenant updated', { tenantId: id, userId: user.id });
        return ApiResponse.success(updatedTenant, 'Tenant updated successfully');
    } catch (error: any) {
        try {
            const { id } = await params;
            logger.error('Tenant update error', error, { endpoint: '/api/tenants/[id]', tenantId: id });
        } catch {
            logger.error('Tenant update error', error, { endpoint: '/api/tenants/[id]' });
        }
        if (error.message === 'Flat not found' || error.message === 'Flat is already occupied') {
            return ApiResponse.error(error.message, 400);
        }
        return ApiResponse.internalError('Failed to update tenant');
    }
}
