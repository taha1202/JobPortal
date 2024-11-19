import React from "react";

import Jobs from "./Jobs";

const Home = () => {
  return (
    <>
      <div className="container">
        <div className="search-bar">
          <p> Job Hunting Website</p>
          <h2>Discover & Apply For Jobs That Match Your Skill</h2>
          <form className="d-flex" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              id="search-bar"
            />
            <button type="button" className="btn btn-success">
              Success
            </button>
          </form>
        </div>
      </div>
      <div className="job-list">
        <h3> Available Jobs</h3>
        <Jobs/>
      </div>
    </>
  );
};

export default Home;
