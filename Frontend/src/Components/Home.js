import React, { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
const Home = ({ role }) => {
  const [values, setValues] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCatPage] = useState(1);
  const [currentFeedback, setCurrentFeedPage] = useState(1);
  const [TotalCategory, setTotalCatPage] = useState(1);
  const [TotalFeedback, setTotalFeedPage] = useState(1);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchfeedBacks = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:5000/api/getfeedback", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch Feedbacks");
        }

        const data = await response.json();
        setValues(data.feedbacks || []);
        console.log(data.feedbacks);
        setTotalFeedPage(Math.ceil(data.pages / 2));
        console.log(Math.ceil(data.pages / 2));
      } catch (err) {
        console.error("Error fetching Feedbacks:", err);
      }
    };

    fetchfeedBacks();

    const fetchCategories = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:5000/api/getcategory", {
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
        setTotalCatPage(Math.ceil(data.pages/3));
      } catch (err) {
        console.error("Error fetching Categories:", err);
      }
    };

    fetchCategories();
  }, []);

  const displaycats = categories.slice(
    currentCategory * 3 - 3,
    currentCategory * 3
  );

  const displayfeeds = values.slice(
    currentFeedback * 2 - 2,
    currentFeedback * 2
  );

  const HandlePrevCat = () => {
    if(currentCategory > 1){
      setCurrentCatPage(currentCategory - 1);
    }
  };

  const HandleNextCat = () => {
    if(currentCategory !== TotalCategory) {
      setCurrentCatPage(currentCategory + 1);
    }
  };

  
  const HandlePrevFeed = () => {
    if(currentFeedback > 1){
      setCurrentFeedPage(currentFeedback - 1);
    }
  };

  const HandleNextFeed = () => {
    if(currentFeedback !== TotalFeedback) {
      setCurrentFeedPage(currentFeedback + 1);
    }
  };

  const HandleClick = ()=> {
    if(!role) {
      alert ("Log In First To Access Jobs.")
      navigate('/login?mode=login');
      
    }
    else{
      navigate('/viewjobs')
    }

  };
  return (
    <>
      {!role && (
        <div className="hero-section text-center my-5">
          <h1>Welcome to JobPortal</h1>
          <p className="lead">
            Your journey to finding the perfect job starts here. Explore
            thousands of job listings tailored to your skills.
          </p>
          <Link
            className="btn btn-primary"
            to="/login?mode=login"
            role="button"
          >
            Get Started
          </Link>
        </div>
      )}
      {role === 1 && (
        <div className="hero-section text-center my-5">
          <h1>Welcome to JobPortal</h1>
          <p className="lead">
            Your journey to finding the perfect job starts here. Explore
            thousands of job listings tailored to your skills.
          </p>
          <Link className="btn btn-primary" to="/viewjobs" role="button">
            View Jobs
          </Link>
        </div>
      )}
      {role === 2 && (
        <div className="hero-section text-center my-5">
          <h1>Welcome to JobPortal</h1>
          <p className="lead">
            Your journey to finding the perfect job starts here. Explore
            thousands of job listings tailored to your skills.
          </p>
          <Link className="btn btn-primary" to="/postjob" role="button">
            Post Jobs
          </Link>
        </div>
      )}

      <div className="categories-section my-5">
        <h2 className="text-center">Explore Job Categories</h2>
        <div className="row my-4 align-items-center">
          <div className="col-md-1">
            <button
              className="btn btn-light mx-2"
               onClick={HandlePrevCat}
               disabled={currentCategory === 1}
            >
              <i className="fa-solid fa-less-than"></i>
            </button>
          </div>

          <div className="col-md-10 d-flex justify-content-around">
            {displaycats.map((category, index) => (
              <div className="card text-center" key={index}>
                <div className="card-body">
                  <h5 className="card-title">{category.category_name}</h5>
                  <p className="card-text">{category.category_description}</p>
                  <button className="btn btn-secondary" onClick={HandleClick}>Explore</button>
                </div>
              </div>
            ))}
          </div>

          <div className="col-md-1 text-center">
            <button
              className="btn btn-light"
               onClick={HandleNextCat}
               disabled={currentCategory === TotalCategory}
            >
              <i className="fa-solid fa-greater-than"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="testimonials-section my-5 text-center">
        <h2>What Our Users Say</h2>
        <div className="row mt-4">
        <div className="col-md-1">
            <button
              className="btn btn-light mx-2 my-5"
               onClick={HandlePrevFeed}
               disabled={currentFeedback === 1}
            >
              <i className="fa-solid fa-less-than"></i>
            </button>
          </div>
          <div className="col-md-10 d-flex justify-content-center">
          {values.length > 0 ? (
            displayfeeds.map((feedback, index) => (
              <div className = "d-flex flex-column align-items-center mx-3"
                key={index}>
                <blockquote className="blockquote">
                  <p>{feedback.comments}</p>
                  <footer className="blockquote-footer">
                    {feedback.first_name + " " + feedback.last_name}
                  </footer>
                </blockquote>
              </div>
            ))
          ) : (
            <p>No feedback available at the moment. Check back later!</p>
          )}
          </div>
          <div className="col-md-1 text-center">
            <button
              className="btn btn-light my-5"
               onClick={HandleNextFeed}
               disabled={currentFeedback === TotalFeedback}
            >
              <i className="fa-solid fa-greater-than"></i>
            </button>
          </div>
        </div>
      </div>

      {!role ? (
        <div className="cta-section text-center my-5">
          <h2>Ready to Find Your Dream Job?</h2>
          <p className="lead">Sign up today and start your journey!</p>
          <Link
            className="btn btn-primary "
            to="/login?mode=signup"
            role="button"
          >
            Join Now
          </Link>
        </div>
      ) : (
        <div className="cta-section text-center my-5">
          <h2>We Value Your Feedback!</h2>
          <p className="lead">
            Share your thoughts and help us improve your experience.
          </p>
          <Link className="btn btn-primary " to="/feedback" role="button">
            Give Feedback
          </Link>
        </div>
      )}
    </>
  );
};

export default Home;
