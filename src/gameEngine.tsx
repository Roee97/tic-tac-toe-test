import Konva from "konva";
import KonvaEventObject = Konva.KonvaEventObject;
import Stage = Konva.Stage;
import { gameConfig } from "./gameConfig";

type CursorType = "default" | "pointer";

// if game won, return coordinates of cells that are part of the win
// return empty array otherwise - IMPORTANT: currently check win only works on 3x3 board
const checkWin = (board: CellInfo[][]): number[][] => {
  // check rows
  for (var i = 0; i < 3; i++) {
    if (
      board[i][0].val !== undefined &&
      board[i][0].val === board[i][1].val &&
      board[i][1].val === board[i][2].val
    ) {
      return [
        [i, 0],
        [i, 1],
        [i, 2],
      ];
    }

    // check column
    if (
      board[0][i].val !== undefined &&
      board[0][i].val === board[1][i].val &&
      board[1][i].val === board[2][i].val
    ) {
      return [
        [0, i],
        [1, i],
        [2, i],
      ];
    }
  }

  // check main diagonal
  if (
    board[0][0].val !== undefined &&
    board[0][0].val === board[1][1].val &&
    board[1][1].val === board[2][2].val
  ) {
    return [
      [0, 0],
      [1, 1],
      [2, 2],
    ];
  }

  // check secondary diagonal
  if (
    board[0][2].val !== undefined &&
    board[0][2].val === board[1][1].val &&
    board[1][1].val === board[2][0].val
  ) {
    return [
      [0, 2],
      [1, 1],
      [2, 0],
    ];
  }
  return [];
};

const checkGameOver = (turnCounter: number): boolean => {
  return turnCounter === 8;
};

const changeCursor = (
  e: KonvaEventObject<MouseEvent>,
  cursorType: CursorType,
): void => {
  let stage: Stage | null;
  stage = e.target.getStage();
  if (stage !== null) {
    let container = stage.container();
    container.style.cursor = cursorType;
  }
};

export type CellInfo = {
  val: string | undefined;
  partOfWin: boolean;
};

const createCleanBoard = (): CellInfo[][] => {
  let arr = [];
  for (let i = 0; i < gameConfig.rows; i++) {
    arr.push(
      Array(gameConfig.columns).fill({ val: undefined, partOfWin: false }),
    );
  }

  return arr;
};

const createRangeArray = (range: number) => {
  return Array.from({ length: range }, (_, i) => i);
};

export {
  checkGameOver,
  checkWin,
  changeCursor,
  createCleanBoard,
  createRangeArray,
};
