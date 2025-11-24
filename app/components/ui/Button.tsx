'use client';

import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline';
    isLoading?: boolean;
    size?: 'small' | 'medium' | 'large';
}

export function Button({ children, variant = 'primary', isLoading, size = 'medium', className, ...props }: ButtonProps) {
    return (
        <button
            className={`${styles.button} ${styles[variant]} ${styles[size]} ${className || ''}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? <span className={styles.loader}></span> : children}
        </button>
    );
}
