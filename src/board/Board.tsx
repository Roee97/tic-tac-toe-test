import React, {
  createContext,
  JSX,
  useContext,
  useEffect,
  useState,
} from "react";
import { Layer, Rect, Text, Line } from "react-konva";
import Konva from "konva";
import KonvaEventObject = Konva.KonvaEventObject;
import { CellInfo, changeCursor, createRangeArray } from "../gameEngine";
import { boardConfig, gameConfig, theme } from "../gameConfig";
import Animation = Konva.Animation;
import {
  BoardCellProps,
  BoardInfo, BoardLayerProps,
  CreateBoardCellsProps,
  CreatePlayerBankProps,
  LineProps, PlayerBankLocation,
  PlayerBankProps
} from "./BoardTypes";

const BoardInfoContext = createContext<BoardInfo>({
  cellWidth: 0,
  cellHeight: 0,
  xStart: 0,
  xEnd: 0,
  yStart: 0,
  yEnd: 0,
});

const RowLine = (props: LineProps): JSX.Element => {
  const context = useContext(BoardInfoContext);
  const y = context.yStart + context.cellHeight * (props.i + 1);
  const startPoint = {
    x: context.xStart,
    y: y,
  };
  const endPoint = {
    x: context.xEnd,
    y: y,
  };
  return (
    <Line
      x={0}
      y={0}
      points={[startPoint.x, startPoint.y, endPoint.x, endPoint.y]}
      tension={0.5}
      closed
      stroke={theme.text}
      key={"row_" + props.i}
    />
  );
};

const drawRowLines = (): JSX.Element[] => {
  return createRangeArray(gameConfig.rows - 1).map((i) => (
    <RowLine i={i} key={"row_base_" + i} />
  ));
};

const ColumnLine = (props: LineProps): JSX.Element => {
  const context = useContext<BoardInfo>(BoardInfoContext);
  // calculates vertical lines X axis using i & cell width
  const x = context.xStart + context.cellWidth * (props.i + 1);
  const startPoint = {
    x: x,
    y: context.yStart,
  };
  const endPoint = {
    x: x,
    y: context.yEnd,
  };
  return (
    <Line
      x={0}
      y={0}
      points={[startPoint.x, startPoint.y, endPoint.x, endPoint.y]}
      tension={0.5}
      closed
      stroke={theme.text}
      key={"column_" + props.i}
    />
  );
};

const drawColumnLines = (): JSX.Element[] => {
  return createRangeArray(gameConfig.columns - 1).map((i) => {
    return <ColumnLine i={i} key={"column_base_" + i} />;
  });
};

const BoardCell = (props: BoardCellProps) => {
  const context = useContext(BoardInfoContext);
  const [row, setRow] = useState(0);
  const [column, setColumn] = useState(0);
  const [cell, setCell] = useState<CellInfo>({
    val: undefined,
    partOfWin: false,
  });
  const ref = React.useRef<Konva.Text>(null);

  useEffect(() => {
    // extract row & column info from i index
    let rowTemp = Math.floor(props.i / gameConfig.rows);
    setRow(rowTemp);
    let columnTemp = props.i % gameConfig.columns;
    setColumn(columnTemp);

    // updates cell for easier access later on
    const cellTemp: CellInfo = {
      val: props.board[rowTemp][columnTemp].val,
      partOfWin: props.board[rowTemp][columnTemp].partOfWin,
    };
    setCell(cellTemp);
  }, [props.i, props.board]);

  useEffect(() => {
    if (!cell.partOfWin) {
      return;
    }
    // animation
    const node = ref.current;
    const animation = new Animation((frame) => {
      if (!frame) {
        return;
      }
      let scale = Math.cos((frame.time * Math.PI) / 500);
      if (node !== null && node !== undefined) {
        node.rotate(scale);
      }
    });
    animation.start();
  }, [cell]);

  // calculates the coordinates to place cell
  const x = context.xStart + column * context.cellWidth;
  const y = context.yStart + row * context.cellHeight;
  if (cell.val === undefined) {
    return (
      <Rect
        x={x}
        y={y}
        width={context.cellWidth}
        height={context.cellHeight}
        onClick={() => props.handleTurn(row, column)}
        onMouseEnter={(e: KonvaEventObject<MouseEvent>) =>
          changeCursor(e, "pointer")
        }
        onMouseLeave={(e: KonvaEventObject<MouseEvent>) =>
          changeCursor(e, "default")
        }
        key={"cell_" + row + "_" + column}
      />
    );
  } else {
    return (
      <Text
        ref={ref}
        // calibrates text to the middle of the cell
        x={x + context.cellWidth / 2.5}
        y={y + context.cellHeight / 2.5}
        text={cell.val ? cell.val : ""}
        fontSize={boardConfig.headlineFontSize}
        fontFamily={boardConfig.fontFamily}
        verticalAlign="middle"
        key={"filled_cell_" + row + "_" + column}
        fill={cell.partOfWin ? theme.success : theme.text}
      />
    );
  }
};

const createBoardCells = (props: CreateBoardCellsProps): JSX.Element[] => {
  return createRangeArray(gameConfig.cells).map((i: number) => (
    <BoardCell
      board={props.board}
      i={i}
      handleTurn={props.handleTurn}
      key={"board_cell_" + i}
    />
  ));
};

const PlayerBank = (props: PlayerBankProps) => {
  const context = useContext<BoardInfo>(BoardInfoContext);
  return (
    <Text
      x={props.playerBankCurrent.x}
      y={props.playerBankCurrent.y}
      onMouseEnter={(e: KonvaEventObject<MouseEvent>) => {
        if (props.draggable) {
          e.currentTarget.setAttr("fill", theme.button);
        }
      }}
      onMouseLeave={(e: KonvaEventObject<MouseEvent>) => {
        e.currentTarget.setAttr("fill", theme.text);
      }}
      onDragMove={(e: KonvaEventObject<MouseEvent>) => {
        props.setPlayerBank({ x: e.target.x(), y: e.target.y() });
      }}
      fill={theme.text}
      onDragEnd={(e: KonvaEventObject<MouseEvent>) => {
        // if drag ended within the board
        if (
          e.target.x() >= context.xStart &&
          e.target.x() <= context.xEnd &&
          e.target.y() >= context.yStart &&
          e.target.y() <= context.yEnd
        ) {
          let stage = e.target.getStage();
          if (!stage) {
            return;
          }

          // calculates i & j indexes on board by coordinates
          const row = Math.floor(
            (e.target.y() - context.yStart) / context.cellHeight,
          );
          const column = Math.floor(
            (e.target.x() - context.xStart) / context.cellWidth,
          );

          // if cell is empty, plays
          if (props.board[row][column].val === undefined) {
            props.handleTurn(row, column);
          }

          // in case dragged into board, resets its location
          props.setPlayerBank({
            x: props.playerBankBase.x,
            y: props.playerBankBase.y,
          });
        }
      }}
      draggable={props.draggable}
      text={props.playerBank}
      stroke={props.draggable ? theme.text : "#d2d9d4"}
      strokeWidth={0.5}
      fontFamily={boardConfig.fontFamily}
      fontSize={boardConfig.headlineFontSize}
      key={props.bankKey}
    />
  );
};

const createPlayerBank = (props: CreatePlayerBankProps): JSX.Element => {
  return (
    <PlayerBank
      playerBankBase={props.playerBankBase}
      board={props.board}
      handleTurn={props.handleTurn}
      playerBankCurrent={props.playerBankCurrent}
      setPlayerBank={props.setPlayerBank}
      playerBank={props.playerBank}
      bankKey={"player_bank_" + props.playerBank}
      key={"bank_" + props.playerBank}
      draggable={props.currentPlayer === props.playerBank}
    />
  );
};

const Board = (props: BoardLayerProps) => {
  const dummyBoardInfo = {
    cellWidth: 0,
    cellHeight: 0,
    xStart: 0,
    xEnd: 0,
    yStart: 0,
    yEnd: 0,
  };
  const [boardInfo, setBoardInfo] = useState<BoardInfo>(dummyBoardInfo);

  useEffect(() => {
    // calculates a single cell width - board width * percentage / number of cells in column
    const cellWidth =
      (props.width * boardConfig.widthPart) / gameConfig.columns;

    // calculates board X axis starting & ending coordinates
    const boardXStart = props.width * boardConfig.widthStartPart;
    const boardXEnd = boardXStart + props.width * boardConfig.widthPart;

    // calculates a single cell height
    const cellHeight =
      (props.height * boardConfig.heightPart) / gameConfig.rows;

    // calculates board Y axis starting & ending coordinates
    const boardYStart = props.height * boardConfig.heightStartPart;
    const boardYEnd = boardYStart + props.height * boardConfig.heightPart;
    setBoardInfo({
      cellWidth: cellWidth,
      cellHeight: cellHeight,
      xStart: boardXStart,
      xEnd: boardXEnd,
      yStart: boardYStart,
      yEnd: boardYEnd,
    });
  }, [props.width, props.height]);

  const player1BankBase: PlayerBankLocation = {
    x: props.width * boardConfig.player1Bank.x,
    y: props.height * boardConfig.player1Bank.y,
  };
  const [player1Bank, setPlayer1Bank] = useState(player1BankBase);

  useEffect(() => {
    setPlayer1Bank({
      x: props.width * boardConfig.player1Bank.x,
      y: props.height * boardConfig.player1Bank.y,
    });
    setPlayer2Bank({
      x: props.width * boardConfig.player2Bank.x,
      y: props.height * boardConfig.player2Bank.y,
    });
  }, [props.width, props.height]);

  const player2BankBase: PlayerBankLocation = {
    x: props.width * boardConfig.player2Bank.x,
    y: props.height * boardConfig.player2Bank.y,
  };
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
          handleTurn: props.handleTurn,
        })}

        {/* create drag & drop banks */}
        {createPlayerBank({
          playerBankBase: player1BankBase,
          board: props.board,
          handleTurn: props.handleTurn,
          playerBankCurrent: player1Bank,
          setPlayerBank: setPlayer1Bank,
          playerBank: boardConfig.player1,
          currentPlayer: props.currentPlayer,
        })}
        {createPlayerBank({
          playerBankBase: player2BankBase,
          board: props.board,
          handleTurn: props.handleTurn,
          playerBankCurrent: player2Bank,
          setPlayerBank: setPlayer2Bank,
          playerBank: boardConfig.player2,
          currentPlayer: props.currentPlayer,
        })}
      </BoardInfoContext.Provider>
    </Layer>
  );
};

export default Board;
