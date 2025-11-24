import { cookies } from 'next/headers';
import { ApiResponse } from '@/lib/api-response';
import { logger } from '@/lib/logger';
import { getSession } from '@/lib/auth';

export async function POST() {
    try {
        const session = await getSession();
        const cookieStore = await cookies();
        cookieStore.delete('session');
        
        if (session) {
            logger.info('User logged out', { userId: session.id });
        }
        
        return ApiResponse.success(null, 'Logged out successfully');
    } catch (error: any) {
        logger.error('Logout error', error, { endpoint: '/api/auth/logout' });
        return ApiResponse.internalError('Internal server error');
    }
}
