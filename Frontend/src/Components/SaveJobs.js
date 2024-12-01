import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const SaveJobs = () => {
    const [jobs, setJobs] = useState([]);
    useEffect(() => {
      const fetchSaveJobs = async () => {
        const token = localStorage.getItem("token");
        try {
          const response = await fetch("https://jobportal-ubcf.onrender.com/api/get-save-jobs", {
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
          setJobs(data.job);
          console.log(data.job);
        } catch (err) {
          console.error("Error in fetching Save Jobs", err);
        }
      };
  
      fetchSaveJobs();
    }, []);
  
    const HandleUnSave = async (job_id) => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `https://jobportal-ubcf.onrender.com/api/delete-save-jobs/${job_id}`,
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
          alert(data.message || "Error Deleting Save Jobs");
        }
        setJobs(jobs.filter((job) => job.job_id !== job_id));
        alert("Job Removed From Save List.");
      } catch (error) {
        console.error("Error Deleting Save Jobs: ", error);
      }
    };
    return (
      <div className="save-jobs-container">
        <h2 className="save-jobs-title">My Saved Jobs</h2>
        <table className="styled-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Job Category</th>
              <th>Salary</th>
              <th>Job Status</th>
              <th>Posting Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs && jobs.length > 0 ? (
              jobs.map((job) => (
                <tr key={job.job_id}>
                  <td>{job.title}</td>
                  <td>{job.category_name}</td>
                  <td>{job.salary}</td>
                  <td>{job.status}</td>
                  <td>{new Date(job.posting_date).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-danger mx-1"
                      onClick={() => HandleUnSave(job.job_id)}
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
                  No Save Jobs Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

export default SaveJobs
