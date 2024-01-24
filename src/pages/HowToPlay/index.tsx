import { useNavigate } from 'react-router-dom'
import style from './howToPlay.module.css'
import BackButton from '../../components/Buttons/BackButton';

class Instruction {
    title: string;
    descriptions: string[];

    constructor(title: string, descriptions: string[]) {
        this.title = title;
        this.descriptions = descriptions;
    }
}

export default function HowToPlay() {
    // navigate to main menu
    const navigate = useNavigate(); 
  
    const goToMainMenu = () => { 
        navigate('/');
    }

    // array with set of instructions of how to play
    const instructions = [
        new Instruction(
            "The Goal of Reversi",
            [
                "The goal of Reversi is simple.",
                `To win, you need to have more pieces on the board than your opponent by the end of the game. 
                Like checkers or chess, game pieces are either black or white. 
                When the game ends, each player counts their pieces left on the board to determine the winner.`,
                "But how do you get to this point?"
            ]
        ),
        new Instruction(
            "How To Play Reversi",
            [
                `If you're playing with a friend, first decide who plays which color. 
                When playing against the computer, you'll always be the black discs.`,
                `To start the game, each player must put two of their pieces in the middle four squares on the board. 
                Usually, the pieces are placed diagonally from each other. 
                Each player may make one move per turn after set-up begins, and black typically goes first.`,
                `Each turn, you put one new piece onto the board. 
                The chosen square is where that piece stays -- you cannot move squares like in chess.`,
                `Each piece you place must capture an opponent's piece. 
                That means you have to place your pieces adjacent to one of the opponent's pieces. 
                You can't put your piece in a square that doesn't lead to a capture.`,
                `Capturing a piece is simple -- when you put your piece beside the opponent piece in any position, 
                that piece and all adjacent pieces become yours. 
                You can put your piece beside the opponent's, as well as diagonally. Both options lead to captures.`
            ]
        ),
        new Instruction(
            "Flanking The Opponent",
            [
                "A key Reversi strategy is flanking your opponent's pieces.",
                `If you can get a piece at each end of a row or column (straight or diagonally) then 
                every piece in the row between your two pieces is captured. By mastering flanking, 
                you can take multiple rows of pieces per turn.`
            ]
        ),
        new Instruction(
            "Ending The Game",
            [
                `Gameplay continues like this until the board is full and no pieces can be captured. 
                If players end up with the same number of pieces each on the board, the game is a draw.`
            ]
        )
    ]
    
    return (
        <>
            <div className={style.howToPlayTitleContainer}>
                <BackButton onClick={goToMainMenu} size='2xl' />
                <h1 className={style.title}>How To Play?</h1>
            </div>
            <div className={style.howToPlayContainer}>
                {instructions.map(instruction => {
                    return (
                        <section>
                            <h2>{instruction.title}</h2>
                            {instruction.descriptions.map(description => <p>{description}</p>)}
                        </section>
                    )
                })}
            </div>
        </>
    )
}