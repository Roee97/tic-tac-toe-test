import React, {useState, useEffect } from "react";
import { Stage, Layer, Text } from "react-konva";
import "./App.css";
import Konva from "konva";
import Board from "./Board";
import {changeCursor, checkGameOver, checkWin, createCleanBoard} from "./gameEngine";
import {KonvaEventObject} from "konva/lib/Node";
import {boardConfig} from "./gameConfig";

// import Line = Konva.Line;
const App: React.FC = () => {
  const [stageSize, setStageSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const resizeScreen = () => {
    const handleResize = () => {
      setStageSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  };
  useEffect(resizeScreen, []);

  const [gameCounter, setGameCounter] = useState(0);
  const [mat, setMat] = useState(createCleanBoard(3,3));
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [tie, setTie] = useState(false);
  const [winner, setWinner] = useState<string>("");


  const handleTurn = (i: number, j: number) => {
    mat[i][j] = currentPlayer;
    setMat(mat);
    setGameCounter(gameCounter + 1);
    if (checkWin(mat)) {
      setWinner(currentPlayer);
    } else if (checkGameOver(gameCounter)) {
        setTie(true);
    } else {
      setCurrentPlayer(currentPlayer === boardConfig.player1 ? boardConfig.player2 : boardConfig.player1);
    }
  }

  const restartGame = () => {
    setCurrentPlayer("X");
    setWinner("");
    setGameCounter(0);
    setTie(false);
    setMat(createCleanBoard(3,3));
  }

  return (
    <div className="App">
      <Stage width={stageSize.width} height={stageSize.height}>
        <Layer>
          {/* Background */}
          {/* Instruction Text */}
          <Text
            x={0}
            y={100}
            width={stageSize.width}
            text="Lets play!"
            fontSize={boardConfig.headlineFontSize + 6}
            fill="black"
            align="center"
            fontFamily={boardConfig.fontFamily}
            verticalAlign="middle"
          />

          {/* Example X */}
          <Text
            x={stageSize.width * boardConfig.player1Bank.x}
            y={stageSize.height * boardConfig.player1Bank.y}
            text={boardConfig.player1}
            fontSize={boardConfig.headlineFontSize}
            fontFamily={boardConfig.fontFamily}
            fill="blue"
            align="center"
            verticalAlign="middle"
          />

          <Text
            x={stageSize.width * boardConfig.player2Bank.x}
            y={stageSize.height * boardConfig.player2Bank.y}
            text={boardConfig.player2}
            fontSize={boardConfig.headlineFontSize}
            fontFamily={boardConfig.fontFamily}
            fill="red"
            align="center"
            verticalAlign="middle"
          />
          <Text
            x={tie
                ? stageSize.width * 0.45
                : winner === ""
                ? stageSize.width * 0.38
                : stageSize.width * 0.42
            }
            y={stageSize.height * 0.7}
            text={tie
                ? "It's a tie"
                : winner === ""
                ? "current Turn: Player " + currentPlayer
                : "Player " + currentPlayer + " won!"
            }
            verticalAlign={"middle"}
            fontFamily={boardConfig.fontFamily}
            fontSize={boardConfig.secondaryHeadlineFontSize}
          />
          <Text
            x={stageSize.width * 0.42}
            y={stageSize.height * 0.8}
            text={"Restart Game"}
            verticalAlign={"middle"}
            fontFamily={boardConfig.fontFamily}
            fontSize={boardConfig.secondaryHeadlineFontSize}
            onClick={() => restartGame()}
            onMouseEnter={(e: KonvaEventObject<MouseEvent>) => changeCursor(e, "pointer")}
            onMouseLeave={(e: KonvaEventObject<MouseEvent>) => changeCursor(e, "default")}
          />
        </Layer>
          <Board
              handleTurn={tie || winner !== "" ? () => {} : handleTurn}
              width={stageSize.width}
              height={stageSize.height}
              board={mat}
              currentPlayer={winner === "" && !tie ? currentPlayer : undefined }
          />
      </Stage>
    </div>
  );
};

export default App;
