'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import Link from 'next/link';
import styles from '../login/login.module.css';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'ADMIN',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Registration failed');
            } else {
                alert('Registration successful! You can now login.');
                router.push('/login');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <h1 className={styles.title}>Create Account</h1>
                <p className={styles.subtitle}>Register a new admin user</p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <Input
                        label="Full Name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Admin User"
                        required
                    />
                    <Input
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="admin@example.com"
                        required
                    />
                    <Input
                        label="Password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="••••••••"
                        required
                    />

                    <div style={{ marginTop: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#333', display: 'block', marginBottom: '0.5rem' }}>
                            Role
                        </label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            style={{
                                padding: '0.75rem',
                                borderRadius: '0.5rem',
                                border: '1px solid #eaeaea',
                                fontSize: '1rem',
                                width: '100%',
                            }}
                        >
                            <option value="ADMIN">Admin</option>
                            <option value="MANAGER">Manager</option>
                            <option value="STAFF">Staff</option>
                        </select>
                    </div>

                    {error && <div className={styles.error}>{error}</div>}

                    <Button type="submit" isLoading={loading} className={styles.submitButton}>
                        Register
                    </Button>

                    <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem', color: '#666' }}>
                        Already have an account?{' '}
                        <Link href="/login" style={{ color: '#0070f3', textDecoration: 'none' }}>
                            Login here
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
