import React, { useState, useEffect } from "react";
import { Stage, Layer, Text, Rect } from "react-konva";
import "./App.css";
import Board from "./Board";
import {
  changeCursor,
  checkGameOver,
  checkWin,
  createCleanBoard,
} from "./gameEngine";
import { KonvaEventObject } from "konva/lib/Node";
import {boardConfig, gameConfig, theme} from "./gameConfig";

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
  const [mat, setMat] = useState(createCleanBoard());
  const [currentPlayer, setCurrentPlayer] = useState(boardConfig.player1);
  const [tie, setTie] = useState(false);
  const [winner, setWinner] = useState<string>("");
  const [player1Wins, setPlayer1Wins] = useState(0);
  const [player2Wins, setPlayer2Wins] = useState(0);

  const handleTurn = (i: number, j: number) => {
    mat[i][j] = { val: currentPlayer, partOfWin: false };
    const res = checkWin(mat);
    // win
    if (res.length > 0) {
      for (const coord of res) {
        mat[coord[0]][coord[1]].partOfWin = true;
      }
    }
    setMat([...mat]);
    setGameCounter(gameCounter + 1);
    if (res.length > 0) {
      setWinner(currentPlayer);
      if (currentPlayer === boardConfig.player1) {
        setPlayer1Wins(player1Wins + 1);
      } else {
        setPlayer2Wins(player2Wins + 1);
      }
    } else if (checkGameOver(gameCounter)) {
      setTie(true);
    } else {
      setCurrentPlayer(
        currentPlayer === boardConfig.player1
          ? boardConfig.player2
          : boardConfig.player1,
      );
    }
  };

  const restartGame = () => {
    setCurrentPlayer(boardConfig.player1);
    setWinner("");
    setGameCounter(0);
    setTie(false);
    setMat(createCleanBoard());
  };

  return (
    <div className="App">
      <Stage width={stageSize.width} height={stageSize.height}>
        <Layer>
          {/* Background */}
          <Rect
            x={0}
            y={0}
            width={stageSize.width}
            height={stageSize.height}
            fillLinearGradientStartPoint={{ x: 0, y: 0 }}
            fillLinearGradientEndPoint={{
              x: stageSize.width,
              y: stageSize.height,
            }}
            fillLinearGradientColorStops={[
              0,
              theme.backgroundDark,
              0.5,
              theme.backgroundLight,
              1,
              theme.backgroundDark,
            ]}
          />
          {/* Instruction Text */}
          <Text
            x={0}
            y={100}
            width={stageSize.width}
            text="Let's play!"
            fontSize={boardConfig.headlineFontSize + 6}
            fill={theme.text}
            align="center"
            fontFamily={boardConfig.fontFamily}
            verticalAlign="middle"
          />

          {/* player 1 bank to drag & drop */}
          <Text
            x={stageSize.width * boardConfig.player1Bank.x}
            y={stageSize.height * boardConfig.player1Bank.y}
            text={boardConfig.player1}
            fontSize={boardConfig.headlineFontSize}
            fontFamily={boardConfig.fontFamily}
            fill={theme.bankPlaceHolder}
            align="center"
            verticalAlign="middle"
          />

          {/* player 2 bank to drag & drop */}
          <Text
            x={stageSize.width * boardConfig.player2Bank.x}
            y={stageSize.height * boardConfig.player2Bank.y}
            text={boardConfig.player2}
            fontSize={boardConfig.headlineFontSize}
            fontFamily={boardConfig.fontFamily}
            fill={theme.bankPlaceHolder}
            align="center"
            verticalAlign="middle"
          />

          {/* Status text */}
          <Text
            x={
              tie
                ? stageSize.width * 0.45
                : winner === ""
                  ? stageSize.width * 0.38
                  : stageSize.width * 0.42
            }
            y={stageSize.height * 0.7}
            text={
              tie
                ? "It's a tie"
                : winner === ""
                  ? "current Turn: Player " + currentPlayer
                  : "Player " + currentPlayer + " won!"
            }
            verticalAlign={"middle"}
            fontFamily={boardConfig.fontFamily}
            fontSize={boardConfig.secondaryHeadlineFontSize}
            fill={theme.text}
          />

          {/* restart button */}
          <Text
            x={stageSize.width * 0.42}
            y={stageSize.height * 0.8}
            text={"Restart Game"}
            verticalAlign={"middle"}
            fontFamily={boardConfig.fontFamily}
            fontSize={boardConfig.secondaryHeadlineFontSize}
            onClick={() => restartGame()}
            onMouseEnter={(e: KonvaEventObject<MouseEvent>) => {
              changeCursor(e, "pointer");
              e.currentTarget.setAttr("fill", theme.button);
            }}
            onMouseLeave={(e: KonvaEventObject<MouseEvent>) => {
              changeCursor(e, "default");
              e.currentTarget.setAttr("fill", theme.text);
            }}
            fill={theme.text}
          />
          {/* player 1 overall wins */}
          <Text
            x={stageSize.width * 0.15}
            y={stageSize.height * 0.65}
            text={"Player 1 total wins: " + player1Wins}
            verticalAlign={"middle"}
            fontFamily={boardConfig.fontFamily}
            fontSize={24}
            fill={theme.text}
          />
          {/* player 2 overall wins */}
          <Text
            x={stageSize.width * 0.7}
            y={stageSize.height * 0.65}
            text={"Player 2 total wins: " + player2Wins}
            verticalAlign={"middle"}
            fontFamily={boardConfig.fontFamily}
            fontSize={24}
            fill={theme.text}
          />
        </Layer>
        {/* main game board */}
        <Board
          handleTurn={tie || winner !== "" ? () => {} : handleTurn}
          width={stageSize.width}
          height={stageSize.height}
          board={mat}
          currentPlayer={winner === "" && !tie ? currentPlayer : undefined}
        />
      </Stage>
    </div>
  );
};

export default App;
