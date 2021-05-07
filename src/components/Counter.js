import React from "react";

function Counter(props) {
  const maxScore = props.maxScore;
  const playerScore = props.playerScore;
  return (
    <header className="header">
      <div className="counter-element">
        <p id="player-score">Player Score: {playerScore}</p>
      </div>
      <div className="counter-element">
        <p id="max-score">Maximum Score: {maxScore}</p>
      </div>
    </header>
  );
}

export default Counter;
