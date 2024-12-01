import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";


const ViewApplications = () => {
  const [values, setValues] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [interviewDate, setInterviewDate] = useState("");

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
        if (!response.ok) throw new Error("Failed to fetch application details");
        const data = await response.json();
        setValues(data.value);
      } catch (err) {
        console.error("Error fetching application details:", err);
      }
    };

    fetchPostJobs();

  }, []);

  const HandleAccept = async (application_id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:5000/api/update-status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "accepted", application_id }),
      });

      if (!response.ok) throw new Error("Failed to Accept Application.");
      setValues(values.filter((value) => value.application_id !== application_id));
      alert("Application Accepted");
    } catch (error) {
      console.error("Error in Accepting The Application: ", error);
      alert("An error occurred. Please try again.");
    }
  };

  const HandleReject = async (application_id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:5000/api/update-status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "rejected", application_id }),
      });

      if (!response.ok) throw new Error("Failed to Reject Application.");
      setValues(values.filter((value) => value.application_id !== application_id));
      alert("Application Rejected Successfully");
    } catch (error) {
      console.error("Error in Rejecting The Application: ", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleScheduleInterview = (application) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  };

  const handleSaveInterview = async () => {
    
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:5000/api/schedule-interview/${selectedApplication.user_id}/${selectedApplication.application_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ interview: interviewDate }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to schedule interview");
      alert("Interview Scheduled Successfully");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error scheduling interview:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="applications-container">
      <h2>Applications</h2>
      <div className="applications-list">
        {values.length > 0 ? (
          values.map((application) => (
            (application.status !== "rejected" && (
            <div className="application-card" key={application.application_id}>
              <h3 className="my-3">{`${application.first_name} ${application.last_name}`}</h3>
              <h5><strong style={{color: "#f1c40f"}}>Company:</strong> {application.company_name}</h5>
              <h5><strong style={{color: "#f1c40f"}}>Title:</strong> {application.title}</h5>
              <h5><strong style={{color: "#f1c40f"}}>Category:</strong> {application.category_name}</h5>
              <h5><strong style={{color: "#f1c40f"}}>Application Date:</strong> {new Date(application.application_date).toLocaleDateString()}</h5>
              <Link className="btn btn-primary my-1" role="button" to={`/viewprofile/${application.user_id}`}>
              View Profile
              </Link>
              {application.status === "pending" ? (
                <>
                  <button onClick={() => HandleAccept(application.application_id)} className="btn btn-success">Accept</button>
                  <button onClick={() => HandleReject(application.application_id)} className="btn btn-danger my-1">Reject</button>
                </>
              ) : (
                <>
                  <button className="meet-button" onClick={() => handleScheduleInterview(application)}>Schedule Interview</button>
                  <button className="btn btn-danger my-1">Remove</button>
                </>
              
              )}
            </div>
          ))))
        ) : (
          <p>No Applications Received</p>
        )}
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <button onClick={() => setIsModalOpen(false)} className="close-button">
            <i className="fa-solid fa-x"></i>
            </button>
            <h2>Schedule Interview</h2>
            <label>Select Interview Date and Time:</label>
            <input
              type="datetime-local"
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
            />
            <button onClick={handleSaveInterview} className="btn btn-success">Schedule</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewApplications;
