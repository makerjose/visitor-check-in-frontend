import React from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Welcome from "./components/Welcome";
import Department from "./components/Department";

function App() {
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const userRole = useSelector((state) => state.role); // get the user role from the Redux store
  console.log("To check login: ", isLoggedIn);
  console.log(userRole);

  return (
    <React.Fragment>
      <header>
        <Header />
      </header>
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {isLoggedIn && userRole === "security" && ( // check user role for redirection
            <Route path="/user" element={<Welcome />} />
          )}
          {isLoggedIn && userRole === "department" && ( 
            <Route path="/user" element={<Department />} /> 
          )}
          {!isLoggedIn && <Route path="/user" element={<Login />} />} {/*redirect unauthorized users */} 
        </Routes>
      </main>
    </React.Fragment>

  );
}

export default App;
