import { useState, ChangeEvent } from 'react';
import styles from './FileUpload.module.css';
import { Upload, X, FileText, Image as ImageIcon } from 'lucide-react';

interface FileUploadProps {
    label: string;
    accept?: string;
    value?: string;
    onChange: (base64: string | null) => void;
    maxSize?: number; // in MB
    type?: 'image' | 'document';
}

export function FileUpload({
    label,
    accept = 'image/*',
    value,
    onChange,
    maxSize = 2,
    type = 'image'
}: FileUploadProps) {
    const [preview, setPreview] = useState<string | null>(value || null);
    const [fileName, setFileName] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > maxSize) {
            setError(`File size must be less than ${maxSize}MB`);
            return;
        }

        setError('');
        setFileName(file.name);

        // Convert to base64
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            setPreview(base64);
            onChange(base64);
        };
        reader.readAsDataURL(file);
    };

    const handleRemove = () => {
        setPreview(null);
        setFileName('');
        onChange(null);
    };

    const isImage = preview?.startsWith('data:image/');

    return (
        <div className={styles.container}>
            <label className={styles.label}>{label}</label>

            {!preview ? (
                <label className={styles.uploadArea}>
                    <input
                        type="file"
                        accept={accept}
                        onChange={handleFileChange}
                        className={styles.fileInput}
                    />
                    <div className={styles.uploadContent}>
                        <Upload size={32} />
                        <p className={styles.uploadText}>Click to upload or drag and drop</p>
                        <p className={styles.uploadHint}>Max size: {maxSize}MB</p>
                    </div>
                </label>
            ) : (
                <div className={styles.preview}>
                    {isImage ? (
                        <img src={preview} alt="Preview" className={styles.previewImage} />
                    ) : (
                        <div className={styles.documentPreview}>
                            <FileText size={48} />
                            <p>{fileName}</p>
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={handleRemove}
                        className={styles.removeButton}
                    >
                        <X size={16} />
                        Remove
                    </button>
                </div>
            )}

            {error && <p className={styles.error}>{error}</p>}
        </div>
    );
}
