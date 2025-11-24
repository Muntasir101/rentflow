'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { Modal } from '@/app/components/ui/Modal';
import { 
    Wrench, 
    Plus, 
    AlertCircle, 
    CheckCircle, 
    Clock, 
    User, 
    DollarSign,
    Filter,
    X
} from 'lucide-react';
import styles from './requests.module.css';

interface ServiceRequest {
    id: string;
    category: string;
    description: string;
    status: string;
    cost: number | null;
    createdAt: string;
    tenant: {
        user: { name: string };
        flat: { number: string; building: { name: string } } | null;
    };
    assignedTo: {
        id: string;
        name: string;
        email: string;
    } | null;
}

interface Tenant {
    id: string;
    user: { name: string };
    flat: { number: string; building: { name: string } } | null;
}

interface StaffUser {
    id: string;
    name: string;
    email: string;
    role: string;
}

export default function RequestsPage() {
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [staffUsers, setStaffUsers] = useState<StaffUser[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>('ALL');

    const [newRequest, setNewRequest] = useState({
        tenantId: '',
        category: 'PLUMBING',
        description: '',
    });

    const [updateData, setUpdateData] = useState({
        status: '',
        assignedToId: '',
        cost: '',
    });

    useEffect(() => {
        fetchRequests();
        fetchTenants();
        fetchStaffUsers();
    }, []);

    const fetchRequests = async () => {
        const res = await fetch('/api/requests');
        const response = await res.json();
        const requests = response.success ? response.data : [];
        setRequests(Array.isArray(requests) ? requests : []);
    };

    const fetchTenants = async () => {
        const res = await fetch('/api/tenants');
        const response = await res.json();
        const tenants = response.success ? response.data : [];
        setTenants(Array.isArray(tenants) ? tenants : []);
    };

    const fetchStaffUsers = async () => {
        try {
            const res = await fetch('/api/users');
            const response = await res.json();
            const users = response.success ? response.data : [];
            setStaffUsers(Array.isArray(users) ? users : []);
        } catch (error) {
            console.error('Failed to fetch staff users:', error);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newRequest),
            });
            if (res.ok) {
                setIsModalOpen(false);
                setNewRequest({
                    tenantId: '',
                    category: 'PLUMBING',
                    description: '',
                });
                fetchRequests();
            }
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRequest) return;

        setLoading(true);
        try {
            const updatePayload: any = {};
            if (updateData.status) updatePayload.status = updateData.status;
            if (updateData.assignedToId) updatePayload.assignedToId = updateData.assignedToId || null;
            if (updateData.cost) updatePayload.cost = parseFloat(updateData.cost);

            const res = await fetch(`/api/requests/${selectedRequest.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatePayload),
            });

            if (res.ok) {
                setIsUpdateModalOpen(false);
                setSelectedRequest(null);
                setUpdateData({ status: '', assignedToId: '', cost: '' });
                fetchRequests();
            } else {
                const error = await res.json();
                alert(error.error?.message || 'Failed to update request');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleQuickStatusUpdate = async (requestId: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/requests/${requestId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                fetchRequests();
            } else {
                const error = await res.json();
                alert(error.error?.message || 'Failed to update status');
            }
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const openUpdateModal = (request: ServiceRequest) => {
        setSelectedRequest(request);
        setUpdateData({
            status: request.status,
            assignedToId: request.assignedTo?.id || '',
            cost: request.cost?.toString() || '',
        });
        setIsUpdateModalOpen(true);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return styles.pending;
            case 'IN_PROGRESS': return styles.inProgress;
            case 'COMPLETED': return styles.completed;
            default: return '';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PENDING': return <Clock size={16} />;
            case 'IN_PROGRESS': return <AlertCircle size={16} />;
            case 'COMPLETED': return <CheckCircle size={16} />;
            default: return <Clock size={16} />;
        }
    };

    const filteredRequests = useMemo(() => {
        if (statusFilter === 'ALL') return requests;
        return requests.filter(r => r.status === statusFilter);
    }, [requests, statusFilter]);

    const stats = useMemo(() => {
        return {
            total: requests.length,
            pending: requests.filter(r => r.status === 'PENDING').length,
            inProgress: requests.filter(r => r.status === 'IN_PROGRESS').length,
            completed: requests.filter(r => r.status === 'COMPLETED').length,
        };
    }, [requests]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Service Requests</h1>
                    <p className={styles.subtitle}>Manage maintenance and service requests</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus size={20} style={{ marginRight: '0.5rem' }} />
                    New Request
                </Button>
            </div>

            {/* Stats Cards */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>
                        <Wrench size={24} />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Total Requests</p>
                        <p className={styles.statValue}>{stats.total}</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' }}>
                        <Clock size={24} />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Pending</p>
                        <p className={styles.statValue}>{stats.pending}</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>
                        <AlertCircle size={24} />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>In Progress</p>
                        <p className={styles.statValue}>{stats.inProgress}</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
                        <CheckCircle size={24} />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Completed</p>
                        <p className={styles.statValue}>{stats.completed}</p>
                    </div>
                </div>
            </div>

            {/* Filter */}
            <div className={styles.filterBar}>
                <div className={styles.filterGroup}>
                    <Filter size={18} />
                    <span className={styles.filterLabel}>Filter by Status:</span>
                    <button
                        className={`${styles.filterButton} ${statusFilter === 'ALL' ? styles.filterActive : ''}`}
                        onClick={() => setStatusFilter('ALL')}
                    >
                        All
                    </button>
                    <button
                        className={`${styles.filterButton} ${statusFilter === 'PENDING' ? styles.filterActive : ''}`}
                        onClick={() => setStatusFilter('PENDING')}
                    >
                        Pending
                    </button>
                    <button
                        className={`${styles.filterButton} ${statusFilter === 'IN_PROGRESS' ? styles.filterActive : ''}`}
                        onClick={() => setStatusFilter('IN_PROGRESS')}
                    >
                        In Progress
                    </button>
                    <button
                        className={`${styles.filterButton} ${statusFilter === 'COMPLETED' ? styles.filterActive : ''}`}
                        onClick={() => setStatusFilter('COMPLETED')}
                    >
                        Completed
                    </button>
                </div>
            </div>

            {/* Requests Grid */}
            <div className={styles.grid}>
                {filteredRequests.map((request) => (
                    <div key={request.id} className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className={styles.category}>
                                <Wrench size={16} />
                                <span>{request.category}</span>
                            </div>
                            <span className={`${styles.status} ${getStatusColor(request.status)}`}>
                                {getStatusIcon(request.status)}
                                <span>{request.status.replace('_', ' ')}</span>
                            </span>
                        </div>

                        <p className={styles.description}>{request.description}</p>

                        <div className={styles.cardDetails}>
                            <div className={styles.detailRow}>
                                <User size={16} />
                                <span>{request.tenant.user.name}</span>
                            </div>
                            {request.tenant.flat && (
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Flat:</span>
                                    <span>{request.tenant.flat.building.name} - {request.tenant.flat.number}</span>
                                </div>
                            )}
                            {request.assignedTo && (
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Assigned to:</span>
                                    <span className={styles.assignedTo}>{request.assignedTo.name}</span>
                                </div>
                            )}
                            {request.cost && (
                                <div className={styles.detailRow}>
                                    <DollarSign size={16} />
                                    <span className={styles.cost}>${request.cost.toFixed(2)}</span>
                                </div>
                            )}
                            <div className={styles.detailRow}>
                                <Clock size={16} />
                                <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className={styles.cardActions}>
                            {request.status !== 'COMPLETED' && (
                                <>
                                    {request.status === 'PENDING' && (
                                        <Button
                                            variant="outline"
                                            size="small"
                                            onClick={() => handleQuickStatusUpdate(request.id, 'IN_PROGRESS')}
                                        >
                                            Start Work
                                        </Button>
                                    )}
                                    {request.status === 'IN_PROGRESS' && (
                                        <Button
                                            variant="outline"
                                            size="small"
                                            onClick={() => handleQuickStatusUpdate(request.id, 'COMPLETED')}
                                        >
                                            Complete
                                        </Button>
                                    )}
                                </>
                            )}
                            <Button
                                variant="secondary"
                                size="small"
                                onClick={() => openUpdateModal(request)}
                            >
                                {request.status === 'COMPLETED' ? 'View Details' : 'Manage'}
                            </Button>
                        </div>
                    </div>
                ))}
                {filteredRequests.length === 0 && (
                    <div className={styles.empty}>
                        <AlertCircle size={48} />
                        <p>No service requests found{statusFilter !== 'ALL' ? ` with status "${statusFilter}"` : ''}.</p>
                    </div>
                )}
            </div>

            {/* Create Request Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create Service Request"
            >
                <form onSubmit={handleCreate} className={styles.form}>
                    <div className={styles.selectGroup}>
                        <label className={styles.label}>Tenant</label>
                        <select
                            className={styles.select}
                            value={newRequest.tenantId}
                            onChange={(e) => setNewRequest({ ...newRequest, tenantId: e.target.value })}
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

                    <div className={styles.selectGroup}>
                        <label className={styles.label}>Category</label>
                        <select
                            className={styles.select}
                            value={newRequest.category}
                            onChange={(e) => setNewRequest({ ...newRequest, category: e.target.value })}
                        >
                            <option value="PLUMBING">Plumbing</option>
                            <option value="ELECTRICAL">Electrical</option>
                            <option value="CLEANING">Cleaning</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>

                    <div className={styles.selectGroup}>
                        <label className={styles.label}>Description</label>
                        <textarea
                            className={styles.textarea}
                            value={newRequest.description}
                            onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                            rows={4}
                            required
                            placeholder="Describe the issue..."
                        />
                    </div>

                    <div className={styles.formActions}>
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={loading}>
                            Submit Request
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Update Request Modal */}
            <Modal
                isOpen={isUpdateModalOpen}
                onClose={() => {
                    setIsUpdateModalOpen(false);
                    setSelectedRequest(null);
                    setUpdateData({ status: '', assignedToId: '', cost: '' });
                }}
                title="Manage Service Request"
            >
                {selectedRequest && (
                    <form onSubmit={handleUpdate} className={styles.form}>
                        <div className={styles.requestInfo}>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Category:</span>
                                <span>{selectedRequest.category}</span>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Description:</span>
                                <span>{selectedRequest.description}</span>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Tenant:</span>
                                <span>{selectedRequest.tenant.user.name}</span>
                            </div>
                        </div>

                        <div className={styles.selectGroup}>
                            <label className={styles.label}>Status</label>
                            <select
                                className={styles.select}
                                value={updateData.status}
                                onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
                            >
                                <option value="PENDING">Pending</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="COMPLETED">Completed</option>
                            </select>
                        </div>

                        <div className={styles.selectGroup}>
                            <label className={styles.label}>Assign To</label>
                            <select
                                className={styles.select}
                                value={updateData.assignedToId}
                                onChange={(e) => setUpdateData({ ...updateData, assignedToId: e.target.value })}
                            >
                                <option value="">Unassigned</option>
                                {staffUsers.map(user => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} ({user.role})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <Input
                            label="Cost (optional)"
                            type="number"
                            step="0.01"
                            min="0"
                            value={updateData.cost}
                            onChange={(e) => setUpdateData({ ...updateData, cost: e.target.value })}
                            placeholder="0.00"
                        />

                        <div className={styles.formActions}>
                            <Button type="button" variant="secondary" onClick={() => {
                                setIsUpdateModalOpen(false);
                                setSelectedRequest(null);
                                setUpdateData({ status: '', assignedToId: '', cost: '' });
                            }}>
                                Cancel
                            </Button>
                            <Button type="submit" isLoading={loading}>
                                Update Request
                            </Button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
}
