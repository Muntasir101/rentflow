'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { Modal } from '@/app/components/ui/Modal';
import { FileUpload } from '@/app/components/ui/FileUpload';
import { User, Plus, Trash2, Users as UsersIcon, Home, Mail, Calendar, DollarSign, ArrowLeft, Phone, FileText, Edit } from 'lucide-react';
import styles from './tenant-details.module.css';

interface FamilyMember {
    id: string;
    name: string;
    relationship: string;
    age: number | null;
    phone: string | null;
}

interface Building {
    id: string;
    name: string;
    flats: { id: string; number: string; isOccupied: boolean }[];
}

interface Tenant {
    id: string;
    user: {
        name: string;
        email: string;
    };
    flat: {
        id?: string;
        number: string;
        rentAmount: number;
        building: {
            name: string;
        };
    } | null;
    flatId?: string | null;
    moveInDate: string;
    moveOutDate?: string | null;
    securityDeposit: number;
    photo?: string | null;
    identityDocument?: string | null;
    identityType?: string | null;
}

export default function TenantDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const [tenant, setTenant] = useState<Tenant | null>(null);
    const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isMoveOutModalOpen, setIsMoveOutModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [moveOutDate, setMoveOutDate] = useState('');

    const [newMember, setNewMember] = useState({
        name: '',
        relationship: '',
        age: '',
        phone: '',
    });

    const [editData, setEditData] = useState({
        name: '',
        email: '',
        flatId: '',
        moveInDate: '',
        securityDeposit: '',
        photo: null as string | null,
        identityDocument: null as string | null,
        identityType: '',
    });

    useEffect(() => {
        if (id) {
            fetchTenantDetails();
            fetchFamilyMembers();
            fetchBuildings();
        }
    }, [id]);

    const fetchTenantDetails = async () => {
        const res = await fetch(`/api/tenants/${id}`);
        const response = await res.json();
        if (response.success && response.data) {
            setTenant(response.data);
        } else {
            // Fallback to list endpoint
            const listRes = await fetch('/api/tenants');
            const listResponse = await listRes.json();
            const tenants = listResponse.success ? listResponse.data : [];
            const t = Array.isArray(tenants) ? tenants.find((t: any) => t.id === id) : null;
            setTenant(t);
        }
    };

    const fetchFamilyMembers = async () => {
        try {
            const res = await fetch(`/api/tenants/${id}/family`);
            const response = await res.json();
            const members = response.success ? response.data : [];
            setFamilyMembers(Array.isArray(members) ? members : []);
        } catch (error) {
            console.error('Failed to fetch family members:', error);
            setFamilyMembers([]);
        }
    };

    const fetchBuildings = async () => {
        const res = await fetch('/api/buildings');
        const response = await res.json();
        const buildings = response.success ? response.data : [];
        setBuildings(Array.isArray(buildings) ? buildings : []);
    };

    const handleEditClick = () => {
        if (tenant) {
            // Get the actual flat ID
            let currentFlatId = '';
            if (tenant.flatId) {
                currentFlatId = tenant.flatId;
            } else if (tenant.flat?.id) {
                currentFlatId = tenant.flat.id;
            }

            setEditData({
                name: tenant.user.name,
                email: tenant.user.email,
                flatId: currentFlatId,
                moveInDate: new Date(tenant.moveInDate).toISOString().split('T')[0],
                securityDeposit: tenant.securityDeposit.toString(),
                photo: tenant.photo || null,
                identityDocument: tenant.identityDocument || null,
                identityType: tenant.identityType || '',
            });
            setIsEditModalOpen(true);
        }
    };

    const handleUpdateTenant = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`/api/tenants/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editData),
            });

            const data = await res.json();

            if (res.ok) {
                setIsEditModalOpen(false);
                await fetchTenantDetails();
                alert('Tenant updated successfully!');
            } else {
                console.error('Update failed:', data);
                alert(data.error || 'Failed to update tenant');
            }
        } catch (error) {
            console.error('Error updating tenant:', error);
            alert('An error occurred while updating tenant');
        } finally {
            setLoading(false);
        }
    };

    const handleAddMember = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`/api/tenants/${id}/family`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMember),
            });

            const data = await res.json();

            if (res.ok) {
                setIsModalOpen(false);
                setNewMember({ name: '', relationship: '', age: '', phone: '' });
                fetchFamilyMembers();
            } else {
                alert(data.error || 'Failed to add family member');
            }
        } catch (error) {
            console.error('Error adding family member:', error);
            alert('An error occurred while adding family member');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteMember = async (memberId: string) => {
        if (!confirm('Are you sure you want to delete this family member?')) return;

        try {
            await fetch(`/api/tenants/${id}/family/${memberId}`, {
                method: 'DELETE',
            });
            fetchFamilyMembers();
        } catch (error) {
            alert('Failed to delete family member');
        }
    };

    const handleMoveOut = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!confirm('Are you sure you want to mark this tenant as moved out? This will free up their flat.')) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/tenants/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ moveOutDate }),
            });

            const data = await res.json();

            if (res.ok) {
                setIsMoveOutModalOpen(false);
                setMoveOutDate('');
                await fetchTenantDetails();
                alert('Tenant moved out successfully!');
            } else {
                alert(data.error || 'Failed to record move-out');
            }
        } catch (error) {
            console.error('Error recording move-out:', error);
            alert('An error occurred while recording move-out');
        } finally {
            setLoading(false);
        }
    };

    if (!tenant) return <div className={styles.loading}>Loading...</div>;

    const monthsSinceMoveIn = Math.floor(
        (new Date().getTime() - new Date(tenant.moveInDate).getTime()) / (1000 * 60 * 60 * 24 * 30)
    );

    // Flatten available flats for selection
    const availableFlats = buildings.flatMap(b =>
        b.flats.filter(f => !f.isOccupied || f.id === tenant.flatId || f.id === tenant.flat?.id).map(f => ({
            id: f.id,
            label: `${b.name} - Flat ${f.number}`,
        }))
    );

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <Button variant="outline" onClick={() => router.back()} style={{ marginRight: '1rem' }}>
                    <ArrowLeft size={18} />
                </Button>
                <div className={styles.headerContent}>
                    <div className={styles.tenantAvatar}>
                        {tenant.photo ? (
                            <img src={tenant.photo} alt={tenant.user.name} className={styles.avatarImage} />
                        ) : (
                            tenant.user.name.charAt(0).toUpperCase()
                        )}
                    </div>
                    <div>
                        <h1 className={styles.title}>{tenant.user.name}</h1>
                        <div className={styles.contactInfo}>
                            <div className={styles.contactItem}>
                                <Mail size={16} />
                                <span>{tenant.user.email}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {!tenant.moveOutDate && (
                        <Button onClick={() => setIsMoveOutModalOpen(true)} variant="outline">
                            Move Out
                        </Button>
                    )}
                    <Button onClick={handleEditClick}>
                        <Edit size={18} style={{ marginRight: '0.5rem' }} />
                        Edit Tenant
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)', color: 'var(--primary)' }}>
                        <Home size={24} />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Assigned Flat</p>
                        <p className={styles.statValue}>
                            {tenant.flat ? `${tenant.flat.building.name} - ${tenant.flat.number}` : 'Not Assigned'}
                        </p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)', color: 'var(--success)' }}>
                        <Calendar size={24} />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Tenure</p>
                        <p className={styles.statValue}>{monthsSinceMoveIn} months</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)', color: 'var(--warning)' }}>
                        <DollarSign size={24} />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Security Deposit</p>
                        <p className={styles.statValue}>${tenant.securityDeposit.toLocaleString()}</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(219, 39, 119, 0.1) 100%)', color: 'var(--accent)' }}>
                        <UsersIcon size={24} />
                    </div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Family Members</p>
                        <p className={styles.statValue}>{familyMembers.length}</p>
                    </div>
                </div>
            </div>

            {/* Tenant Information Card */}
            <div className={styles.infoCard}>
                <h3 className={styles.cardTitle}>Tenant Information</h3>
                <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Move In Date</span>
                        <span className={styles.infoValue}>
                            {new Date(tenant.moveInDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </span>
                    </div>
                    {tenant.moveOutDate && (
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>Move Out Date</span>
                            <span className={styles.infoValue}>
                                {new Date(tenant.moveOutDate).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                    )}
                    {tenant.flat && (
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>Monthly Rent</span>
                            <span className={styles.infoValue}>${tenant.flat.rentAmount.toLocaleString()}</span>
                        </div>
                    )}
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Status</span>
                        <span className={styles.statusBadge} style={tenant.moveOutDate ? { backgroundColor: 'var(--gray-400)', color: 'white' } : {}}>
                            {tenant.moveOutDate ? 'Moved Out' : 'Active'}
                        </span>
                    </div>
                    {tenant.identityType && (
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>Identity Type</span>
                            <span className={styles.infoValue}>{tenant.identityType}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Identity Document Section */}
            {tenant.identityDocument && (
                <div className={styles.infoCard}>
                    <h3 className={styles.cardTitle}>
                        <FileText size={20} style={{ marginRight: '0.5rem' }} />
                        Identity Document
                    </h3>
                    <div className={styles.documentPreview}>
                        {tenant.identityDocument.startsWith('data:image/') ? (
                            <img src={tenant.identityDocument} alt="Identity Document" className={styles.documentImage} />
                        ) : (
                            <div className={styles.documentPlaceholder}>
                                <FileText size={48} />
                                <p>Document uploaded</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Family Members Section */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>
                        <UsersIcon size={20} />
                        Family Members ({familyMembers.length})
                    </h2>
                    <Button onClick={() => setIsModalOpen(true)}>
                        <Plus size={20} style={{ marginRight: '0.5rem' }} />
                        Add Member
                    </Button>
                </div>

                <div className={styles.familyGrid}>
                    {familyMembers.map((member) => (
                        <div key={member.id} className={styles.memberCard}>
                            <div className={styles.memberHeader}>
                                <div className={styles.memberAvatar}>
                                    {member.name.charAt(0).toUpperCase()}
                                </div>
                                <button
                                    onClick={() => handleDeleteMember(member.id)}
                                    className={styles.deleteButton}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <h3 className={styles.memberName}>{member.name}</h3>
                            <p className={styles.memberRelation}>{member.relationship}</p>
                            <div className={styles.memberDetails}>
                                {member.age && (
                                    <div className={styles.memberDetail}>
                                        <User size={14} />
                                        <span>Age: {member.age}</span>
                                    </div>
                                )}
                                {member.phone && (
                                    <div className={styles.memberDetail}>
                                        <Phone size={14} />
                                        <span>{member.phone}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {familyMembers.length === 0 && (
                        <div className={styles.emptyState}>
                            <UsersIcon size={48} />
                            <p>No family members added yet</p>
                            <Button onClick={() => setIsModalOpen(true)} variant="outline">
                                <Plus size={18} style={{ marginRight: '0.5rem' }} />
                                Add First Member
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Tenant Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Tenant Information"
            >
                <form onSubmit={handleUpdateTenant} className={styles.form}>
                    <FileUpload
                        label="Tenant Photo (Optional)"
                        accept="image/*"
                        value={editData.photo || undefined}
                        onChange={(base64) => setEditData({ ...editData, photo: base64 })}
                        maxSize={2}
                        type="image"
                    />

                    <Input
                        label="Full Name"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        placeholder="e.g. John Doe"
                        required
                    />

                    <Input
                        label="Email Address"
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                        placeholder="e.g. john@example.com"
                        required
                    />

                    <div className={styles.selectGroup}>
                        <label className={styles.label}>Identity Type (Optional)</label>
                        <select
                            className={styles.select}
                            value={editData.identityType}
                            onChange={(e) => setEditData({ ...editData, identityType: e.target.value })}
                        >
                            <option value="">Select identity type...</option>
                            <option value="NID">National ID (NID)</option>
                            <option value="Passport">Passport</option>
                            <option value="Driving License">Driving License</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <FileUpload
                        label="Identity Document (Optional)"
                        accept="image/*,application/pdf,.doc,.docx"
                        value={editData.identityDocument || undefined}
                        onChange={(base64) => setEditData({ ...editData, identityDocument: base64 })}
                        maxSize={2}
                        type="document"
                    />

                    <div className={styles.selectGroup}>
                        <label className={styles.label}>Assign Flat (Optional)</label>
                        <select
                            className={styles.select}
                            value={editData.flatId}
                            onChange={(e) => setEditData({ ...editData, flatId: e.target.value })}
                        >
                            <option value="">Select a flat...</option>
                            {availableFlats.map(f => (
                                <option key={f.id} value={f.id}>{f.label}</option>
                            ))}
                        </select>
                    </div>

                    <Input
                        label="Move In Date"
                        type="date"
                        value={editData.moveInDate}
                        onChange={(e) => setEditData({ ...editData, moveInDate: e.target.value })}
                        required
                    />

                    <Input
                        label="Security Deposit"
                        type="number"
                        value={editData.securityDeposit}
                        onChange={(e) => setEditData({ ...editData, securityDeposit: e.target.value })}
                        placeholder="e.g. 5000"
                        required
                    />

                    <div className={styles.formActions}>
                        <Button type="button" variant="secondary" onClick={() => setIsEditModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={loading}>
                            Update Tenant
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Add Family Member Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add Family Member"
            >
                <form onSubmit={handleAddMember} className={styles.form}>
                    <Input
                        label="Full Name"
                        value={newMember.name}
                        onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                        placeholder="e.g. John Doe"
                        required
                    />

                    <div className={styles.selectGroup}>
                        <label className={styles.label}>Relationship</label>
                        <select
                            className={styles.select}
                            value={newMember.relationship}
                            onChange={(e) => setNewMember({ ...newMember, relationship: e.target.value })}
                            required
                        >
                            <option value="">Select relationship...</option>
                            <option value="Spouse">Spouse</option>
                            <option value="Child">Child</option>
                            <option value="Parent">Parent</option>
                            <option value="Sibling">Sibling</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <Input
                        label="Age (Optional)"
                        type="number"
                        value={newMember.age}
                        onChange={(e) => setNewMember({ ...newMember, age: e.target.value })}
                        placeholder="e.g. 25"
                    />

                    <Input
                        label="Phone (Optional)"
                        type="tel"
                        value={newMember.phone}
                        onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                        placeholder="e.g. +880 1234567890"
                    />

                    <div className={styles.formActions}>
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={loading}>
                            Add Member
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Move Out Modal */}
            <Modal
                isOpen={isMoveOutModalOpen}
                onClose={() => setIsMoveOutModalOpen(false)}
                title="Record Move Out"
            >
                <form onSubmit={handleMoveOut} className={styles.form}>
                    <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                        Recording a move-out date will mark this tenant as moved out and free up their assigned flat for new tenants.
                    </p>

                    <Input
                        label="Move Out Date"
                        type="date"
                        value={moveOutDate}
                        onChange={(e) => setMoveOutDate(e.target.value)}
                        required
                    />

                    <div className={styles.formActions}>
                        <Button type="button" variant="secondary" onClick={() => setIsMoveOutModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={loading}>
                            Confirm Move Out
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
