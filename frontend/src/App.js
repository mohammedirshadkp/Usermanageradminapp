import React, { Suspense, lazy, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import UserHomeScreen from "./pages/UserHomeScreen";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const NotFound = lazy(() => import("./pages/NotFound"));

const App = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem("userData"));
    if (data?.isLoggedIn) setUserData(data.userData);
  }, []);

  return (
    <Router>
      {userData && <Header />}

      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={userData ? <UserHomeScreen /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/homeScreen" element={ <home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <ToastContainer position="top-center" autoClose={1000} hideProgressBar closeOnClick theme="colored" />
    </Router>
  );
};

export default App;
