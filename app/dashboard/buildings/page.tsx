'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { Modal } from '@/app/components/ui/Modal';
import { Building2, Plus, MapPin, Home, Users, DollarSign, ArrowRight } from 'lucide-react';
import styles from './buildings.module.css';

interface Building {
    id: string;
    name: string;
    address: string;
    flats: any[];
}

export default function BuildingsPage() {
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newBuilding, setNewBuilding] = useState({ name: '', address: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchBuildings();
    }, []);

    const fetchBuildings = async () => {
        const res = await fetch('/api/buildings');
        const response = await res.json();
        const buildings = response.success ? response.data : [];
        setBuildings(Array.isArray(buildings) ? buildings : []);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/buildings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newBuilding),
            });
            if (res.ok) {
                setIsModalOpen(false);
                setNewBuilding({ name: '', address: '' });
                fetchBuildings();
            }
        } finally {
            setLoading(false);
        }
    };

    // Calculate stats
    const totalBuildings = buildings.length;
    const totalFlats = buildings.reduce((sum, b) => sum + (b.flats?.length || 0), 0);
    const occupiedFlats = buildings.reduce((sum, b) =>
        sum + (b.flats?.filter((f: any) => f.isOccupied).length || 0), 0
    );
    const totalRevenue = buildings.reduce((sum, b) =>
        sum + (b.flats?.filter((f: any) => f.isOccupied).reduce((s: number, f: any) => s + f.rentAmount, 0) || 0), 0
    );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Buildings</h1>
                    <p className={styles.subtitle}>Manage your properties and track occupancy</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus size={20} style={{ marginRight: '0.5rem' }} />
                    Add Building
                </Button>
            </div>

            {/* Overview Stats */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)', color: 'var(--primary)' }}>
                        <Building2 size={24} />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Total Buildings</p>
                        <p className={styles.statValue}>{totalBuildings}</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)', color: 'var(--success)' }}>
                        <Home size={24} />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Total Flats</p>
                        <p className={styles.statValue}>{totalFlats}</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)', color: 'var(--warning)' }}>
                        <Users size={24} />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Occupied</p>
                        <p className={styles.statValue}>{occupiedFlats}</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(219, 39, 119, 0.1) 100%)', color: 'var(--accent)' }}>
                        <DollarSign size={24} />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Total Revenue</p>
                        <p className={styles.statValue}>${totalRevenue.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Buildings Grid */}
            <div className={styles.grid}>
                {buildings.map((building) => {
                    const flatsCount = building.flats?.length || 0;
                    const occupiedCount = building.flats?.filter((f: any) => f.isOccupied).length || 0;
                    const occupancyRate = flatsCount > 0 ? Math.round((occupiedCount / flatsCount) * 100) : 0;
                    const revenue = building.flats?.filter((f: any) => f.isOccupied).reduce((sum: number, f: any) => sum + f.rentAmount, 0) || 0;

                    return (
                        <Link key={building.id} href={`/dashboard/buildings/${building.id}`} className={styles.card}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardIcon}>
                                    <Building2 size={28} />
                                </div>
                                <div className={styles.viewButton}>
                                    <ArrowRight size={20} />
                                </div>
                            </div>

                            <h3 className={styles.cardTitle}>{building.name}</h3>

                            <div className={styles.cardAddress}>
                                <MapPin size={16} />
                                <span>{building.address}</span>
                            </div>

                            <div className={styles.cardStats}>
                                <div className={styles.cardStat}>
                                    <Home size={16} />
                                    <span>{flatsCount} Flats</span>
                                </div>
                                <div className={styles.cardStat}>
                                    <Users size={16} />
                                    <span>{occupiedCount} Occupied</span>
                                </div>
                            </div>

                            <div className={styles.cardFooter}>
                                <div className={styles.occupancy}>
                                    <span className={styles.occupancyLabel}>Occupancy</span>
                                    <span className={styles.occupancyValue}>{occupancyRate}%</span>
                                </div>
                                <div className={styles.revenue}>
                                    <span className={styles.revenueLabel}>Revenue</span>
                                    <span className={styles.revenueValue}>${revenue.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className={styles.progressBar}>
                                <div
                                    className={styles.progressFill}
                                    style={{ width: `${occupancyRate}%` }}
                                />
                            </div>
                        </Link>
                    );
                })}

                {buildings.length === 0 && (
                    <div className={styles.emptyState}>
                        <Building2 size={64} />
                        <h3>No Buildings Yet</h3>
                        <p>Start by adding your first building to manage flats and tenants</p>
                        <Button onClick={() => setIsModalOpen(true)}>
                            <Plus size={18} style={{ marginRight: '0.5rem' }} />
                            Add First Building
                        </Button>
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Building"
            >
                <form onSubmit={handleCreate} className={styles.form}>
                    <Input
                        label="Building Name"
                        value={newBuilding.name}
                        onChange={(e) => setNewBuilding({ ...newBuilding, name: e.target.value })}
                        placeholder="e.g. Sunset Residency, Tower A"
                        required
                    />
                    <Input
                        label="Address"
                        value={newBuilding.address}
                        onChange={(e) => setNewBuilding({ ...newBuilding, address: e.target.value })}
                        placeholder="e.g. 123 Main Street, City"
                        required
                    />
                    <div className={styles.formActions}>
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={loading}>
                            Create Building
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
