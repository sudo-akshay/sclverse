import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import LoginForm from './components/LoginForm';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import UserHome from "./components/UserHome";
import PlayerSearch from "./components/PlayerSearch";
import Wishlist from "./components/Wishlist";
import Hatewatch from "./components/HateWatch";
import HateWatch from './components/HateWatch';
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        {/* Nested Routes for UserDashboard */}
        <Route path="/user-dashboard/*" element={<UserDashboard />}>
          <Route path="players" element={<PlayerSearch />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="hatewatch" element={<Hatewatch />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
