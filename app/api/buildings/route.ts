import { prisma } from '@/lib/db';
import { requireAuth, requireRole } from '@/lib/auth-middleware';
import { buildingSchema, validateRequest } from '@/lib/validations';
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

        const [buildings, total] = await Promise.all([
            prisma.building.findMany({
                include: {
                    flats: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take: limit,
            }),
            prisma.building.count(),
        ]);

        const meta = calculatePaginationMeta(total, page, limit);
        return paginatedResponse(buildings, meta);
    } catch (error: any) {
        logger.error('Failed to fetch buildings', error, { endpoint: '/api/buildings' });
        return ApiResponse.internalError('Failed to fetch buildings');
    }
}

export async function POST(request: NextRequest) {
    try {
        // Require authentication and ADMIN/MANAGER role
        const authResult = await requireRole(request, ['ADMIN', 'MANAGER']);
        if (authResult.error) {
            return authResult.error;
        }

        // Validate request body
        const validation = await validateRequest(request, buildingSchema);
        if (!validation.success) {
            return validation.error;
        }

        const { name, address } = validation.data;

        const building = await prisma.building.create({
            data: {
                name,
                address,
            },
        });

        logger.info('Building created', { buildingId: building.id, name: building.name });
        return ApiResponse.success(building, 'Building created successfully', 201);
    } catch (error: any) {
        logger.error('Failed to create building', error, { endpoint: '/api/buildings' });
        return ApiResponse.internalError('Failed to create building');
    }
}
