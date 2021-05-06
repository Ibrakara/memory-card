import React, { useState, useEffect } from "react";
import MemoryCard from "./components/MemoryCard";
import Counter from "./components/Counter";

function App() {
  const [allTeamsLogos, setAllTeamsLogos] = useState([]);
  const [shownLogos, setShownLogos] = useState([]);
  const [isLogosLoaded, setIsLogosLoaded] = useState(false);
  const [pickedLogos, setPickedLogos] = useState([]);
  const [numberOfLogosPresented, setNumberOfLogosPresented] = useState(0);
  const [isPlayerFailed, setIsPlayerFailed] = useState(false);
  const [maxScore, setMaxScore] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  useEffect(() => {
    fetch(
      "https://www.thesportsdb.com/api/v1/json/1/search_all_teams.php?l=UEFA_Champions_League"
    )
      .then((data) => {
        return data.json();
      })
      .then((response) => {
        const teamInfo = response.teams.map((team) => {
          return {
            teamId: team.idTeam,
            teamName: team.strTeam,
            teamLogo: team.strTeamBadge,
          };
        });
        return teamInfo;
      })
      .then((teamInfo) => {
        setAllTeamsLogos(teamInfo);
        setNumberOfLogosPresented(4);
        setIsLogosLoaded(true);
        setNewShownLogosArr();
      });
  }, []);
  const shuffle = (array) => {
    const newArr = [...array];
    newArr.sort(() => Math.random() - 0.5);
    return newArr;
  };
  useEffect(() => {
    //This is shuffling current round logos every time on a click of an image
    if (shownLogos.length >= 4) {
      const newshownLogos = shuffle(shownLogos);
      setShownLogos(newshownLogos);
    }
  }, [pickedLogos.length]);
  const setNewShownLogosArr = () => {
    if (numberOfLogosPresented > 0) {
      const allTeamsLogosShuffled = shuffle(allTeamsLogos);
      const newshownLogosArr = allTeamsLogosShuffled.slice(
        0,
        numberOfLogosPresented
      );
      setShownLogos(newshownLogosArr);
    }
  };
  useEffect(() => {
    //This is creating next level of logos after selecting all logos correctly
    setNewShownLogosArr();
    setPickedLogos([]);
  }, [numberOfLogosPresented]);

  useEffect(() => {
    if (pickedLogos.length === numberOfLogosPresented) {
      setNumberOfLogosPresented((prevState) => {
        const nextLevelStep = 2; //2 is arbitrary number for an increased number of next level
        const numberOfNextLevelLogos = prevState + nextLevelStep;
        return numberOfNextLevelLogos;
      });
      setPickedLogos([]);
    } else if (isPlayerFailed) {
      setNumberOfLogosPresented(4);
      setIsPlayerFailed(false);
    }
  }, [playerScore]);
  const handlePickedLogos = (event) => {
    const { dataset } = event.currentTarget;
    const logoId = dataset.id;
    const newPickedLogo = shownLogos.find((elem) => {
      return logoId === elem.teamId;
    });
    let isItClickedBefore = pickedLogos.includes(newPickedLogo);
    setIsPlayerFailed(isItClickedBefore);
    let newPickedLogoArr;
    if (isItClickedBefore) {
      newPickedLogoArr = [];
      if (playerScore > maxScore) {
        setMaxScore(playerScore);
      }
      setPlayerScore(0);
    } else {
      newPickedLogoArr = [...pickedLogos, newPickedLogo];
      setPlayerScore((prevState) => prevState + 1);
    }
    setPickedLogos(newPickedLogoArr);
  };

  const createPlaceholderLogos = () => {
    const placeHolderLogos = [];
    for (let i = 0; i < 4; i++) {
      placeHolderLogos.push(
        <img
          key={i}
          src="http://www.yeksun.com.tr/images/download.gif"
          width="100"
          height="100"
          frameBorder="0"
          alt="placeholder gif"
        />
      );
    }
    return placeHolderLogos;
  };
  let memoryCardArray = [];
  const createMemoryCardArray = () => {
    memoryCardArray = shownLogos.map((elem, index) => {
      return (
        <MemoryCard
          key={index}
          teamLogo={elem.teamLogo}
          teamId={elem.teamId}
          teamName={elem.teamName}
          handlePickedLogos={handlePickedLogos}
        />
      );
    });
    return memoryCardArray;
  };

  return (
    <div className="App">
      <header>
        <Counter playerScore={playerScore} maxScore={maxScore} />
      </header>
      {isLogosLoaded ? createMemoryCardArray() : createPlaceholderLogos()}
    </div>
  );
}

export default App;
