import React, { useState, useRef, useCallback, useEffect } from "react";
import "./App.css";
import gamedata from "./gamedata";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import SoundOn from "./images/toggle-on.png";
import SoundOff from "./images/toggle-off.png";
import Click from "./sounds/click.mp3";
import NewCorrect from "./sounds/new-correct.mp3";
import NewWrong from "./sounds/new-wrong.mp3";
import GameWon from "./sounds/game-won.mp3";
import GameLost from "./sounds/game-lost.mp3";
import BackgroundBlue from "./images/background-blue.png";
import BackgroundPink from "./images/background-pink.png";
import HomeIcon from "./images/home-btn.png";
import PickCategory from "./images/pick-a-theme.png";
import Letterbox from "./images/letter-bg.png";
import LetterBoxGuessed from "./images/letter-bg2.png";
import BlankTile from "./images/letter-spacer1.png";
import Frame from "./images/frame.png";
import Noose from "./images/noose.png";
import HeadHappy from "./images/body01-head.png";
import Shirt from "./images/body01-shirt.png";
import Shorts from "./images/body01-shorts.png";
import LeftArm from "./images/body01-leftarm.png";
import HeadWorried from "./images/body01-head-worried.png";
import RightArm from "./images/body01-rightarm.png";
import LeftLeg from "./images/body01-leftleg.png";
import HeadDead from "./images/body01-head-dead.png";
import BackIcon from "./images/back-btn.png";
import SettingsIcon from "./images/settings-btn.png";
import StartIcon from "./images/play-btn.png";

const letterRows = ["ABCDEFG", "HIJKLMN", "OPQRSTU", "VWXYZ"];

const HangmanGame = () => {
  const [userInteracted, setUserInteracted] = useState(false);
  const [view, setView] = useState("start"); // "start" | "category" | "game" | "settings"
  const [backgroundImage, setBackgroundImage] = useState(BackgroundBlue);

  const [selectedCategory, setSelectedCategory] = useState(null);
  /*const [selectedWord, setSelectedWord] = useState("");*/

  const [showBackConfirm, setShowBackConfirm] = useState(false);
  const [useRandomCategory, setUseRandomCategory] = useState(false);
  const [showClue, setShowClue] = useState(false);

  const [showSoundOn, setShowSoundOn] = useState(true);
  const toggleImage = () => {
    setShowSoundOn((prev) => !prev);
  };

  const clickSound = useRef(new Audio(Click)).current;
  const correctSound = useRef(new Audio(NewCorrect)).current;
  const wrongSound = useRef(new Audio(NewWrong)).current;
  const gameWon = useRef(new Audio(GameWon)).current;
  const gameLost = useRef(new Audio(GameLost)).current;

  const playClickSound = () => {
    if (showSoundOn) {
      clickSound.currentTime = 0; // Reset if playing
      clickSound.play();
    }
  };
  const playcorrectSound = () => {
    if (showSoundOn) {
      correctSound.currentTime = 0; // Reset if playing
      correctSound.play();
    }
  };
  const playwrongSound = () => {
    if (showSoundOn) {
      wrongSound.currentTime = 0; // Reset if playing
      wrongSound.play();
    }
  };

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [mistakes, setMistakes] = useState(0);

  const [activeLevel, setActiveLevel] = useState(null);

  const isGameWon = useCallback(() => {
    const word = activeLevel?.ans?.toUpperCase() || "";
    return word
      .replace(/[^A-Z]/g, "") // Remove everything that's not A-Z
      .split("")
      .every((letter) => guessedLetters.includes(letter));
  }, [activeLevel, guessedLetters]);
  const isGameLost = useCallback(() => {
    return mistakes >= 9;
  }, [mistakes]);

  useEffect(() => {
    if (!userInteracted) return;

    const playgameWon = () => {
      if (showSoundOn) {
        gameWon.currentTime = 0; // Reset if playing
        gameWon.play();
      }
    };
    const playgameLost = () => {
      if (showSoundOn) {
        gameLost.currentTime = 0; // Reset if playing
        gameLost.play();
      }
    };

    if (isGameWon()) {
      playgameWon();
    } else if (isGameLost()) {
      playgameLost();
    }
  }, [
    gameLost,
    gameWon,
    guessedLetters,
    isGameLost,
    isGameWon,
    mistakes,
    activeLevel,
    showSoundOn,
    userInteracted,
  ]);

  const resetGame = (categoryIndex = 0) => {
    const levels = gamedata[categoryIndex].levels;
    const newWord = levels[Math.floor(Math.random() * levels.length)];
    setActiveLevel(newWord);
    setGuessedLetters([]);
    setMistakes(0);
  };

  const handleGuess = (letter) => {
    if (!userInteracted) setUserInteracted(true);
    const upperLetter = letter.toUpperCase();
    if (!guessedLetters.includes(upperLetter)) {
      setGuessedLetters([...guessedLetters, upperLetter]);

      const cleanWord = activeLevel?.ans?.toUpperCase().replace(/[^A-Z]/g, "");

      // Check if the guessed letter is not in the word (ignoring spaces)
      if (cleanWord && cleanWord.includes(upperLetter)) {
        playcorrectSound();
      } else {
        setMistakes((prev) => prev + 1);
        playwrongSound();
      }
    }
  };

  if (view === "start") {
    return (
      <div
        className="start-screen"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
        }}>
        <img
          src={require("./images/gamelogo.png")}
          alt="Game Logo"
          className="logo"
        />

        <Button
          variant="link"
          onClick={() => {
            playClickSound();
            setView("category");
          }}
          className="start-button-icon">
          <img src={StartIcon} alt="Start" className="start-icon-img" />
        </Button>

        <Button
          variant="link"
          onClick={() => {
            playClickSound();
            setView("settings");
          }}
          className="settings-button-icon">
          <img
            src={SettingsIcon}
            alt="Settings"
            className="settings-icon-img"
          />
        </Button>
      </div>
    );
  }
  if (view === "category") {
    const handleRandomCategory = () => {
      const randomIndex = Math.floor(Math.random() * gamedata.length);
      const category = gamedata[randomIndex];
      const levels = category.levels;
      const randomWord = levels[Math.floor(Math.random() * levels.length)];

      setSelectedCategory(category);
      setActiveLevel(randomWord);
      /*setSelectedWord(randomWord.ans.toUpperCase());*/
      setView("game");
      setUseRandomCategory(true);
      setGuessedLetters([]);
      setMistakes(0);
    };
    return (
      <div
        className="category-screen"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
        }}>
        <img
          src={PickCategory}
          alt="Pick a Category"
          className="pick-a-category-img"
        />
        <div className="category-list">
          <button
            className="catbutton-random-category"
            onClick={handleRandomCategory}>
            Mix all themes
          </button>
          {gamedata.map((category, index) => (
            <button
              key={index}
              className="category-button"
              onClick={() => {
                const levels = category.levels;
                const randomWord =
                  levels[Math.floor(Math.random() * levels.length)];
                setSelectedCategory(category);
                setActiveLevel(randomWord);
                setView("game");
                setGuessedLetters([]);
                setMistakes(0);
              }}>
              {category.title}
            </button>
          ))}
        </div>
        <Button
          variant="link"
          onClick={() => {
            playClickSound();
            setView("start");
          }}
          className="back-button-icon">
          <img src={BackIcon} alt="Back" className="back-icon-img" />
        </Button>
      </div>
    );
  }
  if (view === "settings") {
    return (
      <div
        className="settings-screen"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
        }}>
        <h2 className="settings-header">Settings</h2>
        <p className="sound-fx">Sound FX</p>
        <p className="bg-text">Background Color</p>

        <div className="settings-toggle-section">
          <img
            src={showSoundOn ? SoundOn : SoundOff}
            alt="Toggle Display"
            className="toggle-image"
            onClick={toggleImage}
            style={{ cursor: "pointer" }}
          />
        </div>

        <div className="bg-options">
          <button
            className="bg-thumb"
            style={{ backgroundImage: `url(${BackgroundBlue})` }}
            onClick={() => setBackgroundImage(BackgroundBlue)}
          />
          <button
            className="bg-thumb"
            style={{ backgroundImage: `url(${BackgroundPink})` }}
            onClick={() => setBackgroundImage(BackgroundPink)}
          />
        </div>

        <Button
          variant="link"
          onClick={() => {
            playClickSound();
            setView("start");
          }}
          className="home-button">
          <img src={HomeIcon} alt="Home" className="home-icon-img" />
        </Button>
      </div>
    );
  }

  if (view === "game") {
    const currentCategory = selectedCategory?.title || "Category";
    return (
      <div
        className="App"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
        }}>
        <div>
          {selectedCategory?.hideclue ? (
            <div className="clue-section">
              {!showClue ? (
                <button
                  className="clue-button"
                  onClick={() => {
                    setShowClue(true);
                    setMistakes((prev) => prev + 1); // Count as a mistake
                  }}>
                  Get clue
                </button>
              ) : (
                activeLevel?.clue && (
                  <p className="hidden-clue-text">{activeLevel.clue}</p>
                )
              )}
            </div>
          ) : (
            activeLevel?.clue && (
              <p className="clue-text">({activeLevel.clue})</p>
            )
          )}
        </div>

        <div className="category-text">
          <strong>Category:</strong> {currentCategory}
        </div>
        <Button
          variant="link"
          onClick={() => {
            playClickSound();
            setShowBackConfirm(true);
          }}
          className="back-button-icon">
          <img src={BackIcon} alt="Back" className="back-icon-img" />
        </Button>

        {showBackConfirm && (
          <div className="popup-overlay">
            <div className="popup-box">
              <h1>Exit game</h1>
              <p>Are you sure you want to exit the game?</p>
              <div className="popup-buttons">
                <Button
                  variant="success"
                  onClick={() => {
                    setView("start"); // Go back to the start screen
                    setUseRandomCategory(false); // reset random mode
                    setShowClue(false); // reset the clue button
                    setShowBackConfirm(false); // Close popup
                  }}>
                  Yes
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowBackConfirm(false)}>
                  No
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="word-container">
          {(activeLevel?.ans || "")
            .toUpperCase()
            .split(" ")
            .map((word, wordIndex) => (
              <div key={wordIndex} className="word-block">
                {word.split("").map((letter, letterIndex) => {
                  const isLetter = /^[A-Z]$/.test(letter); // Only A-Z are guessable
                  const isGuessed = guessedLetters.includes(letter);
                  const shouldReveal = !isLetter || isGuessed;

                  return (
                    <div key={letterIndex} className="letter-tile-wrapper">
                      <div className="letter-char">
                        {shouldReveal ? letter : ""}
                      </div>
                      <div
                        className="tile-box"
                        style={{
                          backgroundImage: `url(${BlankTile})`,
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            ))}
        </div>

        <div className="keyboard-container">
          {letterRows.map((row, rowIndex) => (
            <div key={rowIndex} className="keyboard-row">
              {row.split("").map((letter) => {
                const isGuessed = guessedLetters.includes(letter);
                return (
                  <div
                    key={letter}
                    className="letter-box"
                    onClick={() => !isGuessed && handleGuess(letter)}
                    style={{
                      backgroundImage: `url(${
                        isGuessed ? LetterBoxGuessed : Letterbox
                      })`,
                      pointerEvents: isGuessed ? "none" : "auto",
                      opacity: isGuessed ? 0.5 : 1,
                    }}>
                    <span className="letter-text">{letter}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/*Man Getting Hanged Piece at a Time*/}
        <div className={`hangman-container ${mistakes > 8 ? "lost" : ""}`}>
          {/* Original parts (hidden at game over) */}
          {mistakes > 0 && <img src={Frame} alt="Frame" className="frame" />}
          {mistakes > 1 && <img src={Noose} alt="Noose" className="noose" />}
          {mistakes > 2 && (
            <img src={HeadHappy} alt="HappyFace" className="part head-happy" />
          )}
          {mistakes > 3 && (
            <img src={Shirt} alt="Shirt" className="part shirt" />
          )}
          {mistakes > 4 && (
            <img src={Shorts} alt="Shorts" className="part shorts" />
          )}
          {mistakes > 5 && (
            <img src={LeftArm} alt="Left Arm" className="part left-arm" />
          )}
          {mistakes > 5 && (
            <img
              src={HeadWorried}
              alt="WorriedFace"
              className="part head-worried"
            />
          )}
          {mistakes > 6 && (
            <img src={RightArm} alt="Right Arm" className="part right-arm" />
          )}
          {mistakes > 7 && (
            <img src={LeftLeg} alt="Left Leg" className="part left-leg" />
          )}
          {mistakes > 8 && (
            <img src={HeadDead} alt="DeadFace" className="part head-dead" />
          )}

          {/* Falling duplicates only visible on loss */}
          {mistakes > 8 && (
            <>
              <img
                src={HeadDead}
                className="fall head-dead"
                alt="fall-head-dead"
              />
              <img src={Shirt} className="fall shirt" alt="fall-shirt" />
              <img src={Shorts} className="fall shorts" alt="fall-shorts" />
              <img
                src={LeftArm}
                className="fall left-arm"
                alt="fall-left-arm"
              />
              <img
                src={RightArm}
                className="fall right-arm"
                alt="fall-right-arm"
              />
            </>
          )}
        </div>

        {/* Game status */}
        {(isGameWon() || isGameLost()) && (
          <div className="game-over-overlay">
            <div className="game-over-content">
              <h2>{isGameWon() ? "🎉 Well done" : "💀 Failed"}</h2>
              {!isGameWon() && (
                <p>
                  Answer was...{" "}
                  <strong>{activeLevel?.ans?.toUpperCase()}</strong>
                </p>
              )}
              <Button
                onClick={() => {
                  if (useRandomCategory) {
                    const randomIndex = Math.floor(
                      Math.random() * gamedata.length
                    );
                    const randomCategory = gamedata[randomIndex];
                    setSelectedCategory(randomCategory);
                    setShowClue(false); // reset the clue button
                    resetGame(randomIndex);
                  } else {
                    setShowClue(false); // reset the clue button
                    resetGame(gamedata.indexOf(selectedCategory));
                  }
                }}
                variant="light">
                🔄 Play Again
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }
  return <div> Unknown view</div>;
};

export default HangmanGame;
