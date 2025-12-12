import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router';
import { Container, Button } from 'react-bootstrap';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

function Offline() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { isOnline } = useOnlineStatus();
    const [retrying, setRetrying] = useState(false);

    useEffect(() => {
        if (isOnline) {
            navigate(-1);
        }
    }, [isOnline, navigate]);

    const handleRetry = () => {
        setRetrying(true);
        window.location.reload();
    };

    const checkConnection = async () => {
        setRetrying(true);
        try {
            const response = await fetch('/favicon.ico', { cache: 'no-cache' });
            if (response.ok) {
                window.location.reload();
            } else {
                setRetrying(false);
            }
        } catch {
            setRetrying(false);
        }
    };

    return (
        <div
            className="d-flex align-items-center justify-content-center"
            style={{
                minHeight: "calc(100vh - 20vh)",
                background: "linear-gradient(135deg, #F5F6F7 0%, #E8EAED 100%)",
                padding: "2rem 1rem"
            }}
        >
            <Container className="d-flex justify-content-center">
                <div
                    className="card shadow-lg border-0 text-center"
                    style={{
                        width: "100%",
                        maxWidth: "600px",
                        borderRadius: "16px",
                        overflow: "hidden"
                    }}
                >
                    <div
                        style={{
                            background: "linear-gradient(135deg, #2A3A47 0%, #1F2A32 100%)",
                            padding: "3rem 2rem",
                            textAlign: "center"
                        }}
                    >
                        <div
                            style={{
                                fontSize: "5rem",
                                marginBottom: "1rem",
                                animation: "pulse 2s ease-in-out infinite"
                            }}
                        >
                            📡
                        </div>
                        <h1 className="text-light mb-2 fw-bold" style={{ fontSize: "2.5rem" }}>
                            {t('offline.page.title')}
                        </h1>
                        <p className="text-light mb-0" style={{ opacity: 0.9, fontSize: "1.1rem" }}>
                            {t('offline.page.subtitle')}
                        </p>
                    </div>

                    <div style={{ padding: "3rem 2rem" }}>
                        <div className="mb-4">
                            <h3 className="fw-semibold mb-3" style={{ color: "#2A3A47" }}>
                                {t('offline.page.whatYouCanDo')}
                            </h3>
                            <div className="text-start">
                                <div className="d-flex align-items-start mb-3">
                                    <div
                                        style={{
                                            width: "40px",
                                            height: "40px",
                                            borderRadius: "50%",
                                            backgroundColor: "#E8EAED",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginRight: "1rem",
                                            flexShrink: 0
                                        }}
                                    >
                                        <span style={{ fontSize: "1.2rem" }}>📦</span>
                                    </div>
                                    <div>
                                        <h5 className="fw-semibold mb-1" style={{ color: "#2A3A47" }}>
                                            {t('offline.page.feature1.title')}
                                        </h5>
                                        <p className="text-muted mb-0" style={{ fontSize: "0.95rem" }}>
                                            {t('offline.page.feature1.description')}
                                        </p>
                                    </div>
                                </div>

                                <div className="d-flex align-items-start mb-3">
                                    <div
                                        style={{
                                            width: "40px",
                                            height: "40px",
                                            borderRadius: "50%",
                                            backgroundColor: "#E8EAED",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginRight: "1rem",
                                            flexShrink: 0
                                        }}
                                    >
                                        <span style={{ fontSize: "1.2rem" }}>❤️</span>
                                    </div>
                                    <div>
                                        <h5 className="fw-semibold mb-1" style={{ color: "#2A3A47" }}>
                                            {t('offline.page.feature2.title')}
                                        </h5>
                                        <p className="text-muted mb-0" style={{ fontSize: "0.95rem" }}>
                                            {t('offline.page.feature2.description')}
                                        </p>
                                    </div>
                                </div>

                                <div className="d-flex align-items-start">
                                    <div
                                        style={{
                                            width: "40px",
                                            height: "40px",
                                            borderRadius: "50%",
                                            backgroundColor: "#E8EAED",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginRight: "1rem",
                                            flexShrink: 0
                                        }}
                                    >
                                        <span style={{ fontSize: "1.2rem" }}>🛒</span>
                                    </div>
                                    <div>
                                        <h5 className="fw-semibold mb-1" style={{ color: "#2A3A47" }}>
                                            {t('offline.page.feature3.title')}
                                        </h5>
                                        <p className="text-muted mb-0" style={{ fontSize: "0.95rem" }}>
                                            {t('offline.page.feature3.description')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                            <Button
                                onClick={checkConnection}
                                disabled={retrying}
                                className="fw-semibold"
                                style={{
                                    backgroundColor: "#2A3A47",
                                    border: "none",
                                    borderRadius: "8px",
                                    padding: "0.75rem 2rem",
                                    fontSize: "1rem",
                                    transition: "all 0.3s ease"
                                }}
                                onMouseEnter={(e) => {
                                    if (!retrying) {
                                        e.currentTarget.style.backgroundColor = "#1F2A32";
                                        e.currentTarget.style.transform = "translateY(-2px)";
                                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(42, 58, 71, 0.3)";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!retrying) {
                                        e.currentTarget.style.backgroundColor = "#2A3A47";
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.boxShadow = "none";
                                    }
                                }}
                            >
                                {retrying ? t('offline.page.checking') : t('offline.page.retry')}
                            </Button>

                            <Button
                                as={Link as any}
                                to="/"
                                variant="outline-secondary"
                                className="fw-semibold"
                                style={{
                                    borderRadius: "8px",
                                    padding: "0.75rem 2rem",
                                    fontSize: "1rem",
                                    borderColor: "#2A3A47",
                                    color: "#2A3A47",
                                    transition: "all 0.3s ease"
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "#2A3A47";
                                    e.currentTarget.style.color = "#ffffff";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "transparent";
                                    e.currentTarget.style.color = "#2A3A47";
                                }}
                            >
                                {t('offline.page.goHome')}
                            </Button>
                        </div>

                        <div className="mt-4 pt-4" style={{ borderTop: "1px solid #dee2e6" }}>
                            <p className="text-muted mb-0" style={{ fontSize: "0.875rem" }}>
                                {t('offline.page.tip')}
                            </p>
                        </div>
                    </div>
                </div>
            </Container>

            <style>{`
                @keyframes pulse {
                    0%, 100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                    50% {
                        transform: scale(1.1);
                        opacity: 0.8;
                    }
                }
            `}</style>
        </div>
    );
}

export default Offline;

