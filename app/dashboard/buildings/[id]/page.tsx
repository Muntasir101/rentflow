'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { Modal } from '@/app/components/ui/Modal';
import { Building2, MapPin, Plus, Home, DollarSign, Users, TrendingUp } from 'lucide-react';
import styles from './building-details.module.css';

interface Flat {
    id: string;
    number: string;
    rentAmount: number;
    isOccupied: boolean;
}

interface Building {
    id: string;
    name: string;
    address: string;
    flats: Flat[];
}

export default function BuildingDetailsPage() {
    const params = useParams();
    const id = params.id as string;
    const [building, setBuilding] = useState<Building | null>(null);
    const [flats, setFlats] = useState<Flat[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newFlat, setNewFlat] = useState({ number: '', rentAmount: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            fetchBuildingDetails();
            fetchFlats();
        }
    }, [id]);

    const fetchBuildingDetails = async () => {
        const res = await fetch('/api/buildings');
        const response = await res.json();
        const buildings = response.success ? response.data : [];
        const b = Array.isArray(buildings) ? buildings.find((b: any) => b.id === id) : null;
        setBuilding(b);
    };

    const fetchFlats = async () => {
        const res = await fetch(`/api/buildings/${id}/flats`);
        const response = await res.json();
        const flats = response.success ? response.data : [];
        setFlats(Array.isArray(flats) ? flats : []);
    };

    const handleCreateFlat = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`/api/buildings/${id}/flats`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newFlat),
            });
            if (res.ok) {
                setIsModalOpen(false);
                setNewFlat({ number: '', rentAmount: '' });
                fetchFlats();
            }
        } finally {
            setLoading(false);
        }
    };

    if (!building) return <div className={styles.loading}>Loading...</div>;

    const occupiedFlats = flats.filter(f => f.isOccupied).length;
    const vacantFlats = flats.filter(f => !f.isOccupied).length;
    const occupancyRate = flats.length > 0 ? Math.round((occupiedFlats / flats.length) * 100) : 0;
    const totalRevenue = flats.filter(f => f.isOccupied).reduce((sum, f) => sum + f.rentAmount, 0);
    const potentialRevenue = flats.reduce((sum, f) => sum + f.rentAmount, 0);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <div className={styles.buildingIcon}>
                        <Building2 size={32} />
                    </div>
                    <div>
                        <h1 className={styles.title}>{building.name}</h1>
                        <div className={styles.address}>
                            <MapPin size={16} />
                            <span>{building.address}</span>
                        </div>
                    </div>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus size={20} style={{ marginRight: '0.5rem' }} />
                    Add Flat
                </Button>
            </div>

            {/* Stats Cards */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)', color: 'var(--primary)' }}>
                        <Home size={24} />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Total Flats</p>
                        <p className={styles.statValue}>{flats.length}</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)', color: 'var(--success)' }}>
                        <Users size={24} />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Occupied</p>
                        <p className={styles.statValue} style={{ color: 'var(--success)' }}>{occupiedFlats}</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)', color: 'var(--warning)' }}>
                        <Home size={24} />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Vacant</p>
                        <p className={styles.statValue} style={{ color: 'var(--warning)' }}>{vacantFlats}</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(219, 39, 119, 0.1) 100%)', color: 'var(--accent)' }}>
                        <DollarSign size={24} />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Monthly Revenue</p>
                        <p className={styles.statValue}>${totalRevenue.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Occupancy Overview */}
            <div className={styles.occupancyCard}>
                <div className={styles.occupancyHeader}>
                    <h3 className={styles.occupancyTitle}>
                        <TrendingUp size={20} />
                        Occupancy Overview
                    </h3>
                    <span className={styles.occupancyRate}>{occupancyRate}%</span>
                </div>
                <div className={styles.progressBar}>
                    <div
                        className={styles.progressFill}
                        style={{ width: `${occupancyRate}%` }}
                    />
                </div>
                <div className={styles.revenueInfo}>
                    <div className={styles.revenueItem}>
                        <span className={styles.revenueLabel}>Current Revenue</span>
                        <span className={styles.revenueValue}>${totalRevenue.toLocaleString()}</span>
                    </div>
                    <div className={styles.revenueItem}>
                        <span className={styles.revenueLabel}>Potential Revenue</span>
                        <span className={styles.revenueValue}>${potentialRevenue.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Flats Grid */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Flats ({flats.length})</h2>
                <div className={styles.flatsGrid}>
                    {flats.map((flat) => (
                        <div key={flat.id} className={styles.flatCard}>
                            <div className={styles.flatHeader}>
                                <div className={styles.flatNumber}>
                                    <Home size={18} />
                                    Flat {flat.number}
                                </div>
                                <span className={`${styles.statusBadge} ${flat.isOccupied ? styles.occupied : styles.vacant}`}>
                                    {flat.isOccupied ? 'Occupied' : 'Vacant'}
                                </span>
                            </div>
                            <div className={styles.flatBody}>
                                <div className={styles.flatRent}>
                                    <DollarSign size={16} />
                                    <span>${flat.rentAmount}/month</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {flats.length === 0 && (
                        <div className={styles.emptyState}>
                            <Home size={48} />
                            <p>No flats added yet</p>
                            <Button onClick={() => setIsModalOpen(true)}>
                                <Plus size={18} style={{ marginRight: '0.5rem' }} />
                                Add First Flat
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Flat"
            >
                <form onSubmit={handleCreateFlat} className={styles.form}>
                    <Input
                        label="Flat Number"
                        value={newFlat.number}
                        onChange={(e) => setNewFlat({ ...newFlat, number: e.target.value })}
                        placeholder="e.g. 101, A-1, etc."
                        required
                    />
                    <Input
                        label="Monthly Rent Amount"
                        type="number"
                        value={newFlat.rentAmount}
                        onChange={(e) => setNewFlat({ ...newFlat, rentAmount: e.target.value })}
                        placeholder="e.g. 1200"
                        required
                    />
                    <div className={styles.formActions}>
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={loading}>
                            Add Flat
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
