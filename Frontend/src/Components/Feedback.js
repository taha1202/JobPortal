import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Feedback = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    feedback_text: "",
    rating: 1,
    feedback_type: "",
    isAnonymous: "",
  });

  const HandleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("https://jobportal-ubcf.onrender.com/api/givefeedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...values,
        }),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        navigate("/");
        alert("Feedback Submitted Successful!");
      } else {
        alert(data.message || "Failed to submit a feedback!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const HandleOnChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  return (
    <div className="feedback-container-wrapper">
      <div className="feedback-container">
        <h2>Share Your Thoughts</h2>
        <form className="feedback-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="feedbackType">Feedback Type</label>
              <div className="radio-group">                
                <label>
                  <input
                    type="radio"
                    id="comments"
                    name="feedback_type"
                    value="Comments"
                    checked={values.feedback_type === "Comments"}
                    onChange={HandleOnChange}
                  />
                  Comments
                </label>
                <label>
                  <input
                    type="radio"
                    id="suggestion"
                    name="feedback_type"
                    value="Suggestion"
                    checked={values.feedback_type === "Suggestion"}
                    onChange={HandleOnChange}
                  />
                  Suggestion
                </label>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="ratingSlider">Rating</label>
              <input
                type="range"
                id="ratingSlider"
                name="rating"
                min="1"
                max="5"
                value={values.rating}
                className="slider"
                onChange={HandleOnChange}
              />
              <div className="slider-value">
                <span>{values.rating}</span> / 5
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="validationDefault03">Feedback</label>
              <textarea
                className="form-control"
                id="validationDefault03"
                placeholder="Share your Experience"
                rows="3"
                name="feedback_text"
                value={values.feedback_text}
                onChange={HandleOnChange}
                required
              ></textarea>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Anonymous Feedback</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    id="anonymousYes"
                    name="isAnonymous"
                    value="Yes"
                    checked={values.isAnonymous === "Yes"}
                    onChange={HandleOnChange}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    id="anonymousNo"
                    name="isAnonymous"
                    value="No"
                    checked={values.isAnonymous === "No"}
                    onChange={HandleOnChange}
                  />
                  No
                </label>
              </div>
            </div>
          </div>

          <div className="form-row">
            <button
              className="btn btn-dark"
              type="submit"
              onClick={HandleSubmit}
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
