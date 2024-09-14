type BankBoardLocation = {
    x: number
    y: number
}

type GameConfig = {
    // number of rows in board
    rows: number
    // number of columns in board
    columns: number
    // number of overall cells in board
    cells: number
    // sequence length for winning the game
    sequence: number
}

type BoardConfig = {
    // Board overall width percentage
    widthPart: number,
    // Board overall height percentage
    heightPart: number,
    // Board X axis starting point (by percentage from width)
    widthStartPart: number

    // Board Y axis starting point (by percentage from height)
    heightStartPart: number

    headlineFontSize: number
    secondaryHeadlineFontSize: number
    fontFamily: string
    player1: string
    player2: string
    player1Bank: BankBoardLocation
    player2Bank: BankBoardLocation
}

const gameConfig: GameConfig = {
    rows: 3,
    columns: 3,
    // rows * columns
    cells: 3 * 3,
    sequence: 3,
}

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
    player1Bank: {
        x: 0.25,
        y: 0.4
    },
    player2Bank: {
        x: 0.75,
        y: 0.4
    }
}

export {
    gameConfig,
    boardConfig
}