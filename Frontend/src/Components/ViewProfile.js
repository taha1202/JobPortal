import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ViewProfile = () => {
  const { id } = useParams();  
  const [resume, setResume] = useState("");
  const [values, setValues] = useState({
    first_name: "",
    last_name: "",
    skills: "",
    experience: "",
    education: "",
    profile_pic: "",
  });

 
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`https://jobportal-ubcf.onrender.com/api/view-applicant-profile/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile details");
        }

        const data = await response.json();
        setValues(data.profile);
        setResume(data.profile.resume);
        console.log(data.profile);
      } catch (err) {
        console.error("Error fetching profile details:", err);
      }
    };

    fetchProfile();
  }, [id]);
  return (
    <div className="profile-container">
      <div className="view-profile">
        <div className="profile-picture-container">
          <img
            src={values.profile_pic}
            alt="profile"
            className="profile-picture"
          />
        </div>
      </div>

      <div className="profile-details">
        <h2 className="section-title">Applicant Information</h2>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            className="form-control"
            value={values.first_name + " " + values.last_name}
            disabled
          />
        </div>

        <div className="form-group">
          <label>Skills:</label>
          <textarea
            className="form-control"
            value={values.skills}
            disabled
          ></textarea>
        </div>
          <div className="uploaded-resume-container">
            <label className="uploaded-resume-label">Uploaded Resume:</label>
            <a
              href={resume}
              target="_blank"
              rel="noopener noreferrer"
              className="uploaded-resume-link"
            >
              View Resume
            </a>
          </div>

        <div className="form-group my-3">
          <label>Experience:</label>
          <textarea
            className="form-control"
            value={values.experience}
            disabled
          ></textarea>
        </div>

        <div className="form-group">
          <label>Education:</label>
          <textarea
            className="form-control"
            value={values.education}
            disabled
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
