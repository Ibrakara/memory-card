import React from "react";

function MemoryCard(props) {
  const teamLogoImgSrc = props.teamLogo;
  const teamLogoImgID = props.teamId;
  const teamName = props.teamName;

  return (
    <div data-id={teamLogoImgID}>
      <img src={teamLogoImgSrc} alt="team logo" width="100" />
      <p>{teamName}</p>
    </div>
  );
}

export default MemoryCard;
