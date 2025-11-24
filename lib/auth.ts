import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// Get JWT secret from environment variable (lazy loading)
const getSecretKey = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        // During build time, allow missing secret
        if (process.env.NODE_ENV === 'production' && typeof window === 'undefined' && process.env.NEXT_PHASE !== 'phase-production-build') {
            throw new Error('JWT_SECRET must be set in production environment');
        }
        // Fallback for development and build time
        if (process.env.NODE_ENV !== 'production') {
            console.warn('⚠️  JWT_SECRET not set, using default. This is unsafe for production!');
        }
        return 'dev-secret-key-change-in-production';
    }
    return secret;
};

const getKey = () => {
    const secretKey = getSecretKey();
    return new TextEncoder().encode(secretKey);
};

export async function encrypt(payload: any) {
    const key = getKey();
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(key);
}

export async function decrypt(input: string): Promise<any> {
    const key = getKey();
    const { payload } = await jwtVerify(input, key, {
        algorithms: ['HS256'],
    });
    return payload;
}

export async function getSession() {
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;
    if (!session) return null;
    return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
    const session = request.cookies.get('session')?.value;
    if (!session) return;

    // Refresh the session so it doesn't expire
    const parsed = await decrypt(session);
    parsed.expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const res = NextResponse.next();
    res.cookies.set({
        name: 'session',
        value: await encrypt(parsed),
        httpOnly: true,
        expires: parsed.expires,
    });
    return res;
}
