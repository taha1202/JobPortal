import React, { useEffect, useState } from "react";

const Profile = ({ role }) => {
  const [picture, setPicture] = useState(null);
  const [U_resume, set_UResume] = useState(null);
  const [resume, setResume] = useState("");
  const [picturePreview, setPicturePreview] = useState("");
  const [Password, setPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  let resumeUrl;

  const [values, setValues] = useState({
    first_name: "",
    last_name: "",
    skills: "",
    experience: "",
    education: "",
    profile_pic: "",
    notes: "",
    active_jobs: "",
    totalApplication: "",
  });
  const [edit, setEdit] = useState({
    edit_name: false,
    edit_skills: false,
    edit_experience: false,
    edit_education: false,
    edit_resume: false,
  });
  const [notes, setNotes] = useState(false);

  // const convertPathToUrl = (localPath) => {
  //   if (
  //     localPath ===
  //     "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
  //   ) {
  //     return localPath;
  //   }
  //   const baseUrl = "http://localhost:5000/uploads/images/";
  //   const fileName = localPath.split("uploads\\images\\")[1];
  //   return baseUrl + fileName;
  // };

  // const convertResumeToUrl = (localPath) => {
  //   if (localPath) {
  //     const baseUrl = "http://localhost:5000/uploads/resume/";
  //     const fileName = localPath.split("uploads\\resume\\")[1];
  //     return baseUrl + fileName;
  //   }
  // };
  useEffect(() => {
    const fetchEmpProfile = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          "https://jobportal-ubcf.onrender.com/api/view-emp-profile",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile details");
        }

        const data = await response.json();
        setValues(data.profile);
        console.log(data.profile);
      } catch (err) {
        console.error("Error fetching profile details:", err);
      }
    };

    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          "https://jobportal-ubcf.onrender.com/api/view-profile",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

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
    if (role === 1) {
      fetchProfile();
    } else {
      fetchEmpProfile();
    }
  }, [role]);

  const HandleOnChange = (e) => {
    const { name, value } = e.target;

    setValues({
      ...values,
      [name]: value,
    });
  };

  const HandleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    if (!file) return;

    if (name === "picture") {
      setPicture(file);
      setPicturePreview(URL.createObjectURL(file));
    } else if (name === "resume") {
      console.log(file);
      set_UResume(file);
    }
  };

  const HandleUpdateProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (role === 2) {
      try {
        let profilePicUrl = values.profile_pic;
        if (picture) {
          const formData = new FormData();
          formData.append("picture", picture);

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
            alert(uploadData.message || "Failed to upload picture.");
            throw new Error(uploadData.message || "Failed to upload picture.");
          }

          profilePicUrl = uploadData.url;
          console.log("Uploaded Picture URL:", profilePicUrl);
        }

        const response = await fetch(
          "https://jobportal-ubcf.onrender.com/api/edit-emp-profile",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              ...values,
              profile_pic: profilePicUrl,
            }),
          }
        );

        const data = await response.json();
        if (response.ok) {
          alert("Profile Updated Successfully");
          setValues((prevValues) => ({
            ...prevValues,
            profile_pic: profilePicUrl,
          }));
        } else {
          alert(data.message || "Failed to update profile!");
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        alert("An error occurred. Please try again.");
      }
    } else {
      try {
        let profilePicUrl = values.profile_pic;
        if (picture) {
          const formData = new FormData();
          formData.append("picture", picture);

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
            alert(uploadData.message || "Failed to upload picture.");
            throw new Error(uploadData.message || "Failed to upload picture.");
          }

          profilePicUrl = uploadData.url;
          console.log("Uploaded Picture URL:", profilePicUrl);
        }

        if (U_resume) {
          const formData = new FormData();
          formData.append("U_resume", U_resume);
          formData.forEach((value, key) => {
            console.log(`file value = ${key}:`, value);
          });
          const uploadResponse = await fetch(
            "https://jobportal-ubcf.onrender.com/api/upload-resume",
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
            alert(uploadData.message || "Failed to upload picture.");
          } else {
            resumeUrl = uploadData.url;
            console.log(
              "Uploaded Resume URL: ",
              uploadData.url,
              "/n",
              resumeUrl
            );
          }
        }

        const response = await fetch(
          "https://jobportal-ubcf.onrender.com/api/edit-profile",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              ...values,
              profile_pic: profilePicUrl,
              resume: resumeUrl,
            }),
          }
        );

        const data = await response.json();
        if (response.ok) {
          alert("Profile Updated Successfully");
          setValues((prevValues) => ({
            ...prevValues,
            profile_pic: profilePicUrl,
          }));
          setResume(resumeUrl);
        } else {
          alert(data.message || "Failed to update profile!");
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        alert("An error occurred. Please try again.");
      }
    }
  };

  console.log(picturePreview);

  const HandleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "https://jobportal-ubcf.onrender.com/api/update-password",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            oldPass: oldPassword,
            newPass: newPassword,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setPassword(false);
        alert("Password Changed Successfully");
      } else {
        alert(data.message || "Failed to update Password!");
      }
    } catch (error) {
      console.error("Error updating Password:", error);
      alert("An error occurred. Please try again.");
    }
  };
  return (
    <div className="profile-container">
      <div className="view-profile">
        <div className="profile-picture-container">
          <img
            src={picturePreview || values.profile_pic}
            alt="profile"
            className="profile-picture"
          />
          <div className="file-input-container">
            <input
              type="file"
              id="formFile"
              name="picture"
              className="file-input"
              onChange={HandleFileChange}
            />
            <label htmlFor="formFile" className="edit-icon">
              <i className="fa-regular fa-pen-to-square"></i>
            </label>
          </div>
        </div>
      </div>

      <div className="profile-details">
        <h2 className="section-title">Personal Information</h2>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter your name"
            value={values.first_name + " " + values.last_name}
            disabled={
              !edit.edit_name && (values.first_name || values.last_name)
            }
            onChange={(e) => {
              const [firstName, lastName] = e.target.value.split(" ");
              setValues({
                ...values,
                first_name: firstName || "",
                last_name: lastName || "",
              });
            }}
          />
          {!edit.edit_name && (values.first_name || values.last_name) && (
            <i
              className="fa-regular fa-pen-to-square edit-icon"
              onClick={() =>
                setEdit({
                  edit_name: true,
                  edit_skills: false,
                  edit_resume: false,
                  edit_education: false,
                  edit_experience: false,
                })
              }
            ></i>
          )}
        </div>
        {role === 1 ? (
          <>
            <div className="form-group">
              <label>Skills:</label>
              <textarea
                className="form-control"
                placeholder="Add your skills (e.g., React, Node.js, etc.)"
                name="skills"
                value={values.skills === null ? "" : values.skills}
                disabled={!edit.edit_skills && values.skills}
                onChange={HandleOnChange}
              ></textarea>
              {!edit.edit_skills && values.skills && (
                <i
                  className="fa-regular fa-pen-to-square edit-icon"
                  onClick={() =>
                    setEdit({
                      edit_name: false,
                      edit_skills: true,
                      edit_resume: false,
                      edit_education: false,
                      edit_experience: false,
                    })
                  }
                ></i>
              )}
            </div>

            <div className="form-group">
              <label>Upload Resume:</label>
              <input
                type="file"
                className="form-control"
                name="resume"
                disabled={!edit.edit_resume && resume}
                onChange={HandleFileChange}
              />

              {!edit.edit_resume && resume && (
                <i
                  className="fa-regular fa-pen-to-square edit-icon"
                  onClick={() =>
                    setEdit({
                      edit_name: false,
                      edit_skills: false,
                      edit_resume: true,
                      edit_education: false,
                      edit_experience: false,
                    })
                  }
                ></i>
              )}
            </div>
            {resume && (
              <div className="uploaded-resume-container">
                <label className="uploaded-resume-label">
                  Uploaded Resume:
                </label>
                <div className="uploaded-resume-preview">
                  {/* Embed the PDF directly in the page */}
                  <embed
                    src={resume}
                    type="application/pdf"
                    width="100%"
                    height="500px"
                    className="uploaded-resume-embed"
                  />
                </div>
                View Resume
              </div>
            )}
            <div className="form-group my-3">
              <label>Experience:</label>
              <textarea
                className="form-control"
                placeholder="Add your experience details"
                name="experience"
                value={values.experience === null ? "" : values.experience}
                disabled={!edit.edit_experience && values.experience}
                onChange={HandleOnChange}
              ></textarea>
              {!edit.edit_experience && values.experience && (
                <i
                  className="fa-regular fa-pen-to-square edit-icon"
                  onClick={() =>
                    setEdit({
                      edit_name: false,
                      edit_skills: false,
                      edit_resume: false,
                      edit_education: false,
                      edit_experience: true,
                    })
                  }
                ></i>
              )}
            </div>

            <div className="form-group">
              <label>Education:</label>
              <textarea
                className="form-control"
                placeholder="Add your education details"
                name="education"
                value={values.education === null ? "" : values.education}
                disabled={!edit.edit_education && values.education}
                onChange={HandleOnChange}
              ></textarea>
              {!edit.edit_education && values.education && (
                <i
                  className="fa-regular fa-pen-to-square edit-icon"
                  onClick={() =>
                    setEdit({
                      edit_name: false,
                      edit_skills: false,
                      edit_resume: false,
                      edit_education: true,
                      edit_experience: false,
                    })
                  }
                ></i>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="form-group">
              <label>Active Job Postings:</label>
              <p>Total Number of Active Jobs Are: {values.active_jobs}</p>
            </div>

            <div className="form-group">
              <label>Applications Received:</label>
              <p>
                Total No of Applications Received: {values.totalApplication}
              </p>
            </div>

            <div className="form-group">
              <label>Additional Notes:</label>
              <textarea
                className="form-control"
                placeholder="Add Additional Notes"
                name="notes"
                value={values.notes === null ? "" : values.notes}
                disabled={!notes && values.notes}
                onChange={HandleOnChange}
                onMouseLeave={() => setNotes(false)}
                onClick={() => setNotes(true)}
              ></textarea>
              {!notes && (
                <i
                  className="fa-regular fa-pen-to-square edit-icon"
                  onClick={() => setNotes(true)}
                ></i>
              )}
            </div>
          </>
        )}

        <div className="profile-button">
          <button onClick={HandleUpdateProfile}>Update Profile</button>
          <button
            id="openModal"
            class="open-modal-btn"
            onClick={() => setPassword(true)}
          >
            Change Password
          </button>
          {Password === true && (
            <div id="customModal" class="modal">
              <div class="modal-content">
                <div class="modal-body">
                  <form>
                    <div class="form-group">
                      <label for="recipient-name">Old Password</label>
                      <input
                        type="password"
                        id="recipient-name"
                        class="form-control"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                      />
                    </div>
                    <div class="form-group">
                      <label for="message-text">New Password</label>
                      <input
                        type="password"
                        id="recipient-name"
                        class="form-control"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                  </form>
                </div>
                <div class="modal-footer">
                  <button
                    id="closeModalFooter"
                    class="btn btn-secondary"
                    onClick={() => setPassword(false)}
                  >
                    Close
                  </button>
                  <button class="btn btn-secondary" onClick={HandleSave}>
                    Save Password
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Profile;
