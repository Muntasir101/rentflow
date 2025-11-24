import { prisma } from '@/lib/db';
import { encrypt } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { loginSchema, validateRequest } from '@/lib/validations';
import { ApiResponse } from '@/lib/api-response';
import { logger } from '@/lib/logger';

export async function POST(request: Request) {
    try {
        // Validate request body
        const validation = await validateRequest(request, loginSchema);
        if (!validation.success) {
            return validation.error;
        }

        const { email, password } = validation.data;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.active) {
            logger.warn('Login attempt failed', { email, reason: 'Invalid credentials or inactive user' });
            return ApiResponse.unauthorized('Invalid credentials');
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            logger.warn('Login attempt failed', { email, reason: 'Invalid password' });
            return ApiResponse.unauthorized('Invalid credentials');
        }

        const session = await encrypt({ id: user.id, email: user.email, role: user.role });
        const cookieStore = await cookies();

        cookieStore.set('session', session, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            path: '/',
            sameSite: 'lax',
        });

        logger.info('User logged in', { userId: user.id, email: user.email, role: user.role });
        return ApiResponse.success({ role: user.role }, 'Login successful');
    } catch (error: any) {
        logger.error('Login error', error, { endpoint: '/api/auth/login' });
        return ApiResponse.internalError('Internal server error');
    }
}
