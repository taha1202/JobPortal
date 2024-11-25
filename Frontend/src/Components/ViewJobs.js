import React, { useState, useEffect } from "react";
import JobLists from "./JobLists";
import Spinner from "./Spinner";

const ViewJobs = () => {
  const [loading, setLoading] = useState(true);
  const [filterval, setFilterval] = useState("");
  const [minSalary, setMinSalary] = useState(0);
  const [maxSalary, setMaxSalary] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  

  const [values, setValues] = useState({
    sort: "",
    filter: "",
    order: "",
  });
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobDetails = async () => {
      const token = localStorage.getItem("token");
      try {
        const queryParams = new URLSearchParams({
          ...values,
        });

        const response = await fetch(
          `http://localhost:5000/api/get-jobs?${queryParams}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        const data = await response.json();
        if (data.success) {
          setJobs(data.result);
          console.log(data.result);
          setTotalPages(Math.ceil(data.totaljobs/6));
        } else {
          console.error("API Error:", data.message);
        }
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [values]);


  
  const HandleSearch = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const queryParams = new URLSearchParams({
        ...values,
        filterval: filterval,
        min_salary: minSalary,
        max_salary: maxSalary,
      });

      const response = await fetch(
        `http://localhost:5000/api/search-jobs?${queryParams}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
      const data = await response.json();
      if (data.success) {
        setJobs(data.result);
        console.log(data.result);
        setTotalPages(Math.ceil(data.totaljobs/6));
        //setValues(values);
      } else {
        console.error("API Error: ", data.message);
      }
    } catch (err) {
      console.error("Error Searching jobs: ", err);
    }
  };
  const HandleReset = () => {
    setFilterval("");
    setMinSalary(0);
    setMaxSalary(0);
    setValues({
      sort: "",
      filter: "",
      order: "",
    });
    setJobs([]);
  };
  const HandleOnChange = (e) => {
    const { name, value, type } = e.target;
    if (name === "filter") {
      setFilterval("");
      setMinSalary("");
      setMaxSalary("");
    }
    if (name === "filterval") {
      setFilterval(value);
    } 
    else if (name === "minSalary") {
      setMinSalary(value);
    } 
    else if (name === "maxSalary") {
      setMaxSalary(value);
    } 
    else {
      setValues({
        ...values,
        [name]: type === "number" ? Number(value) : value,
      });
    }

    if(name === "sort" || name === "order") {
      if(values.sort && values.order) {
        setCurrentPage(1);
      }
    }
  };
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    };
  };
  
  const handleNextPage = () => {
      if(currentPage !== totalPages){
        setCurrentPage(currentPage + 1);
      }
  };

  const indexOfLastJob = currentPage * 6;
  const indexOfFirstJob = indexOfLastJob - 6;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="job-list-container">
            <div className="filter-sort">
              <div className="form-group">
                <label htmlFor="validationDefault01">Sort</label>
                <select
                  className="form-select"
                  id="validationDefault01"
                  required
                  name="sort"
                  value={values.sort}
                  onChange={HandleOnChange}
                >
                  <option value="">Sort</option>
                  <option value="salary">salary</option>
                  <option value="posting_date">date</option>
                </select>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="order"
                    id="inlineRadio1"
                    value="asc"
                    onChange={HandleOnChange}
                    checked={values.order === "asc"}
                  />
                  <label className="form-check-label" htmlFor="inlineRadio1">
                    asc
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="order"
                    id="inlineRadio2"
                    value="desc"
                    onChange={HandleOnChange}
                    checked={values.order === "desc"}
                  />
                  <label className="form-check-label" htmlFor="inlineRadio2">
                    desc
                  </label>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="validationDefault02">Filter</label>
                <select
                  className="form-select"
                  id="validationDefault02"
                  required
                  name="filter"
                  value={values.filter}
                  onChange={HandleOnChange}
                >
                  <option value="">filter</option>
                  <option value="Category">Category</option>
                  <option value="Company">Company</option>
                  <option value="Location">Location</option>
                  <option value="Salary">Salary</option>
                </select>
                {values.filter === "Salary" ? (
                  <>
                    <input
                      type="number"
                      className="form-control my-2"
                      placeholder="Min Salary"
                      name="minSalary"
                      value={minSalary}
                      onChange={HandleOnChange}
                    />
                    <input
                      type="number"
                      className="form-control my-2"
                      placeholder="Max Salary"
                      name="maxSalary"
                      value={maxSalary}
                      onChange={HandleOnChange}
                    />
                  </>
                ) : (
                  <input
                    type="text"
                    className="form-control"
                    placeholder={`Enter ${
                      values.filter === "Location"
                        ? "Country"
                        : values.filter || "value"
                    }`}
                    name="filterval"
                    value={filterval}
                    onChange={HandleOnChange}
                    disabled={!values.filter}
                  />
                )}
                <div className="filter-btn">
                  <button className ="btn" nClick={HandleSearch}
                   disabled={(!values.filter || !filterval) && (!maxSalary && !minSalary)}
                  >
                    Search
                  </button>
                  <button
                    className ="btn"
                    onClick={HandleReset}
                    disabled={!values.filter}
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>
            <h3 className="text-center my-3">JobPortal - Available Jobs</h3>
            <div className="prev-next my-3">
              <button
                type="button"
                className ="btn"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button
                type="button"
                className ="btn"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
            <div className="row my-2">
              {currentJobs.map((job, index) => (
                <div className="col-md-4" key={index}>
                  <JobLists
                    id={job.job_id}
                    job_title={job.title}
                    job_description={job.description}
                    company_name={job.company_name}
                    pictureUrl={job.company_image}
                    job_category={job.category_name}
                    salary={job.salary}
                    date={job.posting_date}
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ViewJobs;
