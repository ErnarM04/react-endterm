import React, { useState, FormEvent } from "react";
import ErrorBox from "../components/ErrorBox";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { Link, useNavigate } from "react-router";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    function login(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!email || !password) {
            setError("Please fill out the fields");
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
            className="login align-items-center justify-content-center"
            style={{ width: "100%", height: "90vh", paddingTop: "15vh" }}
        >
            <form className="card shadow m-auto border-0 w-25" onSubmit={login}>
                <h3 className="card-title m-4">Log in</h3>

                <div className="card-body">
                    <input
                        className="form-control my-2"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        className="form-control my-2"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && <ErrorBox message={error} />}

                    {loading && (
                        <p className="text-center text-secondary mt-2">
                            Logging in...
                        </p>
                    )}
                </div>

                <div className="card-footer shadow-none bg-body border-0">
                    <button
                        className="btn btn-primary btn-success w-75 m-auto mt-2"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Please wait..." : "Log In"}
                    </button>

                    <Link
                        to="/signup"
                        className="btn btn-primary m-auto mt-3"
                        style={{ width: "60%" }}
                    >
                        Want to sign up?
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default Login;



