'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import styles from './ErrorBoundary.module.css';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log error to console or error reporting service
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
        });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className={styles.container}>
                    <div className={styles.content}>
                        <div className={styles.icon}>
                            <AlertCircle size={48} />
                        </div>
                        <h1 className={styles.title}>Something went wrong</h1>
                        <p className={styles.message}>
                            {this.state.error?.message || 'An unexpected error occurred'}
                        </p>
                        <button onClick={this.handleReset} className={styles.button}>
                            <RefreshCw size={20} />
                            <span>Try again</span>
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

