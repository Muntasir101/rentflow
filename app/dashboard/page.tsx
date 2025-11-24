'use client';

import { useState, useEffect } from 'react';
import styles from './dashboard.module.css';
import { Users, Building2, Banknote, AlertCircle, TrendingUp, Home } from 'lucide-react';

export default function DashboardPage() {
    const [stats, setStats] = useState({
        totalTenants: 0,
        totalBuildings: 0,
        totalFlats: 0,
        occupiedFlats: 0,
        pendingPayments: 0,
        activeRequests: 0,
    });

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            // Fetch tenants
            const tenantsRes = await fetch('/api/tenants');
            const tenantsData = await tenantsRes.json();
            const tenants = tenantsData.success ? tenantsData.data : [];

            // Fetch buildings
            const buildingsRes = await fetch('/api/buildings');
            const buildingsData = await buildingsRes.json();
            const buildings = buildingsData.success ? buildingsData.data : [];

            // Calculate stats
            let totalFlats = 0;
            let occupiedFlats = 0;

            if (Array.isArray(buildings)) {
                buildings.forEach((building: any) => {
                    totalFlats += building.flats?.length || 0;
                    occupiedFlats += building.flats?.filter((f: any) => f.isOccupied).length || 0;
                });
            }

            setStats({
                totalTenants: Array.isArray(tenants) ? tenants.length : 0,
                totalBuildings: Array.isArray(buildings) ? buildings.length : 0,
                totalFlats,
                occupiedFlats,
                pendingPayments: 0,
                activeRequests: 0,
            });
        } catch (error) {
            console.error('Failed to fetch dashboard stats:', error);
        }
    };

    const occupancyRate = stats.totalFlats > 0
        ? Math.round((stats.occupiedFlats / stats.totalFlats) * 100)
        : 0;

    // Mock data for charts
    const monthlyRevenue = [
        { month: 'Jan', amount: 12000 },
        { month: 'Feb', amount: 15000 },
        { month: 'Mar', amount: 13500 },
        { month: 'Apr', amount: 18000 },
        { month: 'May', amount: 16500 },
        { month: 'Jun', amount: 20000 },
    ];

    const maxRevenue = Math.max(...monthlyRevenue.map(m => m.amount));

    const paymentStatus = [
        { label: 'Paid', value: 75, color: 'var(--success)' },
        { label: 'Pending', value: 20, color: 'var(--warning)' },
        { label: 'Overdue', value: 5, color: 'var(--danger)' },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Dashboard Overview</h1>
                <p className={styles.subtitle}>Welcome back! Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <div className={styles.statIcon}>
                            <Users size={24} />
                        </div>
                    </div>
                    <p className={styles.statLabel}>Total Tenants</p>
                    <p className={styles.statValue}>{stats.totalTenants}</p>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)', color: 'var(--success)' }}>
                            <Building2 size={24} />
                        </div>
                    </div>
                    <p className={styles.statLabel}>Occupancy Rate</p>
                    <p className={styles.statValue}>{occupancyRate}%</p>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)', color: 'var(--warning)' }}>
                            <Banknote size={24} />
                        </div>
                    </div>
                    <p className={styles.statLabel}>Total Flats</p>
                    <p className={styles.statValue}>{stats.totalFlats}</p>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)', color: 'var(--secondary)' }}>
                            <Home size={24} />
                        </div>
                    </div>
                    <p className={styles.statLabel}>Buildings</p>
                    <p className={styles.statValue}>{stats.totalBuildings}</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className={styles.chartsGrid}>
                {/* Revenue Trend Chart */}
                <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                        <h3 className={styles.chartTitle}>
                            <TrendingUp size={20} />
                            Revenue Trend
                        </h3>
                        <span className={styles.chartPeriod}>Last 6 Months</span>
                    </div>
                    <div className={styles.lineChart}>
                        {monthlyRevenue.map((data, index) => (
                            <div key={index} className={styles.chartBar}>
                                <div
                                    className={styles.barFill}
                                    style={{
                                        height: `${(data.amount / maxRevenue) * 100}%`,
                                    }}
                                >
                                    <span className={styles.barValue}>${(data.amount / 1000).toFixed(0)}k</span>
                                </div>
                                <span className={styles.barLabel}>{data.month}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Payment Status Pie Chart */}
                <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                        <h3 className={styles.chartTitle}>
                            <Banknote size={20} />
                            Payment Status
                        </h3>
                        <span className={styles.chartPeriod}>This Month</span>
                    </div>
                    <div className={styles.pieChartContainer}>
                        <div className={styles.pieChart}>
                            {paymentStatus.map((status, index) => {
                                const prevTotal = paymentStatus.slice(0, index).reduce((sum, s) => sum + s.value, 0);
                                return (
                                    <div
                                        key={index}
                                        className={styles.pieSlice}
                                        style={{
                                            '--percentage': `${status.value}%`,
                                            '--rotation': `${(prevTotal / 100) * 360}deg`,
                                            '--color': status.color,
                                        } as any}
                                    />
                                );
                            })}
                        </div>
                        <div className={styles.pieLegend}>
                            {paymentStatus.map((status, index) => (
                                <div key={index} className={styles.legendItem}>
                                    <div className={styles.legendColor} style={{ backgroundColor: status.color }} />
                                    <span className={styles.legendLabel}>{status.label}</span>
                                    <span className={styles.legendValue}>{status.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Occupancy Overview */}
                <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                        <h3 className={styles.chartTitle}>
                            <Building2 size={20} />
                            Occupancy Overview
                        </h3>
                    </div>
                    <div className={styles.occupancyStats}>
                        <div className={styles.occupancyItem}>
                            <span className={styles.occupancyLabel}>Total Flats</span>
                            <span className={styles.occupancyValue}>{stats.totalFlats}</span>
                        </div>
                        <div className={styles.occupancyItem}>
                            <span className={styles.occupancyLabel}>Occupied</span>
                            <span className={styles.occupancyValue} style={{ color: 'var(--success)' }}>{stats.occupiedFlats}</span>
                        </div>
                        <div className={styles.occupancyItem}>
                            <span className={styles.occupancyLabel}>Vacant</span>
                            <span className={styles.occupancyValue} style={{ color: 'var(--warning)' }}>{stats.totalFlats - stats.occupiedFlats}</span>
                        </div>
                    </div>
                    <div className={styles.progressBar}>
                        <div
                            className={styles.progressFill}
                            style={{ width: `${occupancyRate}%` }}
                        />
                    </div>
                    <p className={styles.progressLabel}>{occupancyRate}% Occupied</p>
                </div>
            </div>
        </div>
    );
}
