import style from './piece.module.css'

interface PieceProps {
    color: string;
    isPlaced?: boolean;
    isFlipped?: boolean;
}

export default function Piece({ color, isPlaced, isFlipped }: PieceProps ) {
    return (
        <div className={`${style.piece} ${isPlaced ? style.placedPiece : ''} ${isFlipped ? style.flippedPiece : ''}`} style={{backgroundColor: color}}></div>
    )
}