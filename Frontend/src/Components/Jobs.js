import React from 'react'

import JobLists from './JobLists'

const Jobs = () => {
  return (
    <>
    <div className='prev-next my-3'> 
     <button className="btn btn-dark" type="button">
    Previous
    </button>
    <button className="btn-end btn btn-dark" type="button">
      Next
    </button>
    </div>
    <div className="row my-2">

        <div className="col-md-4">
            <JobLists/>
           
        </div>
        <div className="col-md-4" >
            <JobLists/>
           
        </div>
        <div className="col-md-4" >
            <JobLists/>
           
        </div>
    </div>
    </>
  )
}

export default Jobs
