import React, {useState, FormEvent, ChangeEvent} from "react";
import ErrorBox from "../components/ErrorBox";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {auth} from "../services/firebase";
import {Link, useNavigate} from "react-router";

function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [confirm, setConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    function register(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (email) {
            if (password && confirm) {
                setLoading(true);
                setError("");
                createUserWithEmailAndPassword(auth, email, password)
                    .then(userCredential => {
                        console.log(userCredential);
                        navigate("/profile");
                    })
                    .catch(error => setError(error.toString()))
                    .finally(() => {
                        setLoading(false);
                    });
            } else {
                setError("Please enter a password");
            }
        } else {
            if (password) {
                setError("Please enter an email");
            } else {
                setError("Please fill out the fields");
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
            setError("Passwords don't match");
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
                        setError("Invalid password")
                    }
                }
                else setError("Invalid email");
                console.log(email, password);
            }}>
                <h3 className="card-title m-4">Sign Up</h3>
                <div className="card-body">
                    <input
                        className="form-control my-2"
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}/>
                    <input
                        className="form-control my-2"
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            }}/>
                    <input
                        className="form-control my-2"
                        type="password"
                        placeholder="Confirm Password"
                        name="confirm-password"
                        onChange={(e) => checkPassword(e)}/>
                    {error ? <ErrorBox message={error} />: null}

                    {loading && (
                        <p className="text-center text-secondary mt-2">
                            Creating account...
                        </p>
                    )}
                </div>
                <div className="card-footer shadow-none bg-body border-0">
                    <button
                        className="btn btn-primary btn-success w-75 m-auto mt-2"
                        type="submit"
                        disabled={loading}>
                        {loading ? "Please wait..." : "Sign Up"}
                    </button>
                    <Link to="/login"
                          className="btn btn-primary m-auto mt-3 "
                          style={{ width: "fit-content" }}>
                        Already have an account?
                    </Link>
                </div>

            </form>
        </div>
    );
}

export default Signup;



