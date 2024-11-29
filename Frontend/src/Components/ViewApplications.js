import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ViewApplications = () => {
  const [values, setValues] = useState([]);

  useEffect(() => {
    const fetchPostJobs = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          "http://localhost:5000/api/view-applications",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch application details");
        }

        const data = await response.json();
        setValues(data.value);
        console.log(data.value);
      } catch (err) {
        console.error("Error fetching application details:", err);
      }
    };

    fetchPostJobs();
  }, []);

  const HandleAccept = async (application_id) => {
    const token = localStorage.getItem("token");
    const status = "accepted";
    try {
        const response = await fetch("http://localhost:5000/api/update-status", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              status:status,
              application_id:application_id,
            }),
          });
    
          const data = await response.json();
          console.log(data);
          if (!response.ok) {
            throw new Error("Failed to Accept Application.");
          } 
          setValues(values.filter((value) => value.application_id !== application_id));
          alert("Application Accepted");
    } catch (error) {
      console.error("Error in Accepting The Application: ", error);
      alert("An error occurred. Please try again.");
    }
  };

  const HandleReject = async (application_id) => {
    const token = localStorage.getItem("token");
    const status = "rejected";
    try {
        const response = await fetch("http://localhost:5000/api/update-status", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              status:status,
              application_id:application_id,
            }),
          });
    
          const data = await response.json();
          console.log(data);
          if (!response.ok) {
            alert(data.message || "Failed to Reject the application!");
          } 
          setValues(values.filter((value) => value.application_id !== application_id));
          alert("Application Rejected Successfully");

    } catch (error) {
      console.error("Error in Accepting The Application: ", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="application-container">
      <h2 className="application-title">Applications</h2>
      <table className="styled-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Company Name</th>
            <th>Title</th>
            <th>Category</th>
            <th>Application Date</th>
            <th>Profile</th>
            {values && values.length > 0 && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {values && values.length > 0 ? (
            values.map((value) => (
              <tr key={value.application_id}>
                <td>
                  {value.first_name} {value.last_name}
                </td>
                <td>{value.company_name}</td>
                <td>{value.title}</td>
                <td>{value.category_name}</td>
                <td>{new Date(value.application_date).toLocaleDateString()}</td>
                <td>
                  <Link
                    className="btn btn-primary mx-1"
                    to={`/viewprofile/${value.user_id}`}
                  >
                    View Profile
                  </Link>
                </td>
                <td>
                  {value.status === "pending" ? (
                    <>
                    <button
                    className="btn btn-success mx-1"
                    onClick={() =>HandleAccept(value.application_id)}
                  >
                    <i className="fa-solid fa-check"></i>
                  </button>
                  <button
                    className="btn btn-danger mx-1"
                    onClick={() =>HandleReject(value.application_id)}
                  >
                    <i className="fa-solid fa-x"></i>
                  </button>
                  </>
                  ) : (
                    <>
                    <Link
                     
                      className="btn btn-success"
                      to={`/sendMessage/${value.user_id}`}
                    >
                      <i className="fa-solid fa-message mx-2"></i>
                      Send Message
                    </Link>
                  </>
                  )}
                  
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="no-data">
                No Applications Received
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ViewApplications;
