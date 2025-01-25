import React, { useState, useEffect } from 'react';
import apiClient from '../services/apiClient'; // Corrected the path for apiClient
import './AdminDashboard.css'; // Import the Admin Dashboard CSS
import NavbarA from './Navbar'; // Import Navbar

const AdminDashboard: React.FC = () => {
  const [selectedPosition, setSelectedPosition] = useState(''); // Track selected position
  const [players, setPlayers] = useState<any[]>([]); // Store players fetched from API
  const [loading, setLoading] = useState(false); // Track loading state
  const [auctionStatus, setAuctionStatus] = useState(false); // Track auction status
  const [selectedUser, setSelectedUser] = useState(''); // Track selected user for assignment
  const [finalPrice, setFinalPrice] = useState<number | string>(''); // Track final price input
  const [sold, setSold] = useState(false); // Track if player is sold
  const [hammerAnimation, setHammerAnimation] = useState(false); // Trigger hammer animation

  // Dummy user list
  const users = [
    { id: 1, name: 'Manu' },
    { id: 2, name: 'Barca' },
    { id: 3, name: 'User 3' },
  ];

  // Fetch players based on selected position
  const fetchPlayers = async () => {
    if (selectedPosition && selectedPosition !== 'Select Position') {
      try {
        setLoading(true);
        const response = await apiClient.post(
          `/admin/auction/player?category=${selectedPosition}`
        );
        setPlayers([response.data]); // Wrap in array to access player object
        setLoading(false);

        // Clear finalPrice and selectedUser after fetching the next player
        setFinalPrice('');
        setSelectedUser('');
        setSold(false); // Reset sold state
      } catch (error) {
        console.error('Error fetching players:', error);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, [selectedPosition]); // Trigger fetch when position changes

  // Handle changes in the player position dropdown
  const handlePositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPosition(e.target.value);
  };

  // Start the auction for the selected position
  const handleStartAuction = () => {
    setAuctionStatus(true);
    alert(`Auction started for ${selectedPosition}`);
  };

  // Handle user assignment
  const handleAssignToUser = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUser(event.target.value);
  };

  

  // Handle selling a player
  const handleSellPlayer = async () => {
    if (!finalPrice || !selectedUser) {
      alert('Please provide the final price and assign a user.');
      return;
    }

    try {
      const response = await apiClient.post(
        `/admin/sell-player?playerId=${currentPlayer.id}&userId=${selectedUser}&finalPrice=${finalPrice}`
      );

      if (response.status === 200) {
        setHammerAnimation(true); // Trigger hammer animation
        setSold(true); // Mark the player as sold
        setTimeout(() => {
          setHammerAnimation(false); // Reset animation after it finishes
          fetchPlayers(); // Fetch the next player after selling
        }, 1500); // Adjust time based on animation duration
        // alert('Player sold successfully!');
      }
    } catch (error) {
      console.error('Error selling player:', error);
      alert('There was an error selling the player.');
    }
  };

  // Mark the current player as unsold
  const handleMarkAsUnsold = async () => {
    try {
      const response = await apiClient.post(
        `/admin/auction/player/unsold?playerId=${currentPlayer.id}`
      );

      if (response.status === 200) {
        alert('Player marked as UNSOLD successfully.');
        fetchPlayers(); // Fetch next player
      }
    } catch (error) {
      console.error('Error marking player as unsold:', error);
      alert('There was an error marking the player as unsold.');
    }
  };

  // Set current player (if available)
  const currentPlayer = players.length ? players[0] : {};

  return (
    <div className="admin-dashboard">
      {/* Navbar at the top */}
      <NavbarA />

      {/* Sidebar */}
      <div className="sidebar">
        <h2>Sclverse Admin Panel</h2>
        <label htmlFor="player-position">Player Position:</label>
        <select
          id="player-position"
          value={selectedPosition}
          onChange={handlePositionChange}
        >
          <option value="Select Position">Select Position</option>
          <option value="FORWARD">Forwards</option>
          <option value="MIDFIELDER">Midfielders</option>
          <option value="DEFENDER">Defenders</option>
          <option value="GOALKEEPER">Goalkeepers</option>
        </select>
        <button
          className="start-button"
          onClick={handleStartAuction}
          disabled={selectedPosition === 'Select Position'}
        >
          {auctionStatus ? 'Auction Ongoing' : 'Start Auction'}
        </button>
      </div>

      {/* Player Card Container */}
      <div className="player-container">
        {selectedPosition === 'Select Position' ? (
          <div className="begin-auction-text">
            <p>Select a position to begin the auction.</p>
          </div>
        ) : loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : Object.keys(currentPlayer).length === 0 ? (
          <div className="no-player-text">No player available for this position.</div>
        ) : (
          <div
            className={`player-cardA ${sold ? 'sold' : ''}`}
            style={{ animation: hammerAnimation ? 'hammerAnimation 1.5s ease-out' : 'none' }}
          >
            <div className="player-image-container">
              <img
                src={currentPlayer.imageUrl || 'https://via.placeholder.com/300'}
                alt={currentPlayer.name}
                className="player-image"
              />
            </div>
            <div className="player-info">
              <h3>{currentPlayer.name}</h3>
              <p>
                <strong>{currentPlayer.rating} | {currentPlayer.position}</strong>
              </p>
              <div className="player-details">
                <p>
                  {currentPlayer.preferredFoot + ' footed'} | {currentPlayer.age} | {currentPlayer.nation}
                </p>
              </div>
            </div>
            <div className="attributes">
              <div className="attribute">
                <p><strong>Pace</strong></p>
                <p>{currentPlayer.pace}</p>
              </div>
              <div className="attribute">
                <p><strong>Shooting</strong></p>
                <p>{currentPlayer.shooting}</p>
              </div>
              <div className="attribute">
                <p><strong>Passing</strong></p>
                <p>{currentPlayer.passing}</p>
              </div>
              <div className="attribute">
                <p><strong>Dribbling</strong></p>
                <p>{currentPlayer.dribbling}</p>
              </div>
              <div className="attribute">
                <p><strong>Defense</strong></p>
                <p>{currentPlayer.defense}</p>
              </div>
              <div className="attribute">
                <p><strong>Physical</strong></p>
                <p>{currentPlayer.physical}</p>
              </div>
            </div>
            <div className="base-price">
              <p><strong>Base Price:</strong> ${currentPlayer.basePrice}</p>
            </div>
            <div className="actions">
              <div className="field-group">
                <label htmlFor="assign-user">Assign to User:</label>
                <select
                  id="assign-user"
                  value={selectedUser}
                  onChange={handleAssignToUser}
                >
                  <option value="">Select User</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>

                <label htmlFor="final-price">Final Price:</label>
                <input
                  id="final-price"
                  className="final-price-input"
                  type="text"
                  value={finalPrice}
                  onChange={(e) => setFinalPrice(e.target.value)}
                  placeholder="Enter Price"
                />
              </div>

              <button className="sell-button" onClick={handleSellPlayer}>
                Sell
              </button>
              <button className="unsold-button" onClick={handleMarkAsUnsold}>
                Mark as Unsold
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
