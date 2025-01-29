import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../App.css';

const Header = () => {
  const location = useLocation(); // Get the current location
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate(); // Initialize navigate hook

  useEffect(() => {
    // Check user data on location change (useEffect re-runs when location changes)
    setTimeout(() => {
      getData();
    }, 200);
  }, [location]); // Re-run on location change

  const getData = async () => {
    const data = await JSON.parse(sessionStorage.getItem('userData')); // Retrieve user data from sessionStorage
    console.log('useEffect run');
    if (data && data.isLoggedIn) {
      setUserData(data.userData); // Set user data if logged in
    }
  };

  const logout = () => {
    sessionStorage.clear();  // Clear session data
    setUserData(null);       // Reset user data state
    navigate('/login');      // Redirect to login page
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span className="logo-text">UserManager</span>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Home
          </Link>
        </li>

        {/* Conditional Rendering based on user login status */}
        {userData ? (
          <>
            <li className="navbar-profile">
              <Link
                to="/UserHomeScreen"
                className={location.pathname === '/UserHomeScreen' ? 'active' : ''}
                style={{ display: 'flex' }}
              >
                <img
                  src={require('../img1.png')}
                  alt="Profile"
                  className="profile-photo-circle"
                />
                <span className="username">{userData.name}</span>
              </Link>
            </li>
            <li>
              <i
                className="fas fa-sign-out-alt logo-icon"
                style={{ cursor: 'pointer' }}
                onClick={logout}
              ></i>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>
                Login
              </Link>
            </li>
            <li>
              <Link to="/signup" className={location.pathname === '/signup' ? 'active' : ''}>
                Sign Up
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Header;
