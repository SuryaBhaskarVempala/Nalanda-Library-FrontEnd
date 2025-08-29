import React, { useEffect, useState, useRef, useContext } from "react";
import "../styles/Navbar.css";
import { gsap } from "gsap";
import { NavLink } from "react-router";
import { StoreContext } from "../context/Store";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const tl = useRef(null);
    const menuRef = useRef(null);
    const overlayRef = useRef(null);
    const { user, setUser } = useContext(StoreContext);

    useEffect(() => {
        if (menuOpen) {
            document.body.classList.add("menu-open");

            const links = menuRef.current.querySelectorAll("a");

            tl.current = gsap.timeline();

            tl.current
                .to(overlayRef.current, {
                    opacity: 0.5,
                    duration: 0.4,
                    ease: "power2.out",
                    pointerEvents: "auto",
                })
                .to(
                    menuRef.current,
                    {
                        x: 0,
                        opacity: 1,
                        duration: 0.6,
                        ease: "power3.out",
                    },
                    "-=0.3"
                )
                .fromTo(
                    links,
                    { y: 30, opacity: 0 },  
                    { y: 0, opacity: 1, stagger: 0.1, duration: 0.4, ease: "power2.out" }, 
                    "-=0.2"
                );
        } else {
            document.body.classList.remove("menu-open");
            tl.current && tl.current.reverse();
        }
    }, [menuOpen, user]);


    return (
        <>
            <section id="navbar">
                <div className="logo" onClick={() => window.location.href = "/"}>
                    <i className="fa-solid fa-book"></i>
                    <h1>Nalanda Library</h1>
                </div>
                <i className="fa-solid fa-bars" onClick={() => setMenuOpen(true)}></i>
            </section>

            <div
                className="overlay"
                ref={overlayRef}
                onClick={() => setMenuOpen(false)}
            ></div>

            <div className="menu" ref={menuRef}>
                <i
                    className="fa-solid fa-xmark close-btn"
                    onClick={() => setMenuOpen(false)}
                ></i>

                {!user ? (
                    <>
                        <NavLink to="/" onClick={() => setMenuOpen(false)}>
                            Home
                        </NavLink>
                        <NavLink to="/about" onClick={() => setMenuOpen(false)}>
                            About
                        </NavLink>
                        <NavLink to="/login" onClick={() => setMenuOpen(false)}>
                            Login
                        </NavLink>
                        <NavLink to="/signup" onClick={() => setMenuOpen(false)}>
                            Signup
                        </NavLink>
                    </>
                ) : (
                    <>
                        <NavLink to="/" onClick={() => setMenuOpen(false)}>
                            Home
                        </NavLink>
                        <NavLink to="/about" onClick={() => setMenuOpen(false)}>
                            About
                        </NavLink>
                        <NavLink to="/borrows-history" onClick={() => setMenuOpen(false)}>
                            Borrows History
                        </NavLink>

                        {user.role === "Admin" && (
                            <>
                                <NavLink to="/admin-home" onClick={() => setMenuOpen(false)}>
                                    Admin Home
                                </NavLink>
                                <NavLink to="/library" onClick={() => setMenuOpen(false)}>
                                    Library
                                </NavLink>
                            </>
                        )}

                        <NavLink
                            to="/"
                            onClick={(e) => {
                                e.preventDefault();
                                setMenuOpen(false);

                                setTimeout(() => {
                                    setUser(null);
                                    localStorage.removeItem("token");
                                    window.location.href = "/";
                                }, 800);
                            }}
                        >
                            LogOut
                        </NavLink>
                    </>
                )}
            </div>
        </>
    );
}

export default Navbar;
