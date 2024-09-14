import {CellInfo} from "../gameEngine";

export type BoardLayerProps = {
  width: number;
  height: number;
  board: CellInfo[][];
  handleTurn: (i: number, j: number) => void;
  currentPlayer: string | undefined;
};

export type PlayerBankLocation = {
  x: number;
  y: number;
};

export type CreatePlayerBankProps = {
  playerBankBase: PlayerBankLocation;
  board: CellInfo[][];
  handleTurn: (i: number, j: number) => void;
  playerBankCurrent: PlayerBankLocation;
  setPlayerBank: (bank: PlayerBankLocation) => void;
  playerBank: string;
  currentPlayer: string | undefined;
};

export type PlayerBankProps = {
  playerBankBase: PlayerBankLocation;
  board: CellInfo[][];
  handleTurn: (i: number, j: number) => void;
  playerBankCurrent: PlayerBankLocation;
  setPlayerBank: (bank: PlayerBankLocation) => void;
  playerBank: string;
  draggable: boolean;
  bankKey: string;
};

export type LineProps = {
  i: number;
};

export type CreateBoardCellsProps = {
  board: CellInfo[][];
  handleTurn: (i: number, j: number) => void;
};

export type BoardCellProps = CreateBoardCellsProps & {
  i: number;
};

export type BoardInfo = {
  cellWidth: number;
  cellHeight: number;
  xStart: number;
  xEnd: number;
  yStart: number;
  yEnd: number;
};