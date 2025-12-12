import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

interface OfflineBannerProps {
    onViewOfflinePage?: () => void;
}

function OfflineBanner({ onViewOfflinePage }: OfflineBannerProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleViewOfflinePage = () => {
        if (onViewOfflinePage) {
            onViewOfflinePage();
        } else {
            navigate('/offline');
        }
    };

    return (
        <div
            className="alert alert-warning m-0 d-flex align-items-center justify-content-between flex-wrap gap-2"
            role="alert"
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 1050,
                backgroundColor: '#fff3cd',
                border: 'none',
                borderBottom: '1px solid #ffc107',
                borderRadius: 0,
                padding: '0.75rem 1.5rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
        >
            <div className="d-flex align-items-center gap-2">
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{ flexShrink: 0 }}
                >
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
                    <path d="M12 8v4M12 16h.01" />
                </svg>
                <span className="fw-semibold" style={{ color: '#856404' }}>
                    {t('offline.banner.message')}
                </span>
            </div>
            <button
                className="btn btn-sm btn-outline-warning"
                onClick={handleViewOfflinePage}
                style={{
                    borderColor: '#856404',
                    color: '#856404',
                    fontSize: '0.875rem',
                    padding: '0.25rem 0.75rem'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#856404';
                    e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#856404';
                }}
            >
                {t('offline.banner.viewPage')}
            </button>
        </div>
    );
}

export default OfflineBanner;

