import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { requireAuth, requireRole } from '@/lib/auth-middleware';
import { tenantCreateSchema, validateRequest } from '@/lib/validations';
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

        const { page, limit, skip } = parsePagination(request);

        const [tenants, total] = await Promise.all([
            prisma.tenant.findMany({
                include: {
                    user: true,
                    flat: {
                        include: {
                            building: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take: limit,
            }),
            prisma.tenant.count(),
        ]);

        const meta = calculatePaginationMeta(total, page, limit);
        return paginatedResponse(tenants, meta);
    } catch (error: any) {
        logger.error('Failed to fetch tenants', error, { endpoint: '/api/tenants' });
        return ApiResponse.internalError('Failed to fetch tenants');
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
        const validation = await validateRequest(request, tenantCreateSchema);
        if (!validation.success) {
            return validation.error;
        }

        const { name, email, password, phone, flatId, moveInDate, securityDeposit, photo, identityDocument, identityType } = validation.data;

        // Use transaction for atomicity
        const result = await prisma.$transaction(async (tx) => {
            // 1. Check if user exists
            const existingUser = await tx.user.findUnique({ where: { email } });
            if (existingUser) {
                throw new Error('User with this email already exists');
            }

            // 2. Check if flat is already occupied
            if (flatId) {
                const flat = await tx.flat.findUnique({ where: { id: flatId } });
                if (!flat) {
                    throw new Error('Flat not found');
                }
                if (flat.isOccupied) {
                    throw new Error('Flat is already occupied');
                }
            }

            // 3. Create User
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await tx.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    phone: phone || null,
                    role: 'TENANT',
                },
            });

            // 4. Create Tenant
            const tenant = await tx.tenant.create({
                data: {
                    userId: user.id,
                    flatId: flatId || null,
                    moveInDate: new Date(moveInDate),
                    securityDeposit: securityDeposit || 0,
                    photo: photo || null,
                    identityDocument: identityDocument || null,
                    identityType: identityType || null,
                },
            });

            // 5. Update Flat status if assigned
            if (flatId) {
                await tx.flat.update({
                    where: { id: flatId },
                    data: { isOccupied: true },
                });
            }

            return tenant;
        });

        logger.info('Tenant created', { tenantId: result.id, userId: result.userId });
        return ApiResponse.success(result, 'Tenant created successfully', 201);
    } catch (error: any) {
        logger.error('Tenant creation error', error, { endpoint: '/api/tenants' });
        
        // Handle known errors
        if (error.message === 'User with this email already exists' || 
            error.message === 'Flat not found' || 
            error.message === 'Flat is already occupied') {
            return ApiResponse.error(error.message, 400);
        }
        
        // Handle Prisma errors
        if (error.code === 'P2002') {
            return ApiResponse.error('A record with this information already exists', 400);
        }
        
        // Return the actual error message if available, otherwise generic message
        const errorMessage = error.message || 'Failed to create tenant';
        return ApiResponse.error(errorMessage, 500);
    }
}
