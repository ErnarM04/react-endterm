import Spinner from 'react-bootstrap/Spinner';
import { useTranslation } from 'react-i18next';

function LoadingSpinner() {
    const { t } = useTranslation();
    return (
        <Spinner animation="border" role="status">
            <span className="visually-hidden">{t('spinner.loading')}</span>
        </Spinner>
    );
}

export function ImageSkeleton({ width = "100%", height = "200px", className = "" }: { width?: string; height?: string; className?: string }) {
    return (
        <div
            className={`bg-light ${className}`}
            style={{
                width,
                height,
                borderRadius: '8px',
                background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                backgroundSize: '200% 100%',
                animation: 'skeleton-loading 1.5s ease-in-out infinite',
            }}
        >
            <style>{`
                @keyframes skeleton-loading {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
        </div>
    );
}

export default LoadingSpinner;



