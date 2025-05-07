import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './Auth/AuthContext';
import './Header.css';

const Header = () => {
  const { isLoggedIn, logoutcall } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="header">
      <h2>Student Classroom Experience</h2>
      {isLoggedIn && (
        <button onClick={() => logoutcall(navigate)} className="logout-button">
          Sign out
        </button>
      )}
    </header>
  );
};

export default Header;