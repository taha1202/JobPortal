import React, { useState } from "react";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const HandleLogin = () => {
    setIsLogin(true);
  };

  const HandleSignUp = () => {
    setIsLogin(false);
  };
  return (
    <div className="container">
      <div className="form-container">
        <div className="form-toggle">
          <button
            type="button"
            className={isLogin ? "active" : ""}
            onClick={HandleLogin}
          >
            {" "}
            Login{" "}
          </button>
          <button
            type="button"
            className={!isLogin ? "active" : ""}
            onClick={HandleSignUp}
          >
            {" "}
            Sign Up{" "}
          </button>
        </div>
        <div>
          {isLogin ? (
            <>
              <div className="form">
                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Password" />
                <a href='/'> Forgot Password</a>
                <button> Log In </button>
              </div>
            </>
          ) : (
            <>
                <div className="form">
                <input type="name" placeholder="First Name" />
                <input type="name" placeholder="Last Name" />    
                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Password" />
                <button> Sign Up </button>
                </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
