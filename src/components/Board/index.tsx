import { useEffect } from 'react'
import Square from '../Square'
import { SquareValues } from '../../types/gameTypes'
import { checkGameEnd, flipPiece, highlightMoves, piecesCounter } from '../../utils/gameProcessUtils'
import { cloneValues, delay } from '../../utils/commonUtils'
import style from './board.module.css'
import PassModal from '../PassModal';
import { computerLogic } from '../../utils/minimaxUtils'

interface BoardProps {
    values: SquareValues[][];
    currentTurn: 0 | 1;
    turnPass: boolean;
    gameEnd: boolean;
    setValues: (values: SquareValues[][]) => void;
    setPieces: (whitePiece: number, blackPiece: number) => void;
    setCurrentTurn: (currrenTurn: 0 | 1) => void;
    setTurnPass: (turnPass: boolean) => void;
    setGameEnd: (gameEnd: boolean) => void;
    setIsSaveDisabled: (isSaveDisabled: boolean) => void;
}

export default function Board({ values, currentTurn, turnPass, gameEnd, setValues, setPieces, setCurrentTurn, setTurnPass, setGameEnd, setIsSaveDisabled }: BoardProps) {
    useEffect(() => {
        const highlightedValues = highlightMoves(values, currentTurn);
        setValues(highlightedValues);
    }, [])

    useEffect(() => {
        if (turnPass) {
            setTimeout(() => {onCloseModal()}, 900);
        }

        function onCloseModal() {
            setTurnPass(false);

            if (currentTurn === 0) { // if computer's pass
                const highlightedValues = highlightMoves(values, 1);
                setValues(highlightedValues);
            } else if (currentTurn === 1) { // if player's pass 
                const highlightedValues = highlightMoves(values, 0);
                const selectedId = computerLogic(highlightedValues);

                if (selectedId === '') {
                    setGameEnd(true);
                } else {
                    gameProcess(highlightedValues, selectedId, 0);
                }
            }

            setCurrentTurn(currentTurn === 1 ? 0 : 1);
        }
    }, [turnPass])

    async function handleClick(selectedId: string) {
        // player turn
        setIsSaveDisabled(true);
        const player = await gameProcess(values, selectedId, currentTurn);

        // computer's turn
        if (!player.currentTurn && !player.turnPass) {
            const selectedId = computerLogic(player.values);

            await gameProcess(player.values, selectedId, player.currentTurn);
        }
        setIsSaveDisabled(false);
    }

    async function gameProcess(values: SquareValues[][], selectedId: string, currentTurn: 0 | 1) {
        const newValues = cloneValues(values);
    
        // place piece on selected highlighted square
        const updatedValues = newValues.map(row => row.map(({ id, value, flipPieces }) => ({ 
            id,
            value: id === selectedId ? currentTurn : value,
            isValid: false,
            flipPieces,
            isPlaced: id === selectedId ? true : false,
            isFlipped: false
        })));
        setValues(updatedValues);

        // count black and white pieces
        let pieces = piecesCounter(updatedValues);
        setPieces(pieces.whitePiece, pieces.blackPiece);
    
        // flip pieces
        const flippedValues = flipPiece(updatedValues, selectedId, currentTurn);
        await delay(500);
        setValues(flippedValues);
    
        // count black and white pieces
        pieces = piecesCounter(flippedValues);
        setPieces(pieces.whitePiece, pieces.blackPiece);

        // switch turn
        const isCurrentTurn = currentTurn === 1 ? 0 : 1;
        await delay(500);
        setCurrentTurn(isCurrentTurn);
    
        // remove all stored flip pieces
        const cleanedValues = flippedValues.map(row => row.map(({ id, value, isValid }) => ({ 
            id,
            value,
            isValid,
            flipPieces: [],
            isPlaced: false,
            isFlipped: false,

        })));
    
        // highlight moves
        const highlightedValues = highlightMoves(cleanedValues, isCurrentTurn);
        await delay(300);
        setValues(highlightedValues);
    
        // check if valid moves exist
        const isTurnPass = highlightedValues.some(row => row.some(col => col.isValid === true)) ? false : true;

        // check if game end yet
        const isGameEnd = checkGameEnd(highlightedValues, isTurnPass, isCurrentTurn);
        setGameEnd(isGameEnd);
        !isGameEnd && setTurnPass(isTurnPass);

        return {values: highlightedValues, currentTurn: isCurrentTurn as 0 | 1, turnPass: isTurnPass};
    }

    return (
        <>
            <div className={style.squareBoard}>
                {values.map((row) => row.map((col) => (
                    <Square key={col.id} values={col} onHighlightedPieceClick={() => handleClick(col.id)} currentTurn={currentTurn} isPlaced={col.isPlaced} isFlipped={col.isFlipped} />
                )))}
            </div>
            {turnPass && !gameEnd && <PassModal currentTurn={currentTurn} />}
        </>
    );
}