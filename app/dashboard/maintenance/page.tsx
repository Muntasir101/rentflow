'use client';

import { useState, useEffect, useMemo } from 'react';
import { DollarSign, User, Building2, Calendar, Filter, Download, Search } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import styles from './maintenance.module.css';

interface ServiceRequest {
    id: string;
    category: string;
    description: string;
    status: string;
    cost: number | null;
    createdAt: string;
    tenant: {
        id: string;
        user: {
            id: string;
            name: string;
            email: string;
        };
        flat: {
            number: string;
            building: {
                name: string;
            };
        } | null;
    };
    assignedTo: {
        id: string;
        name: string;
    } | null;
}

interface UserCostSummary {
    userId: string;
    userName: string;
    userEmail: string;
    flatInfo: string;
    totalCost: number;
    requestCount: number;
    requests: ServiceRequest[];
}

export default function MaintenanceCostsPage() {
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [sortBy, setSortBy] = useState<'name' | 'cost' | 'count'>('cost');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/requests');
            const response = await res.json();
            const requestsData = response.success ? response.data : [];
            // Filter only requests with costs
            const requestsWithCosts = requestsData.filter((r: ServiceRequest) => r.cost && r.cost > 0);
            setRequests(Array.isArray(requestsWithCosts) ? requestsWithCosts : []);
        } catch (error) {
            console.error('Failed to fetch requests:', error);
        } finally {
            setLoading(false);
        }
    };

    // Group requests by user and calculate totals
    const userCostSummaries = useMemo(() => {
        const userMap = new Map<string, UserCostSummary>();

        requests.forEach((request) => {
            if (!request.cost || request.cost <= 0) return;

            const userId = request.tenant.user.id;
            const flatInfo = request.tenant.flat
                ? `${request.tenant.flat.building.name} - ${request.tenant.flat.number}`
                : 'No Flat';

            if (!userMap.has(userId)) {
                userMap.set(userId, {
                    userId,
                    userName: request.tenant.user.name,
                    userEmail: request.tenant.user.email,
                    flatInfo,
                    totalCost: 0,
                    requestCount: 0,
                    requests: [],
                });
            }

            const summary = userMap.get(userId)!;
            summary.totalCost += request.cost;
            summary.requestCount += 1;
            summary.requests.push(request);
        });

        return Array.from(userMap.values());
    }, [requests]);

    // Filter and sort summaries
    const filteredAndSortedSummaries = useMemo(() => {
        let filtered = userCostSummaries;

        // Apply search filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (summary) =>
                    summary.userName.toLowerCase().includes(searchLower) ||
                    summary.userEmail.toLowerCase().includes(searchLower) ||
                    summary.flatInfo.toLowerCase().includes(searchLower)
            );
        }

        // Apply status filter
        if (statusFilter !== 'ALL') {
            filtered = filtered.map((summary) => ({
                ...summary,
                requests: summary.requests.filter((r) => r.status === statusFilter),
            })).filter((summary) => summary.requests.length > 0);
        }

        // Recalculate totals after status filter
        filtered = filtered.map((summary) => ({
            ...summary,
            totalCost: summary.requests.reduce((sum, r) => sum + (r.cost || 0), 0),
            requestCount: summary.requests.length,
        }));

        // Sort
        filtered.sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case 'name':
                    comparison = a.userName.localeCompare(b.userName);
                    break;
                case 'cost':
                    comparison = a.totalCost - b.totalCost;
                    break;
                case 'count':
                    comparison = a.requestCount - b.requestCount;
                    break;
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return filtered;
    }, [userCostSummaries, searchTerm, statusFilter, sortBy, sortOrder]);

    const grandTotal = useMemo(() => {
        return filteredAndSortedSummaries.reduce((sum, s) => sum + s.totalCost, 0);
    }, [filteredAndSortedSummaries]);

    const totalRequests = useMemo(() => {
        return filteredAndSortedSummaries.reduce((sum, s) => sum + s.requestCount, 0);
    }, [filteredAndSortedSummaries]);

    const handleSort = (field: 'name' | 'cost' | 'count') => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
    };

    const getStatusBadge = (status: string) => {
        const statusClass = status === 'COMPLETED' ? styles.completed : 
                           status === 'IN_PROGRESS' ? styles.inProgress : 
                           styles.pending;
        return (
            <span className={`${styles.statusBadge} ${statusClass}`}>
                {status.replace('_', ' ')}
            </span>
        );
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Loading maintenance costs...</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Maintenance Costs</h1>
                    <p className={styles.subtitle}>Track maintenance costs by tenant</p>
                </div>
                <Button onClick={() => window.print()}>
                    <Download size={18} style={{ marginRight: '0.5rem' }} />
                    Export
                </Button>
            </div>

            {/* Summary Cards */}
            <div className={styles.summaryGrid}>
                <div className={styles.summaryCard}>
                    <div className={styles.summaryIcon} style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>
                        <DollarSign size={24} />
                    </div>
                    <div className={styles.summaryContent}>
                        <p className={styles.summaryLabel}>Total Maintenance Cost</p>
                        <p className={styles.summaryValue}>${grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                </div>
                <div className={styles.summaryCard}>
                    <div className={styles.summaryIcon} style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
                        <User size={24} />
                    </div>
                    <div className={styles.summaryContent}>
                        <p className={styles.summaryLabel}>Tenants with Costs</p>
                        <p className={styles.summaryValue}>{filteredAndSortedSummaries.length}</p>
                    </div>
                </div>
                <div className={styles.summaryCard}>
                    <div className={styles.summaryIcon} style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' }}>
                        <Building2 size={24} />
                    </div>
                    <div className={styles.summaryContent}>
                        <p className={styles.summaryLabel}>Total Requests</p>
                        <p className={styles.summaryValue}>{totalRequests}</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className={styles.filters}>
                <div className={styles.searchBox}>
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, email, or flat..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
                <div className={styles.filterGroup}>
                    <Filter size={18} />
                    <select
                        className={styles.filterSelect}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="ALL">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>
                                <button
                                    className={styles.sortButton}
                                    onClick={() => handleSort('name')}
                                >
                                    Tenant Name
                                    {sortBy === 'name' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                                </button>
                            </th>
                            <th>Flat</th>
                            <th>
                                <button
                                    className={styles.sortButton}
                                    onClick={() => handleSort('count')}
                                >
                                    Requests
                                    {sortBy === 'count' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                                </button>
                            </th>
                            <th>
                                <button
                                    className={styles.sortButton}
                                    onClick={() => handleSort('cost')}
                                >
                                    Total Cost
                                    {sortBy === 'cost' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                                </button>
                            </th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAndSortedSummaries.map((summary) => (
                            <tr key={summary.userId} className={styles.tableRow}>
                                <td>
                                    <div className={styles.userInfo}>
                                        <div className={styles.userName}>{summary.userName}</div>
                                        <div className={styles.userEmail}>{summary.userEmail}</div>
                                    </div>
                                </td>
                                <td>
                                    <span className={styles.flatInfo}>{summary.flatInfo}</span>
                                </td>
                                <td>
                                    <span className={styles.countBadge}>{summary.requestCount}</span>
                                </td>
                                <td>
                                    <span className={styles.costAmount}>
                                        ${summary.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </td>
                                <td className={styles.detailsCell}>
                                    <details className={styles.details}>
                                        <summary className={styles.detailsSummary}>View Requests</summary>
                                        <div className={styles.detailsContent}>
                                            <div className={styles.nestedTableWrapper}>
                                                <table className={styles.nestedTable}>
                                                    <thead>
                                                        <tr>
                                                            <th>Date</th>
                                                            <th>Category</th>
                                                            <th>Description</th>
                                                            <th>Status</th>
                                                            <th>Assigned To</th>
                                                            <th>Cost</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {summary.requests.map((request) => (
                                                            <tr key={request.id}>
                                                                <td>
                                                                    {new Date(request.createdAt).toLocaleDateString()}
                                                                </td>
                                                                <td>
                                                                    <span className={styles.categoryBadge}>
                                                                        {request.category}
                                                                    </span>
                                                                </td>
                                                                <td className={styles.descriptionCell} title={request.description}>
                                                                    {request.description}
                                                                </td>
                                                                <td>{getStatusBadge(request.status)}</td>
                                                                <td>
                                                                    {request.assignedTo ? (
                                                                        <span className={styles.assignedTo}>
                                                                            {request.assignedTo.name}
                                                                        </span>
                                                                    ) : (
                                                                        <span className={styles.unassigned}>Unassigned</span>
                                                                    )}
                                                                </td>
                                                                <td className={styles.costCell}>
                                                                    ${request.cost?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </details>
                                </td>
                            </tr>
                        ))}
                        {filteredAndSortedSummaries.length === 0 && (
                            <tr>
                                <td colSpan={5} className={styles.empty}>
                                    No maintenance costs found
                                </td>
                            </tr>
                        )}
                    </tbody>
                    <tfoot>
                        <tr className={styles.footerRow}>
                            <td colSpan={3} className={styles.footerLabel}>
                                <strong>Grand Total</strong>
                            </td>
                            <td className={styles.footerTotal}>
                                <strong>${grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                            </td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}

