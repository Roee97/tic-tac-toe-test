type BoardLocation = {
  x: number;
  y: number;
};

type GameConfig = {
  // number of rows in board
  rows: number;
  // number of columns in board
  columns: number;
  // number of overall cells in board
  cells: number;
  // sequence length for winning the game
  sequence: number;
};

type BoardConfig = {
  // Board overall width percentage
  widthPart: number;
  // Board overall height percentage
  heightPart: number;
  // Board X axis starting point (by percentage from width)
  widthStartPart: number;

  // Board Y axis starting point (by percentage from height)
  heightStartPart: number;

  headlineFontSize: number;
  secondaryHeadlineFontSize: number;
  fontFamily: string;
  player1: string;
  player2: string;
  player1Bank: BoardLocation;
  player2Bank: BoardLocation;
  player1Score: BoardLocation;
  player2Score: BoardLocation;
};

// IMPORTANT: NON CHANGABLE for now - win function will not work
const gameConfig: GameConfig = {
  rows: 3,
  columns: 3,
  // rows * columns
  cells: 3 * 3,
  sequence: 3,
};

// values can be changed
const boardConfig: BoardConfig = {
  widthPart: 0.3,
  heightPart: 0.3,
  widthStartPart: 0.35,
  heightStartPart: 0.3,

  headlineFontSize: 40,
  secondaryHeadlineFontSize: 32,
  fontFamily: "Chalkduster, fantasy",
  player1: "X",
  player2: "O",
  // percentage of width & height, location of the bank
  player1Bank: {
    x: 0.25,
    y: 0.4,
  },
  // percentage of width & height, location of the bank
  player2Bank: {
    x: 0.75,
    y: 0.4,
  },
  player1Score: {
    x: 0.15,
    y: 0.62
  },
  player2Score: {
    x: 0.7,
    y: 0.62
  }
};

type Theme = {
  fontFamily: string;
  headlineFontSize: number;
  secondaryHeadlineFontSize: number;
  success: string;
  button: string;
  text: string;
  bankPlaceHolder: string;
  backgroundLight: string;
  backgroundDark: string;
};

const theme: Theme = {
  fontFamily: "Chalkduster, fantasy",
  headlineFontSize: 40,
  secondaryHeadlineFontSize: 32,
  success: "#3ed439",
  button: "#e89f31",
  text: "#dbd9d9",
  backgroundDark: "#212020",
  backgroundLight: "#536582",
  bankPlaceHolder: "#dcdee0"
};

export { gameConfig, boardConfig, theme };
