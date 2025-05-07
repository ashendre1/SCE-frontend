import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import { signup, login} from '../ApiService/apiService';
import { useAuth } from './AuthContext';

const Auth = () => {
  const [isSignup, setIsSignup] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login: setLoginState } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignup) {
      console.log('Signup:', { email, password });
      const response = await signup(email, password);
      if(response.error) {
        alert(response.error);
        return
      } else {
        alert('Successfully registered!');
      }
      
    } else {
      console.log('Login:', { email, password });
      const response = await login(email, password);
      if(response.error) {
        alert(response.error);
        return
      } else {
        setLoginState();
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-toggle">
          <button
            className={`toggle-button ${isSignup ? 'active' : ''}`}
            onClick={() => setIsSignup(true)}
          >
            Signup
          </button>
          <button
            className={`toggle-button ${!isSignup ? 'active' : ''}`}
            onClick={() => setIsSignup(false)}
          >
            Login
          </button>
        </div>

        
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">{isSignup ? 'Register' : 'Enter'}</button>
        </form>
      </div>
    </div>
  );
};

export default Auth;