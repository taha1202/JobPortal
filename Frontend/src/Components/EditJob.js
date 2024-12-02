import React, { useState, useEffect } from "react";
import { useParams} from "react-router-dom";
import Spinner from "./Spinner";

const EditJob = () => {
  const { id } = useParams();
  

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
    status: "", // New field for status
    company_image: "", // New field for company image
  });

  const [loading, setLoading] = useState(true);
  const [isEditing, setEditing] = useState({}); // Track editing states

  useEffect(() => {
    const fetchJobDetails = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `https://jobportal-ubcf.onrender.com/api/job-details/${id}`,
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
      } catch (err) {
        console.error("Error fetching job details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  const handleEditToggle = (field) => {
    setEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e, field) => {
    const value = field === "company_image" ? e.target.files[0] : e.target.value;
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (field) => {
    console.log(field);
    const token = localStorage.getItem("token");
    try {
      if(field === "company_image" && job[field]) {
      let pictureUrl = "";
      
        const formData = new FormData();
        formData.append("picture", job[field]);
        formData.forEach((value, key) => {
          console.log(`${key}:`, value);
        });
        const uploadResponse = await fetch(
          "https://jobportal-ubcf.onrender.com/api/upload-image",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        const uploadData = await uploadResponse.json();

        if (!uploadResponse.ok) {
          console.log(pictureUrl);
          console.error(uploadData.message || "Failed to upload picture.");
        }

        console.log(uploadData.url);
        pictureUrl = uploadData.url;
        console.log(pictureUrl);
      const response = await fetch(
        `https://jobportal-ubcf.onrender.com/api/edit-job/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ 
            update:field,
            field: pictureUrl,
            
           }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to save changes");
      }
      alert("Changes saved successfully!");
      setEditing((prev) => ({ ...prev, [field]: false }));
    }
    else{
      const response = await fetch(
        `https://jobportal-ubcf.onrender.com/api/edit-job/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ 
            update:field,
            field: job[field],
            
           }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to save changes");
      }
      alert("Changes saved successfully!");
      setEditing((prev) => ({ ...prev, [field]: false }));
    }
   } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const requirementsList = job.requirements
    .split("/n")
    .map((req, index) => <p key={index}>{req}</p>);

  

  if (loading)
    return (
      <div className="loading-container">
        <Spinner />
      </div>
    );

  return (
    <div className="job-details-wrapper">
      <div className="job-image-container">
      <div className="job-section">
          <h2 style={{color: "#f39c12", fontWeight:"bold"}}>Company Image</h2>
          {isEditing["company_image"] ? (
            <input
              type="file"
              onChange={(e) => handleChange(e, "company_image")}
              style={{backgroundColor:"white"}}
            />
          ) : (
            <img src={job.picture} alt="Company" className="job-image" />
          )}
          <button
            className="edit-btn"
            onClick={() =>
              isEditing["company_image"]
                ? handleSave("company_image")
                : handleEditToggle("company_image")
            }
          >
            {isEditing["company_image"] ? "Save" : "Edit"}
          </button>
        </div>
      </div>

      <div className="job-content">
        <div className="job-section">
          <h2 style={{color: "#f39c12", fontWeight:"bold"}}>
            {isEditing["job_title"] ? (
              <input
                value={job.job_title}
                onChange={(e) => handleChange(e, "job_title")}
              />
            ) : (
              job.job_title
            )}
          </h2>
          <button
            className="edit-btn"
            onClick={() =>
              isEditing["job_title"]
                ? handleSave("job_title")
                : handleEditToggle("job_title")
            }
          >
            {isEditing["job_title"] ? "Save" : "Edit"}
          </button>
        </div>
        <div className="job-section">
          <h3>Job Description</h3>
          {isEditing["job_description"] ? (
            <textarea
              value={job.job_description}
              onChange={(e) => handleChange(e, "job_description")}
            />
          ) : (
            <p>{job.job_description}</p>
          )}
          <button
            className="edit-btn"
            onClick={() =>
              isEditing["job_description"]
                ? handleSave("job_description")
                : handleEditToggle("job_description")
            }
          >
            {isEditing["job_description"] ? "Save" : "Edit"}
          </button>
        </div>
        <div className="job-section">
          <h3>Requirements</h3>
          {isEditing["requirements"] ? (
            <textarea
              value={job.requirements}
              onChange={(e) => handleChange(e, "requirements")}
            />
          ) : (
            requirementsList
          )}
          <button
            className="edit-btn"
            onClick={() =>
              isEditing["requirements"]
                ? handleSave("requirements")
                : handleEditToggle("requirements")
            }
          >
            {isEditing["requirements"] ? "Save" : "Edit"}
          </button>
        </div>
        <div className="job-section">
          <h3>Salary</h3>
          {isEditing["salary"] ? (
            <input
              type="number"
              value={job.salary}
              onChange={(e) => handleChange(e, "salary")}
            />
          ) : (
            <p>${job.salary}</p>
          )}
          <button
            className="edit-btn"
            onClick={() =>
              isEditing["salary"] ? handleSave("salary") : handleEditToggle("salary")
            }
          >
            {isEditing["salary"] ? "Save" : "Edit"}
          </button>
        </div>

        {/* Status */}
        <div className="job-section">
          <h3>Status</h3>
          {isEditing["status"] ? (
            <select
              value={job.status}
              onChange={(e) => handleChange(e, "status")}
            >
             <option value="active">active</option>
             <option value="inactive">inactive</option>
             </select>   
          ) : (
            <p>{job.status}</p>
          )}
          <button
            className="edit-btn"
            onClick={() =>
              isEditing["status"]
                ? handleSave("status")
                : handleEditToggle("status")
            }
          >
            {isEditing["status"] ? "Save" : "Edit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditJob;
