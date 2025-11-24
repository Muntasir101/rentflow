'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/app/components/ui/Button';
import { Modal } from '@/app/components/ui/Modal';
import { User, Plus, Home, Mail, Calendar, DollarSign, Users as UsersIcon, Building2, CheckCircle } from 'lucide-react';
import styles from './tenants.module.css';
import TenantForm from './TenantForm';

interface Tenant {
    id: string;
    user: {
        name: string;
        email: string;
    };
    flat: {
        number: string;
        building: {
            name: string;
        };
    } | null;
    moveInDate: string;
    moveOutDate?: string | null;
    securityDeposit: number;
}

interface Building {
    id: string;
    name: string;
    flats: { id: string; number: string; isOccupied: boolean }[];
}

export default function TenantsPage() {
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchTenants();
        fetchBuildings();
    }, []);

    const fetchTenants = async () => {
        try {
            const res = await fetch('/api/tenants');
            const response = await res.json();
            const tenants = response.success ? response.data : [];
            setTenants(Array.isArray(tenants) ? tenants : []);
        } catch (error) {
            console.error('Failed to fetch tenants:', error);
            setTenants([]);
        }
    };

    const fetchBuildings = async () => {
        try {
            const res = await fetch('/api/buildings');
            const response = await res.json();
            const buildings = response.success ? response.data : [];
            setBuildings(Array.isArray(buildings) ? buildings : []);
        } catch (error) {
            console.error('Failed to fetch buildings:', error);
            setBuildings([]);
        }
    };

    const handleSuccess = () => {
        setIsModalOpen(false);
        fetchTenants();
    };

    // Flatten available flats for selection
    const availableFlats = (buildings || []).flatMap(b =>
        (b.flats || []).filter(f => !f.isOccupied).map(f => ({
            id: f.id,
            label: `${b.name} - Flat ${f.number}`,
        }))
    );

    // Calculate stats - ensure tenants is always an array
    const tenantsArray = Array.isArray(tenants) ? tenants : [];
    const totalTenants = tenantsArray.length;
    const activeTenants = useMemo(() => {
        return tenantsArray.filter(t => !t.moveOutDate || t.moveOutDate === null).length;
    }, [tenantsArray]);
    const assignedTenants = tenantsArray.filter(t => t.flat !== null).length;
    const unassignedTenants = tenantsArray.filter(t => t.flat === null).length;
    const totalDeposits = tenantsArray.reduce((sum, t) => sum + (t.securityDeposit || 0), 0);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Tenants</h1>
                    <p className={styles.subtitle}>Manage tenant information and assignments</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus size={20} style={{ marginRight: '0.5rem' }} />
                    Onboard Tenant
                </Button>
            </div>

            {/* Stats Overview */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)', color: 'var(--primary)' }}>
                        <UsersIcon size={24} />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Total Tenants</p>
                        <p className={styles.statValue}>{totalTenants}</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)', color: 'var(--success)' }}>
                        <CheckCircle size={24} />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Active Tenants</p>
                        <p className={styles.statValue}>{activeTenants}</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(79, 70, 229, 0.1) 100%)', color: 'var(--primary)' }}>
                        <Home size={24} />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Assigned</p>
                        <p className={styles.statValue}>{assignedTenants}</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)', color: 'var(--warning)' }}>
                        <User size={24} />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Unassigned</p>
                        <p className={styles.statValue}>{unassignedTenants}</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(219, 39, 119, 0.1) 100%)', color: 'var(--accent)' }}>
                        <DollarSign size={24} />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Total Deposits</p>
                        <p className={styles.statValue}>${totalDeposits.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Tenants Table */}
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Tenant</th>
                            <th>Contact</th>
                            <th>Flat Assignment</th>
                            <th>Move In Date</th>
                            <th>Move Out Date</th>
                            <th>Deposit</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tenantsArray.map((tenant) => (
                            <tr key={tenant.id}>
                                <td>
                                    <div className={styles.userCell}>
                                        <div className={styles.avatar}>
                                            {tenant.user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className={styles.userName}>{tenant.user.name}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className={styles.contactCell}>
                                        <Mail size={14} />
                                        <span>{tenant.user.email}</span>
                                    </div>
                                </td>
                                <td>
                                    {tenant.flat ? (
                                        <div className={styles.flatBadge}>
                                            <Building2 size={14} />
                                            <span>{tenant.flat.building.name}</span>
                                            <span className={styles.flatNumber}>#{tenant.flat.number}</span>
                                        </div>
                                    ) : (
                                        <span className={styles.noFlat}>Not Assigned</span>
                                    )}
                                </td>
                                <td>
                                    <div className={styles.dateCell}>
                                        <Calendar size={14} />
                                        <span>{new Date(tenant.moveInDate).toLocaleDateString()}</span>
                                    </div>
                                </td>
                                <td>
                                    {tenant.moveOutDate ? (
                                        <div className={styles.dateCell}>
                                            <Calendar size={14} />
                                            <span>{new Date(tenant.moveOutDate).toLocaleDateString()}</span>
                                        </div>
                                    ) : (
                                        <span className={styles.noFlat}>-</span>
                                    )}
                                </td>
                                <td>
                                    <span className={styles.depositAmount}>${tenant.securityDeposit?.toLocaleString() || 0}</span>
                                </td>
                                <td>
                                    <Link href={`/dashboard/tenants/${tenant.id}`}>
                                        <Button variant="outline" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                                            View Details
                                        </Button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {tenants.length === 0 && (
                            <tr>
                                <td colSpan={7} className={styles.emptyState}>
                                    <UsersIcon size={48} />
                                    <p>No tenants yet. Start by onboarding your first tenant.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Onboard New Tenant"
            >
                <TenantForm
                    availableFlats={availableFlats}
                    onSuccess={handleSuccess}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
}
