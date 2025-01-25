import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import './UserDashboard.css'; // Include your final CSS here
import apiClient from '../services/apiClient';

// Define the structure of a player
interface Player {
  id: number;
  name: string;
  rating: string;
  position: string;
  positionCategory: string;
  age: string;
  nation: string;
  club: string;
  soldFor: number;
  imageUrl: string;
  basePrice: number;
}

const UserDashboard: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [availablePurse, setAvailablePurse] = useState<number>(0); // To store the remaining purse

  // Retrieve the userId from localStorage
  const userId = localStorage.getItem('userId');
  const name = localStorage.getItem('name');


  // Retrieve the available purse from localStorage
  useEffect(() => {
    const purse = localStorage.getItem('availablePurse');
    if (purse) {
      setAvailablePurse(Number(purse)); // Set the available purse from localStorage
    }
  }, []); // Runs only once when the component mounts

  useEffect(() => {
    const fetchPlayers = async () => {
      if (!userId) {
        console.error('User is not logged in');
        return;
      }
      try {
        // Fetching players specific to the logged-in user
        const response = await apiClient.post(`/players/sold?userId=${userId}`);

        // Check if response data is an array
        const data = Array.isArray(response.data) ? response.data : [];
        setPlayers(data); // Update state only if it's a valid array
        setLoading(false);
      } catch (error) {
        console.error('Error fetching players:', error);
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [userId]); // Re-run the effect if userId changes

  // Group players by position category
  const groupPlayersByPosition = (players: Player[]) => {
    return players.reduce((acc, player) => {
      const category = player.positionCategory; // Use the exact category from API
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(player);
      return acc;
    }, {} as Record<string, Player[]>); // Group by exact API position category
  };

  const groupedPlayers = groupPlayersByPosition(players);

  const location = useLocation(); // Hook to get the current location/path

  // Determine if the current path is one of the dashboard paths
  const isDashboardPage = location.pathname.startsWith('/user-dashboard') && !['/user-dashboard/players', '/user-dashboard/wishlist', '/user-dashboard/hatewatch'].includes(location.pathname);

  return (
    <div className="user-dashboard">
      {/* Navbar */}
      <nav className="navbar">
        <p>{name}</p>
        <Link to="/user-dashboard">Home</Link>
        <Link to="/user-dashboard/players">Players</Link>
        <Link to="/user-dashboard/wishlist">Wishlist</Link>
        <Link to="/user-dashboard/hatewatch">Hatewatch</Link>
        <p>${availablePurse}</p>
      </nav>

      {/* Left Panel: Remaining Purse and User ID */}
      {/* <div className="left-panel">
        <h3>Remaining Purse</h3>
        <p>${availablePurse}</p>
        <h3>User ID</h3>
        <p>{userId}</p>
      </div> */}

      {/* Only show player content if it's the home/dashboard page */}
      {isDashboardPage && (
        <>
          <h2>Players You Have Bought</h2>
          <div className="user-dashboard-content">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                {/* FORWARD */}
                <div className="player-category-row">
                  <h3>Forwards</h3>
                  <div className="player-cards-container">
                    {groupedPlayers['FORWARD']?.length > 0 ? (
                      groupedPlayers['FORWARD'].map((player) => (
                        <div key={player.id} className="player-card">
                          <img src={player.imageUrl} alt={player.name} className="player-image" />
                          <div className="player-info">
                            <h4>{player.name}</h4>
                            <p>Rating: {player.rating}</p>
                            <p>Position: {player.position}</p>
                            <p>Age: {player.age}</p>
                            <p>Club: {player.club}</p>
                            <p>Sold For: ${player.soldFor}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No players in this category</p>
                    )}
                  </div>
                </div>

                {/* MIDFIELDER */}
                <div className="player-category-row">
                  <h3>Midfielders</h3>
                  <div className="player-cards-container">
                    {groupedPlayers['MIDFIELDER']?.length > 0 ? (
                      groupedPlayers['MIDFIELDER'].map((player) => (
                        <div key={player.id} className="player-card">
                          <img src={player.imageUrl} alt={player.name} className="player-image" />
                          <div className="player-info">
                            <h4>{player.name}</h4>
                            <p>Rating: {player.rating}</p>
                            <p>Position: {player.position}</p>
                            <p>Age: {player.age}</p>
                            <p>Club: {player.club}</p>
                            <p>Sold For: ${player.soldFor}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No players in this category</p>
                    )}
                  </div>
                </div>

                {/* DEFENDER */}
                <div className="player-category-row">
                  <h3>Defenders</h3>
                  <div className="player-cards-container">
                    {groupedPlayers['DEFENDER']?.length > 0 ? (
                      groupedPlayers['DEFENDER'].map((player) => (
                        <div key={player.id} className="player-card">
                          <img src={player.imageUrl} alt={player.name} className="player-image" />
                          <div className="player-info">
                            <h4>{player.name}</h4>
                            <p>Rating: {player.rating}</p>
                            <p>Position: {player.position}</p>
                            <p>Age: {player.age}</p>
                            <p>Club: {player.club}</p>
                            <p>Sold For: ${player.soldFor}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No players in this category</p>
                    )}
                  </div>
                </div>

                {/* GOALKEEPER */}
                <div className="player-category-row">
                  <h3>Goalkeepers</h3>
                  <div className="player-cards-container">
                    {groupedPlayers['GOALKEEPER']?.length > 0 ? (
                      groupedPlayers['GOALKEEPER'].map((player) => (
                        <div key={player.id} className="player-card">
                          <img src={player.imageUrl} alt={player.name} className="player-image" />
                          <div className="player-info">
                            <h4>{player.name}</h4>
                            <p>Rating: {player.rating}</p>
                            <p>Position: {player.position}</p>
                            <p>Age: {player.age}</p>
                            <p>Club: {player.club}</p>
                            <p>Sold For: ${player.soldFor}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No players in this category</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* Render nested routes (e.g., Wishlist, Hatewatch, etc.) */}
      <Outlet />
    </div>
  );
};

export default UserDashboard;
