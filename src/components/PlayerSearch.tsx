import React, { useState, useEffect } from "react";
import "./PlayerSearch.css";
import apiClient from "../services/apiClient";

interface Player {
  id: number;
  name: string;
  rating: string;
  position: string;
  positionCategory:string;
  defense: string;
  pace: string;
  physical: string;
  shooting: string;
  passing: string;
  dribbling: string;
  age: string;
  nation: string;
  club: string;
  basePrice: number;
  imageUrl: string;
  status : string;
  wishlistedUsers: number[];
}

const PlayerSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [positionFilter, setPositionFilter] = useState<string>("All");

  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [priority, setPriority] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");

  const currentUserId = localStorage.getItem("userId");

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post("players");
      if (!response) {
        throw new Error("Failed to fetch players");
      }
      const data = Array.isArray(response.data) ? response.data : [];
      setPlayers(data);
      setFilteredPlayers(data);
      setLoading(false);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    filterAndSortPlayers(query, positionFilter);
  };

  const handlePositionFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPosition = e.target.value;
    setPositionFilter(selectedPosition);

    filterAndSortPlayers(searchQuery, selectedPosition);
  };

  const handleSort = (attribute: keyof Player) => {
    const sortedPlayers = [...filteredPlayers].sort((a, b) => {
      if (sortOrder === "asc") {
        return Number(a[attribute]) - Number(b[attribute]);
      } else {
        return Number(b[attribute]) - Number(a[attribute]);
      }
    });

    setFilteredPlayers(sortedPlayers);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const filterAndSortPlayers = (query: string, position: string) => {
    let filtered = players;

    if (position !== "All") {
      filtered = filtered.filter((player) => player.position === position);
    }

    if (query) {
      filtered = filtered.filter((player) =>
        player.name.toLowerCase().includes(query)
      );
    }

    setFilteredPlayers(filtered);
  };

  const handleAddToWishlist = (player: Player) => {
    setSelectedPlayer(player);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleSubmitWishlist = async () => {
    if (selectedPlayer) {
      const playerId = selectedPlayer.id;
      const userId = localStorage.getItem("userId");
      const notesParam = encodeURIComponent(notes);

      try {
        const response = await apiClient.post(
          `wishlist/user/${userId}/add?playerId=${playerId}&priority=${priority}&notes=${notesParam}`
        );

        if (response) {
          alert("Player added to wishlist successfully!");

          await fetchPlayers();

          setIsPopupOpen(false);
        } else {
          alert("Failed to add player to wishlist.");
        }
      } catch (error: any) {
        alert("An error occurred while adding the player to the wishlist.");
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="player-search-container">
      <h2>Search Players</h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search for a player..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-input"
      />

      {/* Position Filter Dropdown */}
      <select
        value={positionFilter}
        onChange={handlePositionFilterChange}
        className="position-filter"
      >
        {/* <option value="All">All Positions</option>
        <option value="FORWARD">Forward</option>
        <option value="MIDFIELDER">Midfielder</option>
        <option value="DEFENDER">Defender</option>
        <option value="GOALKEEPER">Goalkeeper</option> */}
        <option value="All">All</option>
          <option value="ST">ST</option>
          <option value="CF">CF</option>
          <option value="LM">LM</option>
          <option value="LW">LW</option>
          <option value="LB">LB</option>
          <option value="CAM">CAM</option>
          <option value="RM">RM</option>
          <option value="RW">RW</option>
          <option value="CM">CM</option>
          <option value="CDM">CDM</option>
          <option value="CB">CB</option>
          <option value="RB">RB</option>
          <option value="GK">GK</option>
      </select>

      {/* Sorting Buttons */}
      <div className="sort-buttons">
      <button onClick={() => handleSort("rating")} className="sort-button">
          Sort by Rating {sortOrder === "asc" ? "▲" : "▼"}
        </button>
        <button onClick={() => handleSort("pace")} className="sort-button">
          Sort by Pace {sortOrder === "asc" ? "▲" : "▼"}
        </button>
        <button onClick={() => handleSort("shooting")} className="sort-button">
          Sort by Shooting {sortOrder === "asc" ? "▲" : "▼"}
        </button>
        <button onClick={() => handleSort("passing")} className="sort-button">
          Sort by Passing {sortOrder === "asc" ? "▲" : "▼"}
        </button>
        <button onClick={() => handleSort("dribbling")} className="sort-button">
          Sort by Dribbling {sortOrder === "asc" ? "▲" : "▼"}
        </button>
        <button onClick={() => handleSort("defense")} className="sort-button">
          Sort by Defense {sortOrder === "asc" ? "▲" : "▼"}
        </button>
        <button onClick={() => handleSort("physical")} className="sort-button">
          Sort by Physical {sortOrder === "asc" ? "▲" : "▼"}
        </button>
      </div>

      {/* Player Table */}
      <table className="player-table">
        <thead>
          <tr>
            {/* <th>Player</th> */}
            <th>Name</th>
            <th>Rating</th>
            <th>Position</th>
            <th>Pace</th>
            <th>Shooting</th>
            <th>Passing</th>
            <th>Dribbling</th>
            <th>Defense</th>
            <th>Physical</th>
            <th>Age</th>
            <th>Club</th>
            <th>Base Price</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredPlayers.map((player) => (
            <tr key={player.id}>
              <td>{player.name}</td>
              <td>{player.rating}</td>
              <td>{player.position}</td>
              <td>{player.pace}</td>
              <td>{player.shooting}</td>
              <td>{player.passing}</td>
              <td>{player.dribbling}</td>
              <td>{player.defense}</td>
              <td>{player.physical}</td>
              <td>{player.age}</td>
              <td>{player.club}</td>
              <td>${player.basePrice}</td>
              <td>{player.status}</td>
              <td>
                <button
                  className="wishlist-button"
                  onClick={() => handleAddToWishlist(player)}
                  disabled={player.wishlistedUsers.includes(
                    Number(currentUserId)
                  )}
                  title={
                    player.wishlistedUsers.includes(Number(currentUserId))
                      ? "Player already in your wishlist"
                      : "Add to wishlist"
                  }
                >
                  {player.wishlistedUsers.includes(Number(currentUserId))
                    ? "Wishlisted"
                    : "Add to Wishlist"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Wishlist Popup */}
      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Add Player to Wishlist</h3>
            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
              >
                {[...Array(10).keys()].map((i) => (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter notes..."
              />
            </div>
            <div className="popup-buttons">
              <button onClick={handleClosePopup} className="cancel-button">
                Cancel
              </button>
              <button onClick={handleSubmitWishlist} className="add-button">
                Add Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerSearch;
