import React, { useState, useEffect } from "react";
import { useParams,useNavigate } from "react-router-dom";
import Spinner from "./Spinner";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  let localUrl;
  const [job, setValues] = useState({
    job_id: 0,
    job_title: "",
    job_description: "",
    requirements: "",
    salary: 0,
    posting_date: "",
    company_description: "",
    company_name: "",
    picture: "",
    job_category: "",
    city: "",
    country: "",
    state: "",
    street: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobDetails = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `http://localhost:5000/api/job-details/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch job details");
        }
        const data = await response.json();
        setValues(data.job);
        console.log(data.job);
      } catch (err) {
        console.error("Error fetching job details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);
  const convertPathToUrl = (localPath) => {
    const baseUrl = "http://localhost:5000/uploads/images/";
    const fileName = localPath.split("\\uploads\\images\\")[1];
    return baseUrl + fileName;
  };
  const HandleApplication =  async (e) =>{
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`http://localhost:5000/api/get-profile`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (!response.ok) {
          alert (data.message || "Error Checking Profile");
          navigate('/profile');
        }
        else{
            try {
                const response = await fetch(`http://localhost:5000/api/apply/${id}`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );
                  const data = await response.json();
                  if (!response.ok) {
                    alert (data.message || "Error In Applying for Job");
                  }
                  else{
                    alert(data.message);
                  }
            } catch (error) {
                console.error("Error In Applying for Job:", error);
            }
        }

      } catch (error) {
        console.error("Error Checking Profile:", error);
      }
  }

  const requirementsList = job.requirements
    .split("/n")
    .map((req, index) => <p key={index}>{req}</p>);

  if (job.picture) {
    localUrl = convertPathToUrl(job.picture);
  }

  if (loading)
    return (
      <div className="my-3">
        <Spinner />
      </div>
    );
  return (
    <div className="job-details-container">
      {localUrl && (
        <img src={localUrl} alt="company-image" className="company-image" />
      )}
      <div className="job-details-content">
        <h2 className="job-title">{job.job_title}</h2>
        <div className="company-info">
          <p>
            <strong>Company:</strong> {job.company_name}
          </p>
          <p>
            <strong>Category:</strong> {job.job_category}
          </p>
          <p>
            <strong>Salary:</strong> ${job.salary}
          </p>
          <p>
            <strong>Posted On:</strong> {new Date(job.posting_date).toLocaleDateString()}
          </p>
          {job.state === job.city ? (
            <p>
            <strong>Location:</strong> {job.street}, {job.city},{" "}
            {job.country}
          </p>
          ) 
          :(
          <p>
            <strong>Location:</strong> {job.street}, {job.city}, {job.state},{" "}
            {job.country}
          </p>
          )}
        </div>
        <div className="job-description">
          <h3>Job Description</h3>
          <p>{job.job_description}</p>
        </div>
        <div className="requirements">
          <h3>Requirements</h3>
          <p>{requirementsList}</p>
        </div>
        <div className="company-info">
          <h3>About the Company</h3>
          <p>{job.company_description}</p>
        </div>
        <button className="apply-button" onClick={HandleApplication}>Apply Job</button>
      </div>
    </div>
  );
};

export default JobDetails;
