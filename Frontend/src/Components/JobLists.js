import React, { useState } from "react";
import { Link } from "react-router-dom";

const JobLists = ({id,job_title,company_name,pictureUrl,job_category,salary,date}) => {

  const convertPathToUrl = (localPath) => {
    const baseUrl = "http://localhost:5000/uploads/images/";

    const fileName = localPath.split("\\uploads\\images\\")[1];
    return baseUrl + fileName;
  };
  const [colour,setColor] = useState("goldenrod");
  const localUrl = convertPathToUrl(pictureUrl);

  const handleBookmarkClick = () => {
    const newColor = colour === "white" ? "goldenrod" : "white";
    setColor(newColor);
    localStorage.setItem(`job-${id}-color`, newColor);

    if (newColor === "white") {
      saveJob(id);
    } else {
      deleteJob(id);
    }
  };

  const saveJob = (jobId) => {
    console.log(`Saving job with ID: ${jobId}`);
    
  };

  const deleteJob = (jobId) => {
    
    console.log(`Deleting job with ID: ${jobId}`);
   
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

           
            <div className = "bookmark-job">
            <Link
              className="btn btn-primary my-2"
              to={`/viewdetails/${id}`}
              role="button"
            >
              View Details
            </Link>
            <i className="fa-solid fa-bookmark" 
              onClick={handleBookmarkClick}
              style={{cursor:"pointer" , color:colour}}></i>
          </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobLists;
