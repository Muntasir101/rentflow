import { Sidebar } from '@/app/components/Sidebar';
import { ErrorBoundary } from '@/app/components/ErrorBoundary';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ErrorBoundary>
            <div style={{ display: 'flex' }}>
                <Sidebar />
                <main style={{ flex: 1, marginLeft: '250px', padding: '2rem', backgroundColor: '#f9fafb', minHeight: '100vh', overflowX: 'hidden', maxWidth: '100%', boxSizing: 'border-box' }}>
                    {children}
                </main>
            </div>
        </ErrorBoundary>
    );
}
