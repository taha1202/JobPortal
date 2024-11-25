import React from "react";

import {
 Link
  // useNavigate
} from "react-router-dom";
const Home = () => {
  return (
    <>
        <div className="hero-section text-center my-5">
          <h1>Welcome to JobPortal</h1>
          <p className="lead">
            Your journey to finding the perfect job starts here. Explore thousands of job listings tailored to your skills.
          </p>
          <Link
            className="btn btn-primary"
            to="/login?mode=login"
            role="button">
            Get Started
          </Link>
        </div>

        {/* Job Categories */}
        <div className="categories-section my-5">
          <h2 className="text-center">Explore Job Categories</h2>
          <div className="row my-4">
            <div className="col-md-4">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title">Software Development</h5>
                  <p className="card-text">Find jobs in programming, web development, and more.</p>
                  <button className="btn btn-secondary">Explore</button>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title">Marketing</h5>
                  <p className="card-text">Explore opportunities in digital marketing and branding.</p>
                  <button className="btn btn-secondary">Explore</button>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title">Finance</h5>
                  <p className="card-text">Apply for jobs in finance, accounting, and more.</p>
                  <button className="btn btn-secondary">Explore</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="testimonials-section my-5 text-center">
          <h2>What Our Users Say</h2>
          <div className="row mt-4">
            <div className="col-md-6">
              <blockquote className="blockquote">
                <p>
                  "JobPortal helped me land my dream job within weeks. The process was so smooth and seamless!"
                </p>
                <footer className="blockquote-footer">Jane Doe, Software Engineer</footer>
              </blockquote>
            </div>
            <div className="col-md-6">
              <blockquote className="blockquote">
                <p>
                  "Amazing platform! I found the perfect match for my skills and interests."
                </p>
                <footer className="blockquote-footer">John Smith, Digital Marketer</footer>
              </blockquote>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="cta-section text-center my-5">
          <h2>Ready to Find Your Dream Job?</h2>
          <p className="lead">Sign up today and start your journey!</p>
          <Link
            className="btn btn-primary "
             to="/login?mode=signup"
            role="button">
           Join Now
          </Link>
        </div>
    </>
  );
};

export default Home;
