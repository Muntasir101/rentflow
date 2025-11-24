'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Building2,
    Users,
    Banknote,
    Wrench,
    LogOut,
    Settings,
    DollarSign
} from 'lucide-react';
import styles from './Sidebar.module.css';

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        // In a real app, call logout API to clear cookie
        // For now, we just redirect to login (cookie clearing happens on server or via API)
        // We should implement a logout API route
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
    };

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Buildings', href: '/dashboard/buildings', icon: Building2 },
        { name: 'Tenants', href: '/dashboard/tenants', icon: Users },
        { name: 'Rent', href: '/dashboard/rent', icon: Banknote },
        { name: 'Requests', href: '/dashboard/requests', icon: Wrench },
        { name: 'Maintenance Costs', href: '/dashboard/maintenance', icon: DollarSign },
        { name: 'Users', href: '/dashboard/users', icon: Settings }, // Admin only ideally
    ];

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <h2>RentManager</h2>
            </div>

            <nav className={styles.nav}>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                        >
                            <Icon size={20} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className={styles.footer}>
                <button onClick={handleLogout} className={styles.logoutButton}>
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
