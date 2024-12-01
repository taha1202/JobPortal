import React, { useEffect, useState } from "react";

const Profile = ({role}) => {
  const [picture, setPicture] = useState(null);
  const [U_resume, set_UResume] = useState(null);
  const [resume, setResume] = useState("");
  const [picturePreview, setPicturePreview] = useState("");
  const [Password, setPassword] = useState(false);
  let resumePreview;
  let resumeUrl;
  const [values, setValues] = useState({
    first_name: "",
    last_name: "",
    skills: "",
    experience: "",
    education: "",
    profile_pic: "",
  });
  const [edit, setEdit] = useState({
    edit_name: false,
    edit_skills: false,
    edit_experience: false,
    edit_education: false,
    edit_resume: false,
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
        const response = await fetch("http://localhost:5000/api/view-profile", {
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
        if (data.profile.profile_pic) {
           console.log("Resume Received:", data.profile.resume);
          // // setPicturePreview(convertPathToUrl(data.profile.profile_pic));      
        }
        setResume(data.profile.resume);
        console.log(data.profile);
      } catch (err) {
        console.error("Error fetching profile details:", err);
      }
    };

    fetchProfile();
  }, []);

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
    } 
    else if (name === "resume"){
      console.log(file);
      set_UResume(file); 
      // resumePreview = URL.createObjectURL(file);
    }
    // e.target.value = null; 
  };
  
  const HandleUpdateProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      let profilePicUrl = values.profile_pic;
      if (picture) {
        const formData = new FormData();
        formData.append("picture", picture);

        const uploadResponse = await fetch(
          "http://localhost:5000/api/upload-image",
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
          "http://localhost:5000/api/upload-resume",
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
        }
        resumeUrl = uploadData.url;
        console.log("Uploaded Resume URL: ", uploadData.url,"/n" , resumeUrl);
      }

      const response = await fetch("http://localhost:5000/api/edit-profile", {
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
      });

      const data = await response.json();
      if (response.ok) {
        alert("Profile Updated Successfully");
        setValues((prevValues) => ({
          ...prevValues,
          profile_pic: profilePicUrl,
        }));
        setResume(resumeUrl);
      } 
      else {
        alert(data.message || "Failed to update profile!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred. Please try again.");
    }
  };
  resumePreview = convertResumeToUrl(resume);
  return (
    <div className="profile-container">
      <div className="view-profile">
        <div className="profile-picture-container">
          <img
            src={picturePreview || convertPathToUrl(values.profile_pic)}
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
            disabled={!edit.edit_name && (values.first_name || values.last_name)}
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
            value={values.skills === null ? "" : values.skills }
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
        )
        :(
          <></>
        )}
      <div className="profile-button">
        <button onClick={HandleUpdateProfile}>
          Update Profile
        </button>
        <button onClick={()=> setPassword(true)}>
          Change Password
        </button>
        </div>
      </div>
    </div>
  );
};
export default Profile;