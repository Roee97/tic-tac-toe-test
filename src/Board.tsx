import React, {createContext, JSX, useContext, useEffect, useState} from "react";
import { Layer, Rect, Text, Line } from "react-konva";
import Konva from "konva";
import KonvaEventObject = Konva.KonvaEventObject;
import {changeCursor, createRangeArray} from "./gameEngine";
import {boardConfig, gameConfig} from "./gameConfig";

type BoardLayerProps = {
    width: number
    height: number
    board: string[][]
    handleTurn: (i: number, j: number) => void,
    currentPlayer: string | undefined
}

type PlayerBankLocation = {
    x: number
    y: number
}

type CreatePlayerBankProps = {
    playerBankBase: PlayerBankLocation
    board: string[][]
    handleTurn: (i: number, j: number) => void
    playerBankCurrent: PlayerBankLocation
    setPlayerBank: (bank: PlayerBankLocation) => void
    playerBank: string
    currentPlayer: string | undefined
}

type PlayerBankProps = {
    playerBankBase: PlayerBankLocation
    board: string[][]
    handleTurn: (i: number, j: number) => void
    playerBankCurrent: PlayerBankLocation
    setPlayerBank: (bank: PlayerBankLocation) => void
    playerBank: string
    draggable: boolean
    key: string
}

type MyProps = {
    i: number
}

type CreateBoardCellsProps = {
    board: string[][]
    handleTurn: (i: number, j: number) => void
}

type BoardCellProps = CreateBoardCellsProps & {
    i: number
}

type BoardInfo = {
    cellWidth: number
    cellHeight: number
    xStart: number
    xEnd: number
    yStart: number
    yEnd: number
}

const BoardInfoContext = createContext<BoardInfo>({
    cellWidth: 134,
    cellHeight: 0,
    xStart: 134,
    xEnd: 0,
    yStart: 0,
    yEnd: 0
});

const RowLine = (props: MyProps): JSX.Element => {
    const context = useContext(BoardInfoContext);
            const y = context.yStart + context.cellHeight * (props.i + 1);
        const startPoint = {
            x: context.xStart,
            y: y
        };
        const endPoint = {
            x: context.xEnd,
            y: y
        };
        return <Line
        x={0}
        y={0}
        points={[startPoint.x, startPoint.y, endPoint.x, endPoint.y]}
        tension={0.5}
        closed
        stroke="black"
        key={"row_" + props.i}
    />
}

const drawRowLines  = (): JSX.Element[] => {
    return createRangeArray(gameConfig.rows - 1).map(i =>
        <RowLine i={i} key={"row_base_" + i}/>
    )
};

const ColumnLine = (props: MyProps): JSX.Element => {
    const context = useContext<BoardInfo>(BoardInfoContext);
    // calculates vertical lines X axis using i & cell width
                    const x = context.xStart + context.cellWidth * (props.i + 1);
                    const startPoint = {
                        x: x,
                        y: context.yStart
                    };
                    const endPoint = {
                        x: x,
                        y: context.yEnd
                    };
    return <Line
                        x={0}
                        y={0}
                        points={[startPoint.x, startPoint.y, endPoint.x, endPoint.y]}
                        tension={0.5}
                        closed
                        stroke="black"
                        key={"column_" + props.i}
                    />
}

const drawColumnLines = (): JSX.Element[] => {
    return createRangeArray(gameConfig.columns - 1).map(i => {
        return <ColumnLine i={i} key={"column_base_" + i}/>
            })
};

const BoardCell = (props: BoardCellProps) => {
    const context = useContext(BoardInfoContext);
    // convert i to place on board - iIndex & jIndex
    const iIndex = Math.floor(props.i / gameConfig.rows);
    const jIndex = props.i % gameConfig.columns;

    const cellContent = props.board[iIndex][jIndex];

    // calculates the coordinates to place cell
    const x = context.xStart + (iIndex) * context.cellWidth;
    const y = context.yStart + (jIndex) * context.cellHeight;
    if (cellContent === undefined) {
            return <Rect
                    x={x}
                    y={y}
                    width={context.cellWidth}
                    height={context.cellHeight}
                    onClick={() => props.handleTurn(iIndex, jIndex)}
                    onMouseEnter={(e: KonvaEventObject<MouseEvent>) => changeCursor(e, "pointer")}
                    onMouseLeave={(e: KonvaEventObject<MouseEvent>) => changeCursor(e, "default")}
                    key={"cell_" + iIndex + "_" + jIndex}
                    />
        } else {
            return <Text
                        x={x + context.cellWidth / 2.5}
                        y={y + context.cellHeight / 2.5}
                        text={cellContent ? cellContent : ""}
                        fontSize={boardConfig.headlineFontSize}
                        fontFamily={boardConfig.fontFamily}
                        verticalAlign="middle"
                        key={"filled_cell_" + iIndex + "_" + jIndex}
                    />
        }

}

const createBoardCells = (props: CreateBoardCellsProps) : JSX.Element[] => {
    return createRangeArray(gameConfig.cells).map((i: number) =>
        <BoardCell board={props.board} i={i} handleTurn={props.handleTurn} />
    );
}

const PlayerBank = (props: PlayerBankProps) => {
    const context = useContext<BoardInfo>(BoardInfoContext);
    return <Text
    x={props.playerBankCurrent.x}
    y={props.playerBankCurrent.y}
    onDragMove={(e: KonvaEventObject<MouseEvent>) => {
        props.setPlayerBank({x: e.target.x(), y:e.target.y()});
    }}
    onDragEnd={(e) => {
        // if drag ended within the board
        if (e.target.x() >= context.xStart &&
            e.target.x() <= context.xEnd &&
            e.target.y() >= context.yStart &&
            e.target.y() <= context.yEnd) {
                let stage = e.target.getStage();
                if (!stage) {
                    return;
                }

            // calculates i & j indexes on board by coordinates
            const iIndex = Math.floor((e.target.x() - context.xStart) / context.cellWidth);
            const jIndex = Math.floor((e.target.y() - context.yStart) / context.cellHeight);

            // if cell is empty, plays
            if (props.board[iIndex][jIndex] === undefined) {
                props.handleTurn(iIndex, jIndex);
            }

            // in case dragged into board, resets it's location
            props.setPlayerBank({
            x: props.playerBankBase.x,
            y: props.playerBankBase.y
            });
    }}}
    draggable={props.draggable}
    text={props.playerBank}
    stroke={props.draggable ? "black" : "#d2d9d4"}
    strokeWidth={0.5}
    fontFamily={boardConfig.fontFamily}
    fontSize={boardConfig.headlineFontSize}
    key={props.key}
            />
}

const createPlayerBank = (props: CreatePlayerBankProps): JSX.Element => {
    return <PlayerBank
        playerBankBase={props.playerBankBase}
        board={props.board}
        handleTurn={props.handleTurn}
        playerBankCurrent={props.playerBankCurrent}
        setPlayerBank={props.setPlayerBank}
        playerBank={props.playerBank}
        key={"bank_" + props.playerBank}
        draggable={props.currentPlayer === props.playerBank}
    />
}

const Board = (props: BoardLayerProps) => {
    const dummyBoardInfo = {
        cellWidth: 0,
        cellHeight: 0,
        xStart: 0,
        xEnd: 0,
        yStart: 0,
        yEnd: 0
    };
    const [boardInfo, setBoardInfo] = useState<BoardInfo>(dummyBoardInfo);

    useEffect(() => {
        // calculates a single cell width - board width * percentage / number of cells in column
        const cellWidth = props.width * boardConfig.widthPart /  gameConfig.columns;

        // calculates board X axis starting & ending coordinates
        const boardXStart = props.width * boardConfig.widthStartPart;
        const boardXEnd = boardXStart + props.width * boardConfig.widthPart;

        // calculates a single cell height
        const cellHeight = props.height * boardConfig.heightPart / gameConfig.rows;

        // calculates board Y axis starting & ending coordinates
        const boardYStart = props.height * boardConfig.heightStartPart;
        const boardYEnd = boardYStart + props.height * boardConfig.heightPart;
        setBoardInfo({
            cellWidth: cellWidth,
            cellHeight: cellHeight,
            xStart: boardXStart,
            xEnd: boardXEnd,
            yStart: boardYStart,
            yEnd: boardYEnd
        });
    }, [props.width, props.height]);


    const player1BankBase: PlayerBankLocation = {
        x: props.width * boardConfig.player1Bank.x,
        y: props.height * boardConfig.player1Bank.y
    }
    const [player1Bank, setPlayer1Bank] = useState(player1BankBase);

    const player2BankBase: PlayerBankLocation = {
        x: props.width * boardConfig.player2Bank.x,
        y: props.height * boardConfig.player2Bank.y
    }
    const [player2Bank, setPlayer2Bank] = useState(player2BankBase);
    return (
        <Layer>
        <BoardInfoContext.Provider value={boardInfo}>
            {/* draw vertical & horizontal board lines*/}
            {drawColumnLines()}
            {drawRowLines()}

            {/* create board game cells */}
            {createBoardCells({
                board: props.board,
                handleTurn: props.handleTurn
            })}

            {/* create drag & drop banks */}
            {createPlayerBank({
                playerBankBase: player1BankBase,
                board: props.board,
                handleTurn: props.handleTurn,
                playerBankCurrent: player1Bank,
                setPlayerBank: setPlayer1Bank,
                playerBank: boardConfig.player1,
                currentPlayer: props.currentPlayer
            })}
            {createPlayerBank({
                playerBankBase: player2BankBase,
                board: props.board,
                handleTurn: props.handleTurn,
                playerBankCurrent: player2Bank,
                setPlayerBank: setPlayer2Bank,
                playerBank: boardConfig.player2,
                currentPlayer: props.currentPlayer
            })}
            </BoardInfoContext.Provider>
        </Layer>
    )
}

export default Board;