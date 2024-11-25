import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
const Navbar = ({ role, setRole, U_name, setName }) => {
  const navigate = useNavigate();
  const [dropdown, setDropdown] = useState(false);

  useEffect(() => {
    // Check if the role exists in localStorage
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const user = JSON.parse(storedUser);
      console.log(user);
      setRole(user.role_id); // Set the role from localStorage if available
      setName(user.Uname);
    }
  }, [setRole, setName]);

  const HandleLogOut = () => {
    localStorage.clear(); // Clear user data
    setRole(""); // Reset role
    setDropdown(false);
    navigate("/login?mode=login");

    alert("LogOut Successfullly");
  };

  const HandleDropdown = () => {
    setDropdown(!dropdown);
  };
  return (
    <>
      <nav
        className="navbar navbar-expand-lg"
        style={{ backgroundColor: "#0e1822"}}
      >
        <div className="container-fluid">
          
            <b className="navbar-brand">
              <span className="first-word">JOB</span>
              <span className="second-word">PORTAL</span>
            </b>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active " aria-current="page" to="/">
                  Home
                </Link>
              </li>
              {role === 2 && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/postjob">
                      Post a Job
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/viewpostjob">
                      View Post Jobs
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/view-applications">
                      Applications
                    </Link>
                  </li>
                </>
              )}
              {role === 1 && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/viewjobs">
                      View Jobs
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/appliedjobs">
                      Applied Jobs
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/savejobs">
                      Saved Jobs
                    </Link>
                  </li>
                </>
              )}
            </ul>
            {role ? (
              <div className="user-info">
                <button
                  type="button"
                  className="btn"
                  style={{ backgroundColor: "#131d27" }}
                  onClick={HandleDropdown}
                >
                  <i className="fa fa-user mx-2" style={{color:"white"}}></i> {U_name}
                  <i className="fa fa-caret-down mx-2" style={{color:"white"}}></i>
                </button>

                {dropdown && (
                  <div
                    className="dropdown-menu show"
                    style={{
                      position: "absolute",
                      top: "40px",
                      right: "0",
                      zIndex: 100,
                    }}
                  >
                    <Link
                      onClick={() => {
                        setDropdown(!dropdown);
                      }}
                      className="dropdown-item"
                      to="/profile"
                    >
                      <i className="fa-solid fa-street-view mx-2"></i> View
                      Profile
                    </Link>
                    <button className="dropdown-item" onClick={HandleLogOut}>
                      <i className="fa-solid fa-right-from-bracket mx-2"></i>{" "}
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
