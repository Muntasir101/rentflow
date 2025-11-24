import { z } from 'zod';

// Password strength validation
const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character');

// Auth validations
export const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email format'),
    password: passwordSchema,
    role: z.enum(['ADMIN', 'MANAGER', 'STAFF', 'TENANT'], {
        message: 'Invalid role',
    }),
});

// Building validations
export const buildingSchema = z.object({
    name: z.string().min(1, 'Building name is required'),
    address: z.string().min(1, 'Address is required'),
});

// Flat validations
export const flatSchema = z.object({
    number: z.string().min(1, 'Flat number is required'),
    buildingId: z.string().uuid('Invalid building ID'),
    rentAmount: z.number().positive('Rent amount must be positive'),
    isOccupied: z.boolean().optional().default(false),
});

// Tenant validations
export const tenantCreateSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email format'),
    password: passwordSchema,
    phone: z.string()
        .min(1, 'Mobile number is required')
        .refine((val) => {
            // Remove all non-digit characters to count actual digits
            const digitsOnly = val.replace(/\D/g, '');
            return digitsOnly.length >= 10 && digitsOnly.length <= 15;
        }, 'Mobile number must contain 10-15 digits')
        .refine((val) => {
            // Allow digits, spaces, +, -, (, ), and common separators
            return /^[\d\s\+\-\(\)\.]{10,20}$/.test(val);
        }, 'Invalid mobile number format. Use format like: +1234567890, 01234567890, or (123) 456-7890'),
    flatId: z.string()
        .uuid('Invalid flat ID')
        .optional()
        .nullable()
        .or(z.literal(''))
        .transform((val) => (val === '' ? null : val)),
    moveInDate: z.union([
        z.string().datetime('Invalid date format'),
        z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
        z.string().date('Invalid date format'),
    ]),
    securityDeposit: z.union([
        z.number().nonnegative('Security deposit must be non-negative'),
        z.string().transform((val) => (val === '' ? 0 : parseFloat(val))),
    ]).optional().default(0),
    photo: z.string().optional().nullable(),
    identityDocument: z.string().optional().nullable(),
    identityType: z.enum(['NID', 'Passport', 'Driving License', 'Other'])
        .optional()
        .nullable()
        .or(z.literal(''))
        .transform((val) => (val === '' ? null : val)),
});

// Payment validations
export const paymentSchema = z.object({
    tenantId: z.string().uuid('Invalid tenant ID'),
    amount: z.number().positive('Amount must be positive'),
    type: z.enum(['RENT', 'UTILITY', 'DEPOSIT'], {
        message: 'Invalid payment type',
    }),
    method: z.enum(['CASH', 'BANK', 'BKASH', 'NAGAD'], {
        message: 'Invalid payment method',
    }),
    month: z.string().regex(/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format').optional().nullable(),
    status: z.enum(['PAID', 'PARTIAL', 'PENDING']).optional().default('PAID'),
});

// Service Request validations
export const serviceRequestSchema = z.object({
    tenantId: z.string().uuid('Invalid tenant ID'),
    category: z.enum(['PLUMBING', 'ELECTRICAL', 'CLEANING', 'OTHER'], {
        message: 'Invalid category',
    }),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    assignedToId: z.string().uuid('Invalid user ID').optional().nullable(),
    cost: z.number().nonnegative('Cost must be non-negative').optional().nullable(),
    status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).optional().default('PENDING'),
});

// Family Member validations
export const familyMemberSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    relationship: z.string().min(1, 'Relationship is required'),
    age: z.number().int().positive('Age must be a positive integer').optional().nullable(),
    phone: z.string().optional().nullable(),
});

// Utility Bill validations
export const utilityBillSchema = z.object({
    tenantId: z.string().uuid('Invalid tenant ID'),
    type: z.enum(['ELECTRICITY', 'WATER', 'GAS', 'INTERNET', 'SERVICE'], {
        message: 'Invalid utility type',
    }),
    amount: z.number().positive('Amount must be positive'),
    month: z.string().regex(/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format'),
    isPaid: z.boolean().optional().default(false),
});
