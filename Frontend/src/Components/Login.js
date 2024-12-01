import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";


const Login = ({ setRole, setName, setShowStarterPage}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  
  const [values, setValues] = useState({
    f_name: "",
    l_name: "",
    email: "",
    phn_no: "",
    password: "",
    role: "",
  });

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  useEffect(() => {
    
    
    const params = new URLSearchParams(location.search);
    setIsLogin(params.get("mode") === "login");

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setRole(user.role_id); 
      setName(user.Uname);
    }

  
  }, [location.search, setRole, setName]);

  const HandleLogin = () => {
    setIsLogin(true);
  };

  const HandleSignUp = () => {
    setIsLogin(false);
  };

  const HandleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (isLogin) {
        if (!credentials.email || !credentials.password) {
           alert("All fields are required!");
          return;
        } else {  
          const response = await fetch("https://jobportal-ubcf.onrender.com/api/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });
          const data = await response.json();
          if (response.ok) {
            localStorage.setItem(
              "user",
              JSON.stringify({ Uname: data.Uname, role_id: data.role_id,Uid:data.user_id })
            );
            localStorage.setItem("token", data.token); 
            setRole(data.role_id);
            setName(data.Uname);
            setShowStarterPage(true);
            navigate("/"); // Redirect to homepage
            alert("Login successful!");
          } else {
            alert(data.message || "Login failed!");
          }
        }
      } else {
        if (
          !values.email ||
          !values.password ||
          !values.f_name ||
          !values.l_name ||
          !values.phn_no ||
          !values.role
        ) {
          alert("All fields are required!");
          return;
        } else {
          const response = await fetch("https://jobportal-ubcf.onrender.com/api/signup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              first_name: values.f_name,
              last_name: values.l_name,
              email: values.email,
              phone_number: values.phn_no,
              password: values.password,
              role_id: values.role === "Employer" ? 2 : 1, // Map role to role_id
            }),
          });
          console.log(values);
          const data = await response.json();
          if (response.ok) {
            localStorage.setItem(
              "user",
              JSON.stringify({ Uname: data.Uname, role_id: data.role_id,Uid:data.user_id })
            );
            localStorage.setItem("token", data.token); 
            setRole(data.role_id);
            setName(data.Uname);
            setShowStarterPage(true);
            navigate("/"); // Redirect to homepage
            alert("Signup successful!");
          } else {
            alert(data.message || "Signup failed!");
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const HandleChange = (e) => {
    const { name, value } = e.target;
    if (isLogin) {
      
      setCredentials({
        ...credentials,
        [name]: value,
      });
    } else {
      // For signup, update the values
      setValues({
        ...values,
        [name]: value,
      });
    }
  };

  return (
    <>
    <h1 className="text-center my-3" style={{color:"white", fontWeight: "bold"}} >
      Make the most of your professional life    
    </h1>
    <div className="container">
      
      <div className="form-container">
        <div>
          
          {isLogin ? (
            <>
              <div className="form">
                <label htmlFor="email" className="form-label">
                  Email{" "}
                </label>
                <div className="input-with-icon">
                  <i className="fa-solid fa-envelope" style={{marginTop:"15px"}}></i>

                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={credentials.email}
                    onChange={HandleChange}
                    required
                  />
                </div>
                <label htmlFor="password" className="form-label">
                  {" "}
                  Password{" "}
                </label>
                <div className="input-with-icon">
                  <i className="fa-solid fa-lock" style={{marginTop:"12px"}}></i>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={credentials.password}
                    onChange={HandleChange}
                    required
                  />
                </div>
                <p> Forgot Password</p>

                <div className="d-grid gap-2 col-10 mx-auto" onClick={HandleSubmit}>
                  <button className="btn btn-primary" type="button">
                    Login
                  </button>
                </div>
                <p className="my-2" onClick={HandleSignUp}>
                  Register Now!
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="form">
                <label htmlFor="f_name" className="form-label">
                  {" "}
                  First Name{" "}
                </label>
                <input
                  id="f_name"
                  type="name"
                  name="f_name"
                  value={values.f_name}
                  onChange={HandleChange}
                  required
                />
                <label htmlFor="l_name" className="form-label">
                  {" "}
                  Last Name{" "}
                </label>
                <input
                  id="l_name"
                  type="name"
                  name="l_name"
                  value={values.l_name}
                  onChange={HandleChange}
                  required
                />
                <label htmlFor="email" className="form-label">
                  Email{" "}
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={HandleChange}
                  required
                />
                <label htmlFor="phn_no" className="form-label">
                  {" "}
                  Phone No{" "}
                </label>
                <input
                  id="phn_no"
                  type="tel"
                  name="phn_no"
                  value={values.phn_no}
                  onChange={HandleChange}
                  required
                />
                <label htmlFor="password" className="form-label">
                  {" "}
                  Password{" "}
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={HandleChange}
                  required
                />
                <label htmlFor="rol" className="form-label">
                  {" "}
                  Role{" "}
                </label>
                <select
                  name="role"
                  id="rol"
                  value={values.role}
                  onChange={HandleChange}
                  required
                >
                  <option disabled value="">
                    Select Role
                  </option>
                  <option value="Job Seeker">Job Seeker</option>
                  <option value="Employer">Employer</option>
                </select>

                <p onClick={HandleLogin} className="my-2">
                  {" "}
                  Already Have An Account? Sign in{" "}
                </p>
                <div className="d-grid gap-2 col-10 mx-auto" onClick={HandleSubmit}>
                  <button className="btn btn-primary" type="button">
                    Sign Up
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default Login;
