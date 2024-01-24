import Piece from '../Piece'
import style from './counter.module.css'

interface CounterProps {
    piece: number;
    color: string;
    currentTurn: 0 | 1;
}

export default function Counter({ piece, color, currentTurn }: CounterProps) {
    if (color === "black") {
        return (
            <div className={`${style.counter} ${currentTurn ? style.activeCounter : style.inactiveCounter}`}>
                <p><b>Player</b></p>
                <p><b>{piece}</b></p>
                <Piece color={color} />
            </div>
        );
    } else if (color === "white") {
        return (
            <div className={`${style.counter} ${currentTurn ? style.activeCounter : style.inactiveCounter}`}>
                <Piece color={color} />
                <p><b>{piece}</b></p>
                <p><b>Computer</b></p>
            </div>
        );
    }
}