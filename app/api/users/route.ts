import { prisma } from '@/lib/db';
import { requireAuth, requireRole } from '@/lib/auth-middleware';
import { ApiResponse } from '@/lib/api-response';
import { logger } from '@/lib/logger';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        // Require authentication and ADMIN/MANAGER/STAFF role
        const authResult = await requireRole(request, ['ADMIN', 'MANAGER', 'STAFF']);
        if (authResult.error) {
            return authResult.error;
        }

        const { searchParams } = new URL(request.url);
        const role = searchParams.get('role'); // Optional filter by role

        const whereClause: any = {
            active: true,
        };

        if (role) {
            whereClause.role = role;
        } else {
            // Default: return staff, managers, and admins (for assignment)
            whereClause.role = {
                in: ['ADMIN', 'MANAGER', 'STAFF'],
            };
        }

        const users = await prisma.user.findMany({
            where: whereClause,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
            orderBy: {
                name: 'asc',
            },
        });

        return ApiResponse.success(users);
    } catch (error: any) {
        logger.error('Failed to fetch users', error, { endpoint: '/api/users' });
        return ApiResponse.internalError('Failed to fetch users');
    }
}

