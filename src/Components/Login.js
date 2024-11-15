import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const Login = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [values, setValues] = useState({
    f_name: "",
    l_name: "",
    email: "",
    phn_no: "",
    password: "",
    role: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setIsLogin(params.get("mode") === "login");
  }, [location.search]);

  const HandleLogin = () => {
    setIsLogin(true);
  };

  const HandleSignUp = () => {
    setIsLogin(false);
  };

  const HandleSubmit = (e) => {
    e.preventDefault();
    try {
      console.log(values);
    } catch (error) {
      console.log(error);
    }
  };

  const HandleChange = (e) => {
    const value = e.target.value;
    setValues({
      ...values,
      [e.target.name]: value,
    });
  };

  return (
    <div className="container">
      <div className="form-container">
        
        <div>
          {isLogin ? (
            <>
              <div className="form">
                <label htmlFor="email" className="form-label">Email </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={values.email}
                  onChange={HandleChange}
                />
                <label htmlFor="password" className="form-label"> Password </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={values.password}
                  onChange={HandleChange}
                />
                 <p> Forgot Password</p> 

                <button className="my-2"> Log In </button>
                <p className="my-2" onClick={HandleSignUp}>Register Now!</p>
              </div>
            </>
          ) : (
            <>
              <div className="form">
                <label htmlFor="f_name" className="form-label"> First Name </label>
                <input
                  id="f_name"
                  type="name"
                  name="f_name"
                  value={values.f_name}
                  onChange={HandleChange}
                />
                <label htmlFor="l_name" className="form-label"> Last Name </label>
                <input
                  id="l_name"
                  type="name"
                  name="l_name"
                  value={values.l_name}
                  onChange={HandleChange}
                />
                <label htmlFor="email" className="form-label">Email </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={HandleChange}
                />
                <label htmlFor="phn_no" className="form-label"> Phone No </label>
                <input
                  id="phn_no"
                  type="tel"
                  name="phn_no"
                  value={values.phn_no}
                  onChange={HandleChange}
                />
                <label htmlFor="password" className="form-label"> Password </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={HandleChange}
                />
                <label htmlFor="role" className="form-label"> Role </label>
                {/* <button id="role" class="btn btn-secondary dropdown-toggle" type="button" 
                data-bs-toggle="dropdown" aria-expanded="false">
                Select Role
                </button> */}
                <select name="role" value={values.role} onChange={HandleChange}>
                <option value="">Select Role</option>
                <option value="Job Seeker">Job Seeker</option>
                <option value="Employer">Employer</option>
                </select>

                <p onClick={HandleLogin} className="my-2"> Already Have An Account! </p>
                <button onClick={HandleSubmit} className="my-2" > Sign Up </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
