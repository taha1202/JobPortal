import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const AppliedJobs = () => {
  const [jobs, setJobs] = useState([]);
  useEffect(() => {
    const fetchAppliedJobs = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("https://jobportal-ubcf.onrender.com/api/applied-jobs", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch applied job details");
        }

        const data = await response.json();
        setJobs(data.jobs);
        console.log(data.jobs);
      } catch (err) {
        console.error("Error fetching profile details:", err);
      }
    };

    fetchAppliedJobs();
  }, []);

  const HandleDelete = async (job_id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `https://jobportal-ubcf.onrender.com/api/delete-appliedjob/${job_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Error Deleting Application");
      }
      setJobs(jobs.filter((job) => job.job_id !== job_id));
      alert(data.message || "Application Deleted.");
    } catch (error) {
      console.error("Error Deleting Application: ", error);
    }
  };
  return (
    <div className="applied-jobs-container">
      <h2 className="applied-jobs-title">My Applied Jobs</h2>
      <table className="styled-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Salary</th>
            <th>Job Status</th>
            <th>Application Status</th>
            <th>Application Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs && jobs.length > 0 ? (
            jobs.map((job) => (
              <tr key={job.job_id}>
                <td>{job.title}</td>
                <td>{job.salary}</td>
                <td>{job.status}</td>
                <td>{job.application_status}</td>
                <td>{new Date(job.application_date).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-danger mx-1"
                    onClick={() => HandleDelete(job.job_id)}
                    title="delete"
                  >
                   <i className="fa-solid fa-trash"></i>
                  </button>
                  <Link
                    className="btn btn-primary mx-1"
                    to={`/viewdetails/${job.job_id}`}
                    title="view details"
                  >
                   <i className="fa-solid fa-info"></i>
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="no-data">
                No applied jobs found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AppliedJobs;
