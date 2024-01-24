import { SquareValues } from "../types/gameTypes";
import { cloneValues } from "./commonUtils";
import { flipPiece, highlightMoves, piecesCounter } from "./gameProcessUtils";

// score board
const scoreBoard = [
    [500, -40, 15, 10, 10, 15, -40, 500],
    [-40, -70, 1, 1, 1, 1, -70, -40],
    [15, 1, 1, 2, 2, 1, 1, 15],
    [10, 1, 2, 6, 6, 2, 1, 10],
    [10, 1, 2, 6, 6, 2, 1, 10],
    [15, 1, 1, 2, 2, 1, 1, 15],
    [-40, -70, 1, 1, 1, 1, -70, -40],
    [500, -40, 15, 10, 10, 15, -40, 500],
]

export function computerLogic(values: SquareValues[][]) {
    let newValues = cloneValues(values);
    let bestScore = -Infinity;
    let nextMove = "";

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (newValues[i][j].isValid === true) {
                newValues[i][j].value = 0;
                const flippedValues = flipPiece(newValues, `${i}${j}`, 0);
                const cleanedValues = flippedValues.map(row => row.map(({ id, value }) => ({ 
                    id,
                    value,
                    isValid: false,
                    flipPieces: [],
                    isPlaced: false,
                    isFlipped: false,
                })));
                const highlightedValues = highlightMoves(cleanedValues, 1);
                let score = minimax(highlightedValues, 3, false);
                if (score > bestScore) {
                    bestScore = score;
                    nextMove = `${i}${j}`;
                }
                newValues = cloneValues(values);
            }
        }
    }

    return nextMove;
}

function minimax(values: SquareValues[][], depth: number, isMaximizing: boolean) {
    let newValues = cloneValues(values);

    if (terminal(newValues) || depth === 0) {
        return evaluate(newValues);
    }

    if (isMaximizing) {
        let score = -Infinity;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (newValues[i][j].isValid === true) {
                    newValues[i][j].value = 0;
                    const flippedValues = flipPiece(newValues, `${i}${j}`, 0);
                    const cleanedValues = flippedValues.map(row => row.map(({ id, value }) => ({ 
                        id,
                        value,
                        isValid: false,
                        flipPieces: [],
                        isPlaced: false,
                        isFlipped: false,
                    })));
                    const highlightedValues = highlightMoves(cleanedValues, 1);
                    if (highlightedValues.some(row => row.some(col => col.isValid))) {
                        score = Math.max(score, minimax(highlightedValues, depth - 1, false));
                    } else {
                        score = Math.max(score, 0);
                    }
                    newValues = cloneValues(values);
                }
            }
        }
        return score;
    } else {
        let score = Infinity;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (newValues[i][j].isValid === true) {
                    newValues[i][j].value = 1;
                    const flippedValues = flipPiece(newValues, `${i}${j}`, 1);
                    const cleanedValues = flippedValues.map(row => row.map(({ id, value }) => ({ 
                        id,
                        value,
                        isValid: false,
                        flipPieces: [],
                        isPlaced: false,
                        isFlipped: false,
                    })));
                    const highlightedValues = highlightMoves(cleanedValues, 0);
                    if (highlightedValues.some(row => row.some(col => col.isValid))) {
                        score = Math.min(score, minimax(highlightedValues, depth - 1, true));
                    } else {
                        score = Math.min(score, 0);
                    }
                    newValues = cloneValues(values);
                }
            }
        }
        return score;
    }
}

function terminal(values: SquareValues[][]) {
    const newValues = cloneValues(values);

    // check if the board is full
    const isFull = !newValues.some((row) => row.some((col) => col.value === null));

    // check if there are no valid moves for both players
    const noValidMovesForMaximizing = !highlightMoves(newValues, 0).some(row => row.some(col => col.isValid));
    const noValidMovesForMinimizing = !highlightMoves(newValues, 1).some(row => row.some(col => col.isValid));

    return isFull || (noValidMovesForMaximizing && noValidMovesForMinimizing);
}

function evaluate(values: SquareValues[][]) {
    const newValues = cloneValues(values);
    const pieces = piecesCounter(newValues);
    const cleanedValues = newValues.map(row => row.map(({ id, value }) => ({ 
        id,
        value,
        isValid: false,
        flipPieces: [],
        isPlaced: false,
        isFlipped: false,
    })));
    const maximizingValidMoves = highlightMoves(cleanedValues, 0);
    const minimizingValidMoves = highlightMoves(cleanedValues, 1);
    let score = 0;
    let maximizingMobility = 0;
    let minimizingMobility = 0;
    
    // calculate board score
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (newValues[i][j].value === 0) {
                score += scoreBoard[i][j];
            }

            if (maximizingValidMoves[i][j].isValid === true) {
                maximizingMobility++;
            }

            if (minimizingValidMoves[i][j].isValid === true) {
                minimizingMobility++;
            }
        }
    }

    // calculate score difference
    score += pieces.whitePiece - pieces.blackPiece;

    // calculate mobility
    score += (maximizingMobility - minimizingMobility) / 2;

    // calculate board score on end game
    if (pieces.whitePiece + pieces.blackPiece === 64) {
        if (pieces.whitePiece > pieces.blackPiece) {
            score += 1000;
        } else if (pieces.whitePiece < pieces.blackPiece) {
            score += -1000;
        } else {
            score += 500;
        }
    }

    return score;
}