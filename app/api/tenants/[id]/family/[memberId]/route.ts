import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth-middleware';
import { ApiResponse } from '@/lib/api-response';
import { logger } from '@/lib/logger';
import type { NextRequest } from 'next/server';

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; memberId: string }> }
) {
    try {
        // Require authentication
        const authResult = await requireAuth(request);
        if (authResult.error) {
            return authResult.error;
        }

        const user = authResult.user!;
        const { id, memberId } = await params;

        // Verify family member exists and belongs to tenant
        const familyMember = await prisma.familyMember.findUnique({
            where: { id: memberId },
            include: {
                tenant: {
                    select: { userId: true },
                },
            },
        });

        if (!familyMember) {
            return ApiResponse.notFound('Family member');
        }

        if (familyMember.tenantId !== id) {
            return ApiResponse.error('Family member does not belong to this tenant', 400);
        }

        // Tenants can only delete their own family members
        if (user.role === 'TENANT' && familyMember.tenant.userId !== user.id) {
            return ApiResponse.forbidden();
        }

        await prisma.familyMember.delete({
            where: { id: memberId },
        });

        logger.info('Family member deleted', { memberId, tenantId: id });
        return ApiResponse.success(null, 'Family member deleted successfully');
    } catch (error: any) {
        try {
            const { memberId } = await params;
            logger.error('Failed to delete family member', error, { endpoint: '/api/tenants/[id]/family/[memberId]', memberId });
        } catch {
            logger.error('Failed to delete family member', error, { endpoint: '/api/tenants/[id]/family/[memberId]' });
        }
        return ApiResponse.internalError('Failed to delete family member');
    }
}
