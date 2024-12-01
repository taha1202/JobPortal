import './App.css';
import Home from './Components/Home';
import Login from './Components/Login';
import Navbar from './Components/Navbar';
import ViewPostJobs from './Components/ViewPostJobs';
import React, { useEffect, useState} from "react";
import PostJob from './Components/PostJob';
import Profile from './Components/Profile';
import ViewJobs from './Components/ViewJobs';
import JobDetails from './Components/JobDetails';
import AppliedJobs from './Components/AppliedJobs';
import ViewApplications from './Components/ViewApplications';
import ViewProfile from './Components/ViewProfile';
import Feedback from './Components/Feedback';
import SendMessage from './Components/SendMessage';

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Messages from './Components/Messages';
import SaveJobs from './Components/SaveJobs';
import EditJob from './Components/EditJob';
import StarterPage from './Components/StarterPage';





function App() {
  // const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [U_name, setName] =  useState("");
  const [showStarterPage, setShowStarterPage] = useState(true); 

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowStarterPage(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, [showStarterPage]);

 
  if (showStarterPage) {
    return <StarterPage/>;
  }
  return (
    <>
       <Router>
   
        <Navbar role={role} setRole={setRole} U_name={U_name} setName={setName}/>
        <Routes>

          <Route path="/" element=  {<Home role={role}/>}/>  
          
          <Route path="/login" element=  {<Login setRole={setRole} setName={setName} setShowStarterPage={setShowStarterPage}/>}/>   
           
          {role  && (
          <>
            <Route path='/profile' element={<Profile role={role}/>}/>
            <Route path='/feedback' element={<Feedback role={role}/>}/>
            <Route path='/sendMessage/:id' element={<SendMessage />}/>
            <Route path='/messages' element={<Messages/>}/>
          </>
          )}
          
          
          {role === 2 && (
          <>
          <Route path="/postjob"  element=  {<PostJob/>}/>
          <Route path="/viewpostjob"  element=  {<ViewPostJobs/>}/>
          <Route path="/view-applications"  element=  {<ViewApplications/>}/>
          <Route path='/viewprofile/:id' element={<ViewProfile/>}/>
          <Route path="/editjob/:id"  element=  {<EditJob/>}/>
          </>
          )}
           {role === 1 && (
          <>
          <Route path="/viewjobs"  element=  {<ViewJobs/>}/>
          <Route path="/viewdetails/:id"  element=  {<JobDetails/>}/>
          <Route path='/appliedjobs' element={<AppliedJobs/>}/>
          <Route path='/savejobs' element={<SaveJobs/>}/>
          </>
          )} 
          
      </Routes>
       </Router> 
    </>
  );
}

export default App;
