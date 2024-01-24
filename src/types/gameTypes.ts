// value of each square
export type Value = 0 | 1 | null; // 0 is white, 1 is black, null is empty

export type SquareValues = {
    id: string;
    value: Value;
    isValid: boolean;
    flipPieces: string[];
    isPlaced: boolean;
    isFlipped: boolean;
}

export interface State {
    values: SquareValues[][];
    whitePiece: number;
    blackPiece: number;
    currentTurn: 0 | 1;
    turnPass: boolean;
    gameEnd: boolean;
    id: string;
    isSaveDisabled: boolean;
    showModal: boolean;
}