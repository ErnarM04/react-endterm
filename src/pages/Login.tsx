import React, { useState, FormEvent } from "react";
import ErrorBox from "../components/ErrorBox";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Container } from "react-bootstrap";
import Spinner from "../components/Spinner";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    const navigate = useNavigate();

    function login(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!email || !password) {
            setError(t('login.errors.fillFields'));
            return;
        }

        setLoading(true);
        setError("");

        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                navigate("/profile");
            })
            .catch((err) => {
                setError(err.message);
                setEmail("");
                setPassword("");
            })
            .finally(() => {
                setLoading(false);
            });
    }

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
                    className="card shadow-lg border-0"
                    style={{
                        width: "100%",
                        maxWidth: "450px",
                        borderRadius: "16px",
                        overflow: "hidden"
                    }}
                >
                    <div
                        style={{
                            background: "linear-gradient(135deg, #2A3A47 0%, #1F2A32 100%)",
                            padding: "2.5rem 2rem",
                            textAlign: "center"
                        }}
                    >
                        <h2 className="text-light mb-0 fw-bold" style={{ fontSize: "2rem" }}>
                            {t('login.title')}
                        </h2>
                        <p className="text-light mt-2 mb-0" style={{ opacity: 0.9, fontSize: "0.95rem" }}>
                            Welcome back! Please sign in to your account.
                        </p>
                    </div>

                    <form onSubmit={login} style={{ padding: "2rem" }}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label fw-semibold" style={{ color: "#2A3A47", fontSize: "0.9rem" }}>
                                {t('login.placeholders.email')}
                            </label>
                            <input
                                id="email"
                                className="form-control"
                                type="email"
                                placeholder={t('login.placeholders.email')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                style={{
                                    padding: "0.75rem 1rem",
                                    borderRadius: "8px",
                                    border: "1px solid #dee2e6",
                                    fontSize: "1rem",
                                    transition: "all 0.3s ease"
                                }}
                                onFocus={(e) => {
                                    e.currentTarget.style.borderColor = "#2A3A47";
                                    e.currentTarget.style.boxShadow = "0 0 0 0.2rem rgba(42, 58, 71, 0.1)";
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.borderColor = "#dee2e6";
                                    e.currentTarget.style.boxShadow = "none";
                                }}
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="form-label fw-semibold" style={{ color: "#2A3A47", fontSize: "0.9rem" }}>
                                {t('login.placeholders.password')}
                            </label>
                            <input
                                id="password"
                                className="form-control"
                                type="password"
                                placeholder={t('login.placeholders.password')}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                style={{
                                    padding: "0.75rem 1rem",
                                    borderRadius: "8px",
                                    border: "1px solid #dee2e6",
                                    fontSize: "1rem",
                                    transition: "all 0.3s ease"
                                }}
                                onFocus={(e) => {
                                    e.currentTarget.style.borderColor = "#2A3A47";
                                    e.currentTarget.style.boxShadow = "0 0 0 0.2rem rgba(42, 58, 71, 0.1)";
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.borderColor = "#dee2e6";
                                    e.currentTarget.style.boxShadow = "none";
                                }}
                            />
                        </div>

                        {error && (
                            <div className="mb-3">
                                <ErrorBox message={error} />
                            </div>
                        )}

                        <button
                            className="btn w-100 fw-semibold"
                            type="submit"
                            disabled={loading}
                            style={{
                                backgroundColor: "#2A3A47",
                                color: "#ffffff",
                                padding: "0.75rem",
                                borderRadius: "8px",
                                border: "none",
                                fontSize: "1rem",
                                transition: "all 0.3s ease",
                                marginBottom: "1rem"
                            }}
                            onMouseEnter={(e) => {
                                if (!loading) {
                                    e.currentTarget.style.backgroundColor = "#1F2A32";
                                    e.currentTarget.style.transform = "translateY(-2px)";
                                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(42, 58, 71, 0.3)";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!loading) {
                                    e.currentTarget.style.backgroundColor = "#2A3A47";
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "none";
                                }
                            }}
                        >
                            {loading ? (
                                <span className="d-flex align-items-center justify-content-center gap-2">
                                    <Spinner />
                                    {t('login.pleaseWait')}
                                </span>
                            ) : (
                                t('login.button')
                            )}
                        </button>

                        <div className="text-center">
                            <p className="text-muted mb-2" style={{ fontSize: "0.9rem" }}>
                                {t('login.switch')}
                            </p>
                            <Link
                                to="/signup"
                                className="btn btn-outline-secondary"
                                style={{
                                    borderRadius: "8px",
                                    padding: "0.5rem 1.5rem",
                                    fontSize: "0.9rem",
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
                                {t('signup.title')}
                            </Link>
                        </div>
                    </form>
                </div>
            </Container>
        </div>
    );
}

export default Login;



