import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const PostJob = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    company_name: "",
    job_title: "",
    job_category: "",
    company_description: "",
    job_description: "",
    requirement: "",
    salary: 0,
    status: "",
    city: "",
    country: "",
    state: "",
    street: "",
    picture: "",
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("https://jobportal-ubcf.onrender.com/api/getcategory", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch Categories");
        }

        const data = await response.json();
        setCategories(data.category || []);
        console.log(data.category);
      } catch (err) {
        console.error("Error fetching Categories:", err);
      }
    };

    fetchCategories();
  }, []);

  const HandleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      let pictureUrl = "";
      if (values.picture) {
        const formData = new FormData();
        formData.append("picture", values.picture);
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
      }

      const response = await fetch("https://jobportal-ubcf.onrender.com/api/post-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...values,
          picture: pictureUrl,
        }),
      });
      console.log(values);
      console.log(response);
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        navigate("/viewpostjob");
        alert("Job Posted successful!");
      } else {
        alert(data.message || "Failed to post a job!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const HandleOnChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      console.log(files[0]);
      setValues({
        ...values,
        [name]: files[0],
      });
    } else {
      setValues({
        ...values,
        [name]: value,
      });
    }
  };

  return (
    <div className="post-container-wrapper">
      <div className="post-container">
        <h2>Post a Job</h2>
        <form className="post-job-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="validationDefault01">Company Name</label>
              <input
                type="text"
                className="form-control"
                id="validationDefault01"
                placeholder="Enter company name"
                name="company_name"
                value={values.company_name}
                onChange={HandleOnChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="validationDefault04">Job Title</label>
              <input
                type="text"
                className="form-control"
                id="validationDefault04"
                placeholder="Enter job title"
                name="job_title"
                value={values.job_title}
                onChange={HandleOnChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="validationDefault06">Job Category</label>
              <div className="custom-dropdown">
                <select
                  className="form-select"
                  id="validationDefault11"
                  required
                  name="job_category"
                  value={values.job_category}
                  onChange={HandleOnChange}
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  {categories.map((category, index) => (
                    <option value={category.category_name} key={index}>
                      {category.category_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="companyImage">Company Image</label>
              <input
                type="file"
                className="form-control"
                id="companyImage"
                name="picture"
                onChange={HandleOnChange}
                accept="image/*"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="validationDefault03">Company Description</label>
              <textarea
                className="form-control"
                id="validationDefault03"
                placeholder="Describe your company"
                rows="3"
                name="company_description"
                value={values.company_description}
                onChange={HandleOnChange}
                required
              ></textarea>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="validationDefault08">Job Description</label>
              <textarea
                className="form-control"
                id="validationDefault08"
                placeholder="Describe the job role"
                rows="3"
                name="job_description"
                value={values.job_description}
                onChange={HandleOnChange}
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="validationDefault09">Requirements</label>
              <textarea
                className="form-control"
                id="validationDefault09"
                placeholder="List the job requirement"
                rows="3"
                name="requirement"
                value={values.requirement}
                onChange={HandleOnChange}
                required
              ></textarea>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="validationDefault10">Salary</label>
              <input
                type="number"
                className="form-control"
                id="validationDefault10"
                placeholder="Enter salary"
                name="salary"
                value={values.salary === 0 ? "" : values.salary}
                onChange={HandleOnChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="validationDefault11">Status</label>
              <select
                className="form-select"
                id="validationDefault11"
                required
                name="status"
                value={values.status}
                onChange={HandleOnChange}
              >
                <option value="" disabled>
                  Select status
                </option>
                <option value="active">active</option>
                <option value="inactive">inactive</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="validationDefault05">City</label>
              <input
                type="text"
                className="form-control"
                id="validationDefault05"
                placeholder="Enter city"
                name="city"
                value={values.city}
                onChange={HandleOnChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="validationDefault07">Country</label>
              <input
                type="text"
                className="form-control"
                id="validationDefault07"
                placeholder="Enter country"
                name="country"
                value={values.country}
                onChange={HandleOnChange}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="validationDefault12">State</label>
              <input
                type="text"
                className="form-control"
                id="validationDefault12"
                placeholder="Enter state"
                name="state"
                value={values.state}
                onChange={HandleOnChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="validationDefault13">Street</label>
              <input
                type="text"
                className="form-control"
                id="validationDefault13"
                placeholder="Enter street address"
                name="street"
                value={values.street}
                onChange={HandleOnChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <button
              className="btn btn-dark"
              type="submit"
              onClick={HandleSubmit}
            >
              Post Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
