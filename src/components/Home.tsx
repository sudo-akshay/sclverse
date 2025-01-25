import React from "react";

interface Player {
  id: number;
  name: string;
  rating: number;
  position: string;
  boughtPrice?: number;
}

interface HomeProps {
  ownedPlayers: Player[];
  purse: number;
}

const Home: React.FC<HomeProps> = ({ ownedPlayers, purse }) => {
  return (
    <div className="home-tab">
      <h2>Your Players</h2>
      <div className="owned-players">
        {ownedPlayers.length ? (
          ownedPlayers.map((player) => (
            <div key={player.id} className="player-card">
              <h3>{player.name}</h3>
              <p>Position: {player.position}</p>
              <p>Rating: {player.rating}</p>
              <p>Bought Price: ${player.boughtPrice}</p>
            </div>
          ))
        ) : (
          <p>You don't own any players yet.</p>
        )}
      </div>
      <h3>Available Purse: ${purse}</h3>
    </div>
  );
};

export default Home;
