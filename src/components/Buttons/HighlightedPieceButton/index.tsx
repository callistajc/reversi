import style from './highlightedPieceButton.module.css'

interface HighlightedPieceButtonProps {
    onHighlightedPieceClick: () => void;
}

export default function HighlightedPieceButton({ onHighlightedPieceClick }: HighlightedPieceButtonProps ) {
    return (
        <button className={style.highlightedPiece} onClick={onHighlightedPieceClick}></button>
    )
}