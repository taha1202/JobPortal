import React, { useState } from "react";

const PostJob = () => {

  const [values,setValues] = useState({
    com_name:"",
    job_title:"",
    category:"",
    picture:"",
    com_description:"",
    job_des:"",
    requirements:"",
    salary:"",
    status:"",
    city:"",
    country:"",
    state:"",
    street:""
  });

  const HandleOnChange = (e) =>{
    const { name, value } = e.target; 
      setValues({
        ...values,
        [name]: value,
      });

  }
  return (
    <div className="post-container-wrapper">
      <div className="post-container">
        <h2>Post a Job</h2>
        <form className="post-job-form">
          {/* Row 1: Company Name and Job Title */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="validationDefault01">Company Name</label>
              <input
                type="text"
                className="form-control"
                id="validationDefault01"
                placeholder="Enter company name"
                name="com_name"
                value={values.com_name}
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

          {/* Row 2: Job Category, Company Picture */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="validationDefault06">Job Category</label>
              <select className="form-select" id="validationDefault06" 
              name="category"
              value={values.category}
              onChange={HandleOnChange}
              required>
                <option value="" disabled selected>
                  Select category
                </option>
                <option>Category1</option>
                <option>Category2</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="companyImage">Company Image</label>
              <input
                type="file"
                className="form-control"
                id="companyImage"
                accept="image/*"
                required
              />
            </div>
          </div>
          {/* Row 3: Company Description */}
          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="validationDefault03">Company Description</label>
              <textarea
                className="form-control"
                id="validationDefault03"
                placeholder="Describe your company"
                rows="3"
                required
              ></textarea>
            </div>
          </div>

          {/* Row 4: Job Description and Requirements */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="validationDefault08">Job Description</label>
              <textarea
                className="form-control"
                id="validationDefault08"
                placeholder="Describe the job role"
                rows="3"
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="validationDefault09">Requirements</label>
              <textarea
                className="form-control"
                id="validationDefault09"
                placeholder="List the job requirements"
                rows="3"
                required
              ></textarea>
            </div>
          </div>

          {/* Row 5: Salary and Status */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="validationDefault10">Salary</label>
              <input
                type="number"
                className="form-control"
                id="validationDefault10"
                placeholder="Enter salary"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="validationDefault11">Status</label>
              <select className="form-select" id="validationDefault11" required>
                <option value="" disabled selected>
                  Select status
                </option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>

          {/* Row 6: Location */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="validationDefault05">City</label>
              <input
                type="text"
                className="form-control"
                id="validationDefault05"
                placeholder="Enter city"
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
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-row">
            <button className="btn btn-dark" type="submit">
              Post Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
