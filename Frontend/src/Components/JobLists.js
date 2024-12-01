import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const JobLists = ({ id, job_title, company_name, pictureUrl, job_category, salary, date }) => {
  const convertPathToUrl = (localPath) => {
    const baseUrl = "http://localhost:5000/uploads/images/";
    const fileName = localPath.split("\\uploads\\images\\")[1];
    return baseUrl + fileName;
  };

  const [colour, setColor] = useState("goldenrod");
  const localUrl = convertPathToUrl(pictureUrl);
  const storedUser = localStorage.getItem("user");
  const user = JSON.parse(storedUser);
  console.log(user.Uid);
    

    useEffect(() => {
    const savedColor = localStorage.getItem(`job-${id}-${user.Uid}-color`);
    if (savedColor) {
      setColor(savedColor);
    }
  }, [id,user]);

  const handleBookmarkClick = (e) => {
    e.preventDefault();
    const newColor = colour === "white" ? "goldenrod" : "white";
    setColor(newColor);
    localStorage.setItem(`job-${id}-${user.Uid}-color`, newColor); 

    if (newColor === "white") {
      SaveJob(id);
    } 
    else {
      deleteJob(id);
    }
  };

  const SaveJob = async (id) =>{
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:5000/api/save-jobs/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        
        alert("Job Saved Successful. You Can View Your Saved Jobs Now.");
      } else {
        alert(data.message || "Failed to Save A Job.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const deleteJob = async(id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:5000/api/delete-save-jobs/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        
        alert("Job Removed From The Saved List.");
      } else {
        alert(data.message || "Failed to Remove a Job From Save List.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };
  return (
    <>
      <div className="job-list">
        <div className="card">
          <img src={localUrl} className="card-img-top" alt="company-image" />
          <div className="card-body">
            <div className="card-title">
              <span className="label">Company:</span>{" "}
              <span className="value">{company_name}</span>
            </div>
            <div className="card-title">
              <span className="label">Title:</span>{" "}
              <span className="value">{job_title}</span>
            </div>
            <div className="card-title">
              <span className="label">Category:</span>{" "}
              <span className="value">{job_category}</span>
            </div>
            <div className="card-title">
              <span className="label">Salary:</span>{" "}
              <span className="value">{salary}</span>
            </div>
            <div className="card-title">
              <span className="label">Posted On:</span>{" "}
              <span className="value">
                {new Date(date).toLocaleDateString()}
              </span>
            </div>
            <div className="bookmark-job">
              <Link
                className="btn btn-primary my-2"
                to={`/viewdetails/${id}`}
                role="button"
              >
                View Details
              </Link>
              <i
                className="fa-solid fa-bookmark"
                onClick={handleBookmarkClick}
                style={{ cursor: "pointer", color: colour }}
              ></i>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobLists;
