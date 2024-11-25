import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ViewProfile = () => {
  const { id } = useParams();  
  const [resume, setResume] = useState("");
  let resumePreview;
  const [values, setValues] = useState({
    first_name: "",
    last_name: "",
    skills: "",
    experience: "",
    education: "",
    profile_pic: "",
  });

  const convertPathToUrl = (localPath) => {
    if (
      localPath ===
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    ) {
      return localPath;
    }
    const baseUrl = "http://localhost:5000/uploads/images/";
    const fileName = localPath.split("uploads\\images\\")[1];
    return baseUrl + fileName;
  };

  const convertResumeToUrl = (localPath) => {
    if (localPath) {
      const baseUrl = "http://localhost:5000/uploads/resume/";
      const fileName = localPath.split("uploads\\resume\\")[1];
      return baseUrl + fileName;
    }
  };
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`http://localhost:5000/api/view-applicant-profile/${id}`, {
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
  resumePreview = convertResumeToUrl(resume);
  return (
    <div className="profile-container">
      <div className="view-profile">
        <div className="profile-picture-container">
          <img
            src={convertPathToUrl(values.profile_pic)}
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
              href={resumePreview}
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
