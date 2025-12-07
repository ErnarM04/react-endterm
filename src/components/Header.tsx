import React from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Button, Container, Form, Nav, Navbar } from "react-bootstrap";
import {useAuth} from "../services/AuthContext";
import {signOut} from "firebase/auth";
import {auth} from "../services/firebase";

function Header() {
    const location = useLocation();
    const navigate = useNavigate();

    const { user } = useAuth();

    function handleLogout() {
        signOut(auth).then(() => {
            navigate("/");
        }).catch((err) => {
            console.log(err);
        });
    }

    return (
        <Navbar expand="lg" bg="dark" variant="dark" className="shadow-sm sticky-top" style={{ height: "10vh" }} >
            <Container fluid className="px-5">
                <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 text-light">
                    FakeStore
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        navbarScroll
                    >
                        <Nav.Link
                            as={Link}
                            to="/"
                            className={location.pathname === "/" ? "active fw-semibold" : ""}
                        >
                            Home
                        </Nav.Link>

                        <Nav.Link
                            as={Link}
                            to="/products"
                            className={location.pathname === "/products" ? "active fw-semibold" : ""}
                        >
                            Products
                        </Nav.Link>

                        <Nav.Link
                            as={Link}
                            to={user ? "/cart" : "/login"}
                            className={location.pathname === "/cart" ? "active fw-semibold" : ""}
                            style={!user ? { opacity: 0.6 } : {}}
                        >
                            Cart {!user && '(Login Required)'}
                        </Nav.Link>
                        <Nav.Link
                            as={Link}
                            to="/favorites"
                            className={location.pathname === "/favorites" ? "active fw-semibold" : ""}
                        >
                            Favorites
                        </Nav.Link>
                    </Nav>

                    <Form className="d-flex align-items-center gap-2">
                        {user ? (
                            <>
                                <Button as={Link as any} to="/profile" variant="outline-light" className="rounded-pill px-3">
                                    Profile
                                </Button>
                                <Button onClick={handleLogout} variant="outline-light" className="rounded-pill px-3">
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button as={Link as any} to="/login" variant="outline-light" className="rounded-pill px-3">
                                    Login
                                </Button>
                                <Button as={Link as any} to="/signup" variant="outline-light" className="rounded-pill px-3">
                                    Signup
                                </Button>
                            </>
                        )}
                    </Form>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;



