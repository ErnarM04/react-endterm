import React from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Button, Container, Form, Nav, Navbar } from "react-bootstrap";
import {useAuth} from "../services/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { useTranslation } from "react-i18next";

function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { user } = useAuth();

    function handleLogout() {
        signOut(auth).then(() => {
            navigate("/");
        }).catch((err) => {
            console.log(err);
        });
    }

    return (
        <Navbar expand="lg" className="shadow-sm sticky-top" style={{ height: "10vh", backgroundColor: "#2A3A47" }} >
            <Container fluid className="px-5">
                <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 text-light">
                    {t('brand')}
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
                            style={location.pathname === "/" ? { color: "#93A4B7" } : { color: "#FFFFFF" }}
                        >
                            {t('nav.home')}
                        </Nav.Link>

                        <Nav.Link
                            as={Link}
                            to="/products"
                            className={location.pathname === "/products" ? "active fw-semibold" : ""}
                            style={location.pathname === "/products" ? { color: "#93A4B7" } : { color: "#FFFFFF" }}
                        >
                            {t('nav.products')}
                        </Nav.Link>

                        <Nav.Link
                            as={Link}
                            to={user ? "/cart" : "/login"}
                            className={location.pathname === "/cart" ? "active fw-semibold" : ""}
                            style={{
                                opacity: !user ? 0.6 : 1,
                                color: location.pathname === "/cart" ? "#93A4B7" : "#FFFFFF"
                              }}
                              

                        >
                            {t('nav.cart')} {!user && `(${t('nav.cartLoginRequired')})`}
                        </Nav.Link>
                        <Nav.Link
                            as={Link}
                            to="/favorites"
                            className={location.pathname === "/favorites" ? "active fw-semibold" : ""}
                            style={location.pathname === "/favorites" ? { color: "#93A4B7" } : { color: "#FFFFFF" }}

                        >
                            {t('nav.favorites')}
                        </Nav.Link>
                    </Nav>

                    <Form className="d-flex align-items-center gap-2">
                        {user ? (
                            <>
                                <Button as={Link as any} to="/profile" variant="outline-light" className="rounded-pill px-3">
                                    {t('nav.profile')}
                                </Button>
                                <Button onClick={handleLogout} variant="outline-light" className="rounded-pill px-3">
                                    {t('nav.logout')}
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button as={Link as any} to="/login" variant="outline-light" className="rounded-pill px-3">
                                    {t('nav.login')}
                                </Button>
                                <Button as={Link as any} to="/signup" variant="outline-light" className="rounded-pill px-3">
                                    {t('nav.signup')}
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



