import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { registerSchema, validateRequest } from '@/lib/validations';
import { requireAuth, requireRole } from '@/lib/auth-middleware';
import { ApiResponse } from '@/lib/api-response';
import { logger } from '@/lib/logger';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        // Require authentication and ADMIN/MANAGER role
        const authResult = await requireRole(request, ['ADMIN', 'MANAGER']);
        if (authResult.error) {
            return authResult.error;
        }

        // Validate request body
        const validation = await validateRequest(request, registerSchema);
        if (!validation.success) {
            return validation.error;
        }

        const { name, email, password, role } = validation.data;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return ApiResponse.error('User already exists', 400);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
            },
        });

        logger.info('User created', { userId: user.id, email: user.email, role: user.role });
        return ApiResponse.success({ userId: user.id }, 'User created successfully', 201);
    } catch (error: any) {
        logger.error('Registration error', error, { endpoint: '/api/auth/register' });
        return ApiResponse.internalError('Internal server error');
    }
}
