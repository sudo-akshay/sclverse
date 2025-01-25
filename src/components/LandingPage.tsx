// src/components/LandingPage.tsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { handleApiError } from '../utils/errorHandler';
import './LandingPage.css'; // Custom styles for the landing page

const LandingPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
        const url = `users/login?username=${username}&password=${password}`;

        // Sending login request using POST method and apiClient
        const response = await apiClient.post(url);

      // Assuming response.data contains { role, userId, totalPurse, etc. }
    const { role, id: userId, totalPurse, availablePurse,name } = response.data;

    // Store userId and role in localStorage for use across the app
    localStorage.setItem('userId', userId.toString());
    localStorage.setItem('role', role);
    localStorage.setItem('totalPurse', totalPurse.toString());
    localStorage.setItem('name', name);
    localStorage.setItem('availablePurse', availablePurse.toString());
     

      if (role === 'ADMIN') {
        navigate('/admin-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
    }
  };

  return (
    <div className="landing-page">
      <div className="login-container">
        <h1>Welcome to Sclverse</h1>
        <p>The ultimate FIFA 25 auction platform</p>
        <form onSubmit={handleLogin} className="login-form">
          {error && <p className="error">{error}</p>}
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LandingPage;
