import React, {useState, FormEvent, ChangeEvent} from "react";
import ErrorBox from "../components/ErrorBox";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {auth} from "../services/firebase";
import {Link, useNavigate} from "react-router";
import { useTranslation } from "react-i18next";

function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [confirm, setConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    const navigate = useNavigate();

    function register(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (email) {
            if (password && confirm) {
                setLoading(true);
                setError("");
                createUserWithEmailAndPassword(auth, email, password)
                    .then(() => {
                        navigate("/profile");
                    })
                    .catch(error => setError(error.toString()))
                    .finally(() => {
                        setLoading(false);
                    });
            } else {
                setError(t('signup.errors.passwordRequired'));
            }
        } else {
            if (password) {
                setError(t('signup.errors.emailRequired'));
            } else {
                setError(t('signup.errors.fillFields'));
            }
        }
    }

    function validateEmail(email: string) {
        return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    }

    function validatePassword(password: string) {
        return password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/);
    }

    function checkPassword(e: ChangeEvent<HTMLInputElement>) {
        if (password === e.target.value) {
            setConfirm(true);
            setError("");
        } else {
            setConfirm(false);
            setError(t("signup.errors.passwordMismatch"));
        }
    }

    return (
        <div className="align-items-center justify-content-center"
             style={{ width: "100%", height: "90vh", paddingTop: "10vh" }} >
            <form className="card shadow m-auto border-0 w-25" onSubmit={(e) => {
                e.preventDefault();
                if (validateEmail(email)) {
                    if (validatePassword(password)) {
                        register(e);
                    } else {
                        setError(t('signup.errors.invalidPassword'))
                    }
                }
                else setError(t('signup.errors.invalidEmail'));
            }}>
                <h3 className="card-title m-4">{t('signup.title')}</h3>
                <div className="card-body">
                    <input
                        className="form-control my-2"
                        type="email"
                        placeholder={t('signup.placeholders.email')}
                        name="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}/>
                    <input
                        className="form-control my-2"
                        type="password"
                        placeholder={t('signup.placeholders.password')}
                        name="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            }}/>
                    <input
                        className="form-control my-2"
                        type="password"
                        placeholder={t('signup.placeholders.confirm')}
                        name="confirm-password"
                        onChange={(e) => checkPassword(e)}/>
                    {error ? <ErrorBox message={error} />: null}

                    {loading && (
                        <p className="text-center text-secondary mt-2">
                            {t('signup.loading')}
                        </p>
                    )}
                </div>
                <div className="card-footer shadow-none bg-body border-0">
                    <button
                        className="btn btn-primary btn-success w-75 m-auto mt-2"
                        type="submit"
                        disabled={loading}>
                        {loading ? t('signup.pleaseWait') : t('signup.button')}
                    </button>
                    <Link to="/login"
                          className="btn btn-primary m-auto mt-3 "
                          style={{ width: "fit-content" }}>
                        {t('signup.switch')}
                    </Link>
                </div>

            </form>
        </div>
    );
}

export default Signup;



