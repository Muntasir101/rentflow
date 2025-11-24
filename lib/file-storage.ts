import { writeFile, mkdir, readFile, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

/**
 * File storage utility for handling file uploads
 * In production, consider using cloud storage (S3, Cloudinary, etc.)
 */

const UPLOAD_DIR = process.env.UPLOAD_DIR || join(process.cwd(), 'uploads');
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Ensure upload directory exists
async function ensureUploadDir() {
    if (!existsSync(UPLOAD_DIR)) {
        await mkdir(UPLOAD_DIR, { recursive: true });
    }
}

/**
 * Save a file from base64 string
 */
export async function saveFileFromBase64(
    base64String: string,
    filename: string,
    subfolder: string = 'general'
): Promise<string> {
    try {
        await ensureUploadDir();

        // Remove data URL prefix if present
        const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
        
        // Validate file size
        const buffer = Buffer.from(base64Data, 'base64');
        if (buffer.length > MAX_FILE_SIZE) {
            throw new Error(`File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`);
        }

        const folderPath = join(UPLOAD_DIR, subfolder);
        if (!existsSync(folderPath)) {
            await mkdir(folderPath, { recursive: true });
        }

        const filePath = join(folderPath, filename);
        await writeFile(filePath, buffer);

        // Return relative path for storage in database
        return `/uploads/${subfolder}/${filename}`;
    } catch (error: any) {
        throw new Error(`Failed to save file: ${error.message}`);
    }
}

/**
 * Read a file
 */
export async function readFileFromStorage(filePath: string): Promise<Buffer> {
    try {
        // Remove leading slash if present
        const normalizedPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
        const fullPath = join(process.cwd(), normalizedPath);
        
        if (!existsSync(fullPath)) {
            throw new Error('File not found');
        }

        return await readFile(fullPath);
    } catch (error: any) {
        throw new Error(`Failed to read file: ${error.message}`);
    }
}

/**
 * Delete a file
 */
export async function deleteFile(filePath: string): Promise<void> {
    try {
        const normalizedPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
        const fullPath = join(process.cwd(), normalizedPath);
        
        if (existsSync(fullPath)) {
            await unlink(fullPath);
        }
    } catch (error: any) {
        // Log but don't throw - file might already be deleted
        console.warn(`Failed to delete file ${filePath}:`, error.message);
    }
}

/**
 * Generate unique filename
 */
export function generateFilename(originalName: string, prefix?: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split('.').pop() || 'bin';
    const name = prefix ? `${prefix}-${timestamp}-${random}.${extension}` : `${timestamp}-${random}.${extension}`;
    return name;
}

/**
 * Validate file type
 */
export function validateFileType(filename: string, allowedTypes: string[]): boolean {
    const extension = filename.split('.').pop()?.toLowerCase();
    return extension ? allowedTypes.includes(extension) : false;
}

/**
 * Get file size from base64 string
 */
export function getFileSizeFromBase64(base64String: string): number {
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
    return Buffer.from(base64Data, 'base64').length;
}

