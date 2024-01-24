import Piece from '../Piece'
import HighlightedPieceButton from '../Buttons/HighlightedPieceButton'
import { SquareValues } from '../../types/gameTypes'
import style from './square.module.css'

interface SquareProps {
    values: SquareValues;
    onHighlightedPieceClick: () => void;
    currentTurn: 0 | 1;
    isPlaced: boolean;
    isFlipped: boolean;
}

export default function Square({ values, onHighlightedPieceClick, currentTurn, isPlaced, isFlipped }: SquareProps ) {
    return (
        <div className={style.square}>
            {
                values.value === null ? 
                values.isValid && currentTurn ? <HighlightedPieceButton onHighlightedPieceClick={onHighlightedPieceClick} /> : null 
                : <Piece color={values.value ? "black" : "white"} isPlaced={isPlaced} isFlipped={isFlipped} />
            }
        </div>
    )
}