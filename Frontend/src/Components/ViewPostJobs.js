import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ViewPostJobs = () => {
  const [jobs,setJobs] = useState([]);

  useEffect(() => {
    const fetchPostJobs = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("https://jobportal-ubcf.onrender.com/api/view-postjobs", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch posted job details");
        }

        const data = await response.json();
        setJobs(data.jobs);
        console.log(data.jobs);
      } catch (err) {
        console.error("Error fetching posted jobs details:", err);
      }
    };

    fetchPostJobs();
  }, []);

  const HandleDelete = async (job_id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`https://jobportal-ubcf.onrender.com/api/delete-post-jobs/${job_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch delete details");
      }
      alert("Job Deleted Successfully");
      const data = await response.json();
      setJobs(jobs.filter((job) => job.job_id !== job_id));;
      console.log(data.jobs);
    } catch (err) {
      console.error("Error deleting jobs details:", err);
    }
  };

  return (
    <div className="post-jobs-container">
      <h2 className="post-jobs-title">My Posted Jobs</h2>
      <table className="styled-table">
        <thead>
          <tr>
            <th>Company Name</th>
            <th>Title</th>
            <th>Category</th>
            <th>Salary</th>
            <th>Status</th>
            <th>Posted On</th>
            {jobs && jobs.length > 0 && (
            <th>Actions</th>
            )
          }
          </tr>
        </thead>

        <tbody>
          {jobs && jobs.length > 0 ? (
            jobs.map((job) => (
              <tr key={job.job_id}>
                <td>{job.company_name}</td>
                <td>{job.title}</td>
                <td>{job.category_name}</td>
                <td>{job.salary}</td>
                <td>{job.status}</td>
                <td>{new Date(job.posting_date).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-danger mx-1"
                    onClick={ () => HandleDelete(job.job_id)}
                  >
                   <i className="fa-solid fa-trash"></i>
                  </button>
                  <Link
                    className="btn btn-primary mx-1"
                    to={`/editjob/${job.job_id}`}
                  >
                    <i className="fa-regular fa-pen-to-square"></i>
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="no-data">
                No posted jobs found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ViewPostJobs;
