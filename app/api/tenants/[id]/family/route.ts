import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth-middleware';
import { familyMemberSchema, validateRequest } from '@/lib/validations';
import { ApiResponse } from '@/lib/api-response';
import { logger } from '@/lib/logger';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        // Require authentication
        const authResult = await requireAuth(request);
        if (authResult.error) {
            return authResult.error;
        }

        const user = authResult.user!;
        const { id } = await params;

        // Verify tenant exists and user has access
        const tenant = await prisma.tenant.findUnique({
            where: { id },
            select: { userId: true },
        });

        if (!tenant) {
            return ApiResponse.notFound('Tenant');
        }

        // Tenants can only view their own family members
        if (user.role === 'TENANT' && tenant.userId !== user.id) {
            return ApiResponse.forbidden();
        }

        const familyMembers = await prisma.familyMember.findMany({
            where: {
                tenantId: id,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return ApiResponse.success(familyMembers);
    } catch (error: any) {
        try {
            const { id } = await params;
            logger.error('Failed to fetch family members', error, { endpoint: '/api/tenants/[id]/family', tenantId: id });
        } catch {
            logger.error('Failed to fetch family members', error, { endpoint: '/api/tenants/[id]/family' });
        }
        return ApiResponse.internalError('Failed to fetch family members');
    }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        // Require authentication
        const authResult = await requireAuth(request);
        if (authResult.error) {
            return authResult.error;
        }

        const user = authResult.user!;
        const { id } = await params;

        // Verify tenant exists and user has access
        const tenant = await prisma.tenant.findUnique({
            where: { id },
            select: { userId: true },
        });

        if (!tenant) {
            return ApiResponse.notFound('Tenant');
        }

        // Tenants can only add family members to their own record
        if (user.role === 'TENANT' && tenant.userId !== user.id) {
            return ApiResponse.forbidden();
        }

        // Validate request body
        const validation = await validateRequest(request, familyMemberSchema);
        if (!validation.success) {
            return validation.error;
        }

        const { name, relationship, age, phone } = validation.data;

        const familyMember = await prisma.familyMember.create({
            data: {
                tenantId: id,
                name,
                relationship,
                age: age || null,
                phone: phone || null,
            },
        });

        logger.info('Family member created', { memberId: familyMember.id, tenantId: id });
        return ApiResponse.success(familyMember, 'Family member created successfully', 201);
    } catch (error: any) {
        try {
            const { id } = await params;
            logger.error('Failed to create family member', error, { endpoint: '/api/tenants/[id]/family', tenantId: id });
        } catch {
            logger.error('Failed to create family member', error, { endpoint: '/api/tenants/[id]/family' });
        }
        return ApiResponse.internalError('Failed to create family member');
    }
}
