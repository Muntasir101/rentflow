import { prisma } from '@/lib/db';
import { requireAuth, requireRole } from '@/lib/auth-middleware';
import { flatSchema, validateRequest } from '@/lib/validations';
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

        const { id } = await params;
        const flats = await prisma.flat.findMany({
            where: {
                buildingId: id,
            },
            orderBy: {
                number: 'asc',
            },
        });
        return ApiResponse.success(flats);
    } catch (error: any) {
        try {
            const { id } = await params;
            logger.error('Failed to fetch flats', error, { endpoint: '/api/buildings/[id]/flats', buildingId: id });
        } catch {
            logger.error('Failed to fetch flats', error, { endpoint: '/api/buildings/[id]/flats' });
        }
        return ApiResponse.internalError('Failed to fetch flats');
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Require authentication and ADMIN/MANAGER role
        const authResult = await requireRole(request, ['ADMIN', 'MANAGER']);
        if (authResult.error) {
            return authResult.error;
        }

        const { id } = await params;

        // Validate request body
        const validation = await validateRequest(request, flatSchema);
        if (!validation.success) {
            return validation.error;
        }

        const { number, rentAmount, isOccupied } = validation.data;

        // Verify building exists
        const building = await prisma.building.findUnique({ where: { id } });
        if (!building) {
            return ApiResponse.notFound('Building');
        }

        const flat = await prisma.flat.create({
            data: {
                number,
                rentAmount,
                buildingId: id,
                isOccupied: isOccupied || false,
            },
        });

        logger.info('Flat created', { flatId: flat.id, buildingId: id, number });
        return ApiResponse.success(flat, 'Flat created successfully', 201);
    } catch (error: any) {
        try {
            const { id } = await params;
            logger.error('Failed to create flat', error, { endpoint: '/api/buildings/[id]/flats', buildingId: id });
        } catch {
            logger.error('Failed to create flat', error, { endpoint: '/api/buildings/[id]/flats' });
        }
        return ApiResponse.internalError('Failed to create flat');
    }
}
