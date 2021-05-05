import React, { useState, useEffect } from "react";
import MemoryCard from "./components/MemoryCard";

function App() {
  const [allTeamsLogos, setAllTeamsLogos] = useState([]);
  const [presentedLogos, setPresentedLogos] = useState([]);
  const [isLogosLoaded, setIsLogosLoaded] = useState(false);
  const [pickedLogos, setPickedLogos] = useState([]);
  const [numberOfLogosPresented, setNumberOfLogosPresented] = useState(0);
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
        setNewPresentedLogosArr();
      });
  }, []);
  const shuffle = (array) => {
    const newArr = [...array];
    newArr.sort(() => Math.random() - 0.5);
    return newArr;
  };
  useEffect(() => {
    //This is shuffling current round logos every time on a click of an image
    if (presentedLogos.length >= 4) {
      const newpresentedLogos = shuffle(presentedLogos);
      setPresentedLogos(newpresentedLogos);
    }
  }, [pickedLogos.length]);
  const setNewPresentedLogosArr = () => {
    if (numberOfLogosPresented > 0) {
      const allTeamsLogosShuffled = shuffle(allTeamsLogos);
      const newPresentedLogosArr = allTeamsLogosShuffled.slice(
        0,
        numberOfLogosPresented
      );
      setPresentedLogos(newPresentedLogosArr);
    }
  };
  useEffect(() => {
    //This is creating next level of logos after selecting all logos correctly
    setNewPresentedLogosArr();
  }, [numberOfLogosPresented]);

  const handlePickedLogos = (event) => {
    const { dataset } = event.target;
    const logoId = dataset.id;
    const newPickedLogo = presentedLogos.find((elem) => {
      return logoId === elem.teamId;
    });
    setPickedLogos((prevState) => {
      return [...prevState, newPickedLogo];
    });
  };

  useEffect(() => {
    if (pickedLogos.length === numberOfLogosPresented) {
      setNumberOfLogosPresented((prevState) => {
        const nextLevelStep = 2; //2 is arbitrary number for an increased number of next level
        const numberOfNextLevelLogos = prevState + nextLevelStep;
        return numberOfNextLevelLogos;
      });
      setPickedLogos([]);
    }
  }, [pickedLogos.length]);

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
    memoryCardArray = presentedLogos.map((elem, index) => {
      return (
        <MemoryCard
          key={index}
          teamLogo={elem.teamLogo}
          teamId={elem.teamId}
          teamName={elem.teamName}
        />
      );
    });
    return memoryCardArray;
  };

  return (
    <div className="App">
      {isLogosLoaded ? createMemoryCardArray() : createPlaceholderLogos()}
    </div>
  );
}

export default App;
