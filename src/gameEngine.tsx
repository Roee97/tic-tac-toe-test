import React from "react";
import Konva from "konva";
import KonvaEventObject = Konva.KonvaEventObject;
import Stage = Konva.Stage;

type CursorType = "default" | "pointer"

const checkWin = (board: string[][]): boolean => {
    // check rows
    for (var i = 0; i < 3; i++) {
        if (
            board[i][0] !== undefined &&
            board[i][0] === board[i][1] &&
            board[i][1] === board[i][2]
        ) {
            return true;
        }

        // check column
        if (
            board[0][i] !== undefined &&
            board[0][i] === board[1][i] &&
            board[1][i] === board[2][i]
        ) {
            return true;
        }
    }

    // check main diagonal
    if (board[0][0] !== undefined &&
        board[0][0] === board[1][1] &&
        board[1][1] === board[2][2]) {
        return true;
    }

    // check secondary diagonal
    if (board[0][2] !== undefined &&
        board[0][2] === board[1][1] &&
        board[1][1] === board[2][0]) {
        return true;
    }
    return false;
}

const checkGameOver = (turnCounter: number) : boolean => {
    return turnCounter === 8;
}

const changeCursor = (e: KonvaEventObject<MouseEvent>, cursorType: CursorType): void => {
    let stage: Stage | null;
    stage = e.target.getStage();
    if (stage !== null) {
        let container = stage.container();
        container.style.cursor = cursorType;
    }
}

const createCleanBoard = (rows: number, columns: number): string[][] => {
    var arr = [];
    for (var i = 0; i < rows; i++) {
      arr.push(Array(columns).fill(undefined));
    }

    return arr;
}

const createRangeArray = (range: number) => {
    return Array.from({length: range}, (_, i) => i);
}

export {
    checkGameOver,
    checkWin,
    changeCursor,
    createCleanBoard,
    createRangeArray
}