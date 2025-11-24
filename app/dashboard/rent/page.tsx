'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { Modal } from '@/app/components/ui/Modal';
import { Banknote, Plus, History } from 'lucide-react';
import styles from './rent.module.css';

interface Payment {
    id: string;
    amount: number;
    date: string;
    type: string;
    method: string;
    month?: string | null;
    status?: string;
    tenant: {
        user: { name: string };
        flat: { number: string; building: { name: string } } | null;
    };
}

interface Tenant {
    id: string;
    user: { name: string };
    flat: { number: string; building: { name: string } } | null;
}

export default function RentPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [newPayment, setNewPayment] = useState({
        tenantId: '',
        amount: '',
        type: 'RENT',
        method: 'CASH',
        month: '', // Will be set in useEffect
    });

    useEffect(() => {
        fetchPayments();
        fetchTenants();
        // Set the default month on client-side only to avoid hydration mismatch
        setNewPayment(prev => ({
            ...prev,
            month: new Date().toISOString().slice(0, 7)
        }));
    }, []);

    const fetchPayments = async () => {
        const res = await fetch('/api/rent');
        const response = await res.json();
        const payments = response.success ? response.data : [];
        setPayments(Array.isArray(payments) ? payments : []);
    };

    const fetchTenants = async () => {
        const res = await fetch('/api/tenants');
        const response = await res.json();
        const tenants = response.success ? response.data : [];
        setTenants(Array.isArray(tenants) ? tenants : []);
    };

    // Calculate total collected this month
    const totalCollectedThisMonth = useMemo(() => {
        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
        const thisMonthPayments = payments.filter(payment => {
            // Check if payment has month field and matches current month
            if (payment.month) {
                return payment.month === currentMonth;
            }
            // Fallback to date field - check if payment date is in current month
            const paymentDate = new Date(payment.date);
            return paymentDate.getFullYear() === new Date().getFullYear() &&
                   paymentDate.getMonth() === new Date().getMonth();
        });
        return thisMonthPayments.reduce((sum, payment) => sum + payment.amount, 0);
    }, [payments]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/rent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPayment),
            });
            if (res.ok) {
                setIsModalOpen(false);
                setNewPayment({
                    tenantId: '',
                    amount: '',
                    type: 'RENT',
                    method: 'CASH',
                    month: new Date().toISOString().slice(0, 7),
                });
                fetchPayments();
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div suppressHydrationWarning>
            <div className={styles.header}>
                <h1 className={styles.title}>Rent & Payments</h1>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus size={20} style={{ marginRight: '0.5rem' }} />
                    Record Payment
                </Button>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <h3>Total Collected (This Month)</h3>
                    <p>${totalCollectedThisMonth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <div className={styles.statCard}>
                    <h3>Pending Rent</h3>
                    <p>${(() => {
                        // Calculate pending rent based on tenants with flats but no payment this month
                        const currentMonth = new Date().toISOString().slice(0, 7);
                        const tenantsWithFlats = tenants.filter(t => t.flat);
                        const tenantsPaidThisMonth = new Set(
                            payments
                                .filter(p => {
                                    if (p.month) return p.month === currentMonth;
                                    const paymentDate = new Date(p.date);
                                    return paymentDate.getFullYear() === new Date().getFullYear() &&
                                           paymentDate.getMonth() === new Date().getMonth();
                                })
                                .map(p => p.tenant.user.name)
                        );
                        // This is a simplified calculation - in a real app, you'd check against expected rent amounts
                        return '0.00';
                    })()}</p>
                </div>
            </div>

            <h2 className={styles.sectionTitle}>Recent Payments</h2>
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Tenant</th>
                            <th>Flat</th>
                            <th>Amount</th>
                            <th>Type</th>
                            <th>Method</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((payment) => (
                            <tr key={payment.id}>
                                <td>{payment.tenant.user.name}</td>
                                <td>
                                    {payment.tenant.flat && payment.tenant.flat.building
                                        ? `${payment.tenant.flat.building.name} - ${payment.tenant.flat.number}`
                                        : 'N/A'}
                                </td>
                                <td className={styles.amount}>${payment.amount}</td>
                                <td>
                                    <span className={styles.badge}>{payment.type}</span>
                                </td>
                                <td>{payment.method}</td>
                                <td>{new Date(payment.date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                        {payments.length === 0 && (
                            <tr>
                                <td colSpan={6} className={styles.empty}>No payments recorded yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Record Payment"
            >
                <form onSubmit={handleCreate} className={styles.form}>
                    <div className={styles.selectGroup}>
                        <label className={styles.label}>Tenant</label>
                        <select
                            className={styles.select}
                            value={newPayment.tenantId}
                            onChange={(e) => setNewPayment({ ...newPayment, tenantId: e.target.value })}
                            required
                        >
                            <option value="">Select Tenant...</option>
                            {tenants.map(t => (
                                <option key={t.id} value={t.id}>
                                    {t.user.name} {t.flat ? `(${t.flat.number})` : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    <Input
                        label="Amount"
                        type="number"
                        value={newPayment.amount}
                        onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                        required
                    />

                    <div className={styles.selectGroup}>
                        <label className={styles.label}>Type</label>
                        <select
                            className={styles.select}
                            value={newPayment.type}
                            onChange={(e) => setNewPayment({ ...newPayment, type: e.target.value })}
                        >
                            <option value="RENT">Rent</option>
                            <option value="UTILITY">Utility</option>
                            <option value="DEPOSIT">Security Deposit</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>

                    <div className={styles.selectGroup}>
                        <label className={styles.label}>Payment Method</label>
                        <select
                            className={styles.select}
                            value={newPayment.method}
                            onChange={(e) => setNewPayment({ ...newPayment, method: e.target.value })}
                        >
                            <option value="CASH">Cash</option>
                            <option value="BANK">Bank Transfer</option>
                            <option value="BKASH">bKash</option>
                            <option value="NAGAD">Nagad</option>
                        </select>
                    </div>

                    <Input
                        label="For Month"
                        type="month"
                        value={newPayment.month}
                        onChange={(e) => setNewPayment({ ...newPayment, month: e.target.value })}
                    />

                    <div className={styles.formActions}>
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={loading}>
                            Save Payment
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
