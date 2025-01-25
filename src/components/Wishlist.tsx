import React, { useState, useEffect } from "react";
import apiClient from "../services/apiClient";
import "./Wishlist.css";

interface Player {
  id: number;
  name: string;
  rating: string;
  position: string;
  positionCategory: string;
  imageUrl: string;
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defense: number;
  physical: number;
}

interface WishlistItem {
  id: number;
  player: Player;
  priority: number;
  notes: string;
}

const Wishlist: React.FC = () => {
  const userId = localStorage.getItem("userId"); // Get the user ID from local storage
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<WishlistItem[]>([]);
  const [positionFilter, setPositionFilter] = useState<string>(""); // Store the selected position filter
  const [sortOrder, setSortOrder] = useState<string>("desc"); // Sort order for rating
  const [sortAttribute, setSortAttribute] = useState<keyof Player>("rating"); // Sorting attribute using keyof Player

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await apiClient.post(`/wishlist/user/${userId}`);
        if (response.data) {
          const data = response.data.items;
          setWishlistItems(data);
          setFilteredItems(data);
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    fetchWishlist();
  }, [userId]);

  const handlePositionFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPosition = e.target.value;
    setPositionFilter(selectedPosition);

    if (selectedPosition) {
      setFilteredItems(
        wishlistItems.filter((item) => item.player.position === selectedPosition)
      );
    } else {
      setFilteredItems(wishlistItems); // Reset the filter if 'All' is selected
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortAttribute(e.target.value as keyof Player); // Cast the value to keyof Player
    sortItems(e.target.value as keyof Player); // Sort by the selected attribute
  };

  const handleSortByOrder = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
    sortItems(sortAttribute, newSortOrder);
  };

  const sortItems = (attribute: keyof Player, order: string = sortOrder) => {
    const sortedItems = [...filteredItems].sort((a, b) => {
      const aValue = a.player[attribute];
      const bValue = b.player[attribute];

      if (order === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredItems(sortedItems);
  };

  const handleDelete = async (id: number, playerId: number) => {
    // Make the API call to delete the player
    try {
      const response = await apiClient.delete(`wishlist/${userId}/remove?playerId=${playerId}`);
      if (response.status === 200) {
        // On successful delete, remove the item from the state
        setWishlistItems(wishlistItems.filter(item => item.id !== id));
        setFilteredItems(filteredItems.filter(item => item.id !== id));
      } else {
        console.error("Failed to delete the player");
      }
    } catch (error) {
      console.error("Error deleting player:", error);
    }
  };

  const handleUpdate = (id: number) => {
    alert(`Update functionality for player ID: ${id}`);
  };

  return (
    <div className="wishlist-container">
      <h2>Wishlist</h2>
      <div className="filter-container">
        <label htmlFor="positionFilter">Filter by Position: </label>
        <select
          id="positionFilter"
          value={positionFilter}
          onChange={handlePositionFilterChange}
        >
          <option value="">All</option>
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

        <label htmlFor="sortAttribute">Sort by: </label>
        <select
          id="sortAttribute"
          value={sortAttribute}
          onChange={handleSortChange}
        >
          <option value="rating">Rating</option>
          <option value="pace">Pace</option>
          <option value="shooting">Shooting</option>
          <option value="defense">Defense</option>
          <option value="physical">Physical</option>
        </select>

        <button onClick={handleSortByOrder} className="sort-button">
          Sort {sortOrder === "asc" ? "▲" : "▼"}
        </button>
      </div>

      <table className="wishlist-table">
        <thead>
          <tr>
            <th>Player</th>
            <th>Name</th>
            <th>Position</th>
            <th>Rating</th>
            <th>Pace</th>
            <th>Shooting</th>
            <th>Passing</th>
            <th>Dribbling</th>
            <th>Defense</th>
            <th>Physical</th>
            <th>Priority</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item) => (
            <tr key={item.id}>
              <td>
                <img src={item.player.imageUrl} alt={item.player.name} className="player-image" />
              </td>
              <td>{item.player.name}</td>
              <td>{item.player.position}</td>
              <td>{item.player.rating}</td>
              <td>{item.player.pace}</td>
              <td>{item.player.shooting}</td>
              <td>{item.player.passing}</td>
              <td>{item.player.dribbling}</td>
              <td>{item.player.defense}</td>
              <td>{item.player.physical}</td>
              <td>{item.priority}</td>
              <td>{item.notes}</td>
              <td>
                <button onClick={() => handleUpdate(item.id)} className="action-button">Update</button>
                <button onClick={() => handleDelete(item.id, item.player.id)} className="action-button">Delete</button>
                </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Wishlist;
