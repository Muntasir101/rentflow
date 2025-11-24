import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth-middleware';
import { ApiResponse } from '@/lib/api-response';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
    try {
        // Require authentication
        const authResult = await requireAuth(request);
        if (authResult.error) {
            return authResult.error;
        }

        const user = authResult.user!;
        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        // Parse dates or use defaults
        const start = startDate ? new Date(startDate) : new Date(new Date().setMonth(new Date().getMonth() - 12));
        const end = endDate ? new Date(endDate) : new Date();

        // Ensure end date is after start date
        if (end < start) {
            return ApiResponse.error('End date must be after start date', 400);
        }

        // Financial Analytics
        const payments = await prisma.payment.findMany({
            where: {
                date: {
                    gte: start,
                    lte: end,
                },
            },
            include: {
                tenant: {
                    include: {
                        user: true,
                        flat: {
                            include: {
                                building: true,
                            },
                        },
                    },
                },
            },
        });

        const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
        const revenueByType = payments.reduce((acc, p) => {
            acc[p.type] = (acc[p.type] || 0) + p.amount;
            return acc;
        }, {} as Record<string, number>);

        const revenueByMethod = payments.reduce((acc, p) => {
            acc[p.method] = (acc[p.method] || 0) + p.amount;
            return acc;
        }, {} as Record<string, number>);

        // Monthly revenue trend
        const monthlyRevenue = payments.reduce((acc, p) => {
            const month = new Date(p.date).toISOString().slice(0, 7); // YYYY-MM
            acc[month] = (acc[month] || 0) + p.amount;
            return acc;
        }, {} as Record<string, number>);

        // Tenant Analytics
        const totalTenants = await prisma.tenant.count();
        const activeTenants = await prisma.tenant.count({
            where: {
                moveOutDate: null,
            },
        });
        const tenantsWithFlats = await prisma.tenant.count({
            where: {
                flatId: { not: null },
                moveOutDate: null,
            },
        });

        // Tenant turnover
        const newTenants = await prisma.tenant.count({
            where: {
                moveInDate: {
                    gte: start,
                    lte: end,
                },
            },
        });

        const movedOutTenants = await prisma.tenant.count({
            where: {
                moveOutDate: {
                    gte: start,
                    lte: end,
                },
            },
        });

        // Building & Flat Analytics
        const totalBuildings = await prisma.building.count();
        const totalFlats = await prisma.flat.count();
        const occupiedFlats = await prisma.flat.count({
            where: { isOccupied: true },
        });
        const occupancyRate = totalFlats > 0 ? (occupiedFlats / totalFlats) * 100 : 0;

        // Revenue by building
        const revenueByBuilding = payments.reduce((acc, p) => {
            const buildingName = p.tenant.flat?.building?.name || 'Unassigned';
            acc[buildingName] = (acc[buildingName] || 0) + p.amount;
            return acc;
        }, {} as Record<string, number>);

        // Maintenance & Service Request Analytics
        const serviceRequests = await prisma.serviceRequest.findMany({
            where: {
                createdAt: {
                    gte: start,
                    lte: end,
                },
            },
            include: {
                tenant: {
                    include: {
                        flat: {
                            include: {
                                building: true,
                            },
                        },
                    },
                },
            },
        });

        const totalMaintenanceCost = serviceRequests.reduce((sum, r) => sum + (r.cost || 0), 0);
        const requestsByStatus = serviceRequests.reduce((acc, r) => {
            acc[r.status] = (acc[r.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const requestsByCategory = serviceRequests.reduce((acc, r) => {
            acc[r.category] = (acc[r.category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const maintenanceByCategory = serviceRequests.reduce((acc, r) => {
            acc[r.category] = (acc[r.category] || 0) + (r.cost || 0);
            return acc;
        }, {} as Record<string, number>);

        // Monthly maintenance trend
        const monthlyMaintenance = serviceRequests.reduce((acc, r) => {
            const month = new Date(r.createdAt).toISOString().slice(0, 7);
            acc[month] = (acc[month] || 0) + (r.cost || 0);
            return acc;
        }, {} as Record<string, number>);

        // Payment Status Analytics
        const paymentsByStatus = payments.reduce((acc, p) => {
            acc[p.status] = (acc[p.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Top Paying Tenants
        const tenantPayments = payments.reduce((acc, p) => {
            const tenantName = p.tenant.user.name;
            acc[tenantName] = (acc[tenantName] || 0) + p.amount;
            return acc;
        }, {} as Record<string, number>);

        const topPayingTenants = Object.entries(tenantPayments)
            .map(([name, amount]) => ({ name, amount }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 10);

        // Average rent per flat
        const flatsWithRent = await prisma.flat.findMany({
            where: { isOccupied: true },
        });
        const averageRent = flatsWithRent.length > 0
            ? flatsWithRent.reduce((sum, f) => sum + f.rentAmount, 0) / flatsWithRent.length
            : 0;

        // Total security deposits
        const totalDeposits = await prisma.tenant.aggregate({
            _sum: {
                securityDeposit: true,
            },
            where: {
                moveOutDate: null,
            },
        });

        // Format monthly data for charts
        const monthlyRevenueData = Object.entries(monthlyRevenue)
            .map(([month, amount]) => ({ month, amount }))
            .sort((a, b) => a.month.localeCompare(b.month));

        const monthlyMaintenanceData = Object.entries(monthlyMaintenance)
            .map(([month, cost]) => ({ month, cost }))
            .sort((a, b) => a.month.localeCompare(b.month));

        const analytics = {
            period: {
                start: start.toISOString(),
                end: end.toISOString(),
            },
            financial: {
                totalRevenue,
                revenueByType,
                revenueByMethod,
                monthlyRevenue: monthlyRevenueData,
                averageRent,
                totalDeposits: totalDeposits._sum.securityDeposit || 0,
            },
            tenants: {
                total: totalTenants,
                active: activeTenants,
                withFlats: tenantsWithFlats,
                newTenants,
                movedOut: movedOutTenants,
                turnoverRate: activeTenants > 0 ? (movedOutTenants / activeTenants) * 100 : 0,
            },
            properties: {
                totalBuildings,
                totalFlats,
                occupiedFlats,
                occupancyRate,
                revenueByBuilding,
            },
            maintenance: {
                totalCost: totalMaintenanceCost,
                requestsByStatus,
                requestsByCategory,
                costByCategory: maintenanceByCategory,
                monthlyMaintenance: monthlyMaintenanceData,
                totalRequests: serviceRequests.length,
            },
            payments: {
                byStatus: paymentsByStatus,
                totalCount: payments.length,
            },
            topPayingTenants,
        };

        return ApiResponse.success(analytics, 'Analytics data retrieved successfully');
    } catch (error: any) {
        logger.error('Failed to fetch analytics', error, { endpoint: '/api/analytics' });
        return ApiResponse.internalError('Failed to fetch analytics');
    }
}

