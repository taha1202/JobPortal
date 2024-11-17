import React from "react";


const Profile = () => {
  return (
    <div className="profile-container">
      <div className="view-profile">
        <div className="profile-picture-container">
          <img
            src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            alt="profile"
            className="profile-picture"
          />
          <div className="file-input-container">
            <input type="file" id="formFile" className="file-input" />
            <label htmlFor="formFile" className="edit-icon">
              <i className="fa-regular fa-pen-to-square"></i>
            </label>
          </div>
        </div>
      </div>

      {/* Profile Details Section */}
      <div className="profile-details">
        <h2 className="section-title">Personal Information</h2>
        <div className="form-group">
          <label>Name:</label>
          <input type="text" className="form-control" placeholder="Enter your name" />
        </div>

        <div className="form-group">
          <label>Skills:</label>
          <textarea
            className="form-control"
            placeholder="Add your skills (e.g., React, Node.js, etc.)"
          ></textarea>
        </div>

        <div className="form-group">
          <label>Upload Resume:</label>
          <input type="file" className="form-control" />
        </div>

        <div className="form-group">
          <label>Experience:</label>
          <textarea
            className="form-control"
            placeholder="Add your experience details"
          ></textarea>
        </div>

        <div className="form-group">
          <label>Education:</label>
          <textarea
            className="form-control"
            placeholder="Add your education details"
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default Profile;
