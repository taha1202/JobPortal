import './App.css';
import Home from './Components/Home';
import Login from './Components/Login';
import Navbar from './Components/Navbar';
import ViewPostJobs from './Components/ViewPostJobs';
import React, { useState} from "react";
import PostJob from './Components/PostJob';
import Profile from './Components/Profile';
import ViewJobs from './Components/ViewJobs';
import JobDetails from './Components/JobDetails';
import AppliedJobs from './Components/AppliedJobs';
import ViewApplications from './Components/ViewApplications';
import ViewProfile from './Components/ViewProfile';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  // useNavigate
} from "react-router-dom";




function App() {
  // const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [U_name, setName] =  useState("");
  // const [showStarterPage,setShowStarterPage ] = useState(true);
  // useEffect(() => {
  //   // Delay rendering other components for 5 seconds
  //    // Cleanup the timeout on unmount
  // }, []);

  return (
    <>
       <Router>
      {/*  
      {role  && (
          <>
         <Navbar role={role} setRole={setRole} U_name={U_name} setName={setName}/>
          </>
          )} */}
        
      

        <Navbar role={role} setRole={setRole} U_name={U_name} setName={setName}/>
        <Routes>

          <Route path="/" element=  {<Home/>}/>  
          
          <Route path="/login" element=  {<Login setRole={setRole} setName={setName}/>}/>   
          <Route path='/profile' element={<Profile role={role}/>}/>
          
          {role === 2 && (
          <>
          <Route path="/postjob"  element=  {<PostJob/>}/>
          <Route path="/viewpostjob"  element=  {<ViewPostJobs/>}/>
          <Route path="/view-applications"  element=  {<ViewApplications/>}/>
          <Route path='/viewprofile/:id' element={<ViewProfile/>}/>
          </>
          )}
           {role === 1 && (
          <>
          <Route path="/viewjobs"  element=  {<ViewJobs/>}/>
          <Route path="/viewdetails/:id"  element=  {<JobDetails/>}/>
          <Route path='/appliedjobs' element={<AppliedJobs/>}/>
          </>
          )} 
          
      </Routes>
       </Router> 
    </>
  );
}

export default App;
