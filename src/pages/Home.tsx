import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { Button, Container } from "react-bootstrap";

function Home() {
    const { t } = useTranslation();
    return (
        <div style={{ minHeight: "calc(100vh - 20vh)" }}>
            <div 
                className="d-flex align-items-center justify-content-center"
                style={{
                    background: "linear-gradient(135deg, #2A3A47 0%, #1F2A32 100%)",
                    minHeight: "70vh",
                    padding: "4rem 2rem",
                    position: "relative",
                    overflow: "hidden"
                }}
            >
                <div 
                    style={{
                        position: "absolute",
                        top: "-50%",
                        right: "-10%",
                        width: "600px",
                        height: "600px",
                        background: "rgba(147, 164, 183, 0.1)",
                        borderRadius: "50%",
                        filter: "blur(80px)"
                    }}
                />
                <div 
                    style={{
                        position: "absolute",
                        bottom: "-30%",
                        left: "-5%",
                        width: "500px",
                        height: "500px",
                        background: "rgba(147, 164, 183, 0.08)",
                        borderRadius: "50%",
                        filter: "blur(60px)"
                    }}
                />

                <Container className="text-center position-relative" style={{ zIndex: 1 }}>
                    <h1 
                        className="display-3 fw-bold text-light mb-4"
                        style={{
                            fontSize: "clamp(2.5rem, 5vw, 4rem)",
                            letterSpacing: "-0.02em",
                            lineHeight: "1.2"
                        }}
                    >
                        {t('home.title')}
                    </h1>
                    
                    <p 
                        className="lead text-light mb-5 mx-auto"
                        style={{
                            maxWidth: "600px",
                            fontSize: "clamp(1.1rem, 2vw, 1.25rem)",
                            lineHeight: "1.6",
                            opacity: 0.95
                        }}
                    >
                        {t('home.tagline')} {t('home.description')}
                    </p>

                    <Button
                        as={Link as any}
                        to="/products"
                        size="lg"
                        className="rounded-pill px-5 py-3 fw-semibold"
                        style={{
                            backgroundColor: "#93A4B7",
                            border: "none",
                            fontSize: "1.1rem",
                            transition: "all 0.3s ease",
                            boxShadow: "0 4px 15px rgba(147, 164, 183, 0.3)"
                        }}
                        onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.currentTarget.style.backgroundColor = "#7A8FA3";
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 6px 20px rgba(147, 164, 183, 0.4)";
                        }}
                        onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.currentTarget.style.backgroundColor = "#93A4B7";
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 4px 15px rgba(147, 164, 183, 0.3)";
                        }}
                    >
                        {t('nav.products')} →
                    </Button>
                </Container>
            </div>

            <Container className="py-5">
                <div className="row g-4 mt-2">
                    <div className="col-md-4">
                        <div className="text-center p-4 h-100" style={{ borderRadius: "12px" }}>
                            <div 
                                className="mb-3"
                                style={{
                                    fontSize: "3rem",
                                    color: "#2A3A47"
                                }}
                            >
                                🛍️
                            </div>
                            <h4 className="fw-semibold mb-3" style={{ color: "#2A3A47" }}>
                                Wide Selection
                            </h4>
                            <p className="text-muted" style={{ lineHeight: "1.6" }}>
                                Browse through our extensive catalog of quality products at competitive prices.
                            </p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="text-center p-4 h-100" style={{ borderRadius: "12px" }}>
                            <div 
                                className="mb-3"
                                style={{
                                    fontSize: "3rem",
                                    color: "#2A3A47"
                                }}
                            >
                                ⚡
                            </div>
                            <h4 className="fw-semibold mb-3" style={{ color: "#2A3A47" }}>
                                Fast & Easy
                            </h4>
                            <p className="text-muted" style={{ lineHeight: "1.6" }}>
                                Quick search and seamless shopping experience with intuitive navigation.
                            </p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="text-center p-4 h-100" style={{ borderRadius: "12px" }}>
                            <div 
                                className="mb-3"
                                style={{
                                    fontSize: "3rem",
                                    color: "#2A3A47"
                                }}
                            >
                                ❤️
                            </div>
                            <h4 className="fw-semibold mb-3" style={{ color: "#2A3A47" }}>
                                Save Favorites
                            </h4>
                            <p className="text-muted" style={{ lineHeight: "1.6" }}>
                                Keep track of your favorite items and access them anytime you want.
                            </p>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}

export default Home;



