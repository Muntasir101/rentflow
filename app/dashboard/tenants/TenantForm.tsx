'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { FileUpload } from '@/app/components/ui/FileUpload';
import styles from './tenants.module.css';
import { tenantCreateSchema } from '@/lib/schemas';
import { z } from 'zod';

interface TenantFormProps {
    availableFlats: { id: string; label: string }[];
    onSuccess: () => void;
    onCancel: () => void;
}

type TenantFormData = z.infer<typeof tenantCreateSchema>;

export default function TenantForm({ availableFlats, onSuccess, onCancel }: TenantFormProps) {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState<TenantFormData>({
        name: '',
        email: '',
        password: '',
        phone: '',
        flatId: '',
        moveInDate: '',
        securityDeposit: 0,
        photo: null,
        identityDocument: null,
        identityType: '',
    });

    const validateField = (name: keyof TenantFormData, value: any) => {
        try {
            (tenantCreateSchema.shape as any)[name].parse(value);
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                setErrors(prev => ({ ...prev, [name]: error.issues[0]?.message || 'Validation error' }));
            }
        }
    };

    const handleChange = (name: keyof TenantFormData, value: any) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        // Validate on change if there's already an error, or just clear it
        if (errors[name]) {
            validateField(name, value);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            // Prepare data for submission - convert empty strings to null for optional fields
            const submitData = {
                ...formData,
                flatId: formData.flatId && formData.flatId.trim() !== '' ? formData.flatId : null,
                identityType: formData.identityType && formData.identityType.trim() !== '' ? formData.identityType : null,
                photo: formData.photo || null,
                identityDocument: formData.identityDocument || null,
                securityDeposit: typeof formData.securityDeposit === 'string' 
                    ? (formData.securityDeposit === '' ? 0 : parseFloat(formData.securityDeposit))
                    : (formData.securityDeposit || 0),
            };

            // Validate entire form
            const validatedData = tenantCreateSchema.parse(submitData);

            console.log('Submitting tenant data...', { 
                hasPhoto: !!validatedData.photo, 
                hasDoc: !!validatedData.identityDocument,
                photoSize: validatedData.photo?.length || 0 
            });

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

            try {
                const res = await fetch('/api/tenants', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(validatedData),
                    signal: controller.signal,
                });

                clearTimeout(timeoutId);

                // Parse response once
                let responseData: any;
                try {
                    const text = await res.text();
                    responseData = text ? JSON.parse(text) : {};
                } catch (parseError) {
                    console.error('Failed to parse response:', parseError);
                    responseData = { error: `Server returned invalid response (${res.status})` };
                }

                // Check if response is ok
                if (!res.ok) {
                    console.error('API Error Response:', responseData);
                    
                    let errorMessage = 'Failed to create tenant';
                    if (responseData.error) {
                        if (typeof responseData.error === 'string') {
                            errorMessage = responseData.error;
                        } else if (responseData.error.details && Array.isArray(responseData.error.details)) {
                            // Handle server-side validation errors
                            const serverErrors: Record<string, string> = {};
                            responseData.error.details.forEach((err: any) => {
                                const path = err.path || err.field || 'unknown';
                                serverErrors[path] = err.message || 'Validation error';
                            });
                            setErrors(serverErrors);
                            errorMessage = 'Please fix the validation errors';
                        } else if (responseData.error.message) {
                            errorMessage = responseData.error.message;
                        }
                    } else if (responseData.message) {
                        errorMessage = responseData.message;
                    }
                    alert(errorMessage);
                    return;
                }

                // Success
                console.log('Tenant created successfully:', responseData);
                onSuccess();
            } catch (fetchError: any) {
                clearTimeout(timeoutId);
                if (fetchError.name === 'AbortError') {
                    alert('Request timed out. Please try again.');
                } else {
                    throw fetchError; // Re-throw to be caught by outer catch
                }
            }
        } catch (error: any) {
            console.error('Error submitting form:', error);
            
            if (error instanceof z.ZodError) {
                const newErrors: Record<string, string> = {};
                error.issues.forEach((err: any) => {
                    const path = (err.path && err.path.length > 0) ? String(err.path[0]) : 'unknown';
                    // Combine multiple errors for the same field
                    if (newErrors[path]) {
                        newErrors[path] += `; ${err.message || 'Validation error'}`;
                    } else {
                        newErrors[path] = err.message || 'Validation error';
                    }
                });
                setErrors(newErrors);
                
                // Show alert with first error for user feedback
                const firstError = error.issues[0];
                if (firstError) {
                    alert(`Validation Error: ${firstError.message}\n\nPlease check all fields and try again.`);
                } else {
                    alert('Please fix the validation errors in the form');
                }
            } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
                alert('Network error: Could not connect to server. Please check your connection.');
            } else if (error.name === 'AbortError') {
                // Already handled in inner catch
                return;
            } else {
                alert(`An unexpected error occurred: ${error.message || 'Unknown error'}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <FileUpload
                label="Tenant Photo (Optional)"
                accept="image/*"
                value={formData.photo || undefined}
                onChange={(base64) => handleChange('photo', base64)}
                maxSize={2}
                type="image"
            />

            <Input
                label="Full Name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g. John Doe"
                required
                error={errors.name}
            />
            <Input
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="e.g. john@example.com"
                required
                error={errors.email}
            />
            <div>
                <Input
                    label="Mobile Number"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="e.g. +1234567890 or 01234567890"
                    required
                    error={errors.phone}
                />
                {!errors.phone && (
                    <p className={styles.helperText} style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                        Must contain 10-15 digits (format: +1234567890, 01234567890, or (123) 456-7890)
                    </p>
                )}
            </div>
            <div>
                <Input
                    label="Password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="Create a secure password"
                    required
                    error={errors.password}
                />
                {!errors.password && (
                    <p className={styles.helperText} style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                        Must be at least 8 characters with uppercase, lowercase, number, and special character
                    </p>
                )}
            </div>

            <div className={styles.selectGroup}>
                <label className={styles.label}>Identity Type (Optional)</label>
                <select
                    className={styles.select}
                    value={formData.identityType || ''}
                    onChange={(e) => handleChange('identityType', e.target.value)}
                >
                    <option value="">Select identity type...</option>
                    <option value="NID">National ID (NID)</option>
                    <option value="Passport">Passport</option>
                    <option value="Driving License">Driving License</option>
                    <option value="Other">Other</option>
                </select>
                {errors.identityType && <span className={styles.error}>{errors.identityType}</span>}
            </div>

            <FileUpload
                label="Identity Document (Optional)"
                accept="image/*,application/pdf,.doc,.docx"
                value={formData.identityDocument || undefined}
                onChange={(base64) => handleChange('identityDocument', base64)}
                maxSize={2}
                type="document"
            />

            <div className={styles.selectGroup}>
                <label className={styles.label}>Assign Flat (Optional)</label>
                <select
                    className={styles.select}
                    value={formData.flatId || ''}
                    onChange={(e) => handleChange('flatId', e.target.value)}
                >
                    <option value="">Select a flat...</option>
                    {availableFlats.map(f => (
                        <option key={f.id} value={f.id}>{f.label}</option>
                    ))}
                </select>
                {errors.flatId && <span className={styles.error}>{errors.flatId}</span>}
            </div>

            <Input
                label="Move In Date"
                type="date"
                value={formData.moveInDate}
                onChange={(e) => handleChange('moveInDate', e.target.value)}
                required
                error={errors.moveInDate}
            />
            <Input
                label="Security Deposit"
                type="number"
                value={formData.securityDeposit}
                onChange={(e) => handleChange('securityDeposit', e.target.value)}
                placeholder="e.g. 5000"
                required
                error={errors.securityDeposit}
            />

            <div className={styles.formActions}>
                <Button type="button" variant="secondary" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" isLoading={loading}>
                    Onboard Tenant
                </Button>
            </div>
        </form>
    );
}
