import React from 'react';

const StarterPage = () => {
  return (
    <div className='starter-container'>
      <div className="starter-page">
        <div className="computer-container">
          <div className="computer-frame">
            {/* Front Side */}
            <div className="screen front">
              <h1 className="welcome-text">Welcome to Job Portal</h1>
            </div>
            {/* Back Side */}
            <div className="screen back">
              <h1 className="welcome-text">Welcome to Job Portal</h1>
            </div>
          </div>
          <div className="keyboard"></div>
          <div className="base"></div>
        </div>
        <div className="floating-effect"></div>
      </div>
    </div>
  );
};

export default StarterPage;
