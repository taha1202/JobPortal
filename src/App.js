import './App.css';
import Home from './Components/Home';
import Login from './Components/Login';
import Navbar from './Components/Navbar';
import ViewPostJobs from './Components/ViewPostJobs';
import React, { useState } from "react";
 import PostJob from './Components/PostJob';
 import Profile from './Components/Profile';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";




function App() {
  const [role, setRole] = useState("");
  const [U_name, setName] =  useState("");
  return (
    <>
      <Router>
        <Navbar role={role} setRole={setRole} U_name={U_name} setName={setName}/>
        <Routes>
          <Route path="/" element=  {<Home/>}/>   
          <Route path="/viewpostjob"  element=  {<ViewPostJobs/>}/>
          <Route path="/postjob"  element=  {<PostJob/>}/>
          <Route path="/login" element=  {<Login setRole={setRole} setName={setName}/>}/>   
          <Route path='/profile' element={<Profile/>}/>
      </Routes>
       
       </Router> 
    </>
  );
}

export default App;
