import './App.css';
import Home from './Components/Home';
import Login from './Components/Login';
import Navbar from './Components/Navbar';

import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Navbar/>
        <Routes>
      <Route path="/" element=  {<Home/>}/>   
      <Route path="/about" />
      <Route path="/login" element=  {<Login/>}/>     
      </Routes>
       
       </Router> 
    </>
  );
}

export default App;
