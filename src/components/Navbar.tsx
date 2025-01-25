// src/components/Navbar.tsx

import React from 'react';
import './Navbar.css';

const NavbarA: React.FC = () => {
  return (
    <div className="navbarA">
      <div className="navbar-leftA">
        <h2>Sclverse Admin</h2>
      </div>
      <div className="navbar-rightA">
        <a href="#home">Home</a>
        <a href="#players">Players</a>
        <a href="#settings">Settings</a>
        <a href="#logout">Logout</a>
      </div>
    </div>
  );
};

export default NavbarA;
