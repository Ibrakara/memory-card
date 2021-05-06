import React from "react";

function Counter(props) {
  const maxScore = props.maxScore;
  const playerScore = props.playerScore;
  return (
    <div>
      <p>Player Score: {playerScore}</p>
      <p>Maximum Score: {maxScore}</p>
    </div>
  );
}

export default Counter;
