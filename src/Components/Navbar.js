import React from "react";
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <b><span className="first-word">JOB</span><span className="second-word">PORTAL</span></b>
          </Link>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">
                  About
                </Link>
              </li>
            </ul>
            <Link
              className="btn btn-outline-primary mx-2"
              to="/login?mode=login"
              role="button"
            >
              Login
            </Link>
            <Link
              className="btn btn-outline-primary"
              to="/login?mode=signup"
              role="button"
            >
              SignUp
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
