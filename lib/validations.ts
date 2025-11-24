import { z } from 'zod';
import { NextResponse } from 'next/server';
import {
    loginSchema,
    registerSchema,
    buildingSchema,
    flatSchema,
    tenantCreateSchema,
    paymentSchema,
    serviceRequestSchema,
    familyMemberSchema,
    utilityBillSchema
} from './schemas';

export {
    loginSchema,
    registerSchema,
    buildingSchema,
    flatSchema,
    tenantCreateSchema,
    paymentSchema,
    serviceRequestSchema,
    familyMemberSchema,
    utilityBillSchema
};

/**
 * Helper function to validate request body
 */
export async function validateRequest<T>(
    request: Request,
    schema: z.ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; error: NextResponse }> {
    try {
        const body = await request.json();
        const data = schema.parse(body);
        return { success: true, data };
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            const { ApiResponse } = await import('./api-response');
            // ZodError uses 'issues' not 'errors'
            const errors = (error.issues || []).map((e: any) => ({
                path: (e.path || []).join('.'),
                message: e.message || 'Validation error',
            }));
            return {
                success: false,
                error: ApiResponse.validationError(errors),
            };
        }
        const { ApiResponse } = await import('./api-response');
        return {
            success: false,
            error: ApiResponse.error('Invalid request body', 400),
        };
    }
}
