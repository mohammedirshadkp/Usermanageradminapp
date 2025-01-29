import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    // Define the logout function
    const logout = () => {
        sessionStorage.clear(); // Clear session data
        navigate('/login'); // Redirect to login page
    };

    return (
        <div>
            <h2 style={{ textAlign: 'center' }}>UserManager</h2>
            <li>
              <i className="fas fa-sign-out-alt logo-icon" style={{ cursor: 'pointer' }} onClick={logout}></i>
            </li>
          
        </div>
    );
}

export default Home;
