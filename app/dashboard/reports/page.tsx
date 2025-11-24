'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import {
    TrendingUp,
    DollarSign,
    Users,
    Building2,
    Wrench,
    Download,
    Calendar,
    BarChart3,
} from 'lucide-react';
import styles from './reports.module.css';

interface AnalyticsData {
    period: {
        start: string;
        end: string;
    };
    financial: {
        totalRevenue: number;
        revenueByType: Record<string, number>;
        revenueByMethod: Record<string, number>;
        monthlyRevenue: { month: string; amount: number }[];
        averageRent: number;
        totalDeposits: number;
    };
    tenants: {
        total: number;
        active: number;
        withFlats: number;
        newTenants: number;
        movedOut: number;
        turnoverRate: number;
    };
    properties: {
        totalBuildings: number;
        totalFlats: number;
        occupiedFlats: number;
        occupancyRate: number;
        revenueByBuilding: Record<string, number>;
    };
    maintenance: {
        totalCost: number;
        requestsByStatus: Record<string, number>;
        requestsByCategory: Record<string, number>;
        costByCategory: Record<string, number>;
        monthlyMaintenance: { month: string; cost: number }[];
        totalRequests: number;
    };
    payments: {
        byStatus: Record<string, number>;
        totalCount: number;
    };
    topPayingTenants: { name: string; amount: number }[];
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

export default function ReportsPage() {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState(() => {
        const date = new Date();
        date.setMonth(date.getMonth() - 12);
        return date.toISOString().split('T')[0];
    });
    const [endDate, setEndDate] = useState(() => {
        return new Date().toISOString().split('T')[0];
    });

    useEffect(() => {
        fetchAnalytics();
    }, [startDate, endDate]);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/analytics?startDate=${startDate}&endDate=${endDate}`);
            const response = await res.json();
            if (response.success) {
                setAnalytics(response.data);
            } else {
                console.error('Failed to fetch analytics:', response);
            }
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        if (!analytics) return;

        // Create CSV content
        let csv = 'Rent Management Analytics Report\n';
        csv += `Period: ${new Date(analytics.period.start).toLocaleDateString()} - ${new Date(analytics.period.end).toLocaleDateString()}\n\n`;

        csv += 'Financial Summary\n';
        csv += `Total Revenue,$${analytics.financial.totalRevenue.toFixed(2)}\n`;
        csv += `Average Rent,$${analytics.financial.averageRent.toFixed(2)}\n`;
        csv += `Total Deposits,$${analytics.financial.totalDeposits.toFixed(2)}\n\n`;

        csv += 'Revenue by Type\n';
        Object.entries(analytics.financial.revenueByType).forEach(([type, amount]) => {
            csv += `${type},$${amount.toFixed(2)}\n`;
        });
        csv += '\n';

        csv += 'Tenant Summary\n';
        csv += `Total Tenants,${analytics.tenants.total}\n`;
        csv += `Active Tenants,${analytics.tenants.active}\n`;
        csv += `New Tenants (Period),${analytics.tenants.newTenants}\n`;
        csv += `Moved Out (Period),${analytics.tenants.movedOut}\n`;
        csv += `Turnover Rate,${analytics.tenants.turnoverRate.toFixed(2)}%\n\n`;

        csv += 'Property Summary\n';
        csv += `Total Buildings,${analytics.properties.totalBuildings}\n`;
        csv += `Total Flats,${analytics.properties.totalFlats}\n`;
        csv += `Occupied Flats,${analytics.properties.occupiedFlats}\n`;
        csv += `Occupancy Rate,${analytics.properties.occupancyRate.toFixed(2)}%\n\n`;

        csv += 'Maintenance Summary\n';
        csv += `Total Cost,$${analytics.maintenance.totalCost.toFixed(2)}\n`;
        csv += `Total Requests,${analytics.maintenance.totalRequests}\n\n`;

        // Download CSV
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    // Prepare chart data
    const revenueByTypeData = useMemo(() => {
        if (!analytics) return [];
        return Object.entries(analytics.financial.revenueByType).map(([name, value]) => ({
            name,
            value: parseFloat(value.toFixed(2)),
        }));
    }, [analytics]);

    const revenueByMethodData = useMemo(() => {
        if (!analytics) return [];
        return Object.entries(analytics.financial.revenueByMethod).map(([name, value]) => ({
            name,
            value: parseFloat(value.toFixed(2)),
        }));
    }, [analytics]);

    const revenueByBuildingData = useMemo(() => {
        if (!analytics) return [];
        return Object.entries(analytics.properties.revenueByBuilding)
            .map(([name, value]) => ({
                name: name.length > 15 ? name.substring(0, 15) + '...' : name,
                value: parseFloat(value.toFixed(2)),
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10);
    }, [analytics]);

    const requestsByCategoryData = useMemo(() => {
        if (!analytics) return [];
        return Object.entries(analytics.maintenance.requestsByCategory).map(([name, value]) => ({
            name,
            value,
        }));
    }, [analytics]);

    const costByCategoryData = useMemo(() => {
        if (!analytics) return [];
        return Object.entries(analytics.maintenance.costByCategory).map(([name, value]) => ({
            name,
            value: parseFloat(value.toFixed(2)),
        }));
    }, [analytics]);

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Loading analytics...</div>
            </div>
        );
    }

    if (!analytics) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>Failed to load analytics data</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Reports & Analytics</h1>
                    <p className={styles.subtitle}>Comprehensive insights into your rental business</p>
                </div>
                <div className={styles.headerActions}>
                    <div className={styles.dateRange}>
                        <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            label="Start Date"
                        />
                        <Input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            label="End Date"
                        />
                    </div>
                    <Button onClick={handleExport} variant="outline">
                        <Download size={20} style={{ marginRight: '0.5rem' }} />
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className={styles.metricsGrid}>
                <div className={styles.metricCard}>
                    <div className={styles.metricIcon} style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                        <DollarSign size={24} />
                    </div>
                    <div className={styles.metricContent}>
                        <p className={styles.metricLabel}>Total Revenue</p>
                        <p className={styles.metricValue}>${analytics.financial.totalRevenue.toLocaleString()}</p>
                    </div>
                </div>

                <div className={styles.metricCard}>
                    <div className={styles.metricIcon} style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
                        <Users size={24} />
                    </div>
                    <div className={styles.metricContent}>
                        <p className={styles.metricLabel}>Active Tenants</p>
                        <p className={styles.metricValue}>{analytics.tenants.active}</p>
                    </div>
                </div>

                <div className={styles.metricCard}>
                    <div className={styles.metricIcon} style={{ background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899' }}>
                        <Building2 size={24} />
                    </div>
                    <div className={styles.metricContent}>
                        <p className={styles.metricLabel}>Occupancy Rate</p>
                        <p className={styles.metricValue}>{analytics.properties.occupancyRate.toFixed(1)}%</p>
                    </div>
                </div>

                <div className={styles.metricCard}>
                    <div className={styles.metricIcon} style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                        <Wrench size={24} />
                    </div>
                    <div className={styles.metricContent}>
                        <p className={styles.metricLabel}>Maintenance Cost</p>
                        <p className={styles.metricValue}>${analytics.maintenance.totalCost.toLocaleString()}</p>
                    </div>
                </div>

                <div className={styles.metricCard}>
                    <div className={styles.metricIcon} style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                        <TrendingUp size={24} />
                    </div>
                    <div className={styles.metricContent}>
                        <p className={styles.metricLabel}>Average Rent</p>
                        <p className={styles.metricValue}>${analytics.financial.averageRent.toFixed(2)}</p>
                    </div>
                </div>

                <div className={styles.metricCard}>
                    <div className={styles.metricIcon} style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
                        <BarChart3 size={24} />
                    </div>
                    <div className={styles.metricContent}>
                        <p className={styles.metricLabel}>Total Deposits</p>
                        <p className={styles.metricValue}>${analytics.financial.totalDeposits.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className={styles.chartsGrid}>
                {/* Monthly Revenue Trend */}
                <div className={styles.chartCard}>
                    <h3 className={styles.chartTitle}>Monthly Revenue Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={analytics.financial.monthlyRevenue}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                            <Legend />
                            <Line type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={2} name="Revenue" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Revenue by Type */}
                <div className={styles.chartCard}>
                    <h3 className={styles.chartTitle}>Revenue by Type</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={revenueByTypeData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {revenueByTypeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Revenue by Payment Method */}
                <div className={styles.chartCard}>
                    <h3 className={styles.chartTitle}>Revenue by Payment Method</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={revenueByMethodData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                            <Legend />
                            <Bar dataKey="value" fill="#8b5cf6" name="Revenue" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Revenue by Building */}
                <div className={styles.chartCard}>
                    <h3 className={styles.chartTitle}>Top Buildings by Revenue</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={revenueByBuildingData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={100} />
                            <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                            <Legend />
                            <Bar dataKey="value" fill="#ec4899" name="Revenue" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Monthly Maintenance Trend */}
                <div className={styles.chartCard}>
                    <h3 className={styles.chartTitle}>Monthly Maintenance Cost Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={analytics.maintenance.monthlyMaintenance}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                            <Legend />
                            <Line type="monotone" dataKey="cost" stroke="#f59e0b" strokeWidth={2} name="Cost" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Maintenance Requests by Category */}
                <div className={styles.chartCard}>
                    <h3 className={styles.chartTitle}>Maintenance Requests by Category</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={requestsByCategoryData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#10b981" name="Requests" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Maintenance Cost by Category */}
                <div className={styles.chartCard}>
                    <h3 className={styles.chartTitle}>Maintenance Cost by Category</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={costByCategoryData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {costByCategoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Top Paying Tenants */}
            {analytics.topPayingTenants.length > 0 && (
                <div className={styles.tableCard}>
                    <h3 className={styles.chartTitle}>Top Paying Tenants</h3>
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Tenant Name</th>
                                    <th>Total Paid</th>
                                </tr>
                            </thead>
                            <tbody>
                                {analytics.topPayingTenants.map((tenant, index) => (
                                    <tr key={tenant.name}>
                                        <td>{index + 1}</td>
                                        <td>{tenant.name}</td>
                                        <td className={styles.amount}>${tenant.amount.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

