'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './home.module.css';

export default function Home() {
    const router = useRouter();

    const features = [
        {
            icon: '🏢',
            title: 'Building Management',
            description: 'Efficiently manage multiple properties with detailed tracking and organization.'
        },
        {
            icon: '👥',
            title: 'Tenant Management',
            description: 'Keep track of tenant information, lease agreements, and communication history.'
        },
        {
            icon: '💰',
            title: 'Rent Tracking',
            description: 'Monitor rent payments, generate invoices, and track payment history seamlessly.'
        },
        {
            icon: '🔧',
            title: 'Maintenance Requests',
            description: 'Handle maintenance requests efficiently with priority tracking and status updates.'
        }
    ];

    return (
        <div className={styles.page}>
            {/* Navigation */}
            <nav className={styles.nav}>
                <div className={styles.logo}>
                    <div className={styles.logoIcon}>🏠</div>
                    RentFlow
                </div>
                <div className={styles.navButtons}>
                    <button
                        className={`${styles.navButton} ${styles.loginButton}`}
                        onClick={() => router.push('/login')}
                    >
                        Login
                    </button>
                    <button
                        className={`${styles.navButton} ${styles.dashboardButton}`}
                        onClick={() => router.push('/dashboard')}
                    >
                        Dashboard
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <div className={styles.heroText}>
                        <h1 className={styles.heroTitle}>
                            Manage Your Properties with Ease
                        </h1>
                        <p className={styles.heroSubtitle}>
                            Streamline your rental management with our comprehensive platform.
                            Track tenants, manage buildings, collect rent, and handle maintenance
                            requests all in one place.
                        </p>
                        <div className={styles.heroButtons}>
                            <button
                                className={styles.primaryButton}
                                onClick={() => router.push('/login')}
                            >
                                Get Started
                            </button>
                            <button
                                className={styles.secondaryButton}
                                onClick={() => router.push('/dashboard')}
                            >
                                View Dashboard
                            </button>
                        </div>
                    </div>
                    <div className={styles.heroImage}>
                        <div className={styles.imageWrapper}>
                            <Image
                                src="/hero-dashboard.png"
                                alt="Property Management Dashboard"
                                width={600}
                                height={400}
                                priority
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className={styles.features}>
                <div className={styles.featuresContainer}>
                    <h2 className={styles.featuresTitle}>Everything You Need</h2>
                    <p className={styles.featuresSubtitle}>
                        Powerful features to help you manage your rental properties efficiently
                    </p>
                    <div className={styles.featuresGrid}>
                        {features.map((feature, index) => (
                            <div key={index} className={styles.featureCard}>
                                <div className={styles.featureIcon}>{feature.icon}</div>
                                <h3 className={styles.featureTitle}>{feature.title}</h3>
                                <p className={styles.featureDescription}>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
