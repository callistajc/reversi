import { Value, SquareValues } from '../types/gameTypes'
import { cloneValues } from './commonUtils';

export function highlightMoves(values: SquareValues[][], player: number) {
    function checkValidMoves(values: SquareValues[][], row: Value[], i: number, direction: number) {
        let nullIndex: number | null = null;
        let valid: boolean = false;
        let capturedPieces: string[] = [];
        let capturedPiecesReverse: string[] = [];
        
        if (row.includes(0) && row.includes(1) && row.includes(null)) {
            for (let j = 0; j < row.length; j++) {
                if (row[j] === null && row[j + 1] === opponent) {
                    nullIndex = j;
                    capturedPieces = [];
                }
            
                if (nullIndex != null) {
                    if (row[j] === null && row[j + 1] !== opponent) {
                        nullIndex = null;
                    } else if (row[j] === player) {
                        switch (direction) {
                            case 1: // horizontal
                                values[i][nullIndex].isValid = true;
                                values[i][nullIndex].flipPieces = values[i][nullIndex].flipPieces.concat(capturedPieces);
                                break;
                            case 2: // vertical
                                values[nullIndex][i].isValid = true;
                                values[nullIndex][i].flipPieces = values[nullIndex][i].flipPieces.concat(capturedPieces);
                                break;
                            case 3: // first diagonal (\)
                                values[nullIndex + i][nullIndex].isValid = true;
                                values[nullIndex + i][nullIndex].flipPieces = values[nullIndex + i][nullIndex].flipPieces.concat(capturedPieces);
                                break;
                            case 4: // second diagonal (/)
                                values[i - nullIndex][nullIndex].isValid = true;
                                values[i - nullIndex][nullIndex].flipPieces = values[i - nullIndex][nullIndex].flipPieces.concat(capturedPieces);
                                break;
                        }
                        nullIndex = null;
                        capturedPieces = [];
                    } else if (row[j] === opponent) {
                        switch (direction) {
                            case 1:
                                capturedPieces.push(`${i}${j}`);
                                break;
                            case 2:
                                capturedPieces.push(`${j}${i}`);
                                break;
                            case 3:
                                capturedPieces.push(`${j + i}${j}`);
                                break;
                            case 4:
                                capturedPieces.push(`${i - j}${j}`);
                                break;
                        }
                    }
                }
            
                if (row[j] === player && row[j + 1] === opponent) {
                    valid = true;
                    capturedPiecesReverse = [];
                }
            
                if (valid) {
                    if (row[j] === player && row[j + 1] !== opponent) {
                        valid = false;
                    } else if (row[j] === null) {
                        switch (direction) {
                            case 1:
                                values[i][j].isValid = true;
                                values[i][j].flipPieces = values[i][j].flipPieces.concat(capturedPiecesReverse);
                                break;
                            case 2:
                                values[j][i].isValid = true;
                                values[j][i].flipPieces = values[j][i].flipPieces.concat(capturedPiecesReverse);
                                break;
                            case 3:
                                values[j + i][j].isValid = true;
                                values[j + i][j].flipPieces = values[j + i][j].flipPieces.concat(capturedPiecesReverse);
                                break;
                            case 4:
                                values[i - j][j].isValid = true;
                                values[i - j][j].flipPieces = values[i - j][j].flipPieces.concat(capturedPiecesReverse);
                                break;
                        }
                        valid = false;
                        capturedPiecesReverse = [];
                    } else if (row[j] === opponent) {
                        switch (direction) {
                            case 1:
                                capturedPiecesReverse.push(`${i}${j}`);
                                break;
                            case 2:
                                capturedPiecesReverse.push(`${j}${i}`);
                                break;
                            case 3:
                                capturedPiecesReverse.push(`${j + i}${j}`);
                                break;
                            case 4:
                                capturedPiecesReverse.push(`${i - j}${j}`);
                                break;
                        }
                    }
                }
            }
        }
    }

    const newValues = cloneValues(values);
    const opponent = player === 1 ? 0 : 1;
    let row: Value[] = [];

    // check horizontally
    for (let i = 0; i < values.length; i++ ) {
        row = values[i].map(object => object.value);
        checkValidMoves(newValues, row, i, 1);
    }

    // check vertically
    // save squares into new 2d array with vertical oder
    const transposeSquares = values[0].map((_, colIndex) => values.map(row => row[colIndex]));

    for (let i = 0; i < values.length; i++ ) {
        row = transposeSquares[i].map(object => object.value);
        checkValidMoves(newValues, row, i, 2);
    }
    
    // check first diagonal (\)
    // save squares into new 2d array with diagonal order (\)
    let firstArray: SquareValues[][] = [];
    for (let k = -values.length + 1; k <= values.length - 1; k++) {
        firstArray[k] = [];
        for (let i = 0; i < values.length; i++){
            if ((i - k >= 0) && (i - k < values.length)) {
                firstArray[k][i - k] = values[i][i - k];
            }
        }
    }
    
    // loop through diagonal array to find possible moves
    for (let i = -values.length + 1; i <= values.length - 1; i++) {
        row = firstArray[i].map(object => object.value);
        checkValidMoves(newValues, row, i, 3);
    }
    
    // check second diagonal (/)
    // save squares into new 2d array with diagonal order (/)
    let secondArray: SquareValues[][] = [];
    for (let k = 0; k < values.length * 2 - 1; k++) {
        secondArray[k] = [];
        for (let j = 0; j <= k; j++) {
            let i = k - j;
            if(i < values.length && j < values.length) {
                secondArray[k][j] = values[i][j];
            }
        }
    }

    // loop through diagonal array to find possible moves
    for (let i = 0; i < secondArray.length; i++) {
        row = secondArray[i].map(object => object.value);
        checkValidMoves(newValues, row, i, 4);
    }
    
    return newValues;
}

export function piecesCounter(values: SquareValues[][]) {
    let whitePiece = 0;
    let blackPiece = 0;

    for (let i = 0; i < values.length; i++) {
        const row = values[i].map(value => value.value);
        if (row.includes(0) || row.includes(1)) {
            for (let j = 0; j < row.length; j++) {
                if (row[j] === 0) {
                    whitePiece++;
                } else if (row[j] === 1) {
                    blackPiece++;
                }
            }
        }
    }

    return {whitePiece, blackPiece};
}

export function flipPiece(values: SquareValues[][], id: string, pieceValue: 0 | 1) {
    const newValues = cloneValues(values);

    const flippedPieces = newValues[Number(id[0])][Number(id[1])].flipPieces;

    flippedPieces.forEach((piece) => {
        newValues[Number(piece[0])][Number(piece[1])].value = pieceValue;
        newValues[Number(piece[0])][Number(piece[1])].isFlipped = true;
    });

    return newValues;
}

export function checkGameEnd(values: SquareValues[][], turnPass: boolean, currentTurn: 0 | 1) {
    const newValues = cloneValues(values);

    // check if both players don't have any valid moves anymore
    if (turnPass) {
        const highlightedValues = highlightMoves(newValues, currentTurn === 1 ? 0 : 1);
        
        const validMoves = highlightedValues.map(row => row.filter(item => item.isValid === true)).flat();

        if (validMoves.length === 0) {
            return true;
        }
    }

    // check if all board is filled
    const isEnd = !newValues.some((row) => row.some((col) => col.value === null));
    
    return isEnd;
}